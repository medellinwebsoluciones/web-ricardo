import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { harvestTrainingExamples, trainingStats } from "@/lib/finetune";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const approved = req.nextUrl.searchParams.get("approved");

  const [stats, examples] = await Promise.all([
    trainingStats(),
    prisma.trainingExample.findMany({
      where: approved === null ? {} : { approved: approved === "true" },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  return Response.json({
    stats,
    examples: examples.map((e) => ({
      id: e.id,
      question: e.question,
      answer: e.answer,
      audience: e.audience,
      source: e.source,
      approved: e.approved,
      createdAt: e.createdAt.toISOString(),
    })),
  });
}

/** Recolecta ejemplos de evaluaciones con nota alta y role-plays ganados. */
export async function POST() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const harvested = await harvestTrainingExamples();
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

  await prisma.trainingExample.update({
    where: { id },
    data: {
      approved: Boolean(body?.approved),
      ...(typeof body?.answer === "string" && body.answer.trim()
        ? { answer: body.answer.trim() }
        : {}),
    },
  });

  return Response.json({ ok: true, stats: await trainingStats() });
}
