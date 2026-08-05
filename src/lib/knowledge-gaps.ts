import { prisma } from "./prisma";

/**
 * Cola de huecos de conocimiento.
 *
 * Una pregunta entra aquí cuando el corpus no la cubre: desde el playground,
 * desde una nota baja de las evaluaciones o desde un chat real del sitio. Se
 * deduplica por forma normalizada para poder priorizar por frecuencia: lo que
 * más veces preguntan es lo primero que hay que responder.
 */

export type GapSource = "playground" | "eval" | "chat";

/** Normaliza para deduplicar: sin acentos, sin puntuación, sin mayúsculas. */
export function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

export async function recordGap(params: {
  question: string;
  source: GapSource;
  bestSimilarity?: number;
  audience?: string | null;
}): Promise<void> {
  const question = params.question.trim();
  const normalized = normalizeQuestion(question);
  if (normalized.length < 8) return;

  try {
    const existing = await prisma.knowledgeGap.findUnique({
      where: { normalized },
    });

    if (existing) {
      // Un hueco ya resuelto que vuelve a aparecer se reabre: la respuesta que
      // se guardó no está sirviendo.
      await prisma.knowledgeGap.update({
        where: { normalized },
        data: {
          hits: { increment: 1 },
          bestSimilarity: Math.max(
            existing.bestSimilarity,
            params.bestSimilarity ?? 0,
          ),
          ...(existing.status === "resuelto" ? { status: "abierto" } : {}),
        },
      });
      return;
    }

    await prisma.knowledgeGap.create({
      data: {
        question: question.slice(0, 2000),
        normalized,
        source: params.source,
        audience: params.audience ?? null,
        bestSimilarity: params.bestSimilarity ?? 0,
      },
    });
  } catch (err) {
    console.error("Registrar hueco:", err);
  }
}

/**
 * Preguntas reales de visitantes que el corpus no cubrió.
 *
 * Se detectan por el trazo de retrieval que guarda cada turno: si la mejor
 * similitud fue baja, el agente respondió sin apoyo real.
 */
export async function mineGapsFromChats(params: {
  threshold?: number;
  limit?: number;
} = {}): Promise<number> {
  const { threshold = 0.35, limit = 200 } = params;

  const analyses = await prisma.chatTurnAnalysis.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { message: true, audience: true, ragTrace: true },
  });

  let found = 0;
  for (const row of analyses) {
    const trace = Array.isArray(row.ragTrace)
      ? (row.ragTrace as { similarity?: number }[])
      : [];
    const best = trace.reduce(
      (max, t) => Math.max(max, Number(t?.similarity) || 0),
      0,
    );
    if (best >= threshold) continue;
    // Un "hola" no es un hueco de conocimiento.
    if (row.message.trim().length < 25) continue;

    await recordGap({
      question: row.message,
      source: "chat",
      bestSimilarity: best,
      audience: row.audience,
    });
    found++;
  }

  return found;
}
