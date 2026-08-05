import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return lines.join("\n");
}

const iso = (d: Date | null) => (d ? d.toISOString() : "");

export async function GET(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const type = req.nextUrl.searchParams.get("type") || "leads";
  let rows: Record<string, unknown>[] = [];

  if (type === "appointments") {
    const appts = await prisma.appointment.findMany({
      orderBy: { scheduledAt: "desc" },
    });
    rows = appts.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      topic: a.topic,
      scheduledAt: iso(a.scheduledAt),
      durationMin: a.durationMin,
      timezone: a.timezone,
      status: a.status,
      meetLink: a.meetLink,
      createdAt: iso(a.createdAt),
    }));
  } else if (type === "opportunities") {
    const opps = await prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" },
    });
    rows = opps.map((o) => ({
      id: o.id,
      company: o.company,
      role: o.role,
      type: o.type,
      location: o.location,
      remote: o.remote,
      stage: o.stage,
      priority: o.priority,
      matchScore: o.matchScore,
      salaryRange: o.salaryRange,
      url: o.url,
      nextAction: o.nextAction,
      nextActionAt: iso(o.nextActionAt),
      createdAt: iso(o.createdAt),
    }));
  } else {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { notes: { orderBy: { createdAt: "asc" } } },
    });
    rows = leads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      company: l.company,
      role: l.role,
      phone: l.phone,
      status: l.status,
      temperature: l.temperature,
      value: l.value,
      source: l.source,
      locale: l.locale,
      message: l.message,
      aiSummary: l.aiSummary,
      tags: l.tags.join(" | "),
      notes: l.notes.map((n) => n.body).join(" || "),
      nextAction: l.nextAction,
      nextActionAt: iso(l.nextActionAt),
      lastContactedAt: iso(l.lastContactedAt),
      createdAt: iso(l.createdAt),
    }));
  }

  const csv = toCsv(rows);
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
