import { NextRequest } from "next/server";
import type OpenAI from "openai";
import { clientFor, isLlmConfigured } from "@/lib/llm/client";
import { searchChunks, formatRagContext, ragTrace, type RetrievedChunk } from "@/lib/rag";
import { buildSystemPrompt } from "@/lib/persona";
import { getAgentConfig } from "@/lib/agent-config";
import {
  analyzeTurn,
  lastAnalysisFor,
  persistTurnAnalysis,
} from "@/lib/conversation-analyst";
import { AGENT_TOOLS, runAgentTool, type ToolContext } from "@/lib/agent-tools";
import { prisma } from "@/lib/prisma";
import { logUsage } from "@/lib/usage";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import { isLocale, defaultLocale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_CHARS = 1200;
/** Rondas de herramientas antes de obligar al modelo a responder. */
const MAX_TOOL_ROUNDS = 2;

type IncomingMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`chat:${ip}`, 20, 5 * 60 * 1000);
  if (!limit.ok) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  if (!isLlmConfigured("chat")) {
    return new Response(JSON.stringify({ error: "not_configured" }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }

  let body: {
    message?: string;
    sessionId?: string;
    locale?: string;
    history?: IncomingMessage[];
  };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
    });
  }

  const message = (body.message || "").trim();
  const locale = isLocale(body.locale || "") ? body.locale! : defaultLocale;
  if (!message || message.length > MAX_MESSAGE_CHARS) {
    return new Response(JSON.stringify({ error: "invalid_message" }), {
      status: 400,
    });
  }

  const history = (body.history || []).slice(-8);

  // --- Sesión ---
  let sessionId = body.sessionId;
  try {
    if (sessionId) {
      const existing = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      });
      if (!existing) sessionId = undefined;
    }
    if (!sessionId) {
      const created = await prisma.chatSession.create({
        data: { locale, visitorId: req.cookies.get("rz_vid")?.value ?? null },
      });
      sessionId = created.id;
    } else {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { lastSeenAt: new Date() },
      });
    }
    await prisma.chatMessage.create({
      data: { sessionId, role: "user", content: message },
    });
  } catch (err) {
    console.error("Session persist error:", err);
  }

  // --- Leer al interlocutor y recuperar contexto en paralelo ---
  const previous = sessionId ? await lastAnalysisFor(sessionId) : null;
  const [analysis, chunks] = await Promise.all([
    analyzeTurn({ message, history, previous }),
    searchChunks(message, { k: 5, publicOnly: true, lang: locale }).catch(
      (err) => {
        console.error("RAG error:", err);
        return [] as RetrievedChunk[];
      },
    ),
  ]);

  const retrieved: RetrievedChunk[] = [...chunks];
  const config = await getAgentConfig();

  const systemPrompt = buildSystemPrompt({
    locale: locale as "es" | "en",
    ragContext: formatRagContext(chunks),
    audience: analysis.audience,
    stage: analysis.stage,
    layers: config.layers,
    extra: analysis.tactic
      ? `LECTURA DE ESTE TURNO: ${analysis.tactic}${
          analysis.objections.length
            ? `\nObjeciones detectadas: ${analysis.objections.join("; ")}`
            : ""
        }`
      : undefined,
  });

  const toolCtx: ToolContext = {
    locale,
    sessionId,
    analysis,
    onRetrieval: (extra) => retrieved.push(...extra),
  };

  const { client, model, provider, tier } = clientFor("chat");
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const encoder = new TextEncoder();
  let fullText = "";

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`\u0000META${JSON.stringify({ sessionId })}\u0000`),
      );

      try {
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const completion = await client.chat.completions.create({
            model: config.model || model,
            messages,
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            stream: true,
            stream_options: { include_usage: true },
            // En la última ronda se le quitan las herramientas para forzar
            // una respuesta al visitante en vez de otra llamada.
            ...(round < MAX_TOOL_ROUNDS ? { tools: AGENT_TOOLS } : {}),
          });

          // Las llamadas a herramientas llegan troceadas: hay que reensamblar
          // el JSON de argumentos por índice antes de poder ejecutarlas.
          const pending = new Map<
            number,
            { id: string; name: string; args: string }
          >();
          let roundText = "";

          for await (const part of completion) {
            const delta = part.choices[0]?.delta;

            if (delta?.content) {
              roundText += delta.content;
              fullText += delta.content;
              controller.enqueue(encoder.encode(delta.content));
            }

            for (const call of delta?.tool_calls ?? []) {
              const slot = pending.get(call.index) ?? {
                id: "",
                name: "",
                args: "",
              };
              if (call.id) slot.id = call.id;
              if (call.function?.name) slot.name = call.function.name;
              if (call.function?.arguments) slot.args += call.function.arguments;
              pending.set(call.index, slot);
            }

            if (part.usage) {
              await logUsage({
                channel: "chat",
                model: config.model || model,
                provider,
                tier,
                promptTokens: part.usage.prompt_tokens,
                completionTokens: part.usage.completion_tokens,
              });
            }
          }

          if (pending.size === 0) break;

          const calls = [...pending.values()].filter((c) => c.id && c.name);
          messages.push({
            role: "assistant",
            content: roundText || null,
            tool_calls: calls.map((c) => ({
              id: c.id,
              type: "function" as const,
              function: { name: c.name, arguments: c.args || "{}" },
            })),
          });

          for (const call of calls) {
            const result = await runAgentTool(call.name, call.args, toolCtx);
            messages.push({
              role: "tool",
              tool_call_id: call.id,
              content: result,
            });
          }
        }
      } catch (err) {
        console.error("OpenAI stream error:", err);
      } finally {
        if (sessionId) {
          if (fullText) {
            try {
              await prisma.chatMessage.create({
                data: { sessionId, role: "assistant", content: fullText },
              });
            } catch {
              /* noop */
            }
          }
          await persistTurnAnalysis({
            sessionId,
            message,
            analysis,
            ragTrace: ragTrace(retrieved),
          });
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-session-id": sessionId || "",
    },
  });
}
