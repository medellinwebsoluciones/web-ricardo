import { NextRequest } from "next/server";
import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import { searchChunks, formatRagContext } from "@/lib/rag";
import { buildSystemPrompt } from "@/lib/persona";
import { logUsage } from "@/lib/usage";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { isLocale, defaultLocale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Por debajo de esta similitud consideramos que falta contexto en el corpus. */
const GAP_THRESHOLD = 0.35;

/**
 * Prueba el agente igual que en el sitio público, pero devolviendo las fuentes
 * recuperadas y su similitud para poder detectar huecos de conocimiento.
 * Modo "entrevista": responde como si un reclutador estuviera evaluando.
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "openai_not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const message = String(body?.message || "").trim();
  if (!message) return Response.json({ error: "empty_message" }, { status: 400 });

  const locale = isLocale(body?.locale || "") ? body.locale : defaultLocale;
  const mode = body?.mode === "entrevista" ? "entrevista" : "normal";

  const chunks = await searchChunks(message, { k: 6, publicOnly: false });
  const useful = chunks.filter((c) => c.similarity > 0.15);
  const ragContext = formatRagContext(useful);
  const bestSimilarity = chunks[0]?.similarity ?? 0;

  const systemPrompt =
    buildSystemPrompt(locale as "es" | "en", ragContext) +
    (mode === "entrevista"
      ? `\n\nMODO ENTREVISTA: quien pregunta es un reclutador o hiring manager evaluando a Ricardo para un puesto senior (remoto fijo o consultoría). Responde en primera persona como su asistente, con ejemplos concretos del contexto, métricas si existen, y cierra ofreciendo la llamada técnica de 15 minutos. Máximo 6 frases.`
      : "");

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.4,
    max_tokens: 600,
    messages: [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(body?.history)
        ? body.history.slice(-6).map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
            content: String(m.content).slice(0, 2000),
          }))
        : []),
      { role: "user", content: message },
    ],
  });

  if (completion.usage) {
    await logUsage({
      channel: "chat",
      model: CHAT_MODEL,
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
    });
  }

  return Response.json({
    answer: completion.choices[0]?.message?.content || "",
    sources: chunks.map((c) => ({
      id: c.id,
      title: c.title,
      sourceRef: c.sourceRef,
      similarity: Number(c.similarity.toFixed(3)),
      excerpt: c.content.slice(0, 240),
    })),
    gap: bestSimilarity < GAP_THRESHOLD,
    bestSimilarity: Number(bestSimilarity.toFixed(3)),
  });
}
