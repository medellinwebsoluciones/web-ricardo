import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { ensureCollection, reindexEntry } from "@/lib/corpus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOCS_COLLECTION = { slug: "documentos", name: "Documentos subidos" };

/**
 * Envía el texto extraído del documento al corpus RAG.
 * Si ya se había enviado, actualiza la entrada y reindexa.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "openai_not_configured" }, { status: 503 });
  }

  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return Response.json({ error: "not_found" }, { status: 404 });
  if (!doc.extractedText) {
    return Response.json({ error: "no_text_to_ingest" }, { status: 400 });
  }

  const collectionId = await ensureCollection(
    DOCS_COLLECTION.slug,
    DOCS_COLLECTION.name,
  );

  const existing = doc.knowledgeEntryId
    ? await prisma.knowledgeEntry.findUnique({
        where: { id: doc.knowledgeEntryId },
      })
    : null;

  const entry = existing
    ? await prisma.knowledgeEntry.update({
        where: { id: existing.id },
        data: { title: doc.title, content: doc.extractedText, lang: doc.lang },
      })
    : await prisma.knowledgeEntry.create({
        data: {
          collectionId,
          title: doc.title,
          content: doc.extractedText,
          lang: doc.lang,
          sourceType: "doc",
          sourceRef: doc.filename,
          trustTier: "canonical",
        },
      });

  const chunks = await reindexEntry(entry.id);

  await prisma.document.update({
    where: { id },
    data: { knowledgeEntryId: entry.id },
  });

  return Response.json({ ok: true, entryId: entry.id, chunks });
}
