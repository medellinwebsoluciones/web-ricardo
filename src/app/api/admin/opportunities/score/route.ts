import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { scoreJob } from "@/lib/opportunity-score";
import { mergeParsedJob, parseJobPaste } from "@/lib/parse-job-paste";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Triaje de una oferta pegada. Devuelve el veredicto y, si `save` es true,
 * crea la oportunidad ya puntuada y priorizada en el tablero.
 *
 * Funciona sin OPENAI_API_KEY: la heurística basta para filtrar. `useLlm` solo
 * añade matices cuando hay clave configurada.
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const rawDescription = String(body?.jobDescription || "").trim();
  if (rawDescription.length < 40) {
    return Response.json({ error: "job_description_too_short" }, { status: 400 });
  }

  const parsed = parseJobPaste(rawDescription);
  const merged = mergeParsedJob(
    {
      company: body?.company ? String(body.company) : "",
      role: body?.role ? String(body.role) : "",
      location: body?.location ? String(body.location) : null,
      salaryRange: body?.salaryRange ? String(body.salaryRange) : null,
      type: body?.type ? String(body.type) : undefined,
      jobDescription: rawDescription,
    },
    parsed,
    { preferCleanDescription: true },
  );

  const score = await scoreJob(merged.jobDescription, {
    useLlm: Boolean(body?.useLlm),
  });

  if (!body?.save) {
    return Response.json({ score, extracted: parsed, filled: {
      company: merged.company,
      role: merged.role,
      location: merged.location,
      salaryRange: merged.salaryRange,
      type: merged.type,
    } });
  }

  const company = merged.company || "Empresa por confirmar";
  const role = merged.role || "Rol por confirmar";

  const opportunity = await prisma.opportunity.create({
    data: {
      company: company.slice(0, 200),
      role: role.slice(0, 200),
      type: ["fijo-remoto", "consultoria", "freelance"].includes(merged.type)
        ? merged.type
        : "fijo-remoto",
      location: merged.location ? merged.location.slice(0, 160) : null,
      remote: score.remote !== false && parsed.remote !== false,
      url: body?.url ? String(body.url).slice(0, 500) : null,
      salaryRange: merged.salaryRange ? merged.salaryRange.slice(0, 120) : null,
      priority: score.priority,
      matchScore: score.score,
      matchGaps: score.matchGaps,
      jobDescription: merged.jobDescription.slice(0, 20000),
      events: {
        create: {
          type: "creada",
          note: `Triaje: ${score.verdict.toUpperCase()} (${score.score}%)`,
        },
      },
    },
    include: {
      events: { orderBy: { at: "desc" }, take: 20 },
      assets: {
        orderBy: { createdAt: "desc" },
        select: { id: true, kind: true, title: true, createdAt: true },
      },
    },
  });

  return Response.json({ score, opportunity, extracted: parsed });
}
