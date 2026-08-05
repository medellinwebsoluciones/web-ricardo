import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const text = String(body?.body || "").trim();
  if (!text) return Response.json({ error: "empty_note" }, { status: 400 });

  const note = await prisma.leadNote.create({
    data: { leadId: id, body: text.slice(0, 4000) },
  });
  await prisma.lead.update({
    where: { id },
    data: { lastContactedAt: new Date() },
  });

  return Response.json({ note });
}
