import { prisma } from "./prisma";
import { estimateCostUsd } from "./openai";

export async function logUsage(params: {
  channel: "chat" | "embeddings";
  model: string;
  promptTokens?: number;
  completionTokens?: number;
}) {
  const promptTokens = params.promptTokens ?? 0;
  const completionTokens = params.completionTokens ?? 0;
  const totalTokens = promptTokens + completionTokens;
  const costUsd = estimateCostUsd(params.model, promptTokens, completionTokens);

  try {
    await prisma.apiUsage.create({
      data: {
        channel: params.channel,
        model: params.model,
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
