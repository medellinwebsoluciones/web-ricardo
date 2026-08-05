import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = [
  "nuevo",
  "contactado",
  "calificado",
  "propuesta",
  "ganado",
  "perdido",
];
const TEMPERATURES = ["alta", "media", "baja"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "bad_request" }, { status: 400 });

  const data: Record<string, unknown> = {};

  if (typeof body.status === "string" && STATUSES.includes(body.status)) {
    data.status = body.status;
    if (body.status === "contactado") data.lastContactedAt = new Date();
  }
  if (
    typeof body.temperature === "string" &&
    TEMPERATURES.includes(body.temperature)
  ) {
    data.temperature = body.temperature;
  }
  for (const field of ["company", "role", "phone", "nextAction"] as const) {
    if (typeof body[field] === "string") {
      data[field] = body[field].slice(0, 300) || null;
    }
  }
  if (body.value !== undefined) {
    const n = Number(body.value);
    data.value = Number.isFinite(n) && n > 0 ? n : null;
  }
  if (body.nextActionAt !== undefined) {
    data.nextActionAt = body.nextActionAt ? new Date(body.nextActionAt) : null;
  }
  if (Array.isArray(body.tags)) {
    data.tags = body.tags.map((t: unknown) => String(t).slice(0, 40)).slice(0, 12);
  }

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "nothing_to_update" }, { status: 400 });
  }

  const lead = await prisma.lead.update({ where: { id }, data });
  return Response.json({ lead });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return Response.json({ ok: true });
}
