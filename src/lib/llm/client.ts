import OpenAI from "openai";

/**
 * Resolución de cliente LLM por rol.
 *
 * Todos los proveedores que interesan (Groq, Cerebras, Gemini, OpenRouter,
 * Together, Ollama…) exponen la API de OpenAI, así que cambiar de proveedor es
 * cambiar `baseURL` + `apiKey` + `model`, no cambiar de SDK. Separar los roles
 * permite mover primero los que no ve el visitante (`analyst`, `judge`) y
 * dejar `chat` en el proveedor más fiable.
 *
 * Los embeddings quedan fijados a OpenAI a propósito: el corpus vive en una
 * columna `vector(1536)` y otro proveedor cambiaría la dimensión, obligando a
 * migrar la columna y reindexar todo.
 */
export type LlmRole = "chat" | "analyst" | "judge" | "embeddings";

const DEFAULT_MODEL: Record<LlmRole, string> = {
  chat: "gpt-4o",
  analyst: "gpt-4o-mini",
  judge: "gpt-4o-mini",
  embeddings: "text-embedding-3-small",
};

/** Proveedores sin coste por token: el ledger los marca como `free`. */
const FREE_PROVIDERS = new Set([
  "groq",
  "cerebras",
  "sambanova",
  "gemini",
  "openrouter",
  "mistral",
  "cloudflare",
  "github",
  "hf",
  "ollama",
]);

export type LlmTarget = {
  client: OpenAI;
  model: string;
  provider: string;
  tier: "free" | "paid";
};

const cache = new Map<string, LlmTarget>();

function env(role: LlmRole, key: string): string {
  return (process.env[`LLM_${role.toUpperCase()}_${key}`] || "").trim();
}

export function isLlmConfigured(role: LlmRole = "chat"): boolean {
  return Boolean(env(role, "API_KEY") || process.env.OPENAI_API_KEY);
}

export function clientFor(role: LlmRole): LlmTarget {
  const provider = env(role, "PROVIDER") || "openai";
  const baseURL = env(role, "BASE_URL") || undefined;
  const apiKey = env(role, "API_KEY") || process.env.OPENAI_API_KEY || "";
  const model = env(role, "MODEL") || DEFAULT_MODEL[role];

  if (!apiKey) throw new Error(`LLM no configurado para el rol "${role}"`);

  const cacheKey = `${provider}|${baseURL ?? ""}|${apiKey.slice(-8)}`;
  let target = cache.get(cacheKey);
  if (!target) {
    target = {
      client: new OpenAI({ apiKey, baseURL }),
      model,
      provider,
      tier: FREE_PROVIDERS.has(provider) ? "free" : "paid",
    };
    cache.set(cacheKey, target);
  }
  // El modelo puede variar por rol aunque compartan cliente (misma cuenta).
  return { ...target, model };
}
