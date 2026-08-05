import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { getOpenAI, EMBEDDING_MODEL } from "./openai";
import { logUsage } from "./usage";

export type RetrievedChunk = {
  id: string;
  content: string;
  title: string;
  sourceRef: string | null;
  similarity: number;
};

/**
 * Divide texto en fragmentos con solapamiento, respetando parrafos.
 */
export function chunkText(
  text: string,
  maxChars = 900,
  overlap = 150,
): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (clean.length <= maxChars) return clean ? [clean] : [];

  const paragraphs = clean.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > maxChars) {
      if (current) chunks.push(current.trim());
      if (para.length > maxChars) {
        // Parrafo muy largo: partir por oraciones
        const sentences = para.split(/(?<=[.!?])\s+/);
        let buf = "";
        for (const s of sentences) {
          if ((buf + " " + s).length > maxChars) {
            if (buf) chunks.push(buf.trim());
            buf = s;
          } else {
            buf = buf ? `${buf} ${s}` : s;
          }
        }
        current = buf;
      } else {
        current = para;
      }
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current) chunks.push(current.trim());

  // Aplicar solapamiento
  if (overlap > 0 && chunks.length > 1) {
    return chunks.map((c, i) => {
      if (i === 0) return c;
      const prev = chunks[i - 1];
      const tail = prev.slice(Math.max(0, prev.length - overlap));
      return `${tail} ${c}`.trim();
    });
  }
  return chunks;
}

export async function embedText(text: string): Promise<number[]> {
  const openai = getOpenAI();
  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.replace(/\n/g, " ").slice(0, 8000),
  });
  await logUsage({
    channel: "embeddings",
    model: EMBEDDING_MODEL,
    promptTokens: res.usage?.total_tokens ?? 0,
  });
  return res.data[0].embedding;
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.map((n) => (Number.isFinite(n) ? n : 0)).join(",")}]`;
}

/**
 * Persiste el embedding de un chunk en la columna pgvector via SQL crudo.
 */
export async function setChunkEmbedding(
  chunkId: string,
  embedding: number[],
): Promise<void> {
  const literal = toVectorLiteral(embedding);
  await prisma.$executeRaw`
    UPDATE "KnowledgeChunk"
    SET embedding = ${literal}::vector
    WHERE id = ${chunkId}
  `;
}

/**
 * Recupera los chunks mas similares (retrieval por coseno con pgvector).
 */
export async function searchChunks(
  query: string,
  opts: { k?: number; publicOnly?: boolean } = {},
): Promise<RetrievedChunk[]> {
  const { k = 5, publicOnly = true } = opts;
  const queryEmbedding = await embedText(query);
  const literal = toVectorLiteral(queryEmbedding);

  const publicFilter = publicOnly
    ? Prisma.sql`AND c."isPublic" = true`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<
    {
      id: string;
      content: string;
      title: string;
      sourceRef: string | null;
      similarity: number;
    }[]
  >(Prisma.sql`
    SELECT
      k.id,
      k.content,
      e.title AS title,
      e."sourceRef" AS "sourceRef",
      1 - (k.embedding <=> ${literal}::vector) AS similarity
    FROM "KnowledgeChunk" k
    JOIN "KnowledgeCollection" c ON c.id = k."collectionId"
    JOIN "KnowledgeEntry" e ON e.id = k."entryId"
    WHERE k.embedding IS NOT NULL
    ${publicFilter}
    ORDER BY k.embedding <=> ${literal}::vector
    LIMIT ${k}
  `);

  return rows.map((r) => ({
    id: r.id,
    content: r.content,
    title: r.title,
    sourceRef: r.sourceRef,
    similarity: Number(r.similarity),
  }));
}

/**
 * Formatea el contexto RAG para inyectar en el prompt (con citas).
 */
export function formatRagContext(chunks: RetrievedChunk[]): string {
  if (!chunks.length) return "";
  return chunks
    .map(
      (c, i) =>
        `[Fuente ${i + 1}: ${c.title}]\n${c.content}`,
    )
    .join("\n\n---\n\n");
}
