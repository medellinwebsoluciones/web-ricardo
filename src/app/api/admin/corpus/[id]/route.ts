import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { reindexEntry } from "@/lib/corpus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const entry = await prisma.knowledgeEntry.findUnique({
    where: { id },
    include: {
      chunks: {
        orderBy: { idx: "asc" },
        select: { id: true, idx: true, content: true, tokens: true },
      },
    },
  });
  if (!entry) return Response.json({ error: "not_found" }, { status: 404 });

  // ¿Tienen embedding? Consulta cruda porque la columna es Unsupported.
  const embedded = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "KnowledgeChunk"
    WHERE "entryId" = ${id} AND embedding IS NOT NULL
  `;
  const embeddedIds = new Set(embedded.map((r) => r.id));

  return Response.json({
    entry: {
      ...entry,
      createdAt: entry.createdAt.toISOString(),
      chunks: entry.chunks.map((c) => ({
        ...c,
        embedded: embeddedIds.has(c.id),
      })),
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json().catch(() => null);

  if (body?.action === "reindex") {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "openai_not_configured" }, { status: 503 });
    }
    const chunks = await reindexEntry(id);
    return Response.json({ ok: true, chunks });
  }

  const data: Record<string, unknown> = {};
  if (typeof body?.title === "string" && body.title.trim()) {
    data.title = body.title.trim().slice(0, 300);
  }
  if (typeof body?.content === "string" && body.content.trim()) {
    data.content = body.content.trim();
  }
  if (body?.lang === "es" || body?.lang === "en") data.lang = body.lang;
  if (typeof body?.trustTier === "string") {
    data.trustTier = body.trustTier.slice(0, 40);
  }
  if (typeof body?.collectionId === "string") {
    data.collectionId = body.collectionId;
  }

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "nothing_to_update" }, { status: 400 });
  }

  const entry = await prisma.knowledgeEntry.update({ where: { id }, data });

  // Si cambió el contenido hay que rehacer los vectores.
  let chunks: number | null = null;
  let warning: string | null = null;
  if (data.content) {
    if (process.env.OPENAI_API_KEY) {
      try {
        chunks = await reindexEntry(id);
      } catch (err) {
        warning = err instanceof Error ? err.message : "index_failed";
      }
    } else {
      warning = "openai_not_configured";
    }
  }

  return Response.json({ entry, chunks, warning });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.knowledgeEntry.delete({ where: { id } });
  return Response.json({ ok: true });
}
