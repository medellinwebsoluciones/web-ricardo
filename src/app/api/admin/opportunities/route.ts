import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const opportunities = await prisma.opportunity.findMany({
    orderBy: { updatedAt: "desc" },
    take: 300,
    include: {
      events: { orderBy: { at: "desc" }, take: 20 },
      assets: {
        orderBy: { createdAt: "desc" },
        select: { id: true, kind: true, title: true, createdAt: true },
      },
    },
  });

  return Response.json({ opportunities });
}

export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const company = String(body?.company || "").trim();
  const role = String(body?.role || "").trim();
  if (!company || !role) {
    return Response.json({ error: "company_role_required" }, { status: 400 });
  }

  const opportunity = await prisma.opportunity.create({
    data: {
      company: company.slice(0, 200),
      role: role.slice(0, 200),
      type: ["fijo-remoto", "consultoria", "freelance"].includes(body?.type)
        ? body.type
        : "fijo-remoto",
      location: body?.location ? String(body.location).slice(0, 160) : null,
      remote: body?.remote !== false,
      url: body?.url ? String(body.url).slice(0, 500) : null,
      salaryRange: body?.salaryRange ? String(body.salaryRange).slice(0, 120) : null,
      priority: ["alta", "media", "baja"].includes(body?.priority)
        ? body.priority
        : "media",
      jobDescription: body?.jobDescription
        ? String(body.jobDescription).slice(0, 20000)
        : null,
      notes: body?.notes ? String(body.notes).slice(0, 4000) : null,
      events: { create: { type: "creada", note: "Oportunidad registrada" } },
    },
    include: { events: true, assets: true },
  });

  return Response.json({ opportunity });
}
