import { clientFor } from "./llm/client";
import { logUsage } from "./usage";
import { prisma } from "./prisma";
import {
  AUDIENCES,
  STAGES,
  isAudience,
  isStage,
  type Audience,
  type Stage,
} from "./persona";

/**
 * Lectura del interlocutor antes de responder.
 *
 * Una llamada barata al modelo pequeño que decide con quién estamos hablando y
 * en qué punto de la conversación estamos, para elegir las capas de persona.
 * Sin esto el agente le habla igual a un reclutador de RRHH que a un CTO.
 *
 * Nunca bloquea la respuesta: si falla, se degrada a la lectura anterior de la
 * sesión (o a "desconocido") y el chat sigue.
 */

export const INTENTS = [
  "evaluar_perfil",
  "problema_tecnico",
  "precio_alcance",
  "agendar",
  "soporte_mws",
  "otro",
] as const;
export type Intent = (typeof INTENTS)[number];

export type ExtractedFacts = {
  name?: string;
  company?: string;
  role?: string;
  need?: string;
  budgetSignal?: string;
  timeline?: string;
};

export type TurnAnalysis = {
  audience: Audience;
  intent: Intent;
  stage: Stage;
  sentiment: "positivo" | "neutral" | "escéptico" | "frustrado";
  urgency: "alta" | "media" | "baja";
  objections: string[];
  extracted: ExtractedFacts;
  tactic: string;
};

export const NEUTRAL_ANALYSIS: TurnAnalysis = {
  audience: "desconocido",
  intent: "otro",
  stage: "apertura",
  sentiment: "neutral",
  urgency: "baja",
  objections: [],
  extracted: {},
  tactic: "",
};

const SENTIMENTS = ["positivo", "neutral", "escéptico", "frustrado"] as const;
const URGENCIES = ["alta", "media", "baja"] as const;

const SYSTEM = `Analizas conversaciones del chat de un consultor de software y automatización con IA (Ricardo Zuluaga, Medellín Web Soluciones). Los visitantes son reclutadores, hiring managers técnicos, CTOs, CEOs de pyme o agencias de WordPress.

Devuelve SOLO un JSON con esta forma exacta:
{
  "audience": ${AUDIENCES.map((a) => `"${a}"`).join(" | ")},
  "intent": ${INTENTS.map((i) => `"${i}"`).join(" | ")},
  "stage": ${STAGES.map((s) => `"${s}"`).join(" | ")},
  "sentiment": "positivo" | "neutral" | "escéptico" | "frustrado",
  "urgency": "alta" | "media" | "baja",
  "objections": ["objeción detectada en las palabras del visitante"],
  "extracted": { "name": "", "company": "", "role": "", "need": "", "budgetSignal": "", "timeline": "" },
  "tactic": "en una frase, qué debería hacer el asistente en este turno"
}

Reglas:
- "audience" es "desconocido" mientras no haya señal clara. No adivines por el tema.
- "stage" refleja dónde está la conversación completa, no solo el último mensaje: apertura (aún no sabes qué necesita), descubrimiento (estás entendiendo el problema), diagnostico (ya lo entiendes), propuesta (se habla de cómo trabajar juntos), cierre (se concreta el siguiente paso).
- En "extracted" solo pon lo que el visitante haya dicho literalmente. Omite las claves de las que no tengas dato: no inventes nombres ni empresas.
- "objections" va vacío si no hay ninguna.`;

function pick<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
): T[number] {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T[number])
    : fallback;
}

function cleanFacts(raw: unknown): ExtractedFacts {
  if (!raw || typeof raw !== "object") return {};
  const src = raw as Record<string, unknown>;
  const out: ExtractedFacts = {};
  for (const key of [
    "name",
    "company",
    "role",
    "need",
    "budgetSignal",
    "timeline",
  ] as const) {
    const v = src[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim().slice(0, 200);
  }
  return out;
}

export async function analyzeTurn(params: {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  previous?: Partial<TurnAnalysis> | null;
}): Promise<TurnAnalysis> {
  const { message, history = [], previous } = params;

  const transcript = [...history.slice(-6), { role: "user" as const, content: message }]
    .map((m) => `${m.role === "user" ? "Visitante" : "Asistente"}: ${m.content}`)
    .join("\n")
    .slice(-4000);

  const known = previous
    ? `\n\nLectura previa de esta sesión (actualízala, no la repitas a ciegas): ${JSON.stringify(
        {
          audience: previous.audience,
          stage: previous.stage,
          extracted: previous.extracted,
        },
      )}`
    : "";

  try {
    const { client, model, provider, tier } = clientFor("analyst");
    const completion = await client.chat.completions.create({
      model,
      temperature: 0,
      max_tokens: 400,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `${transcript}${known}` },
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

    const parsed = JSON.parse(
      completion.choices[0]?.message?.content || "{}",
    ) as Record<string, unknown>;

    const objections = Array.isArray(parsed.objections)
      ? parsed.objections
          .filter((o): o is string => typeof o === "string" && Boolean(o.trim()))
          .slice(0, 5)
          .map((o) => o.slice(0, 200))
      : [];

    return {
      audience: isAudience(String(parsed.audience))
        ? (parsed.audience as Audience)
        : previous?.audience ?? "desconocido",
      intent: pick(parsed.intent, INTENTS, "otro"),
      stage: isStage(String(parsed.stage))
        ? (parsed.stage as Stage)
        : previous?.stage ?? "apertura",
      sentiment: pick(parsed.sentiment, SENTIMENTS, "neutral"),
      urgency: pick(parsed.urgency, URGENCIES, "baja"),
      objections,
      // Los datos ya conocidos no se pierden si el turno actual no los repite.
      extracted: { ...(previous?.extracted ?? {}), ...cleanFacts(parsed.extracted) },
      tactic:
        typeof parsed.tactic === "string" ? parsed.tactic.slice(0, 400) : "",
    };
  } catch (err) {
    console.error("Analista de turno:", err);
    return {
      ...NEUTRAL_ANALYSIS,
      audience: previous?.audience ?? "desconocido",
      stage: previous?.stage ?? "apertura",
      extracted: previous?.extracted ?? {},
    };
  }
}

/** Última lectura guardada de una sesión, para no empezar de cero cada turno. */
export async function lastAnalysisFor(
  sessionId: string,
): Promise<Partial<TurnAnalysis> | null> {
  try {
    const row = await prisma.chatTurnAnalysis.findFirst({
      where: { sessionId },
      orderBy: { turn: "desc" },
    });
    if (!row) return null;
    return {
      audience: isAudience(row.audience) ? row.audience : "desconocido",
      stage: isStage(row.stage) ? row.stage : "apertura",
      extracted: (row.extracted ?? {}) as ExtractedFacts,
    };
  } catch {
    return null;
  }
}

export async function persistTurnAnalysis(params: {
  sessionId: string;
  message: string;
  analysis: TurnAnalysis;
  ragTrace?: { id: string; title: string; similarity: number }[];
}): Promise<void> {
  const { sessionId, message, analysis, ragTrace } = params;
  try {
    const turn = await prisma.chatTurnAnalysis.count({ where: { sessionId } });
    await prisma.chatTurnAnalysis.create({
      data: {
        sessionId,
        turn,
        message: message.slice(0, 2000),
        audience: analysis.audience,
        intent: analysis.intent,
        stage: analysis.stage,
        sentiment: analysis.sentiment,
        urgency: analysis.urgency,
        objections: analysis.objections,
        extracted: analysis.extracted,
        tactic: analysis.tactic || null,
        ragTrace: ragTrace ?? undefined,
      },
    });
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { audience: analysis.audience, stage: analysis.stage },
    });
  } catch (err) {
    console.error("Persistir análisis de turno:", err);
  }
}
