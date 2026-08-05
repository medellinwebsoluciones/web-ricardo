import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import {
  ensureSeedPromptVersion,
  invalidateAgentConfig,
} from "@/lib/agent-config";
import {
  AUDIENCES,
  AUDIENCE_LABEL,
  STAGES,
  STAGE_LABEL,
  DEFAULT_AUDIENCE_LAYERS,
  DEFAULT_PSYCHOLOGY_LAYER,
  DEFAULT_STAGE_LAYERS,
} from "@/lib/persona";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  await ensureSeedPromptVersion();

  const versions = await prisma.agentPromptVersion.findMany({
    orderBy: { version: "desc" },
  });

  return Response.json({
    versions: versions.map((v) => ({
      id: v.id,
      version: v.version,
      name: v.name,
      notes: v.notes,
      psychologyLayer: v.psychologyLayer,
      audienceLayers: v.audienceLayers,
      stageLayers: v.stageLayers,
      model: v.model,
      temperature: v.temperature,
      maxTokens: v.maxTokens,
      isActive: v.isActive,
      updatedAt: v.updatedAt.toISOString(),
    })),
    meta: {
      audiences: AUDIENCES.map((a) => ({ key: a, label: AUDIENCE_LABEL[a] })),
      stages: STAGES.map((s) => ({ key: s, label: STAGE_LABEL[s] })),
    },
    defaults: {
      psychologyLayer: DEFAULT_PSYCHOLOGY_LAYER,
      audienceLayers: DEFAULT_AUDIENCE_LAYERS,
      stageLayers: DEFAULT_STAGE_LAYERS,
    },
  });
}

/**
 * Crea una versión nueva a partir de otra. Nunca se edita en sitio una versión
 * que ya tiene evaluaciones: si no, el histórico dejaría de significar nada.
 */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const from = String(body?.fromId || "");

  const base = from
    ? await prisma.agentPromptVersion.findUnique({ where: { id: from } })
    : await prisma.agentPromptVersion.findFirst({
        where: { isActive: true },
        orderBy: { version: "desc" },
      });

  const last = await prisma.agentPromptVersion.findFirst({
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const created = await prisma.agentPromptVersion.create({
    data: {
      version: (last?.version ?? 0) + 1,
      name: String(body?.name || "").slice(0, 120) || `Versión ${(last?.version ?? 0) + 1}`,
      notes: String(body?.notes || "").slice(0, 2000) || null,
      psychologyLayer:
        String(body?.psychologyLayer || "") ||
        base?.psychologyLayer ||
        DEFAULT_PSYCHOLOGY_LAYER,
      audienceLayers:
        body?.audienceLayers ?? base?.audienceLayers ?? DEFAULT_AUDIENCE_LAYERS,
      stageLayers:
        body?.stageLayers ?? base?.stageLayers ?? DEFAULT_STAGE_LAYERS,
      model: String(body?.model || "") || base?.model || "gpt-4o",
      temperature: Number(body?.temperature ?? base?.temperature ?? 0.6),
      maxTokens: Number(body?.maxTokens ?? base?.maxTokens ?? 700),
      isActive: false,
    },
  });

  return Response.json({ id: created.id, version: created.version });
}

export async function PATCH(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const id = String(body?.id || "");
  if (!id) return Response.json({ error: "bad_request" }, { status: 400 });

  if (body?.activate) {
    await prisma.$transaction([
      prisma.agentPromptVersion.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      }),
      prisma.agentPromptVersion.update({
        where: { id },
        data: { isActive: true },
      }),
    ]);
    invalidateAgentConfig();
    return Response.json({ ok: true, activated: id });
  }

  await prisma.agentPromptVersion.update({
    where: { id },
    data: {
      ...(typeof body?.name === "string" ? { name: body.name.slice(0, 120) } : {}),
      ...(typeof body?.notes === "string"
        ? { notes: body.notes.slice(0, 2000) }
        : {}),
      ...(typeof body?.psychologyLayer === "string"
        ? { psychologyLayer: body.psychologyLayer }
        : {}),
      ...(body?.audienceLayers ? { audienceLayers: body.audienceLayers } : {}),
      ...(body?.stageLayers ? { stageLayers: body.stageLayers } : {}),
      ...(typeof body?.model === "string" && body.model
        ? { model: body.model }
        : {}),
      ...(body?.temperature !== undefined
        ? { temperature: Number(body.temperature) }
        : {}),
      ...(body?.maxTokens !== undefined
        ? { maxTokens: Number(body.maxTokens) }
        : {}),
    },
  });

  invalidateAgentConfig();
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const id = req.nextUrl.searchParams.get("id") || "";
  const version = await prisma.agentPromptVersion.findUnique({ where: { id } });
  if (!version) return Response.json({ error: "not_found" }, { status: 404 });
  if (version.isActive) {
    return Response.json({ error: "cannot_delete_active" }, { status: 400 });
  }

  await prisma.agentPromptVersion.delete({ where: { id } });
  return Response.json({ ok: true });
}
