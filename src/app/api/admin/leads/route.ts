import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const source = sp.get("source");
  const temperature = sp.get("temperature");
  const q = sp.get("q")?.trim();

  const leads = await prisma.lead.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
      ...(temperature ? { temperature } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { company: { contains: q, mode: "insensitive" as const } },
              { message: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 300,
    include: {
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  return Response.json({ leads });
}

export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email) {
    return Response.json({ error: "name_email_required" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      name: String(body.name).slice(0, 160),
      email: String(body.email).slice(0, 200),
      company: body.company ? String(body.company).slice(0, 160) : null,
      role: body.role ? String(body.role).slice(0, 160) : null,
      phone: body.phone ? String(body.phone).slice(0, 60) : null,
      message: body.message ? String(body.message).slice(0, 4000) : null,
      source: body.source ? String(body.source).slice(0, 40) : "manual",
      status: body.status ? String(body.status) : "nuevo",
      temperature: body.temperature ? String(body.temperature) : "media",
    },
  });

  return Response.json({ lead });
}
