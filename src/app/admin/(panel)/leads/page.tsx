import { prisma } from "@/lib/prisma";
import { LeadsBoard, type LeadRow } from "@/components/admin/LeadsBoard";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { notes: { orderBy: { createdAt: "desc" } } },
  });

  const rows: LeadRow[] = leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    company: l.company,
    role: l.role,
    phone: l.phone,
    message: l.message,
    source: l.source,
    locale: l.locale,
    status: l.status,
    temperature: l.temperature,
    value: l.value,
    nextAction: l.nextAction,
    nextActionAt: l.nextActionAt?.toISOString() ?? null,
    lastContactedAt: l.lastContactedAt?.toISOString() ?? null,
    aiSummary: l.aiSummary,
    tags: l.tags,
    createdAt: l.createdAt.toISOString(),
    notes: l.notes.map((n) => ({
      id: n.id,
      body: n.body,
      createdAt: n.createdAt.toISOString(),
    })),
  }));

  return <LeadsBoard initialLeads={rows} />;
}
