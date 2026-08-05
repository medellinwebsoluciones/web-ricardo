import { prisma } from "@/lib/prisma";
import {
  OpportunitiesBoard,
  type OpportunityRow,
} from "@/components/admin/OpportunitiesBoard";

export const dynamic = "force-dynamic";

export default async function OportunidadesPage() {
  const opps = await prisma.opportunity.findMany({
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

  const rows: OpportunityRow[] = opps.map((o) => ({
    id: o.id,
    company: o.company,
    role: o.role,
    type: o.type,
    location: o.location,
    remote: o.remote,
    url: o.url,
    salaryRange: o.salaryRange,
    stage: o.stage,
    priority: o.priority,
    matchScore: o.matchScore,
    matchGaps: o.matchGaps,
    jobDescription: o.jobDescription,
    nextAction: o.nextAction,
    nextActionAt: o.nextActionAt?.toISOString() ?? null,
    notes: o.notes,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    events: o.events.map((e) => ({
      id: e.id,
      type: e.type,
      note: e.note,
      at: e.at.toISOString(),
    })),
    assets: o.assets.map((a) => ({
      id: a.id,
      kind: a.kind,
      title: a.title,
      createdAt: a.createdAt.toISOString(),
    })),
  }));

  return <OpportunitiesBoard initial={rows} />;
}
