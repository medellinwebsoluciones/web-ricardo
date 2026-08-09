import { NextRequest } from "next/server";
import { denyIfNotAdminOrIngestToken } from "@/lib/admin-auth";
import {
  ingestJob,
  parseJobEmailAlert,
  type JobSource,
} from "@/lib/job-ingest";
import { mergeParsedJob, parseJobPaste } from "@/lib/parse-job-paste";
import { getClientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SOURCES: JobSource[] = [
  "manual",
  "linkedin",
  "remoteok",
  "remotive",
  "arbeitnow",
  "email",
];

const INGEST_LIMIT = 30;
const INGEST_WINDOW_MS = 5 * 60 * 1000;

function ingestCorsHeaders(req: Request): Record<string, string> {
  const allowlist = (process.env.JOB_INGEST_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  const origin = req.headers.get("origin") || "";
  const allowOrigin =
    allowlist.length === 0
      ? "*"
      : allowlist.includes(origin)
        ? origin
        : allowlist[0]!;

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-ingest-token",
    Vary: "Origin",
  };
}

/** Preflight para la extensión Chrome. */
export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: ingestCorsHeaders(req) });
}

/**
 * Ingesta una oferta (LinkedIn via extensión/bookmarklet, email pegado, etc.).
 * Auth: sesión admin o header `x-ingest-token` = JOB_INGEST_TOKEN.
 */
export async function POST(req: NextRequest) {
  const cors = ingestCorsHeaders(req);

  const denied = await denyIfNotAdminOrIngestToken(req);
  if (denied) {
    const body = await denied.text();
    return new Response(body, {
      status: denied.status,
      headers: { "content-type": "application/json", ...cors },
    });
  }

  const ip = getClientIp(req);
  const tokenHint = (req.headers.get("x-ingest-token") || "session").slice(0, 8);
  const rl = rateLimit(`ingest:${ip}:${tokenHint}`, INGEST_LIMIT, INGEST_WINDOW_MS);
  if (!rl.ok) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: cors },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "bad_request" }, { status: 400, headers: cors });
  }

  let company = String(body.company || "").trim();
  let role = String(body.role || "").trim();
  let jobDescription = String(body.jobDescription || "").trim();
  let url = body.url ? String(body.url) : null;
  let location = body.location ? String(body.location) : null;
  let salaryRange = body.salaryRange ? String(body.salaryRange) : null;
  let type = body.type ? String(body.type) : undefined;
  const source: JobSource = SOURCES.includes(body.source) ? body.source : "manual";

  if (source === "email" && jobDescription) {
    const parsed = parseJobEmailAlert(jobDescription);
    company = company || parsed.company;
    role = role || parsed.role;
    url = url || parsed.url;
    location = location || parsed.location || null;
    jobDescription = parsed.jobDescription;
  }

  // Pegado manual / LinkedIn: rellenar empresa, cargo, ubicación, tipo…
  if (jobDescription) {
    const paste = parseJobPaste(jobDescription);
    const merged = mergeParsedJob(
      { company, role, location, salaryRange, type, jobDescription },
      paste,
    );
    company = merged.company;
    role = merged.role;
    location = merged.location;
    salaryRange = merged.salaryRange;
    type = merged.type;
    if (body.clean !== false && paste.cleanDescription.length >= 40) {
      jobDescription = paste.cleanDescription;
    }
  }

  if (jobDescription.length < 40) {
    return Response.json(
      { error: "job_description_too_short" },
      { status: 400, headers: cors },
    );
  }

  try {
    const result = await ingestJob({
      company,
      role,
      jobDescription,
      url,
      location,
      salaryRange,
      type,
      source,
      externalId: body.externalId ? String(body.externalId) : null,
      saveAll: body.saveAll !== false,
      minScore: typeof body.minScore === "number" ? body.minScore : 0,
      useLlm: Boolean(body.useLlm),
    });
    return Response.json(result, { headers: cors });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ingest_failed";
    return Response.json({ error: msg }, { status: 400, headers: cors });
  }
}
