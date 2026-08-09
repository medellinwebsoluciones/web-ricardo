import { writeFile, unlink } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { prisma } from "./prisma";
import { getOpenAI } from "./openai";
import {
  MIN_EXAMPLES,
  buildJsonl,
} from "./finetune";
import {
  DEFAULT_AUDIENCE_LAYERS,
  DEFAULT_PSYCHOLOGY_LAYER,
  DEFAULT_STAGE_LAYERS,
} from "./persona";
import { invalidateAgentConfig } from "./agent-config";

export const DEFAULT_FINETUNE_BASE =
  process.env.FINETUNE_BASE_MODEL || "gpt-4o-mini-2024-07-18";

const ACTIVE_STATUSES = new Set([
  "validating_files",
  "queued",
  "running",
  "pending",
]);

function mapOpenAiStatus(status: string): string {
  return status || "pending";
}

export async function listFineTuneJobs(limit = 20) {
  const jobs = await prisma.fineTuneJob.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return jobs.map(serializeJob);
}

function serializeJob(j: {
  id: string;
  openaiJobId: string;
  status: string;
  baseModel: string;
  fineTunedModel: string | null;
  fileId: string | null;
  exampleCount: number;
  error: string | null;
  promptVersionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  finishedAt: Date | null;
}) {
  return {
    id: j.id,
    openaiJobId: j.openaiJobId,
    status: j.status,
    baseModel: j.baseModel,
    fineTunedModel: j.fineTunedModel,
    fileId: j.fileId,
    exampleCount: j.exampleCount,
    error: j.error,
    promptVersionId: j.promptVersionId,
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
    finishedAt: j.finishedAt?.toISOString() ?? null,
  };
}

/** Sincroniza jobs activos con OpenAI y devuelve la lista actualizada. */
export async function syncFineTuneJobs() {
  const active = await prisma.fineTuneJob.findMany({
    where: { status: { in: [...ACTIVE_STATUSES] } },
  });

  if (active.length === 0) {
    return listFineTuneJobs();
  }

  const client = getOpenAI();
  for (const job of active) {
    try {
      const remote = await client.fineTuning.jobs.retrieve(job.openaiJobId);
      const status = mapOpenAiStatus(remote.status);
      const done =
        status === "succeeded" ||
        status === "failed" ||
        status === "cancelled";
      await prisma.fineTuneJob.update({
        where: { id: job.id },
        data: {
          status,
          fineTunedModel: remote.fine_tuned_model ?? job.fineTunedModel,
          error: remote.error?.message ?? null,
          finishedAt: done ? new Date() : null,
        },
      });
    } catch (err) {
      console.error("Sync fine-tune job:", job.openaiJobId, err);
    }
  }

  return listFineTuneJobs();
}

export async function hasActiveFineTuneJob(): Promise<boolean> {
  const n = await prisma.fineTuneJob.count({
    where: { status: { in: [...ACTIVE_STATUSES] } },
  });
  return n > 0;
}

/**
 * Escribe JSONL temporal, opcionalmente sube y lanza el job.
 * dryRun=true solo valida el dataset.
 */
export async function launchFineTuneJob(opts?: {
  dryRun?: boolean;
  baseModel?: string;
  suffix?: string;
}): Promise<
  | { dryRun: true; count: number; path: string }
  | {
      dryRun: false;
      job: ReturnType<typeof serializeJob>;
      count: number;
    }
> {
  const { jsonl, count } = await buildJsonl();
  if (count < MIN_EXAMPLES) {
    const err = new Error("not_enough_examples") as Error & {
      count: number;
      required: number;
    };
    err.count = count;
    err.required = MIN_EXAMPLES;
    throw err;
  }

  const path = join(tmpdir(), `ricardo-finetune-${Date.now()}.jsonl`);
  await writeFile(path, jsonl, "utf8");

  if (opts?.dryRun) {
    return { dryRun: true, count, path };
  }

  if (await hasActiveFineTuneJob()) {
    await unlink(path).catch(() => {});
    throw new Error("job_already_running");
  }

  const baseModel = opts?.baseModel || DEFAULT_FINETUNE_BASE;
  const suffix = (opts?.suffix || "ricardo").slice(0, 18);
  const client = getOpenAI();

  try {
    const file = await client.files.create({
      file: createReadStream(path),
      purpose: "fine-tune",
    });

    const remote = await client.fineTuning.jobs.create({
      training_file: file.id,
      model: baseModel,
      suffix,
    });

    const row = await prisma.fineTuneJob.create({
      data: {
        openaiJobId: remote.id,
        status: mapOpenAiStatus(remote.status),
        baseModel,
        fineTunedModel: remote.fine_tuned_model ?? null,
        fileId: file.id,
        exampleCount: count,
      },
    });

    await prisma.trainingExample.updateMany({
      where: { approved: true },
      data: { exportedAt: new Date() },
    });

    return { dryRun: false, job: serializeJob(row), count };
  } finally {
    await unlink(path).catch(() => {});
  }
}

export async function getFineTuneJobStatus(openaiJobId: string) {
  const client = getOpenAI();
  const remote = await client.fineTuning.jobs.retrieve(openaiJobId);

  const local = await prisma.fineTuneJob.findUnique({
    where: { openaiJobId },
  });

  if (local) {
    const status = mapOpenAiStatus(remote.status);
    const done =
      status === "succeeded" ||
      status === "failed" ||
      status === "cancelled";
    await prisma.fineTuneJob.update({
      where: { id: local.id },
      data: {
        status,
        fineTunedModel: remote.fine_tuned_model ?? local.fineTunedModel,
        error: remote.error?.message ?? null,
        finishedAt: done ? new Date() : local.finishedAt,
      },
    });
  }

  return {
    openaiJobId: remote.id,
    status: remote.status,
    baseModel: remote.model,
    fineTunedModel: remote.fine_tuned_model,
    error: remote.error?.message ?? null,
  };
}

/**
 * Crea una nueva AgentPromptVersion copiando la activa y pegando el modelo FT.
 * No la activa sola: hay que correr evals antes.
 */
export async function applyFineTunedModelToPersona(params: {
  jobId: string;
  activate?: boolean;
  name?: string;
}): Promise<{ promptVersionId: string; version: number; model: string }> {
  const job = await prisma.fineTuneJob.findUnique({
    where: { id: params.jobId },
  });
  if (!job) throw new Error("job_not_found");
  if (!job.fineTunedModel) throw new Error("model_not_ready");

  const base =
    (await prisma.agentPromptVersion.findFirst({
      where: { isActive: true },
      orderBy: { version: "desc" },
    })) ??
    (await prisma.agentPromptVersion.findFirst({
      orderBy: { version: "desc" },
    }));

  const last = await prisma.agentPromptVersion.findFirst({
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const nextVersion = (last?.version ?? 0) + 1;
  const created = await prisma.agentPromptVersion.create({
    data: {
      version: nextVersion,
      name:
        params.name?.slice(0, 120) ||
        `Fine-tune ${job.fineTunedModel.slice(-12)}`,
      notes: `Modelo fine-tuned desde job ${job.openaiJobId} (${job.exampleCount} ejemplos). Correr suites antes de activar.`,
      psychologyLayer:
        base?.psychologyLayer || DEFAULT_PSYCHOLOGY_LAYER,
      audienceLayers: base?.audienceLayers ?? DEFAULT_AUDIENCE_LAYERS,
      stageLayers: base?.stageLayers ?? DEFAULT_STAGE_LAYERS,
      model: job.fineTunedModel,
      temperature: base?.temperature ?? 0.6,
      maxTokens: base?.maxTokens ?? 700,
      isActive: false,
    },
  });

  if (params.activate) {
    await prisma.$transaction([
      prisma.agentPromptVersion.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      }),
      prisma.agentPromptVersion.update({
        where: { id: created.id },
        data: { isActive: true },
      }),
    ]);
    invalidateAgentConfig();
  }

  await prisma.fineTuneJob.update({
    where: { id: job.id },
    data: { promptVersionId: created.id },
  });

  return {
    promptVersionId: created.id,
    version: created.version,
    model: job.fineTunedModel,
  };
}
