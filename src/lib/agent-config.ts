import { prisma } from "./prisma";
import {
  AUDIENCES,
  DEFAULT_LAYERS,
  DEFAULT_AUDIENCE_LAYERS,
  DEFAULT_STAGE_LAYERS,
  DEFAULT_PSYCHOLOGY_LAYER,
  STAGES,
  type Audience,
  type PersonaLayers,
  type Stage,
} from "./persona";
import { CHAT_MODEL } from "./openai";

/**
 * Versión activa de la persona del agente.
 *
 * Se cachea en memoria porque cada turno de chat la necesita y cambia una vez
 * cada muchos días. Al guardar o activar una versión desde el panel hay que
 * llamar a `invalidateAgentConfig()`.
 */
export type AgentConfig = {
  id: string | null;
  version: number;
  name: string;
  layers: PersonaLayers;
  model: string;
  temperature: number;
  maxTokens: number;
};

const FALLBACK: AgentConfig = {
  id: null,
  version: 0,
  name: "Defaults en código",
  layers: DEFAULT_LAYERS,
  model: CHAT_MODEL,
  // Algo más alta que la 0.4 original: con temperatura baja el agente repite
  // las mismas fórmulas turno a turno y suena a plantilla.
  temperature: 0.6,
  maxTokens: 700,
};

const TTL_MS = 60_000;
let cache: { value: AgentConfig; at: number } | null = null;

export function invalidateAgentConfig(): void {
  cache = null;
}

/** Completa capas ausentes con los defaults en código. */
function normalizeLayers(raw: {
  psychologyLayer: string;
  audienceLayers: unknown;
  stageLayers: unknown;
}): PersonaLayers {
  const audiencesRaw = (raw.audienceLayers ?? {}) as Record<string, unknown>;
  const stagesRaw = (raw.stageLayers ?? {}) as Record<string, unknown>;

  const audiences = {} as Record<Audience, string>;
  for (const a of AUDIENCES) {
    const v = audiencesRaw[a];
    audiences[a] =
      typeof v === "string" && v.trim() ? v : DEFAULT_AUDIENCE_LAYERS[a];
  }

  const stages = {} as Record<Stage, string>;
  for (const s of STAGES) {
    const v = stagesRaw[s];
    stages[s] = typeof v === "string" && v.trim() ? v : DEFAULT_STAGE_LAYERS[s];
  }

  return {
    psychology: raw.psychologyLayer?.trim() || DEFAULT_PSYCHOLOGY_LAYER,
    audiences,
    stages,
  };
}

export async function getAgentConfig(): Promise<AgentConfig> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;

  let value = FALLBACK;
  try {
    const active = await prisma.agentPromptVersion.findFirst({
      where: { isActive: true },
      orderBy: { version: "desc" },
    });
    if (active) {
      value = {
        id: active.id,
        version: active.version,
        name: active.name,
        layers: normalizeLayers(active),
        model: active.model || CHAT_MODEL,
        temperature: active.temperature,
        maxTokens: active.maxTokens,
      };
    }
  } catch {
    // Sin BD o sin tabla todavía: el agente sigue funcionando con los defaults.
  }

  cache = { value, at: Date.now() };
  return value;
}

/**
 * Crea la versión 1 a partir de los defaults en código, para que el panel
 * tenga algo que editar la primera vez que se abre.
 */
export async function ensureSeedPromptVersion(): Promise<void> {
  const count = await prisma.agentPromptVersion.count();
  if (count > 0) return;

  await prisma.agentPromptVersion.create({
    data: {
      version: 1,
      name: "Base (capas por defecto)",
      notes: "Generada desde los defaults en código.",
      psychologyLayer: DEFAULT_PSYCHOLOGY_LAYER,
      audienceLayers: DEFAULT_AUDIENCE_LAYERS,
      stageLayers: DEFAULT_STAGE_LAYERS,
      model: CHAT_MODEL,
      temperature: FALLBACK.temperature,
      maxTokens: FALLBACK.maxTokens,
      isActive: true,
    },
  });
  invalidateAgentConfig();
}
