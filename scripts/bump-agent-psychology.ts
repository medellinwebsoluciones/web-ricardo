/**
 * Actualiza capas tuneables de la versión activa del agente
 * con los DEFAULT_* de persona.ts (psicología, audiencias, etapas).
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import {
  DEFAULT_AUDIENCE_LAYERS,
  DEFAULT_PSYCHOLOGY_LAYER,
  DEFAULT_STAGE_LAYERS,
} from "../src/lib/persona";
import { invalidateAgentConfig } from "../src/lib/agent-config";

async function main() {
  const active = await prisma.agentPromptVersion.findFirst({
    where: { isActive: true },
    orderBy: { version: "desc" },
  });

  if (!active) {
    console.log("No hay versión activa; se usarán defaults de código tras deploy.");
    return;
  }

  await prisma.agentPromptVersion.update({
    where: { id: active.id },
    data: {
      psychologyLayer: DEFAULT_PSYCHOLOGY_LAYER,
      audienceLayers: DEFAULT_AUDIENCE_LAYERS,
      stageLayers: DEFAULT_STAGE_LAYERS,
      notes: `${active.notes || ""}\n[${new Date().toISOString()}] bump: tono humano, sin MWS en apertura, contacto nombre+email+tel+intent, agenda`.trim(),
    },
  });
  invalidateAgentConfig();
  console.log(`Actualizada AgentPromptVersion v${active.version} (${active.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
