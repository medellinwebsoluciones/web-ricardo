import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import { logUsage } from "@/lib/usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEMPERATURES = ["alta", "media", "baja"];

/**
 * Perfila un lead con IA: resumen corto + temperatura sugerida.
 * Solo usa los datos ya guardados del lead (sin inventar contexto externo).
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "openai_not_configured" }, { status: 503 });
  }

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { notes: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
  if (!lead) return Response.json({ error: "not_found" }, { status: 404 });

  const facts = [
    `Nombre: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.company && `Empresa: ${lead.company}`,
    lead.role && `Cargo: ${lead.role}`,
    `Origen: ${lead.source}`,
    `Idioma: ${lead.locale}`,
    lead.message && `Mensaje: ${lead.message}`,
    lead.notes.length > 0 &&
      `Notas:\n${lead.notes.map((n) => `- ${n.body}`).join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.2,
    max_tokens: 320,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Eres analista comercial de una consultoría de software y automatización con IA (cliente ideal: empresas que necesitan agentes IA, automatización, arquitectura; también reclutadores para puestos senior remotos).
Analiza el lead y responde SOLO JSON con esta forma:
{"summary": "2-3 frases en español sobre quién parece ser y qué necesita", "temperature": "alta|media|baja", "reason": "una frase", "nextAction": "acción concreta sugerida"}
No inventes datos que no estén en la ficha. Si hay poca información, la temperatura debe ser baja o media.`,
      },
      { role: "user", content: facts },
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

  let parsed: {
    summary?: string;
    temperature?: string;
    reason?: string;
    nextAction?: string;
  } = {};
  try {
    parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
  } catch {
    return Response.json({ error: "bad_ai_response" }, { status: 502 });
  }

  const summary = [parsed.summary, parsed.reason && `(${parsed.reason})`]
    .filter(Boolean)
    .join(" ")
    .slice(0, 1200);

  const updated = await prisma.lead.update({
    where: { id },
    data: {
      aiSummary: summary || null,
      ...(parsed.temperature && TEMPERATURES.includes(parsed.temperature)
        ? { temperature: parsed.temperature }
        : {}),
      ...(parsed.nextAction && !lead.nextAction
        ? { nextAction: String(parsed.nextAction).slice(0, 300) }
        : {}),
    },
  });

  return Response.json({ lead: updated });
}
