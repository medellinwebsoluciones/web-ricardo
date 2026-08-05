import { prisma } from "./prisma";
import { estimateCostUsd } from "./openai";

export type UsageChannel =
  | "chat"
  | "embeddings"
  | "analyst"
  | "judge"
  | "simulation";

export async function logUsage(params: {
  channel: UsageChannel;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  provider?: string;
  tier?: "free" | "paid";
}) {
  const promptTokens = params.promptTokens ?? 0;
  const completionTokens = params.completionTokens ?? 0;
  const totalTokens = promptTokens + completionTokens;
  const provider = params.provider ?? "openai";
  const tier = params.tier ?? "paid";
  // Un proveedor free no tiene tarifa por token aunque el id de modelo coincida
  // con uno de pago (p. ej. `gpt-oss` servido por Groq).
  const costUsd =
    tier === "free"
      ? 0
      : estimateCostUsd(params.model, promptTokens, completionTokens);

  try {
    await prisma.apiUsage.create({
      data: {
        channel: params.channel,
        model: params.model,
        provider,
        tier,
        promptTokens,
        completionTokens,
        totalTokens,
        costUsd,
      },
    });
  } catch {
    // No bloquear la respuesta al usuario si el log falla.
  }
}
