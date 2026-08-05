import { prisma } from "./prisma";
import { AUDIENCE_LABEL, isAudience } from "./persona";

/**
 * Dataset de fine-tuning.
 *
 * Importante para no perder el tiempo: el fine-tuning enseña **estilo, tono y
 * formato**, no hechos. Los hechos siguen viniendo del RAG. Por eso los
 * ejemplos se guardan sin el contexto recuperado: lo que queremos que el modelo
 * aprenda es cómo suena Ricardo, no lo que sabe.
 */

/** Sin este volumen el fine-tuning rinde peor que meter ejemplos en el prompt. */
export const MIN_EXAMPLES = 80;

/** Nota a partir de la cual una respuesta evaluada vale como ejemplo. */
const HARVEST_SCORE = 90;

/**
 * Instrucción del sistema del dataset. Es corta a propósito: si aquí metemos
 * el prompt completo, el modelo aprende a depender de él y el fine-tuning deja
 * de aportar.
 */
const SYSTEM_LINE =
  "Eres el asistente de IA de Ricardo Zuluaga, arquitecto de software y consultor de automatización con IA. Respondes en español, en texto plano, como un experto que conversa: sin listas, sin markdown y sin fórmulas enlatadas.";

export type JsonlExample = {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
};

export function toJsonlExample(example: {
  question: string;
  answer: string;
  audience: string;
}): JsonlExample {
  const audience = isAudience(example.audience)
    ? AUDIENCE_LABEL[example.audience]
    : null;

  return {
    messages: [
      {
        role: "system",
        content: audience
          ? `${SYSTEM_LINE}\nQuien pregunta: ${audience}.`
          : SYSTEM_LINE,
      },
      { role: "user", content: example.question },
      { role: "assistant", content: example.answer },
    ],
  };
}

export async function buildJsonl(): Promise<{ jsonl: string; count: number }> {
  const examples = await prisma.trainingExample.findMany({
    where: { approved: true },
    orderBy: { createdAt: "asc" },
  });

  const jsonl = examples
    .map((e) => JSON.stringify(toJsonlExample(e)))
    .join("\n");

  return { jsonl, count: examples.length };
}

/**
 * Recolecta ejemplos de lo que ya se produjo: respuestas que el juez puntuó
 * alto y role-plays que terminaron en llamada agendada.
 */
export async function harvestTrainingExamples(): Promise<{
  fromEvals: number;
  fromSimulations: number;
}> {
  const existing = new Set(
    (await prisma.trainingExample.findMany({ select: { question: true } })).map(
      (e) => e.question.trim().toLowerCase(),
    ),
  );

  // --- Respuestas con nota alta en las evaluaciones ---
  const results = await prisma.evalResult.findMany({
    where: { score: { gte: HARVEST_SCORE } },
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { case: { select: { question: true, audience: true, locale: true } } },
  });

  let fromEvals = 0;
  for (const r of results) {
    const key = r.case.question.trim().toLowerCase();
    if (existing.has(key) || !r.answer.trim()) continue;
    existing.add(key);
    await prisma.trainingExample.create({
      data: {
        question: r.case.question,
        answer: r.answer,
        audience: r.case.audience,
        locale: r.case.locale,
        source: "eval",
        approved: true,
      },
    });
    fromEvals++;
  }

  // --- Conversaciones ganadas en el simulador ---
  const runs = await prisma.simulationRun.findMany({
    where: { booked: true, status: "done" },
    orderBy: { startedAt: "desc" },
    take: 40,
    include: { turns: { orderBy: { idx: "asc" } } },
  });

  let fromSimulations = 0;
  for (const run of runs) {
    for (let i = 0; i < run.turns.length - 1; i++) {
      const prospect = run.turns[i];
      const agent = run.turns[i + 1];
      if (prospect.role !== "prospect" || agent.role !== "agent") continue;

      const key = prospect.content.trim().toLowerCase();
      if (existing.has(key) || agent.content.trim().length < 40) continue;
      existing.add(key);

      await prisma.trainingExample.create({
        data: {
          question: prospect.content,
          answer: agent.content,
          audience: "desconocido",
          source: "simulacion",
          // Los turnos sueltos de una conversación ganada necesitan repaso
          // humano: que la conversación cerrara no valida cada turno.
          approved: false,
        },
      });
      fromSimulations++;
    }
  }

  return { fromEvals, fromSimulations };
}

export async function trainingStats() {
  const [approved, pending, bySource, lastExport] = await Promise.all([
    prisma.trainingExample.count({ where: { approved: true } }),
    prisma.trainingExample.count({ where: { approved: false } }),
    prisma.trainingExample.groupBy({
      by: ["source"],
      where: { approved: true },
      _count: true,
    }),
    prisma.trainingExample.findFirst({
      where: { exportedAt: { not: null } },
      orderBy: { exportedAt: "desc" },
      select: { exportedAt: true },
    }),
  ]);

  return {
    approved,
    pending,
    minExamples: MIN_EXAMPLES,
    ready: approved >= MIN_EXAMPLES,
    bySource: Object.fromEntries(bySource.map((s) => [s.source, s._count])),
    lastExportAt: lastExport?.exportedAt?.toISOString() ?? null,
  };
}
