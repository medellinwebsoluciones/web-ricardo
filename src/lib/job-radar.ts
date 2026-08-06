import { ingestJob, type IngestResult, type JobSource } from "./job-ingest";

/**
 * Radar multi-fuente de empleo remoto.
 *
 * No toca LinkedIn: usa APIs públicas (RemoteOK, Remotive, Arbeitnow),
 * filtra por keywords del perfil y pasa cada candidata por el scoreador.
 */

export type RadarHit = {
  source: JobSource;
  externalId: string;
  company: string;
  role: string;
  url: string;
  location: string | null;
  salaryRange: string | null;
  description: string;
  tags: string[];
};

export type RadarScanResult = {
  fetched: number;
  scored: number;
  saved: number;
  skipped: number;
  results: Array<IngestResult & { hit: Pick<RadarHit, "source" | "company" | "role" | "url"> }>;
};

const DEFAULT_KEYWORDS = [
  "python",
  "fastapi",
  "django",
  "react",
  "next.js",
  "nextjs",
  "typescript",
  "full.?stack",
  "ai ",
  "llm",
  "rag",
  "automation",
  "agent",
];

const PROFILE_RE = new RegExp(DEFAULT_KEYWORDS.join("|"), "i");

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "WebRicardoJobRadar/1.0 (+https://ricardozuluaga.medellinweb.co)",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function fromRemoteOk(): Promise<RadarHit[]> {
  const raw = (await fetchJson("https://remoteok.com/api")) as Array<
    Record<string, unknown>
  >;
  // El primer elemento es el aviso legal de RemoteOK.
  return raw
    .slice(1)
    .filter((j) => j.id && j.position)
    .map((j) => {
      const tags = Array.isArray(j.tags) ? j.tags.map(String) : [];
      const desc = stripHtml(String(j.description || ""));
      const blob = `${j.position} ${j.company} ${tags.join(" ")} ${desc}`;
      return {
        source: "remoteok" as const,
        externalId: String(j.id),
        company: String(j.company || "RemoteOK").slice(0, 200),
        role: String(j.position).slice(0, 200),
        url: String(j.url || `https://remoteok.com/remote-jobs/${j.id}`).slice(0, 500),
        location: j.location ? String(j.location).slice(0, 160) : "Remoto",
        salaryRange:
          j.salary_min || j.salary_max
            ? `${j.salary_min || "?"}–${j.salary_max || "?"} ${j.currency || "USD"}`
            : null,
        description: blob.slice(0, 12000),
        tags,
      };
    })
    .filter((h) => PROFILE_RE.test(h.description));
}

async function fromRemotive(): Promise<RadarHit[]> {
  const raw = (await fetchJson(
    "https://remotive.com/api/remote-jobs?category=software-dev",
  )) as { jobs?: Array<Record<string, unknown>> };
  const jobs = raw.jobs || [];
  return jobs
    .map((j) => {
      const tags = Array.isArray(j.tags) ? j.tags.map(String) : [];
      const desc = stripHtml(String(j.description || ""));
      const blob = `${j.title} ${j.company_name} ${tags.join(" ")} ${desc}`;
      return {
        source: "remotive" as const,
        externalId: String(j.id),
        company: String(j.company_name || "Remotive").slice(0, 200),
        role: String(j.title || "Role").slice(0, 200),
        url: String(j.url || "").slice(0, 500),
        location: j.candidate_required_location
          ? String(j.candidate_required_location).slice(0, 160)
          : "Remoto",
        salaryRange: j.salary ? String(j.salary).slice(0, 120) : null,
        description: blob.slice(0, 12000),
        tags,
      };
    })
    .filter((h) => h.url && PROFILE_RE.test(h.description));
}

async function fromArbeitnow(): Promise<RadarHit[]> {
  const raw = (await fetchJson(
    "https://www.arbeitnow.com/api/job-board-api",
  )) as { data?: Array<Record<string, unknown>> };
  const jobs = raw.data || [];
  return jobs
    .map((j) => {
      const tags = Array.isArray(j.tags) ? j.tags.map(String) : [];
      const desc = stripHtml(String(j.description || ""));
      const blob = `${j.title} ${j.company_name} ${tags.join(" ")} ${desc}`;
      return {
        source: "arbeitnow" as const,
        externalId: String(j.slug || j.url || j.title),
        company: String(j.company_name || "Arbeitnow").slice(0, 200),
        role: String(j.title || "Role").slice(0, 200),
        url: String(j.url || "").slice(0, 500),
        location: j.location ? String(j.location).slice(0, 160) : null,
        salaryRange: null,
        description: blob.slice(0, 12000),
        tags,
      };
    })
    .filter(
      (h) =>
        h.url &&
        (jRemote(h) || PROFILE_RE.test(h.description)) &&
        PROFILE_RE.test(h.description),
    );
}

function jRemote(h: RadarHit): boolean {
  return /remote|remoto|worldwide|anywhere/i.test(
    `${h.location || ""} ${h.tags.join(" ")}`,
  );
}

export async function collectRadarHits(opts?: {
  sources?: JobSource[];
  limit?: number;
}): Promise<RadarHit[]> {
  const want = new Set(
    opts?.sources?.length
      ? opts.sources
      : (["remoteok", "remotive", "arbeitnow"] as JobSource[]),
  );
  const limit = opts?.limit ?? 40;
  const buckets: Promise<RadarHit[]>[] = [];
  if (want.has("remoteok")) buckets.push(fromRemoteOk().catch(() => []));
  if (want.has("remotive")) buckets.push(fromRemotive().catch(() => []));
  if (want.has("arbeitnow")) buckets.push(fromArbeitnow().catch(() => []));

  const all = (await Promise.all(buckets)).flat();
  // Preferir las que mencionan IA / FastAPI / Next cerca del título.
  all.sort((a, b) => {
    const score = (h: RadarHit) =>
      (/ai|llm|fastapi|next\.?js|agent/i.test(h.role) ? 2 : 0) +
      (/ai|llm|rag|agent/i.test(h.description.slice(0, 400)) ? 1 : 0);
    return score(b) - score(a);
  });
  return all.slice(0, limit);
}

export async function scanRadar(opts?: {
  sources?: JobSource[];
  limit?: number;
  minScore?: number;
  saveAll?: boolean;
}): Promise<RadarScanResult> {
  const hits = await collectRadarHits({
    sources: opts?.sources,
    limit: opts?.limit ?? 25,
  });

  const results: RadarScanResult["results"] = [];
  let saved = 0;
  let skipped = 0;

  for (const hit of hits) {
    try {
      const r = await ingestJob({
        company: hit.company,
        role: hit.role,
        jobDescription: hit.description,
        url: hit.url,
        location: hit.location,
        salaryRange: hit.salaryRange,
        source: hit.source,
        externalId: hit.externalId,
        minScore: opts?.minScore ?? 48,
        saveAll: opts?.saveAll ?? false,
      });
      if (r.saved) saved += 1;
      else skipped += 1;
      results.push({
        ...r,
        hit: {
          source: hit.source,
          company: hit.company,
          role: hit.role,
          url: hit.url,
        },
      });
    } catch {
      skipped += 1;
    }
  }

  return {
    fetched: hits.length,
    scored: results.length,
    saved,
    skipped,
    results,
  };
}
