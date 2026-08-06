import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { enrichOpportunities, enrichOpportunity } from "@/lib/job-enrich";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Reorganiza metadatos (empresa, cargo, ubicación, tipo…) a partir del
 * jobDescription ya guardado. Sin IA.
 *
 * Body:
 *   { id } | { ids: string[] } | { all: true }
 *   force?: boolean  — pisa empresa/rol aunque ya tengan valor
 *   cleanDescription?: boolean
 *   rescore?: boolean
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const opts = {
    force: Boolean(body.force),
    cleanDescription: body.cleanDescription !== false,
    rescore: body.rescore !== false,
  };

  if (typeof body.id === "string" && body.id.trim()) {
    const result = await enrichOpportunity(body.id.trim(), opts);
    if (result.reason === "not_found") {
      return Response.json({ error: "not_found" }, { status: 404 });
    }
    return Response.json({
      total: 1,
      updated: result.changed ? 1 : 0,
      skipped: result.changed ? 0 : 1,
      results: [result],
      opportunity: result.opportunity,
    });
  }

  const ids = Array.isArray(body.ids)
    ? body.ids.filter((x: unknown): x is string => typeof x === "string")
    : undefined;

  if (!body.all && (!ids || ids.length === 0)) {
    return Response.json(
      { error: "id_ids_or_all_required" },
      { status: 400 },
    );
  }

  const batch = await enrichOpportunities({
    ...opts,
    ids,
    all: Boolean(body.all),
  });

  return Response.json(batch);
}
