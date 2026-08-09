import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { MIN_EXAMPLES, trainingStats } from "@/lib/finetune";
import {
  DEFAULT_FINETUNE_BASE,
  applyFineTunedModelToPersona,
  launchFineTuneJob,
  syncFineTuneJobs,
} from "@/lib/finetune-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  try {
    const jobs = await syncFineTuneJobs();
    return Response.json({
      jobs,
      baseModelDefault: DEFAULT_FINETUNE_BASE,
      stats: await trainingStats(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    if (msg.includes("OPENAI_API_KEY")) {
      return Response.json({
        jobs: [],
        baseModelDefault: DEFAULT_FINETUNE_BASE,
        stats: await trainingStats(),
        warning: "openai_not_configured",
      });
    }
    throw e;
  }
}

/**
 * POST:
 * - launch: { action?: "launch", dryRun?, baseModel?, suffix? }
 * - apply: { action: "apply", jobId, activate?, name? }
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const action = String(body?.action || "launch");

  if (action === "apply") {
    const jobId = String(body?.jobId || "");
    if (!jobId) {
      return Response.json({ error: "bad_request" }, { status: 400 });
    }
    try {
      const result = await applyFineTunedModelToPersona({
        jobId,
        activate: Boolean(body?.activate),
        name: body?.name ? String(body.name) : undefined,
      });
      return Response.json({ ok: true, ...result });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      const status =
        msg === "job_not_found"
          ? 404
          : msg === "model_not_ready"
            ? 400
            : 500;
      return Response.json({ error: msg }, { status });
    }
  }

  // launch
  try {
    const result = await launchFineTuneJob({
      dryRun: Boolean(body?.dryRun),
      baseModel: body?.baseModel
        ? String(body.baseModel).slice(0, 80)
        : undefined,
      suffix: body?.suffix ? String(body.suffix).slice(0, 18) : undefined,
    });

    if (result.dryRun) {
      return Response.json({
        dryRun: true,
        count: result.count,
        path: result.path,
        stats: await trainingStats(),
      });
    }

    return Response.json({
      dryRun: false,
      job: result.job,
      count: result.count,
      stats: await trainingStats(),
    });
  } catch (e) {
    const err = e as Error & { count?: number; required?: number };
    if (err.message === "not_enough_examples") {
      return Response.json(
        {
          error: "not_enough_examples",
          count: err.count ?? 0,
          required: err.required ?? MIN_EXAMPLES,
          stats: await trainingStats(),
        },
        { status: 400 },
      );
    }
    if (err.message === "job_already_running") {
      return Response.json(
        { error: "job_already_running", stats: await trainingStats() },
        { status: 409 },
      );
    }
    if (err.message?.includes("OPENAI_API_KEY")) {
      return Response.json(
        { error: "openai_not_configured" },
        { status: 503 },
      );
    }
    console.error("Fine-tune launch:", err);
    return Response.json({ error: "launch_failed" }, { status: 500 });
  }
}
