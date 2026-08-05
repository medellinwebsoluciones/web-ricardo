import { clientFor } from "./llm/client";
import { logUsage } from "./usage";
import { searchChunks, formatRagContext, type RetrievedChunk } from "./rag";
import { buildSystemPrompt, AUDIENCE_LABEL, type Audience, type Stage } from "./persona";
import { getAgentConfig } from "./agent-config";

/**
 * Juez de respuestas del agente.
 *
 * Sin una nota por dimensión no hay forma de saber si un cambio de prompt
 * mejoró algo o solo lo cambió: el juez es lo que convierte "me suena mejor"
 * en un número comparable entre versiones.
 */

export const DIMENSIONS = [
  "grounding",
  "especificidad",
  "naturalidad",
  "empatia",
  "rol",
  "comercial",
  "concision",
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_LABEL: Record<Dimension, string> = {
  grounding: "Grounding",
  especificidad: "Especificidad",
  naturalidad: "Naturalidad",
  empatia: "Empatía",
  rol: "Adecuación al rol",
  comercial: "Avance comercial",
  concision: "Concisión",
};

/**
 * El grounding pesa el doble: una respuesta inventada es un problema mayor que
 * una respuesta sosa, aunque suene mejor.
 */
const WEIGHTS: Record<Dimension, number> = {
  grounding: 2,
  especificidad: 1.5,
  naturalidad: 1.5,
  empatia: 1,
  rol: 1,
  comercial: 1,
  concision: 0.75,
};

export type Scores = Record<Dimension, number>;

export type Judgement = {
  scores: Scores;
  score: number;
  diagnosis: string;
  improved: string;
};

const JUDGE_SYSTEM = `Eres un evaluador externo de asistentes conversacionales de venta consultiva. Puntúas la respuesta de un asistente de IA que habla en nombre de Ricardo Zuluaga, arquitecto de software y consultor de automatización con IA.

Puntúa de 0 a 100 cada dimensión:
- grounding: ¿cada afirmación se sostiene en el CONTEXTO dado? Inventar cifras, clientes o compromisos es 0. Decir honestamente que no lo sabe y derivar es 100.
- especificidad: ¿hay ejemplos, trade-offs y detalles concretos, o es palabrería intercambiable?
- naturalidad: ¿suena a persona experta conversando, o a plantilla? Bullets, encabezados o cierres enlatados bajan la nota.
- empatia: ¿lee lo que le preocupa a quien pregunta y lo nombra antes de rebatir?
- rol: ¿habla al perfil que pregunta con su vocabulario y sus prioridades?
- comercial: ¿avanza la conversación con una sola pregunta útil o un siguiente paso natural? Insistir con la misma llamada a la acción baja la nota; no avanzar nada también.
- concision: ¿la longitud encaja con la pregunta? Penaliza el relleno.

Devuelve SOLO este JSON:
{
  "scores": {"grounding":0,"especificidad":0,"naturalidad":0,"empatia":0,"rol":0,"comercial":0,"concision":0},
  "diagnosis": "dos frases sobre lo que falla, concretas y accionables",
  "improved": "la respuesta reescrita como debería haber sido, respetando el contexto y sin inventar nada"
}

Sé exigente: 70 es aceptable, 85 es bueno, 95 es excelente. No regales notas.`;

function clamp(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function weightedScore(scores: Scores): number {
  let total = 0;
  let weight = 0;
  for (const d of DIMENSIONS) {
    total += scores[d] * WEIGHTS[d];
    weight += WEIGHTS[d];
  }
  return Math.round((total / weight) * 10) / 10;
}

export async function judgeAnswer(params: {
  question: string;
  answer: string;
  ragContext: string;
  audience: Audience;
  mustCover?: string[];
  redFlags?: string[];
}): Promise<Judgement> {
  const { question, answer, ragContext, audience, mustCover = [], redFlags = [] } =
    params;

  const rubric = [
    mustCover.length
      ? `Una buena respuesta cubre:\n${mustCover.map((m) => `- ${m}`).join("\n")}`
      : "",
    redFlags.length
      ? `Hunden la respuesta:\n${redFlags.map((r) => `- ${r}`).join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const user = `QUIÉN PREGUNTA: ${AUDIENCE_LABEL[audience]}

PREGUNTA:
${question}

${rubric}

CONTEXTO DISPONIBLE PARA EL ASISTENTE:
${ragContext || "(no se recuperó nada del corpus)"}

RESPUESTA DEL ASISTENTE:
${answer || "(vacía)"}`;

  const { client, model, provider, tier } = clientFor("judge");
  const completion = await client.chat.completions.create({
    model,
    temperature: 0,
    max_tokens: 900,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: JUDGE_SYSTEM },
      { role: "user", content: user },
    ],
  });

  if (completion.usage) {
    await logUsage({
      channel: "judge",
      model,
      provider,
      tier,
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
    });
  }

  const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}") as {
    scores?: Record<string, unknown>;
    diagnosis?: unknown;
    improved?: unknown;
  };

  const scores = {} as Scores;
  for (const d of DIMENSIONS) scores[d] = clamp(parsed.scores?.[d]);

  return {
    scores,
    score: weightedScore(scores),
    diagnosis:
      typeof parsed.diagnosis === "string" ? parsed.diagnosis.slice(0, 1200) : "",
    improved:
      typeof parsed.improved === "string" ? parsed.improved.slice(0, 4000) : "",
  };
}

// ---------------------------------------------------------------------------
// Respuesta del agente fuera del chat (evaluaciones, playground, simulador)
// ---------------------------------------------------------------------------

export type AgentAnswer = {
  answer: string;
  sources: RetrievedChunk[];
  ragContext: string;
  bestSimilarity: number;
  model: string;
};

/** Por debajo de esta similitud consideramos que falta contexto en el corpus. */
export const GAP_THRESHOLD = 0.35;

export async function answerAsAgent(params: {
  question: string;
  locale?: "es" | "en";
  audience?: Audience;
  stage?: Stage;
  history?: { role: "user" | "assistant"; content: string }[];
  extra?: string;
  publicOnly?: boolean;
}): Promise<AgentAnswer> {
  const {
    question,
    locale = "es",
    audience = "desconocido",
    stage = "diagnostico",
    history = [],
    extra,
    publicOnly = false,
  } = params;

  const config = await getAgentConfig();
  const sources = await searchChunks(question, {
    k: 6,
    publicOnly,
    lang: locale,
  });
  const ragContext = formatRagContext(sources);

  const systemPrompt = buildSystemPrompt({
    locale,
    ragContext,
    audience,
    stage,
    layers: config.layers,
    extra,
  });

  const { client, model, provider, tier } = clientFor("chat");
  const chatModel = config.model || model;

  const completion = await client.chat.completions.create({
    model: chatModel,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      ...history.slice(-8).map((m) => ({
        role: m.role,
        content: m.content.slice(0, 2000),
      })),
      { role: "user", content: question },
    ],
  });

  if (completion.usage) {
    await logUsage({
      channel: "chat",
      model: chatModel,
      provider,
      tier,
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
    });
  }

  return {
    answer: completion.choices[0]?.message?.content?.trim() || "",
    sources,
    ragContext,
    bestSimilarity: sources[0]?.similarity ?? 0,
    model: chatModel,
  };
}
