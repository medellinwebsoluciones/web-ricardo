import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import { searchChunks, formatRagContext } from "@/lib/rag";
import { logUsage } from "@/lib/usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Kind = "cv" | "carta" | "propuesta" | "match";

const INSTRUCTIONS: Record<Exclude<Kind, "match">, string> = {
  cv: `Genera un CV adaptado a la oferta, en Markdown. Estructura: titular profesional, resumen de 3 líneas, "Experiencia relevante" (bullets orientados a los requisitos de la oferta, con resultados medibles cuando existan en el CONTEXTO), "Stack" agrupado, y "Proyectos destacados" con 2-3 casos. Ordena todo según lo que la oferta valora.`,
  carta: `Genera una carta de presentación breve (máximo 250 palabras) en Markdown. Tono senior, directo, sin adulación. Estructura: por qué esta empresa/rol, tres pruebas concretas de encaje sacadas del CONTEXTO, y cierre proponiendo una llamada técnica de 15 minutos.`,
  propuesta: `Genera una propuesta de consultoría en Markdown. Estructura: problema entendido, alcance propuesto por fases, entregables concretos, cómo se mide el éxito, supuestos y riesgos, y modalidad de trabajo (proyecto cerrado o retainer). NO inventes precios ni plazos exactos: deja marcadores claros como [rango a definir en llamada].`,
};

/**
 * Genera material a partir de la oferta usando el corpus RAG como fuente de
 * verdad sobre Ricardo. También calcula el match score contra ese corpus.
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "openai_not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const kind = body?.kind as Kind;
  if (!["cv", "carta", "propuesta", "match"].includes(kind)) {
    return Response.json({ error: "invalid_kind" }, { status: 400 });
  }

  const opportunityId: string | null = body?.opportunityId || null;
  let jobDescription = String(body?.jobDescription || "").trim();
  let opportunity = null;

  if (opportunityId) {
    opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });
    if (!opportunity) {
      return Response.json({ error: "opportunity_not_found" }, { status: 404 });
    }
    if (!jobDescription) jobDescription = opportunity.jobDescription || "";
  }

  if (!jobDescription) {
    return Response.json({ error: "job_description_required" }, { status: 400 });
  }

  const locale = body?.locale === "en" ? "en" : "es";

  // Recuperar contexto real del corpus (más chunks porque el material es largo).
  const chunks = await searchChunks(jobDescription.slice(0, 2000), {
    k: 12,
    publicOnly: false,
  });
  const context = formatRagContext(chunks.filter((c) => c.similarity > 0.12));

  const openai = getOpenAI();

  if (kind === "match") {
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.2,
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Evalúas el encaje entre una oferta y el perfil de Ricardo Zuluaga (arquitecto de soluciones senior, automatización con IA, consultoría).
Usa SOLO el CONTEXTO para saber qué sabe hacer. Si algo no está en el contexto, cuéntalo como hueco.
Responde SOLO JSON: {"score": 0-100, "strengths": ["..."], "gaps": ["..."], "summary": "2 frases", "talkingPoints": ["..."]}

CONTEXTO SOBRE RICARDO:
${context || "(sin contexto: el corpus está vacío, el score debe ser bajo)"}`,
        },
        { role: "user", content: `OFERTA:\n${jobDescription.slice(0, 8000)}` },
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
      score?: number;
      strengths?: string[];
      gaps?: string[];
      summary?: string;
      talkingPoints?: string[];
    } = {};
    try {
      parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    } catch {
      return Response.json({ error: "bad_ai_response" }, { status: 502 });
    }

    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    const gapsText = [
      parsed.summary,
      parsed.strengths?.length
        ? `Fortalezas: ${parsed.strengths.join("; ")}`
        : null,
      parsed.gaps?.length ? `Huecos: ${parsed.gaps.join("; ")}` : null,
      parsed.talkingPoints?.length
        ? `Argumentos: ${parsed.talkingPoints.join("; ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    if (opportunity) {
      await prisma.opportunity.update({
        where: { id: opportunity.id },
        data: { matchScore: score, matchGaps: gapsText.slice(0, 4000) },
      });
    }

    return Response.json({
      kind: "match",
      score,
      strengths: parsed.strengths ?? [],
      gaps: parsed.gaps ?? [],
      talkingPoints: parsed.talkingPoints ?? [],
      summary: parsed.summary ?? "",
      sourcesUsed: chunks.length,
    });
  }

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.5,
    max_tokens: 1800,
    messages: [
      {
        role: "system",
        content: `Escribes material profesional para Ricardo Zuluaga, arquitecto de soluciones senior y experto en automatización con IA, fundador de la consultoría Medellín Web Soluciones.

REGLAS CRÍTICAS:
- Usa SOLO hechos que aparezcan en el CONTEXTO. Nunca inventes empleadores, fechas, cifras, clientes ni certificaciones.
- Si falta un dato importante, deja un marcador explícito entre corchetes, por ejemplo [completar años en X].
- Idioma de salida: ${locale === "en" ? "inglés" : "español"}.
- Formato Markdown limpio, sin emojis, sin relleno.

${INSTRUCTIONS[kind]}

CONTEXTO SOBRE RICARDO (fuente de verdad):
${context || "(corpus vacío: usa marcadores entre corchetes en todo lo que no puedas verificar)"}`,
      },
      {
        role: "user",
        content: `OFERTA / CLIENTE OBJETIVO:\n${jobDescription.slice(0, 8000)}${
          opportunity
            ? `\n\nEmpresa: ${opportunity.company}\nPuesto: ${opportunity.role}\nModalidad: ${opportunity.type}`
            : ""
        }`,
      },
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

  const content = completion.choices[0]?.message?.content?.trim() || "";
  if (!content) {
    return Response.json({ error: "empty_generation" }, { status: 502 });
  }

  const title = opportunity
    ? `${kind.toUpperCase()} · ${opportunity.role} · ${opportunity.company}`
    : `${kind.toUpperCase()} · ${new Date().toLocaleDateString("es-CO")}`;

  const asset = await prisma.generatedAsset.create({
    data: {
      opportunityId: opportunity?.id ?? null,
      kind,
      locale,
      title: title.slice(0, 300),
      content,
      model: CHAT_MODEL,
    },
  });

  if (opportunity) {
    await prisma.opportunityEvent.create({
      data: {
        opportunityId: opportunity.id,
        type: "envio",
        note: `Generado ${kind}`,
      },
    });
  }

  return Response.json({
    kind,
    asset: {
      id: asset.id,
      kind: asset.kind,
      title: asset.title,
      content: asset.content,
      locale: asset.locale,
      createdAt: asset.createdAt.toISOString(),
    },
    sourcesUsed: chunks.length,
  });
}
