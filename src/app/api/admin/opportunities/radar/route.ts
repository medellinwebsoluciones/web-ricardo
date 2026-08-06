import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { collectRadarHits, scanRadar } from "@/lib/job-radar";
import type { JobSource } from "@/lib/job-ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * GET: vista previa de hits del radar (sin guardar).
 * POST: escanea, puntúa y guarda las que pasan el umbral.
 */
export async function GET(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const limit = Math.min(
    40,
    Math.max(5, Number(req.nextUrl.searchParams.get("limit") || 15)),
  );
  try {
    const hits = await collectRadarHits({ limit });
    return Response.json({
      hits: hits.map((h) => ({
        source: h.source,
        company: h.company,
        role: h.role,
        url: h.url,
        location: h.location,
        tags: h.tags.slice(0, 8),
      })),
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "radar_failed" },
      { status: 502 },
    );
  }
}

export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const sources = Array.isArray(body?.sources)
    ? (body.sources as JobSource[])
    : undefined;
  const limit = Math.min(40, Math.max(5, Number(body?.limit || 20)));
  const minScore = Math.min(100, Math.max(0, Number(body?.minScore ?? 48)));

  try {
    const result = await scanRadar({
      sources,
      limit,
      minScore,
      saveAll: Boolean(body?.saveAll),
    });
    return Response.json(result);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "radar_failed" },
      { status: 502 },
    );
  }
}