import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STAGES = ["guardada", "aplicada", "entrevista", "oferta", "cerrada"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "bad_request" }, { status: 400 });

  const current = await prisma.opportunity.findUnique({ where: { id } });
  if (!current) return Response.json({ error: "not_found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  const events: { type: string; note: string }[] = [];

  if (typeof body.stage === "string" && STAGES.includes(body.stage)) {
    if (body.stage !== current.stage) {
      data.stage = body.stage;
      events.push({
        type: "etapa",
        note: `${current.stage} → ${body.stage}`,
      });
    }
  }
  for (const field of [
    "company",
    "role",
    "location",
    "url",
    "salaryRange",
    "nextAction",
    "notes",
    "jobDescription",
  ] as const) {
    if (typeof body[field] === "string") {
      data[field] = body[field].slice(0, 20000) || null;
    }
  }
  if (["alta", "media", "baja"].includes(body.priority)) {
    data.priority = body.priority;
  }
  if (["fijo-remoto", "consultoria", "freelance"].includes(body.type)) {
    data.type = body.type;
  }
  if (typeof body.remote === "boolean") data.remote = body.remote;
  if (body.nextActionAt !== undefined) {
    data.nextActionAt = body.nextActionAt ? new Date(body.nextActionAt) : null;
  }
  if (typeof body.note === "string" && body.note.trim()) {
    events.push({ type: "nota", note: body.note.trim().slice(0, 2000) });
  }

  if (Object.keys(data).length === 0 && events.length === 0) {
    return Response.json({ error: "nothing_to_update" }, { status: 400 });
  }

  const opportunity = await prisma.opportunity.update({
    where: { id },
    data: {
      ...data,
      ...(events.length > 0 ? { events: { create: events } } : {}),
    },
    include: {
      events: { orderBy: { at: "desc" }, take: 20 },
      assets: {
        orderBy: { createdAt: "desc" },
        select: { id: true, kind: true, title: true, createdAt: true },
      },
    },
  });

  return Response.json({ opportunity });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.opportunity.delete({ where: { id } });
  return Response.json({ ok: true });
}
