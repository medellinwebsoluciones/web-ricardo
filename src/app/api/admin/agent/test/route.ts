import { NextRequest } from "next/server";
import { isLlmConfigured } from "@/lib/llm/client";
import { answerAsAgent, GAP_THRESHOLD } from "@/lib/agent-eval";
import { analyzeTurn } from "@/lib/conversation-analyst";
import { recordGap } from "@/lib/knowledge-gaps";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { isAudience, isStage, type Audience, type Stage } from "@/lib/persona";
import { isLocale, defaultLocale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Playground: responde igual que el sitio público pero devolviendo las fuentes
 * recuperadas, la lectura del interlocutor y la similitud, para poder ver por
 * qué el agente contestó lo que contestó.
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  if (!isLlmConfigured("chat")) {
    return Response.json({ error: "openai_not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const message = String(body?.message || "").trim();
  if (!message) return Response.json({ error: "empty_message" }, { status: 400 });

  const locale = (isLocale(body?.locale || "") ? body.locale : defaultLocale) as
    | "es"
    | "en";
  const history = Array.isArray(body?.history)
    ? body.history
        .slice(-6)
        .map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: String(m.content).slice(0, 2000),
        }))
    : [];

  // La audiencia se puede forzar desde el panel para probar cómo cambia el tono
  // con el mismo corpus; si no, la deduce el analista.
  const forcedAudience = String(body?.audience || "");
  const analysis =
    isAudience(forcedAudience) && forcedAudience !== "desconocido"
      ? null
      : await analyzeTurn({ message, history });

  const audience: Audience = isAudience(forcedAudience)
    ? forcedAudience
    : (analysis?.audience ?? "desconocido");
  const stage: Stage = isStage(String(body?.stage || ""))
    ? (body.stage as Stage)
    : (analysis?.stage ?? "diagnostico");

  const result = await answerAsAgent({
    question: message,
    locale,
    audience,
    stage,
    history,
    publicOnly: false,
  });

  const gap = result.bestSimilarity < GAP_THRESHOLD;
  if (gap) {
    await recordGap({
      question: message,
      source: "playground",
      bestSimilarity: result.bestSimilarity,
      audience,
    });
  }

  return Response.json({
    answer: result.answer,
    audience,
    stage,
    analysis: analysis
      ? {
          intent: analysis.intent,
          sentiment: analysis.sentiment,
          urgency: analysis.urgency,
          objections: analysis.objections,
          extracted: analysis.extracted,
          tactic: analysis.tactic,
        }
      : null,
    sources: result.sources.map((c) => ({
      id: c.id,
      title: c.title,
      sourceRef: c.sourceRef,
      similarity: Number(c.similarity.toFixed(3)),
      excerpt: c.content.slice(0, 240),
    })),
    gap,
    bestSimilarity: Number(result.bestSimilarity.toFixed(3)),
  });
}
