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

export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const [collections, entries, chunkCounts] = await Promise.all([
    prisma.knowledgeCollection.findMany({ orderBy: { name: "asc" } }),
    prisma.knowledgeEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 400,
      select: {
        id: true,
        collectionId: true,
        title: true,
        sourceType: true,
        sourceRef: true,
        lang: true,
        trustTier: true,
        content: true,
        createdAt: true,
        _count: { select: { chunks: true } },
      },
    }),
    prisma.knowledgeChunk.count(),
  ]);

  return Response.json({
    collections,
    entries: entries.map((e) => ({
      ...e,
      chunks: e._count.chunks,
      createdAt: e.createdAt.toISOString(),
    })),
    totalChunks: chunkCounts,
  });
}

export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const title = String(body?.title || "").trim();
  const content = String(body?.content || "").trim();
  if (!title || !content) {
    return Response.json({ error: "title_content_required" }, { status: 400 });
  }

  const collectionId =
    body?.collectionId ||
    (await ensureCollection(
      TRAINING_COLLECTION.slug,
      TRAINING_COLLECTION.name,
    ));

  const entry = await prisma.knowledgeEntry.create({
    data: {
      collectionId,
      title: title.slice(0, 300),
      content,
      lang: body?.lang === "en" ? "en" : "es",
      sourceType: body?.sourceType ? String(body.sourceType).slice(0, 40) : "manual",
      sourceRef: body?.sourceRef ? String(body.sourceRef).slice(0, 300) : null,
      trustTier: body?.trustTier ? String(body.trustTier).slice(0, 40) : "canonical",
    },
  });

  let chunks = 0;
  let warning: string | null = null;
  if (process.env.OPENAI_API_KEY) {
    try {
      chunks = await reindexEntry(entry.id);
    } catch (err) {
      warning = err instanceof Error ? err.message : "index_failed";
    }
  } else {
    warning = "openai_not_configured";
  }

  return Response.json({ entry, chunks, warning });
}
