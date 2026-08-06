import { prisma } from "./prisma";
import { scoreJobHeuristic } from "./opportunity-score";
import {
  formatParsedSummary,
  mergeParsedJob,
  parseJobPaste,
} from "./parse-job-paste";

const PLACEHOLDER_COMPANY =
  /^(empresa por confirmar|empresa linkedin|empresa|company|unknown|n\/?a)$/i;
const PLACEHOLDER_ROLE =
  /^(rol por confirmar|oferta linkedin|puesto|role|title|unknown|n\/?a)$/i;

const OPP_INCLUDE = {
  events: { orderBy: { at: "desc" as const }, take: 20 },
  assets: {
    orderBy: { createdAt: "desc" as const },
    select: { id: true, kind: true, title: true, createdAt: true },
  },
};

export type EnrichOptions = {
  /** Si true, pisa empresa/rol aunque ya tengan valor “real”. */
  force?: boolean;
  /** Si true, limpia chrome de LinkedIn en jobDescription. */
  cleanDescription?: boolean;
  /** Si true, recalcula matchScore/matchGaps/priority. Default true. */
  rescore?: boolean;
};

export type EnrichResult = {
  id: string;
  changed: boolean;
  fields: string[];
  summary: string;
  opportunity?: unknown;
  reason?: string;
};

function isWeakCompany(value: string | null | undefined): boolean {
  const v = (value || "").trim();
  return !v || PLACEHOLDER_COMPANY.test(v);
}

function isWeakRole(value: string | null | undefined): boolean {
  const v = (value || "").trim();
  return !v || PLACEHOLDER_ROLE.test(v);
}

/**
 * Reescribe metadatos de una oportunidad a partir de su jobDescription.
 * Por defecto solo rellena huecos y placeholders; con `force` pisa empresa/rol.
 */
export async function enrichOpportunity(
  id: string,
  opts: EnrichOptions = {},
): Promise<EnrichResult> {
  const current = await prisma.opportunity.findUnique({ where: { id } });
  if (!current) {
    return { id, changed: false, fields: [], summary: "", reason: "not_found" };
  }

  const raw = (current.jobDescription || "").trim();
  if (raw.length < 40) {
    return {
      id,
      changed: false,
      fields: [],
      summary: "",
      reason: "no_description",
    };
  }

  const force = Boolean(opts.force);
  const cleanDescription = opts.cleanDescription !== false;
  const rescore = opts.rescore !== false;

  const parsed = parseJobPaste(raw);
  const merged = mergeParsedJob(
    {
      company: force || isWeakCompany(current.company) ? "" : current.company,
      role: force || isWeakRole(current.role) ? "" : current.role,
      location: current.location,
      salaryRange: current.salaryRange,
      type: current.type,
      jobDescription: raw,
    },
    parsed,
    { preferCleanDescription: cleanDescription },
  );

  const data: Record<string, unknown> = {};
  const fields: string[] = [];

  const nextCompany = (merged.company || current.company).slice(0, 200);
  if (nextCompany && nextCompany !== current.company) {
    data.company = nextCompany;
    fields.push("company");
  }

  const nextRole = (merged.role || current.role).slice(0, 200);
  if (nextRole && nextRole !== current.role) {
    data.role = nextRole;
    fields.push("role");
  }

  if (
    merged.location &&
    (!current.location?.trim() || force) &&
    merged.location !== current.location
  ) {
    data.location = merged.location.slice(0, 160);
    fields.push("location");
  }

  if (
    merged.salaryRange &&
    (!current.salaryRange?.trim() || force) &&
    merged.salaryRange !== current.salaryRange
  ) {
    data.salaryRange = merged.salaryRange.slice(0, 120);
    fields.push("salaryRange");
  }

  // Tipo: force siempre; si no, solo cuando el parser ve freelance/consultoría
  // o la ficha aún parece genérica.
  if (merged.type && merged.type !== current.type) {
    const upgrade =
      force ||
      merged.type === "freelance" ||
      merged.type === "consultoria" ||
      isWeakCompany(current.company) ||
      isWeakRole(current.role);
    if (upgrade) {
      data.type = merged.type;
      fields.push("type");
    }
  }

  if (parsed.remote !== null && parsed.remote !== current.remote) {
    data.remote = parsed.remote;
    fields.push("remote");
  }

  if (
    cleanDescription &&
    parsed.cleanDescription.length >= 40 &&
    parsed.cleanDescription !== current.jobDescription
  ) {
    // Solo limpiar si quita chrome (más corto) o force.
    const shorter =
      parsed.cleanDescription.length < raw.length * 0.95 ||
      /solicitar|guardar|probar premium/i.test(raw);
    if (force || shorter) {
      data.jobDescription = parsed.cleanDescription.slice(0, 20000);
      fields.push("jobDescription");
    }
  }

  const textForScore =
    typeof data.jobDescription === "string"
      ? data.jobDescription
      : current.jobDescription || raw;

  if (rescore) {
    const score = scoreJobHeuristic(textForScore);
    if (score.score !== current.matchScore) {
      data.matchScore = score.score;
      fields.push("matchScore");
    }
    if (score.matchGaps !== current.matchGaps) {
      data.matchGaps = score.matchGaps;
      fields.push("matchGaps");
    }
    if (score.priority !== current.priority) {
      data.priority = score.priority;
      fields.push("priority");
    }
  }

  const summary = formatParsedSummary(parsed);

  if (fields.length === 0) {
    const unchanged = await prisma.opportunity.findUnique({
      where: { id },
      include: OPP_INCLUDE,
    });
    return {
      id,
      changed: false,
      fields: [],
      summary,
      reason: "already_organized",
      opportunity: unchanged,
    };
  }

  const opportunity = await prisma.opportunity.update({
    where: { id },
    data: {
      ...data,
      events: {
        create: {
          type: "nota",
          note: `Datos reorganizados: ${fields.join(", ")}. ${summary}`.slice(
            0,
            2000,
          ),
        },
      },
    },
    include: OPP_INCLUDE,
  });

  return { id, changed: true, fields, summary, opportunity };
}

export async function enrichOpportunities(
  opts: EnrichOptions & { ids?: string[]; all?: boolean } = {},
): Promise<{
  total: number;
  updated: number;
  skipped: number;
  results: EnrichResult[];
}> {
  const where =
    opts.ids && opts.ids.length > 0
      ? { id: { in: opts.ids } }
      : opts.all
        ? { jobDescription: { not: null } }
        : { jobDescription: { not: null } };

  const rows = await prisma.opportunity.findMany({
    where,
    select: { id: true, jobDescription: true },
    take: 300,
    orderBy: { updatedAt: "desc" },
  });

  const results: EnrichResult[] = [];
  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!row.jobDescription || row.jobDescription.trim().length < 40) {
      skipped += 1;
      results.push({
        id: row.id,
        changed: false,
        fields: [],
        summary: "",
        reason: "no_description",
      });
      continue;
    }
    const r = await enrichOpportunity(row.id, opts);
    results.push(r);
    if (r.changed) updated += 1;
    else skipped += 1;
  }

  return { total: rows.length, updated, skipped, results };
}
