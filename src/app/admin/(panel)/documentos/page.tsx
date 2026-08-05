import { prisma } from "@/lib/prisma";
import {
  DocumentsLibrary,
  type DocumentRow,
} from "@/components/admin/DocumentsLibrary";

export const dynamic = "force-dynamic";

export default async function DocumentosPage() {
  const docs = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const rows: DocumentRow[] = docs.map((d) => ({
    id: d.id,
    title: d.title,
    kind: d.kind,
    lang: d.lang,
    filename: d.filename,
    mimeType: d.mimeType,
    sizeBytes: d.sizeBytes,
    version: d.version,
    tags: d.tags,
    hasText: Boolean(d.extractedText),
    textChars: d.extractedText?.length ?? 0,
    knowledgeEntryId: d.knowledgeEntryId,
    createdAt: d.createdAt.toISOString(),
  }));

  return (
    <DocumentsLibrary
      initial={rows}
      openaiConfigured={Boolean(process.env.OPENAI_API_KEY)}
    />
  );
}
