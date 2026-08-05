import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

/** Chat público: la conversación consultiva justifica el modelo grande. */
export const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o";
/** Clasificar el turno y juzgar respuestas son tareas de alto volumen. */
export const ANALYST_MODEL = process.env.OPENAI_ANALYST_MODEL || "gpt-4o-mini";
export const JUDGE_MODEL = process.env.OPENAI_JUDGE_MODEL || "gpt-4o-mini";
export const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
export const EMBEDDING_DIM = 1536;

// Precios aproximados por 1M tokens (USD) para estimar coste.
const PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4.1": { input: 2, output: 8 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "text-embedding-3-small": { input: 0.02, output: 0 },
  "text-embedding-3-large": { input: 0.13, output: 0 },
};

export function estimateCostUsd(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number {
  // Los modelos fine-tuned llegan como `ft:gpt-4o-mini-2024-07-18:org::id`;
  // se tarifan sobre su base (el recargo de FT no lo modelamos aquí).
  const base = model.startsWith("ft:") ? model.split(":")[1] ?? model : model;
  const p =
    PRICING[model] ??
    PRICING[base] ??
    PRICING[Object.keys(PRICING).find((k) => base.startsWith(k)) ?? ""] ?? {
      input: 0,
      output: 0,
    };
  return (
    (promptTokens / 1_000_000) * p.input +
    (completionTokens / 1_000_000) * p.output
  );
}
