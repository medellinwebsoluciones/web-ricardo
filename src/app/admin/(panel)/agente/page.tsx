import { prisma } from "@/lib/prisma";
import { AgentStudio, type CorpusEntry } from "@/components/admin/AgentStudio";

export const dynamic = "force-dynamic";

export default async function AgentePage() {
  const [collections, entries, totalChunks] = await Promise.all([
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

  const rows: CorpusEntry[] = entries.map((e) => ({
    id: e.id,
    collectionId: e.collectionId,
    title: e.title,
    sourceType: e.sourceType,
    sourceRef: e.sourceRef,
    lang: e.lang,
    trustTier: e.trustTier,
    content: e.content,
    chunks: e._count.chunks,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <AgentStudio
      collections={collections.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        isPublic: c.isPublic,
      }))}
      entries={rows}
      totalChunks={totalChunks}
      openaiConfigured={Boolean(process.env.OPENAI_API_KEY)}
    />
  );
}
