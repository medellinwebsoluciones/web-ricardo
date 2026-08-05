import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Historial de corridas de una suite: es el gráfico donde se ve si el agente
 * mejora tras cargar conocimiento o cambiar la persona.
 */
export async function GET(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const suiteId = req.nextUrl.searchParams.get("suiteId") || "";
  const runId = req.nextUrl.searchParams.get("runId") || "";

  if (runId) {
    const run = await prisma.evalRun.findUnique({
      where: { id: runId },
      include: {
        suite: { select: { name: true } },
        results: {
          orderBy: { createdAt: "asc" },
          include: { case: { select: { question: true, externalId: true } } },
        },
      },
    });
    if (!run) return Response.json({ error: "not_found" }, { status: 404 });

    return Response.json({
      run: {
        id: run.id,
        suite: run.suite.name,
        label: run.label,
        model: run.model,
        avgScore: run.avgScore,
        dimensionAvgs: run.dimensionAvgs,
        corpusChunks: run.corpusChunks,
        startedAt: run.startedAt.toISOString(),
      },
      results: run.results.map((r) => ({
        id: r.id,
        question: r.case.question,
        externalId: r.case.externalId,
        answer: r.answer,
        scores: r.scores,
        score: r.score,
        diagnosis: r.diagnosis,
        improved: r.improved,
        bestSimilarity: r.bestSimilarity,
      })),
    });
  }

  const runs = await prisma.evalRun.findMany({
    where: {
      status: "done",
      ...(suiteId ? { suiteId } : {}),
    },
    orderBy: { startedAt: "asc" },
    take: 60,
    include: {
      suite: { select: { name: true, slug: true } },
      promptVersion: { select: { version: true, name: true } },
    },
  });

  return Response.json({
    runs: runs.map((r) => ({
      id: r.id,
      suite: r.suite.name,
      suiteSlug: r.suite.slug,
      label: r.label,
      model: r.model,
      promptVersion: r.promptVersion?.version ?? null,
      avgScore: r.avgScore,
      dimensionAvgs: r.dimensionAvgs,
      corpusChunks: r.corpusChunks,
      completedCases: r.completedCases,
      startedAt: r.startedAt.toISOString(),
    })),
  });
}
