import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { clientFor } from "./llm/client";
import { EMBEDDING_MODEL } from "./openai";
import { logUsage } from "./usage";

export type RetrievedChunk = {
  id: string;
  entryId: string;
  content: string;
  title: string;
  sourceRef: string | null;
  sourceType: string;
  trustTier: string;
  lang: string;
  createdAt: Date;
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

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const { client } = clientFor("embeddings");
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts.map((t) => t.replace(/\n/g, " ").slice(0, 8000)),
  });
  await logUsage({
    channel: "embeddings",
    model: EMBEDDING_MODEL,
    promptTokens: res.usage?.total_tokens ?? 0,
  });
  return res.data.map((d) => d.embedding);
}

export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  return embedding;
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

// ---------------------------------------------------------------------------
// Búsqueda híbrida
// ---------------------------------------------------------------------------

export type SearchOptions = {
  /** Cuántos chunks devolver tras el re-ranking. */
  k?: number;
  publicOnly?: boolean;
  /** Idioma del visitante: prioriza el corpus en ese idioma. */
  lang?: string;
  /** Reformular la pregunta para no depender del vocabulario del visitante. */
  multiQuery?: boolean;
  /** Candidatos por rama antes de fusionar. */
  candidates?: number;
};

type ScoredRow = RetrievedChunk & { rank: number };

const TS_CONFIG: Record<string, string> = { es: "spanish", en: "english" };

let lexicalIndexReady = false;

/**
 * Índices GIN para la rama léxica. Se crean una vez por proceso: `db push` no
 * gestiona índices de expresión, así que viven aquí junto a la consulta que
 * los usa.
 */
async function ensureLexicalIndexes(): Promise<void> {
  if (lexicalIndexReady) return;
  try {
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "knowledge_chunk_fts_es" ON "KnowledgeChunk" USING GIN (to_tsvector('spanish', content))`,
    );
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "knowledge_chunk_fts_en" ON "KnowledgeChunk" USING GIN (to_tsvector('english', content))`,
    );
    lexicalIndexReady = true;
  } catch (err) {
    // Sin índice la búsqueda léxica sigue funcionando, solo más lenta.
    console.error("Índices léxicos:", err);
  }
}

/**
 * Reformula la pregunta en 2 variantes. El visitante pregunta "¿aguanta mucha
 * gente?" y el corpus dice "alta disponibilidad": sin esto el retrieval falla
 * por vocabulario, no por falta de conocimiento.
 */
async function expandQuery(query: string): Promise<string[]> {
  try {
    const { client, model, provider, tier } = clientFor("analyst");
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.3,
      max_tokens: 160,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Reescribe la pregunta de 2 formas distintas para buscar en una base de conocimiento sobre un arquitecto de software y consultor de IA. Una variante con vocabulario técnico y otra con las palabras que usaría alguien de negocio. Devuelve solo {"queries": ["...", "..."]}.',
        },
        { role: "user", content: query.slice(0, 600) },
      ],
    });
    if (completion.usage) {
      await logUsage({
        channel: "analyst",
        model,
        provider,
        tier,
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
      });
    }
    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    const queries = Array.isArray(parsed.queries) ? parsed.queries : [];
    return queries
      .filter((q: unknown): q is string => typeof q === "string" && q.trim().length > 3)
      .slice(0, 2)
      .map((q: string) => q.trim());
  } catch {
    return [];
  }
}

/** Convierte texto libre en un tsquery por OR, para privilegiar recall. */
function toTsQuery(text: string): string {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 14);
  return [...new Set(words)].join(" | ");
}

async function vectorSearch(
  embedding: number[],
  limit: number,
  publicOnly: boolean,
): Promise<ScoredRow[]> {
  const literal = toVectorLiteral(embedding);
  const publicFilter = publicOnly
    ? Prisma.sql`AND c."isPublic" = true`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<
    (Omit<RetrievedChunk, "similarity"> & { similarity: number })[]
  >(Prisma.sql`
    SELECT
      k.id,
      k."entryId",
      k.content,
      e.title AS title,
      e."sourceRef" AS "sourceRef",
      e."sourceType" AS "sourceType",
      e."trustTier" AS "trustTier",
      e.lang AS lang,
      e."createdAt" AS "createdAt",
      1 - (k.embedding <=> ${literal}::vector) AS similarity
    FROM "KnowledgeChunk" k
    JOIN "KnowledgeCollection" c ON c.id = k."collectionId"
    JOIN "KnowledgeEntry" e ON e.id = k."entryId"
    WHERE k.embedding IS NOT NULL
    ${publicFilter}
    ORDER BY k.embedding <=> ${literal}::vector
    LIMIT ${limit}
  `);

  return rows.map((r, i) => ({
    ...r,
    similarity: Number(r.similarity),
    rank: i + 1,
  }));
}

async function lexicalSearch(
  query: string,
  limit: number,
  publicOnly: boolean,
  lang: string,
): Promise<ScoredRow[]> {
  const tsquery = toTsQuery(query);
  if (!tsquery) return [];
  await ensureLexicalIndexes();

  const config = TS_CONFIG[lang] ?? "spanish";
  const publicFilter = publicOnly
    ? Prisma.sql`AND c."isPublic" = true`
    : Prisma.empty;

  try {
    const rows = await prisma.$queryRaw<
      (Omit<RetrievedChunk, "similarity"> & { similarity: number })[]
    >(Prisma.sql`
      SELECT
        k.id,
        k."entryId",
        k.content,
        e.title AS title,
        e."sourceRef" AS "sourceRef",
        e."sourceType" AS "sourceType",
        e."trustTier" AS "trustTier",
        e.lang AS lang,
        e."createdAt" AS "createdAt",
        ts_rank(to_tsvector(${config}::regconfig, k.content), to_tsquery(${config}::regconfig, ${tsquery})) AS similarity
      FROM "KnowledgeChunk" k
      JOIN "KnowledgeCollection" c ON c.id = k."collectionId"
      JOIN "KnowledgeEntry" e ON e.id = k."entryId"
      WHERE to_tsvector(${config}::regconfig, k.content) @@ to_tsquery(${config}::regconfig, ${tsquery})
      ${publicFilter}
      ORDER BY similarity DESC
      LIMIT ${limit}
    `);
    return rows.map((r, i) => ({
      ...r,
      similarity: Number(r.similarity),
      rank: i + 1,
    }));
  } catch (err) {
    console.error("Búsqueda léxica:", err);
    return [];
  }
}

/**
 * Reciprocal Rank Fusion: combina rankings sin necesidad de normalizar
 * puntuaciones que no son comparables entre sí (coseno vs ts_rank).
 */
const RRF_K = 60;

function fuse(
  branches: ScoredRow[][],
  opts: { lang: string },
): (RetrievedChunk & { fusedScore: number })[] {
  const byId = new Map<string, RetrievedChunk & { fusedScore: number }>();

  for (const branch of branches) {
    for (const row of branch) {
      const existing = byId.get(row.id);
      const contribution = 1 / (RRF_K + row.rank);
      if (existing) {
        existing.fusedScore += contribution;
        // La similitud coseno es la métrica que entiende el panel: conservar la
        // mayor vista en cualquier rama.
        existing.similarity = Math.max(existing.similarity, row.similarity);
      } else {
        const { rank: _rank, ...chunk } = row;
        byId.set(row.id, { ...chunk, fusedScore: contribution });
      }
    }
  }

  // Preferencias del corpus: idioma del visitante y material canónico.
  for (const chunk of byId.values()) {
    if (chunk.lang === opts.lang) chunk.fusedScore *= 1.15;
    if (chunk.trustTier === "canonical") chunk.fusedScore *= 1.1;
    else if (chunk.trustTier === "draft") chunk.fusedScore *= 0.85;
  }

  return [...byId.values()].sort((a, b) => b.fusedScore - a.fusedScore);
}

/**
 * Similitud entre los propios candidatos, calculada en Postgres para no traer
 * 1536 floats por chunk hasta Node.
 */
async function pairwiseSimilarity(
  ids: string[],
): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  if (ids.length < 2) return out;
  try {
    const rows = await prisma.$queryRaw<
      { a: string; b: string; sim: number }[]
    >(Prisma.sql`
      SELECT a.id AS a, b.id AS b, 1 - (a.embedding <=> b.embedding) AS sim
      FROM "KnowledgeChunk" a
      JOIN "KnowledgeChunk" b ON a.id < b.id
      WHERE a.id IN (${Prisma.join(ids)})
        AND b.id IN (${Prisma.join(ids)})
        AND a.embedding IS NOT NULL
        AND b.embedding IS NOT NULL
    `);
    for (const r of rows) {
      out.set(`${r.a}|${r.b}`, Number(r.sim));
      out.set(`${r.b}|${r.a}`, Number(r.sim));
    }
  } catch (err) {
    console.error("Similitud entre candidatos:", err);
  }
  return out;
}

/**
 * Maximal Marginal Relevance: evita devolver cinco chunks que dicen lo mismo,
 * que es lo que pasa cuando el corpus tiene la misma idea en varias entradas.
 */
const MMR_LAMBDA = 0.7;

async function rerankMmr<T extends RetrievedChunk & { fusedScore: number }>(
  candidates: T[],
  k: number,
): Promise<T[]> {
  if (candidates.length <= k) return candidates;

  const pool = candidates.slice(0, Math.min(candidates.length, 24));
  const sims = await pairwiseSimilarity(pool.map((c) => c.id));
  const maxScore = pool[0]?.fusedScore || 1;

  const selected: T[] = [];
  const remaining = [...pool];

  while (selected.length < k && remaining.length > 0) {
    let bestIdx = 0;
    let bestValue = -Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const relevance = remaining[i].fusedScore / maxScore;
      const redundancy = selected.length
        ? Math.max(
            ...selected.map((s) => sims.get(`${remaining[i].id}|${s.id}`) ?? 0),
          )
        : 0;
      const value = MMR_LAMBDA * relevance - (1 - MMR_LAMBDA) * redundancy;
      if (value > bestValue) {
        bestValue = value;
        bestIdx = i;
      }
    }
    selected.push(remaining.splice(bestIdx, 1)[0]);
  }

  return selected;
}

/**
 * Recupera los chunks más relevantes combinando búsqueda vectorial y léxica.
 */
export async function searchChunks(
  query: string,
  opts: SearchOptions = {},
): Promise<RetrievedChunk[]> {
  const {
    k = 5,
    publicOnly = true,
    lang = "es",
    multiQuery = true,
    candidates = 12,
  } = opts;

  const queries = [query];
  if (multiQuery) queries.push(...(await expandQuery(query)));

  // Una sola llamada de embeddings para todas las variantes.
  const embeddings = await embedTexts(queries);

  const branches = await Promise.all([
    ...embeddings.map((e) => vectorSearch(e, candidates, publicOnly)),
    lexicalSearch(query, candidates, publicOnly, lang),
  ]);

  const fused = fuse(branches, { lang });
  const reranked = await rerankMmr(fused, k);

  return reranked.map(({ fusedScore: _fusedScore, ...chunk }) => chunk);
}

/**
 * Formatea el contexto RAG con procedencia, para que el agente pueda citar de
 * dónde sale cada dato en vez de soltarlo sin origen.
 */
export function formatRagContext(chunks: RetrievedChunk[]): string {
  if (!chunks.length) return "";
  return chunks
    .map((c, i) => {
      const year = new Date(c.createdAt).getFullYear();
      const meta = [c.sourceType, c.lang, `${year}`]
        .filter(Boolean)
        .join(" · ");
      return `[Fuente ${i + 1}: ${c.title} — ${meta}]\n${c.content}`;
    })
    .join("\n\n---\n\n");
}

/** Trazo compacto del retrieval para guardar junto al análisis del turno. */
export function ragTrace(chunks: RetrievedChunk[]) {
  return chunks.map((c) => ({
    id: c.id,
    title: c.title,
    similarity: Number(c.similarity.toFixed(3)),
  }));
}
