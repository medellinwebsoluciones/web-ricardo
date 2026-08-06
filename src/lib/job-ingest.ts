import { prisma } from "./prisma";
import { scoreJob, type JobScore } from "./opportunity-score";
import { parseJobPaste } from "./parse-job-paste";

export type JobSource =
  | "manual"
  | "linkedin"
  | "remoteok"
  | "remotive"
  | "arbeitnow"
  | "email";

export type IngestJobInput = {
  company: string;
  role: string;
  jobDescription: string;
  url?: string | null;
  location?: string | null;
  salaryRange?: string | null;
  /** fijo-remoto | consultoria | freelance */
  type?: string | null;
  source: JobSource;
  externalId?: string | null;
  /** Si true, guarda aunque el veredicto sea descartar. Por defecto solo aplicar/valorar. */
  saveAll?: boolean;
  /** Umbral mínimo de score para guardar (default 48 = valorar). */
  minScore?: number;
  useLlm?: boolean;
};

const OPP_TYPES = ["fijo-remoto", "consultoria", "freelance"] as const;

function resolveType(raw?: string | null): string {
  return raw && (OPP_TYPES as readonly string[]).includes(raw) ? raw : "fijo-remoto";
}

export type IngestResult = {
  score: JobScore;
  saved: boolean;
  skipped: boolean;
  reason?: string;
  opportunity?: {
    id: string;
    company: string;
    role: string;
    stage: string;
    priority: string;
    matchScore: number | null;
    matchGaps: string | null;
    url: string | null;
    source: string | null;
    createdAt: string;
  };
};

const OPP_INCLUDE = {
  events: { orderBy: { at: "desc" as const }, take: 20 },
  assets: {
    orderBy: { createdAt: "desc" as const },
    select: { id: true, kind: true, title: true, createdAt: true },
  },
};

function normalizeUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    u.hash = "";
    // LinkedIn y RemoteOK llevan query tracking; la ruta basta para dedup.
    if (u.hostname.includes("linkedin.com")) {
      u.search = "";
    }
    return u.toString().slice(0, 500);
  } catch {
    return url.trim().slice(0, 500);
  }
}

/**
 * Puntúa una oferta y, si pasa el umbral, la crea o actualiza en el tablero
 * sin duplicar por (source, externalId) ni por URL.
 */
export async function ingestJob(input: IngestJobInput): Promise<IngestResult> {
  const company = input.company.trim().slice(0, 200) || "Empresa por confirmar";
  const role = input.role.trim().slice(0, 200) || "Rol por confirmar";
  const jobDescription = input.jobDescription.trim().slice(0, 20000);
  if (jobDescription.length < 40) {
    throw new Error("job_description_too_short");
  }

  const url = normalizeUrl(input.url);
  const externalId = input.externalId?.trim().slice(0, 200) || null;
  const type = resolveType(input.type);
  const score = await scoreJob(jobDescription, { useLlm: Boolean(input.useLlm) });
  const minScore = input.minScore ?? 48;

  if (!input.saveAll && score.score < minScore) {
    return {
      score,
      saved: false,
      skipped: true,
      reason: `score_${score.score}_below_${minScore}`,
    };
  }

  // Deduplicar: primero por origen+id, luego por URL.
  let existing = null;
  if (input.source && externalId) {
    existing = await prisma.opportunity.findFirst({
      where: { source: input.source, externalId },
    });
  }
  if (!existing && url) {
    existing = await prisma.opportunity.findFirst({ where: { url } });
  }

  if (existing) {
    const updated = await prisma.opportunity.update({
      where: { id: existing.id },
      data: {
        company,
        role,
        type: input.type ? type : existing.type,
        location: input.location?.slice(0, 160) || existing.location,
        salaryRange: input.salaryRange?.slice(0, 120) || existing.salaryRange,
        remote: score.remote !== false,
        url: url || existing.url,
        priority: score.priority,
        matchScore: score.score,
        matchGaps: score.matchGaps,
        jobDescription,
        source: input.source,
        externalId: externalId || existing.externalId,
        events: {
          create: {
            type: "nota",
            note: `Re-escaneada: ${score.verdict.toUpperCase()} (${score.score}%)`,
          },
        },
      },
      include: OPP_INCLUDE,
    });
    return {
      score,
      saved: true,
      skipped: false,
      reason: "updated",
      opportunity: serialize(updated),
    };
  }

  const created = await prisma.opportunity.create({
    data: {
      company,
      role,
      type,
      location: input.location?.slice(0, 160) || null,
      remote: score.remote !== false,
      url,
      salaryRange: input.salaryRange?.slice(0, 120) || null,
      priority: score.priority,
      matchScore: score.score,
      matchGaps: score.matchGaps,
      jobDescription,
      source: input.source,
      externalId,
      events: {
        create: {
          type: "creada",
          note: `Ingest (${input.source}): ${score.verdict.toUpperCase()} (${score.score}%)`,
        },
      },
    },
    include: OPP_INCLUDE,
  });

  return {
    score,
    saved: true,
    skipped: false,
    reason: "created",
    opportunity: serialize(created),
  };
}

function serialize(o: {
  id: string;
  company: string;
  role: string;
  stage: string;
  priority: string;
  matchScore: number | null;
  matchGaps: string | null;
  url: string | null;
  source: string | null;
  createdAt: Date;
}) {
  return {
    id: o.id,
    company: o.company,
    role: o.role,
    stage: o.stage,
    priority: o.priority,
    matchScore: o.matchScore,
    matchGaps: o.matchGaps,
    url: o.url,
    source: o.source,
    createdAt: o.createdAt.toISOString(),
  };
}

/** Extrae empresa/rol/descripción de una alerta de email de LinkedIn (texto plano). */
export function parseJobEmailAlert(raw: string): {
  company: string;
  role: string;
  jobDescription: string;
  url: string | null;
  location?: string | null;
} {
  const text = raw.replace(/\r\n/g, "\n").trim();
  const urlMatch = text.match(/https?:\/\/[^\s)]+/i);
  const url = urlMatch ? urlMatch[0].replace(/[.,;]+$/, "") : null;

  // Patrones típicos: "Senior X at Company" / "Puesto en Empresa"
  const atMatch = text.match(
    /^(.{5,120}?)\s+(?:at|en|@)\s+([A-ZÁÉÍÓÚÑ][^\n]{1,80})/m,
  );
  let role =
    atMatch?.[1]?.trim() ||
    text.split("\n").find((l) => l.trim())?.trim() ||
    "";
  let company = atMatch?.[2]?.trim() || "";

  // Si el email trae el cuerpo completo de LinkedIn, reutilizar el parser de paste.
  const paste = parseJobPaste(text);
  company = company || paste.company || paste.employer || "Empresa por confirmar";
  role = role || paste.role || "Rol por confirmar";

  return {
    company: company.slice(0, 200),
    role: role.slice(0, 200),
    jobDescription: (paste.cleanDescription || text).slice(0, 20000),
    url,
    location: paste.location,
  };
}
