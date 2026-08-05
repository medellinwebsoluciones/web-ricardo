import { prisma } from "./prisma";
import { chunkText, embedText, setChunkEmbedding } from "./rag";
import {
  collections as corpusCollections,
  entries as corpusEntries,
  type CorpusCollection,
  type CorpusEntry,
} from "./knowledge-corpus";

export async function ensureVectorExtension(): Promise<void> {
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
}

export async function upsertCollections(
  collections: CorpusCollection[],
): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const c of collections) {
    const row = await prisma.knowledgeCollection.upsert({
      where: { slug: c.slug },
      update: { name: c.name, isPublic: c.isPublic },
      create: { slug: c.slug, name: c.name, isPublic: c.isPublic },
    });
    map[c.slug] = row.id;
  }
  return map;
}

/**
 * Ingesta un conjunto de entradas: crea la entrada, la trocea, embebe cada
 * chunk y guarda el vector. Devuelve el numero de chunks procesados.
 */
export async function ingestEntries(
  entries: CorpusEntry[],
  collectionMap: Record<string, string>,
): Promise<number> {
  let totalChunks = 0;

  for (const entry of entries) {
    const collectionId = collectionMap[entry.collectionSlug];
    if (!collectionId) {
      console.warn(`Colección no encontrada: ${entry.collectionSlug}`);
      continue;
    }

    const created = await prisma.knowledgeEntry.create({
      data: {
        collectionId,
        title: entry.title,
        sourceType: entry.sourceType,
        lang: entry.lang,
        content: entry.content,
      },
    });

    const chunks = chunkText(entry.content);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = await prisma.knowledgeChunk.create({
        data: {
          entryId: created.id,
          collectionId,
          idx: i,
          content: chunks[i],
          tokens: Math.ceil(chunks[i].length / 4),
        },
      });
      const embedding = await embedText(chunks[i]);
      await setChunkEmbedding(chunk.id, embedding);
      totalChunks++;
    }
  }

  return totalChunks;
}

/**
 * Reindexa todo el corpus base (borra entradas previas de esas colecciones).
 */
export async function ingestCorpus(
  opts: { reset?: boolean } = {},
): Promise<{ collections: number; chunks: number }> {
  await ensureVectorExtension();
  const map = await upsertCollections(corpusCollections);

  if (opts.reset) {
    await prisma.knowledgeEntry.deleteMany({
      where: { collectionId: { in: Object.values(map) } },
    });
  }

  const chunks = await ingestEntries(corpusEntries, map);
  return { collections: corpusCollections.length, chunks };
}
