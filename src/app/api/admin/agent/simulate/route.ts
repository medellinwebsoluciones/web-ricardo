import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { clientFor, isLlmConfigured } from "@/lib/llm/client";
import { logUsage } from "@/lib/usage";
import { answerAsAgent } from "@/lib/agent-eval";
import { findPersona, SIMULATION_PERSONAS } from "@/lib/simulation-personas";
import { getAgentConfig } from "@/lib/agent-config";
import type { Stage } from "@/lib/persona";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 800;

export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const runs = await prisma.simulationRun.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
    select: {
      id: true,
      personaSlug: true,
      personaName: true,
      status: true,
      booked: true,
      score: true,
      verdict: true,
      failures: true,
      startedAt: true,
    },
  });

  return Response.json({
    personas: SIMULATION_PERSONAS.map((p) => ({
      slug: p.slug,
      name: p.name,
      audience: p.audience,
      difficulty: p.difficulty,
      summary: p.summary,
      goal: p.goal,
    })),
    runs: runs.map((r) => ({ ...r, startedAt: r.startedAt.toISOString() })),
  });
}

/** La conversación avanza de etapa aunque el prospecto no lo diga. */
function stageForTurn(turn: number, total: number): Stage {
  const progress = turn / Math.max(1, total - 1);
  if (progress < 0.2) return "apertura";
  if (progress < 0.5) return "descubrimiento";
  if (progress < 0.75) return "diagnostico";
  if (progress < 0.9) return "propuesta";
  return "cierre";
}

/**
 * Role-play completo: un modelo interpreta al prospecto difícil y conversa con
 * el agente. Al final el juez dice si habría agendado la llamada.
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  if (!isLlmConfigured("chat")) {
    return Response.json({ error: "openai_not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const persona = findPersona(String(body?.personaSlug || ""));
  if (!persona) {
    return Response.json({ error: "persona_not_found" }, { status: 404 });
  }
  const maxTurns = Math.min(Math.max(Number(body?.maxTurns) || 8, 3), 12);

  const config = await getAgentConfig();
  const run = await prisma.simulationRun.create({
    data: {
      personaSlug: persona.slug,
      personaName: persona.name,
      maxTurns,
      model: config.model,
    },
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));

      send({
        type: "start",
        runId: run.id,
        persona: persona.name,
        goal: persona.goal,
        maxTurns,
      });

      // Historial visto desde el agente: el prospecto es "user".
      const history: { role: "user" | "assistant"; content: string }[] = [];
      let idx = 0;

      try {
        const judge = clientFor("judge");

        for (let turn = 0; turn < maxTurns; turn++) {
          // --- Turno del prospecto ---
          const prospectMessages = [
            {
              role: "system" as const,
              content: `${persona.brief}

Estás escribiendo en el chat de la web de Ricardo Zuluaga. Escribe SOLO tu siguiente mensaje, en primera persona, sin comillas ni acotaciones. Máximo tres frases. No te rindas a la primera ni aceptes agendar salvo que te hayan convencido de verdad.${
                turn === 0
                  ? "\n\nEste es tu primer mensaje: entra directo con lo que te trae aquí."
                  : ""
              }`,
            },
            // Los papeles se invierten: lo que el agente dijo llega al
            // prospecto como mensaje del interlocutor, y viceversa.
            ...history.map((m) => ({
              role: m.role === "user" ? ("assistant" as const) : ("user" as const),
              content: m.content,
            })),
          ];

          const prospectCompletion = await judge.client.chat.completions.create({
            model: judge.model,
            temperature: 0.9,
            max_tokens: 220,
            messages: prospectMessages,
          });

          if (prospectCompletion.usage) {
            await logUsage({
              channel: "simulation",
              model: judge.model,
              provider: judge.provider,
              tier: judge.tier,
              promptTokens: prospectCompletion.usage.prompt_tokens,
              completionTokens: prospectCompletion.usage.completion_tokens,
            });
          }

          const prospectMessage =
            prospectCompletion.choices[0]?.message?.content?.trim() || "";
          if (!prospectMessage) break;

          await prisma.simulationTurn.create({
            data: {
              runId: run.id,
              idx: idx++,
              role: "prospect",
              content: prospectMessage,
            },
          });
          send({ type: "turn", role: "prospect", content: prospectMessage, turn });

          // --- Turno del agente ---
          const agent = await answerAsAgent({
            question: prospectMessage,
            locale: "es",
            audience: persona.audience,
            stage: stageForTurn(turn, maxTurns),
            history,
            publicOnly: true,
          });

          history.push({ role: "user", content: prospectMessage });
          history.push({ role: "assistant", content: agent.answer });

          await prisma.simulationTurn.create({
            data: {
              runId: run.id,
              idx: idx++,
              role: "agent",
              content: agent.answer,
            },
          });
          send({
            type: "turn",
            role: "agent",
            content: agent.answer,
            turn,
            bestSimilarity: Number(agent.bestSimilarity.toFixed(3)),
          });
        }

        // --- Veredicto ---
        const transcript = history
          .map(
            (m) =>
              `${m.role === "user" ? persona.name : "Asistente"}: ${m.content}`,
          )
          .join("\n\n");

        const verdictCompletion = await judge.client.chat.completions.create({
          model: judge.model,
          temperature: 0,
          max_tokens: 700,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `Evalúas una conversación de venta consultiva simulada.

El prospecto era: ${persona.name}. ${persona.summary}
Objetivo del asistente: ${persona.goal}

Responde SOLO este JSON:
{
  "booked": true|false,
  "score": 0-100,
  "verdict": "tres frases: qué hizo bien, qué le costó la conversación y en qué turno se torció",
  "failures": ["fallo concreto y accionable", "..."]
}

"booked" es true solo si el prospecto, dado su carácter, habría aceptado de verdad el siguiente paso. Sé exigente: contestar bien no es lo mismo que avanzar.`,
            },
            { role: "user", content: transcript.slice(0, 14000) },
          ],
        });

        if (verdictCompletion.usage) {
          await logUsage({
            channel: "judge",
            model: judge.model,
            provider: judge.provider,
            tier: judge.tier,
            promptTokens: verdictCompletion.usage.prompt_tokens,
            completionTokens: verdictCompletion.usage.completion_tokens,
          });
        }

        const parsed = JSON.parse(
          verdictCompletion.choices[0]?.message?.content || "{}",
        ) as {
          booked?: unknown;
          score?: unknown;
          verdict?: unknown;
          failures?: unknown;
        };

        const failures = Array.isArray(parsed.failures)
          ? parsed.failures
              .filter((f): f is string => typeof f === "string" && Boolean(f.trim()))
              .slice(0, 6)
              .map((f) => f.slice(0, 300))
          : [];
        const score = Number.isFinite(Number(parsed.score))
          ? Math.max(0, Math.min(100, Math.round(Number(parsed.score))))
          : 0;
        const verdict =
          typeof parsed.verdict === "string" ? parsed.verdict.slice(0, 2000) : "";

        await prisma.simulationRun.update({
          where: { id: run.id },
          data: {
            status: "done",
            booked: Boolean(parsed.booked),
            score,
            verdict,
            failures,
            finishedAt: new Date(),
          },
        });

        send({
          type: "verdict",
          runId: run.id,
          booked: Boolean(parsed.booked),
          score,
          verdict,
          failures,
        });
      } catch (err) {
        console.error("Simulación:", err);
        await prisma.simulationRun
          .update({
            where: { id: run.id },
            data: { status: "error", finishedAt: new Date() },
          })
          .catch(() => {});
        send({
          type: "error",
          error: err instanceof Error ? err.message : "error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}
