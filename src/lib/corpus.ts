import { prisma } from "./prisma";
import { chunkText, embedText, setChunkEmbedding } from "./rag";

/**
 * Crea (o reemplaza) los chunks de una entrada y genera sus embeddings.
 * Devuelve cuántos chunks quedaron indexados.
 */
export async function reindexEntry(entryId: string): Promise<number> {
  const entry = await prisma.knowledgeEntry.findUnique({
    where: { id: entryId },
  });
  if (!entry) throw new Error("entry_not_found");

  await prisma.knowledgeChunk.deleteMany({ where: { entryId } });

  const chunks = chunkText(entry.content);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = await prisma.knowledgeChunk.create({
      data: {
        entryId: entry.id,
        collectionId: entry.collectionId,
        idx: i,
        content: chunks[i],
        tokens: Math.ceil(chunks[i].length / 4),
      },
    });
    const embedding = await embedText(chunks[i]);
    await setChunkEmbedding(chunk.id, embedding);
  }

  return chunks.length;
}

/**
 * Colección por defecto para material que se añade desde el panel.
 */
export async function ensureCollection(
  slug: string,
  name: string,
  isPublic = true,
): Promise<string> {
  const row = await prisma.knowledgeCollection.upsert({
    where: { slug },
    update: {},
    create: { slug, name, isPublic },
  });
  return row.id;
}

export const TRAINING_COLLECTION = {
  slug: "entrenamiento",
  name: "Entrenamiento manual (panel)",
};
