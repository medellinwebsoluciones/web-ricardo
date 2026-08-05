import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { isLlmConfigured } from "@/lib/llm/client";
import {
  DIMENSIONS,
  GAP_THRESHOLD,
  answerAsAgent,
  judgeAnswer,
  type Dimension,
  type Scores,
} from "@/lib/agent-eval";
import { getAgentConfig } from "@/lib/agent-config";
import { recordGap } from "@/lib/knowledge-gaps";
import { isAudience } from "@/lib/persona";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Una suite de 17 preguntas tarda varios minutos entre respuesta y juicio. */
export const maxDuration = 800;

/** Por debajo de esta nota la pregunta entra en la cola de huecos. */
const WEAK_SCORE = 60;

/**
 * Corre una suite completa y va emitiendo cada caso en cuanto se juzga.
 *
 * El streaming no es cosmético: una suite tarda minutos y sin él el panel se
 * quedaría en blanco sin saber si avanza, que es justo lo contrario de "ver
 * cómo aprende".
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  if (!isLlmConfigured("chat")) {
    return Response.json({ error: "openai_not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const suiteId = String(body?.suiteId || "");
  const limit = Math.min(Math.max(Number(body?.limit) || 0, 0), 200);
  const label = String(body?.label || "").slice(0, 120) || null;

  const suite = await prisma.evalSuite.findUnique({
    where: { id: suiteId },
    include: {
      cases: {
        orderBy: { createdAt: "asc" },
        ...(limit ? { take: limit } : {}),
      },
    },
  });
  if (!suite) return Response.json({ error: "suite_not_found" }, { status: 404 });
  if (!suite.cases.length) {
    return Response.json({ error: "suite_empty" }, { status: 400 });
  }

  const config = await getAgentConfig();
  const corpusChunks = await prisma.knowledgeChunk.count();

  const run = await prisma.evalRun.create({
    data: {
      suiteId: suite.id,
      promptVersionId: config.id,
      label,
      model: config.model,
      totalCases: suite.cases.length,
      corpusChunks,
    },
  });

  const encoder = new TextEncoder();
  const cases = suite.cases;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));

      send({
        type: "start",
        runId: run.id,
        suite: suite.name,
        total: cases.length,
        model: config.model,
        promptVersion: config.version,
        corpusChunks,
      });

      const totals: Record<Dimension, number> = Object.fromEntries(
        DIMENSIONS.map((d) => [d, 0]),
      ) as Record<Dimension, number>;
      let scoreSum = 0;
      let completed = 0;

      for (const c of cases) {
        try {
          const audience = isAudience(c.audience) ? c.audience : "desconocido";

          const agent = await answerAsAgent({
            question: c.question,
            locale: c.locale === "en" ? "en" : "es",
            audience,
            stage: "diagnostico",
            // El corpus privado también cuenta: aquí evaluamos el conocimiento,
            // no lo que se expone en el sitio.
            publicOnly: false,
          });

          const judgement = await judgeAnswer({
            question: c.question,
            answer: agent.answer,
            ragContext: agent.ragContext,
            audience,
            mustCover: c.mustCover,
            redFlags: c.redFlags,
          });

          await prisma.evalResult.create({
            data: {
              runId: run.id,
              caseId: c.id,
              answer: agent.answer,
              scores: judgement.scores,
              score: judgement.score,
              diagnosis: judgement.diagnosis || null,
              improved: judgement.improved || null,
              sources: agent.sources.map((s) => ({
                id: s.id,
                title: s.title,
                similarity: Number(s.similarity.toFixed(3)),
              })),
              bestSimilarity: agent.bestSimilarity,
            },
          });

          if (
            judgement.score < WEAK_SCORE ||
            agent.bestSimilarity < GAP_THRESHOLD
          ) {
            await recordGap({
              question: c.question,
              source: "eval",
              bestSimilarity: agent.bestSimilarity,
              audience,
            });
          }

          for (const d of DIMENSIONS) totals[d] += judgement.scores[d];
          scoreSum += judgement.score;
          completed++;

          await prisma.evalRun.update({
            where: { id: run.id },
            data: { completedCases: completed },
          });

          send({
            type: "case",
            caseId: c.id,
            externalId: c.externalId,
            question: c.question,
            audience,
            difficulty: c.difficulty,
            answer: agent.answer,
            scores: judgement.scores,
            score: judgement.score,
            diagnosis: judgement.diagnosis,
            improved: judgement.improved,
            bestSimilarity: Number(agent.bestSimilarity.toFixed(3)),
            gap: agent.bestSimilarity < GAP_THRESHOLD,
            index: completed,
            total: cases.length,
          });
        } catch (err) {
          console.error("Caso de evaluación:", err);
          send({
            type: "case_error",
            caseId: c.id,
            question: c.question,
            error: err instanceof Error ? err.message : "error",
          });
        }
      }

      const dimensionAvgs = Object.fromEntries(
        DIMENSIONS.map((d) => [
          d,
          completed ? Math.round((totals[d] / completed) * 10) / 10 : 0,
        ]),
      ) as Scores;
      const avgScore = completed
        ? Math.round((scoreSum / completed) * 10) / 10
        : 0;

      await prisma.evalRun.update({
        where: { id: run.id },
        data: {
          status: completed ? "done" : "error",
          completedCases: completed,
          avgScore,
          dimensionAvgs,
          finishedAt: new Date(),
        },
      });

      send({
        type: "done",
        runId: run.id,
        completed,
        avgScore,
        dimensionAvgs,
      });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}
