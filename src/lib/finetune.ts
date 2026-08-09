import { prisma } from "./prisma";
import { AUDIENCE_LABEL, isAudience } from "./persona";

/**
 * Dataset de fine-tuning.
 *
 * El fine-tuning enseña **estilo, tono y formato**, no hechos. Los hechos
 * siguen viniendo del RAG. Por eso los ejemplos se guardan sin el contexto
 * recuperado: lo que queremos que el modelo aprenda es cómo suena Ricardo.
 */

/** Sin este volumen el fine-tuning rinde peor que meter ejemplos en el prompt. */
export const MIN_EXAMPLES = 80;

/** Nota a partir de la cual una respuesta evaluada vale como ejemplo. */
const HARVEST_SCORE = 90;

export const TRAINING_SOURCES = [
  "correccion",
  "eval",
  "simulacion",
  "playground",
  "import",
  "preferencia",
  "manual",
] as const;

export type TrainingSource = (typeof TRAINING_SOURCES)[number];

export type HarvestSourceKey = "evals" | "preferences" | "simulations";

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

function questionKey(q: string) {
  return q.trim().toLowerCase();
}

async function existingQuestionKeys(): Promise<Set<string>> {
  const rows = await prisma.trainingExample.findMany({
    select: { question: true },
  });
  return new Set(rows.map((e) => questionKey(e.question)));
}

async function harvestHighScoreEvals(
  existing: Set<string>,
): Promise<number> {
  const results = await prisma.evalResult.findMany({
    where: { score: { gte: HARVEST_SCORE } },
    orderBy: { createdAt: "desc" },
    take: 300,
    include: {
      case: { select: { question: true, audience: true, locale: true } },
    },
  });

  let count = 0;
  for (const r of results) {
    const key = questionKey(r.case.question);
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
        evalResultId: r.id,
        tags: ["high_score"],
      },
    });
    count++;
  }
  return count;
}

/**
 * Pares preferencia: el juez dejó `improved`. Preferred = improved,
 * rejected = respuesta original. Quedan pendientes de repaso humano.
 */
async function harvestPreferencePairs(
  existing: Set<string>,
): Promise<number> {
  const results = await prisma.evalResult.findMany({
    where: {
      improved: { not: null },
      score: { lt: HARVEST_SCORE },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      case: { select: { question: true, audience: true, locale: true } },
    },
  });

  let count = 0;
  for (const r of results) {
    const improved = (r.improved || "").trim();
    if (improved.length < 40) continue;
    const key = questionKey(r.case.question);
    if (existing.has(key)) continue;
    existing.add(key);
    await prisma.trainingExample.create({
      data: {
        question: r.case.question,
        answer: improved,
        rejectedAnswer: r.answer,
        audience: r.case.audience,
        locale: r.case.locale,
        source: "preferencia",
        approved: false,
        evalResultId: r.id,
        tags: ["judge_improved"],
      },
    });
    count++;
  }
  return count;
}

async function harvestWonSimulations(
  existing: Set<string>,
): Promise<number> {
  const runs = await prisma.simulationRun.findMany({
    where: { booked: true, status: "done" },
    orderBy: { startedAt: "desc" },
    take: 40,
    include: { turns: { orderBy: { idx: "asc" } } },
  });

  let count = 0;
  for (const run of runs) {
    count += await ingestSimulationTurns(run, existing, {
      approved: false,
      tags: ["booked"],
    });
  }
  return count;
}

async function ingestSimulationTurns(
  run: {
    id: string;
    turns: { role: string; content: string; idx: number }[];
  },
  existing: Set<string>,
  opts: { approved: boolean; tags: string[] },
): Promise<number> {
  let count = 0;
  for (let i = 0; i < run.turns.length - 1; i++) {
    const prospect = run.turns[i];
    const agent = run.turns[i + 1];
    if (prospect.role !== "prospect" || agent.role !== "agent") continue;

    const key = questionKey(prospect.content);
    if (existing.has(key) || agent.content.trim().length < 40) continue;
    existing.add(key);

    await prisma.trainingExample.create({
      data: {
        question: prospect.content,
        answer: agent.content,
        audience: "desconocido",
        source: "simulacion",
        approved: opts.approved,
        simulationRunId: run.id,
        tags: opts.tags,
      },
    });
    count++;
  }
  return count;
}

/**
 * Recolecta ejemplos de lo que ya se produjo.
 * sources: si se omite o va vacío, recolecta todas las fuentes automáticas.
 */
export async function harvestTrainingExamples(
  sources?: HarvestSourceKey[],
): Promise<{
  fromEvals: number;
  fromPreferences: number;
  fromSimulations: number;
}> {
  const want = new Set<HarvestSourceKey>(
    sources?.length
      ? sources
      : (["evals", "preferences", "simulations"] as HarvestSourceKey[]),
  );

  const existing = await existingQuestionKeys();

  const fromEvals = want.has("evals")
    ? await harvestHighScoreEvals(existing)
    : 0;
  const fromPreferences = want.has("preferences")
    ? await harvestPreferencePairs(existing)
    : 0;
  const fromSimulations = want.has("simulations")
    ? await harvestWonSimulations(existing)
    : 0;

  return { fromEvals, fromPreferences, fromSimulations };
}

/** Envía turnos de una simulación concreta al dataset (manual desde el panel). */
export async function harvestSimulationRun(
  runId: string,
): Promise<{ added: number }> {
  const run = await prisma.simulationRun.findUnique({
    where: { id: runId },
    include: { turns: { orderBy: { idx: "asc" } } },
  });
  if (!run || run.status !== "done") {
    return { added: 0 };
  }

  const existing = await existingQuestionKeys();
  const added = await ingestSimulationTurns(run, existing, {
    approved: false,
    tags: run.booked ? ["booked", "manual"] : ["manual"],
  });
  return { added };
}

export async function createTrainingExample(params: {
  question: string;
  answer: string;
  rejectedAnswer?: string | null;
  audience?: string;
  locale?: string;
  source?: TrainingSource;
  approved?: boolean;
  tags?: string[];
  notes?: string | null;
  quality?: number | null;
  simulationRunId?: string | null;
  evalResultId?: string | null;
}) {
  const question = params.question.trim();
  const answer = params.answer.trim();
  if (question.length < 3 || answer.length < 20) {
    throw new Error("invalid_example");
  }

  return prisma.trainingExample.create({
    data: {
      question,
      answer,
      rejectedAnswer: params.rejectedAnswer?.trim() || null,
      audience: params.audience || "desconocido",
      locale: params.locale || "es",
      source: params.source || "manual",
      approved: params.approved ?? false,
      tags: params.tags ?? [],
      notes: params.notes?.trim() || null,
      quality:
        typeof params.quality === "number" &&
        params.quality >= 1 &&
        params.quality <= 5
          ? params.quality
          : null,
      simulationRunId: params.simulationRunId || null,
      evalResultId: params.evalResultId || null,
    },
  });
}

export async function importJsonlExamples(
  raw: string,
  opts?: { approve?: boolean },
): Promise<{ imported: number; skipped: number }> {
  const existing = await existingQuestionKeys();
  let imported = 0;
  let skipped = 0;

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let parsed: {
      messages?: { role: string; content: string }[];
      question?: string;
      answer?: string;
    };
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      skipped++;
      continue;
    }

    let question = "";
    let answer = "";
    if (Array.isArray(parsed.messages)) {
      const user = parsed.messages.find((m) => m.role === "user");
      const assistant = parsed.messages.find((m) => m.role === "assistant");
      question = String(user?.content || "").trim();
      answer = String(assistant?.content || "").trim();
    } else {
      question = String(parsed.question || "").trim();
      answer = String(parsed.answer || "").trim();
    }

    if (question.length < 3 || answer.length < 20) {
      skipped++;
      continue;
    }
    const key = questionKey(question);
    if (existing.has(key)) {
      skipped++;
      continue;
    }
    existing.add(key);
    await prisma.trainingExample.create({
      data: {
        question,
        answer,
        audience: "desconocido",
        source: "import",
        approved: Boolean(opts?.approve),
        tags: ["import"],
      },
    });
    imported++;
  }

  return { imported, skipped };
}

export async function trainingStats() {
  const [approved, pending, bySource, lastExport, withPreference] =
    await Promise.all([
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
      prisma.trainingExample.count({
        where: { rejectedAnswer: { not: null } },
      }),
    ]);

  return {
    approved,
    pending,
    minExamples: MIN_EXAMPLES,
    ready: approved >= MIN_EXAMPLES,
    bySource: Object.fromEntries(bySource.map((s) => [s.source, s._count])),
    lastExportAt: lastExport?.exportedAt?.toISOString() ?? null,
    withPreference,
  };
}

export function serializeExample(e: {
  id: string;
  question: string;
  answer: string;
  rejectedAnswer: string | null;
  audience: string;
  locale: string;
  source: string;
  tags: string[];
  notes: string | null;
  quality: number | null;
  simulationRunId: string | null;
  evalResultId: string | null;
  approved: boolean;
  createdAt: Date;
}) {
  return {
    id: e.id,
    question: e.question,
    answer: e.answer,
    rejectedAnswer: e.rejectedAnswer,
    audience: e.audience,
    locale: e.locale,
    source: e.source,
    tags: e.tags,
    notes: e.notes,
    quality: e.quality,
    simulationRunId: e.simulationRunId,
    evalResultId: e.evalResultId,
    approved: e.approved,
    createdAt: e.createdAt.toISOString(),
  };
}
