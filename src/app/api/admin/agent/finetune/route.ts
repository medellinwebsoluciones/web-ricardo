import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import {
  createTrainingExample,
  harvestSimulationRun,
  harvestTrainingExamples,
  importJsonlExamples,
  serializeExample,
  trainingStats,
  type HarvestSourceKey,
} from "@/lib/finetune";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HARVEST_KEYS = new Set<HarvestSourceKey>([
  "evals",
  "preferences",
  "simulations",
]);

export async function GET(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const approved = req.nextUrl.searchParams.get("approved");
  const source = req.nextUrl.searchParams.get("source");

  const [stats, examples] = await Promise.all([
    trainingStats(),
    prisma.trainingExample.findMany({
      where: {
        ...(approved === null ? {} : { approved: approved === "true" }),
        ...(source ? { source } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  return Response.json({
    stats,
    examples: examples.map(serializeExample),
  });
}

/**
 * POST actions:
 * - harvest (default): { sources?: string[] }
 * - import: { action: "import", jsonl: string, approve?: boolean }
 * - create: { action: "create", question, answer, ... }
 * - harvest_simulation: { action: "harvest_simulation", runId }
 * - bulk_approve: { action: "bulk_approve", ids: string[], approved?: boolean }
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const action = String(body?.action || "harvest");

  if (action === "import") {
    const jsonl = String(body?.jsonl || "");
    if (!jsonl.trim()) {
      return Response.json({ error: "empty_jsonl" }, { status: 400 });
    }
    const result = await importJsonlExamples(jsonl, {
      approve: Boolean(body?.approve),
    });
    return Response.json({ ...result, stats: await trainingStats() });
  }

  if (action === "create") {
    try {
      const example = await createTrainingExample({
        question: String(body?.question || ""),
        answer: String(body?.answer || ""),
        rejectedAnswer: body?.rejectedAnswer
          ? String(body.rejectedAnswer)
          : null,
        audience: body?.audience ? String(body.audience) : undefined,
        locale: body?.locale ? String(body.locale) : undefined,
        source: body?.source || "manual",
        approved: body?.approved !== undefined ? Boolean(body.approved) : false,
        tags: Array.isArray(body?.tags)
          ? body.tags.map(String)
          : undefined,
        notes: body?.notes ? String(body.notes) : null,
        quality:
          typeof body?.quality === "number" ? body.quality : null,
        simulationRunId: body?.simulationRunId
          ? String(body.simulationRunId)
          : null,
        evalResultId: body?.evalResultId
          ? String(body.evalResultId)
          : null,
      });
      return Response.json({
        example: serializeExample(example),
        stats: await trainingStats(),
      });
    } catch {
      return Response.json({ error: "invalid_example" }, { status: 400 });
    }
  }

  if (action === "harvest_simulation") {
    const runId = String(body?.runId || "");
    if (!runId) {
      return Response.json({ error: "bad_request" }, { status: 400 });
    }
    const result = await harvestSimulationRun(runId);
    return Response.json({ ...result, stats: await trainingStats() });
  }

  if (action === "bulk_approve") {
    const ids = Array.isArray(body?.ids)
      ? body.ids.map(String).filter(Boolean)
      : [];
    if (ids.length === 0) {
      return Response.json({ error: "bad_request" }, { status: 400 });
    }
    const approved = body?.approved === false ? false : true;
    await prisma.trainingExample.updateMany({
      where: { id: { in: ids } },
      data: { approved },
    });
    return Response.json({ ok: true, stats: await trainingStats() });
  }

  // harvest
  const rawSources = Array.isArray(body?.sources) ? body.sources : [];
  const sources = rawSources
    .map(String)
    .filter((s: string): s is HarvestSourceKey =>
      HARVEST_KEYS.has(s as HarvestSourceKey),
    );

  const harvested = await harvestTrainingExamples(
    sources.length ? sources : undefined,
  );
  return Response.json({ ...harvested, stats: await trainingStats() });
}

export async function PATCH(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const id = String(body?.id || "");
  if (!id) return Response.json({ error: "bad_request" }, { status: 400 });

  if (body?.delete) {
    await prisma.trainingExample.delete({ where: { id } }).catch(() => {});
    return Response.json({ ok: true, stats: await trainingStats() });
  }

  const data: {
    approved?: boolean;
    answer?: string;
    rejectedAnswer?: string | null;
    notes?: string | null;
    quality?: number | null;
    tags?: string[];
    audience?: string;
  } = {};

  if (typeof body?.approved === "boolean") data.approved = body.approved;
  if (typeof body?.answer === "string" && body.answer.trim()) {
    data.answer = body.answer.trim();
  }
  if (body?.rejectedAnswer === null) data.rejectedAnswer = null;
  else if (typeof body?.rejectedAnswer === "string") {
    data.rejectedAnswer = body.rejectedAnswer.trim() || null;
  }
  if (body?.notes === null) data.notes = null;
  else if (typeof body?.notes === "string") {
    data.notes = body.notes.trim() || null;
  }
  if (body?.quality === null) data.quality = null;
  else if (
    typeof body?.quality === "number" &&
    body.quality >= 1 &&
    body.quality <= 5
  ) {
    data.quality = body.quality;
  }
  if (Array.isArray(body?.tags)) data.tags = body.tags.map(String);
  if (typeof body?.audience === "string" && body.audience.trim()) {
    data.audience = body.audience.trim();
  }

  await prisma.trainingExample.update({ where: { id }, data });
  return Response.json({ ok: true, stats: await trainingStats() });
}
