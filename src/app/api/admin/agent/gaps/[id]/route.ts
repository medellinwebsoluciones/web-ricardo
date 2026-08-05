import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import {
  ensureCollection,
  reindexEntry,
  TRAINING_COLLECTION,
} from "@/lib/corpus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Resolver un hueco hace tres cosas de golpe: guarda la respuesta en el corpus
 * (para que el RAG la recupere), la deja como ejemplo aprobado para el dataset
 * de fine-tuning, y cierra el hueco.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const action = String(body?.action || "resolve");

  const gap = await prisma.knowledgeGap.findUnique({ where: { id } });
  if (!gap) return Response.json({ error: "not_found" }, { status: 404 });

  if (action === "dismiss") {
    await prisma.knowledgeGap.update({
      where: { id },
      data: { status: "descartado" },
    });
    return Response.json({ ok: true, status: "descartado" });
  }

  const answer = String(body?.answer || "").trim();
  if (answer.length < 20) {
    return Response.json({ error: "answer_too_short" }, { status: 400 });
  }

  const collectionId = await ensureCollection(
    TRAINING_COLLECTION.slug,
    TRAINING_COLLECTION.name,
  );

  const entry = await prisma.knowledgeEntry.create({
    data: {
      collectionId,
      title: gap.question.slice(0, 160),
      content: `Pregunta: ${gap.question}\n\nRespuesta: ${answer}`,
      sourceType: "manual",
      sourceRef: `hueco:${gap.id}`,
      lang: "es",
      trustTier: "canonical",
    },
  });

  let chunks = 0;
  try {
    chunks = await reindexEntry(entry.id);
  } catch (err) {
    console.error("Reindexar hueco resuelto:", err);
  }

  await prisma.trainingExample.create({
    data: {
      question: gap.question,
      answer,
      audience: gap.audience || "desconocido",
      source: "correccion",
      approved: true,
    },
  });

  await prisma.knowledgeGap.update({
    where: { id },
    data: { status: "resuelto", answer, entryId: entry.id },
  });

  return Response.json({ ok: true, entryId: entry.id, chunks });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.knowledgeGap.delete({ where: { id } }).catch(() => {});
  return Response.json({ ok: true });
}
