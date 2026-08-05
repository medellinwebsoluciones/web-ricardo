import { prisma } from "./prisma";

export type DailyPoint = { date: string; value: number };

export type Metrics = {
  days: number;
  totals: {
    visits: number;
    pageViews: number;
    avgDwellSec: number;
    avgScrollPct: number;
    chatSessions: number;
    chatMessages: number;
    leads: number;
    appointments: number;
    upcomingAppointments: number;
    tokens: number;
    costUsd: number;
  };
  funnel: {
    visits: number;
    chats: number;
    leads: number;
    appointments: number;
    won: number;
  };
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  topQuestions: { content: string; createdAt: string }[];
  upcoming: {
    id: string;
    name: string;
    email: string;
    scheduledAt: string;
    meetLink: string | null;
    topic: string | null;
  }[];
  pipeline: {
    opportunitiesByStage: { stage: string; count: number }[];
    dueSoon: {
      id: string;
      kind: "lead" | "opportunity";
      label: string;
      nextAction: string | null;
      nextActionAt: string;
    }[];
  };
  series: {
    visits: DailyPoint[];
    leads: DailyPoint[];
    cost: DailyPoint[];
    chats: DailyPoint[];
    appointments: DailyPoint[];
  };
};

export type PageAnalytics = {
  days: number;
  topPaths: {
    path: string;
    views: number;
    avgDwellSec: number;
    avgScrollPct: number;
  }[];
  topReferrers: { referrer: string; count: number }[];
  utm: { source: string; medium: string; campaign: string; count: number }[];
  byLocale: { locale: string; count: number }[];
  landingPaths: { path: string; count: number }[];
  series: { views: DailyPoint[] };
  totals: {
    pageViews: number;
    uniqueVisitors: number;
    avgDwellSec: number;
    avgScrollPct: number;
  };
};

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function emptySeries(days: number): DailyPoint[] {
  const out: DailyPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push({ date: dayKey(d), value: 0 });
  }
  return out;
}

function bucket(dates: Date[], days: number): DailyPoint[] {
  const series = emptySeries(days);
  const index = new Map(series.map((p, i) => [p.date, i]));
  for (const d of dates) {
    const i = index.get(dayKey(d));
    if (i !== undefined) series[i].value += 1;
  }
  return series;
}

function sinceDate(days: number): Date {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return since;
}

export async function getMetrics(days = 14): Promise<Metrics> {
  const since = sinceDate(days);
  const now = new Date();

  const [
    visits,
    pageAgg,
    chatSessions,
    chatMessages,
    leads,
    appointments,
    upcomingCount,
    usageAgg,
    leadsGrouped,
    leadsByStatusGrouped,
    topQuestionsRows,
    upcomingRows,
    visitRows,
    leadRows,
    usageRows,
    chatRows,
    apptRows,
    wonLeads,
    oppByStage,
    dueLeads,
    dueOpps,
  ] = await Promise.all([
    prisma.visitSession.count({ where: { firstSeenAt: { gte: since } } }),
    prisma.pageHit.aggregate({
      where: { createdAt: { gte: since } },
      _avg: { dwellMs: true, scrollPct: true },
      _count: true,
    }),
    prisma.chatSession.count({
      where: { createdAt: { gte: since }, channel: "site" },
    }),
    prisma.chatMessage.count({ where: { createdAt: { gte: since } } }),
    prisma.lead.count({ where: { createdAt: { gte: since } } }),
    prisma.appointment.count({ where: { createdAt: { gte: since } } }),
    prisma.appointment.count({
      where: {
        scheduledAt: { gte: now },
        status: { in: ["confirmed", "pending"] },
      },
    }),
    prisma.apiUsage.aggregate({
      where: { createdAt: { gte: since } },
      _sum: { totalTokens: true, costUsd: true },
    }),
    prisma.lead.groupBy({ by: ["source"], _count: { source: true } }),
    prisma.lead.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.chatMessage.findMany({
      where: { role: "user" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { content: true, createdAt: true },
    }),
    prisma.appointment.findMany({
      where: {
        scheduledAt: { gte: now },
        status: { in: ["confirmed", "pending"] },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        scheduledAt: true,
        meetLink: true,
        topic: true,
      },
    }),
    prisma.visitSession.findMany({
      where: { firstSeenAt: { gte: since } },
      select: { firstSeenAt: true },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.apiUsage.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, costUsd: true },
    }),
    prisma.chatSession.findMany({
      where: { createdAt: { gte: since }, channel: "site" },
      select: { createdAt: true },
    }),
    prisma.appointment.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.lead.count({ where: { status: "ganado", createdAt: { gte: since } } }),
    prisma.opportunity.groupBy({ by: ["stage"], _count: { stage: true } }),
    prisma.lead.findMany({
      where: { nextActionAt: { not: null } },
      orderBy: { nextActionAt: "asc" },
      take: 8,
      select: { id: true, name: true, company: true, nextAction: true, nextActionAt: true },
    }),
    prisma.opportunity.findMany({
      where: { nextActionAt: { not: null } },
      orderBy: { nextActionAt: "asc" },
      take: 8,
      select: { id: true, company: true, role: true, nextAction: true, nextActionAt: true },
    }),
  ]);

  const costSeries = emptySeries(days);
  const costIndex = new Map(costSeries.map((p, i) => [p.date, i]));
  for (const u of usageRows) {
    const i = costIndex.get(dayKey(u.createdAt));
    if (i !== undefined) costSeries[i].value += u.costUsd;
  }
  costSeries.forEach((p) => (p.value = Number(p.value.toFixed(4))));

  const dueSoon = [
    ...dueLeads.map((l) => ({
      id: l.id,
      kind: "lead" as const,
      label: l.company ? `${l.name} · ${l.company}` : l.name,
      nextAction: l.nextAction,
      nextActionAt: l.nextActionAt!.toISOString(),
    })),
    ...dueOpps.map((o) => ({
      id: o.id,
      kind: "opportunity" as const,
      label: `${o.role} · ${o.company}`,
      nextAction: o.nextAction,
      nextActionAt: o.nextActionAt!.toISOString(),
    })),
  ]
    .sort((a, b) => a.nextActionAt.localeCompare(b.nextActionAt))
    .slice(0, 8);

  return {
    days,
    totals: {
      visits,
      pageViews: pageAgg._count || 0,
      avgDwellSec: Math.round((pageAgg._avg.dwellMs || 0) / 1000),
      avgScrollPct: Math.round(pageAgg._avg.scrollPct || 0),
      chatSessions,
      chatMessages,
      leads,
      appointments,
      upcomingAppointments: upcomingCount,
      tokens: usageAgg._sum.totalTokens || 0,
      costUsd: Number((usageAgg._sum.costUsd || 0).toFixed(4)),
    },
    funnel: {
      visits,
      chats: chatSessions,
      leads,
      appointments,
      won: wonLeads,
    },
    leadsBySource: leadsGrouped.map((g) => ({
      source: g.source,
      count: g._count.source,
    })),
    leadsByStatus: leadsByStatusGrouped.map((g) => ({
      status: g.status,
      count: g._count.status,
    })),
    topQuestions: topQuestionsRows.map((q) => ({
      content: q.content,
      createdAt: q.createdAt.toISOString(),
    })),
    upcoming: upcomingRows.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      scheduledAt: a.scheduledAt.toISOString(),
      meetLink: a.meetLink,
      topic: a.topic,
    })),
    pipeline: {
      opportunitiesByStage: oppByStage.map((g) => ({
        stage: g.stage,
        count: g._count.stage,
      })),
      dueSoon,
    },
    series: {
      visits: bucket(
        visitRows.map((v) => v.firstSeenAt),
        days,
      ),
      leads: bucket(
        leadRows.map((l) => l.createdAt),
        days,
      ),
      cost: costSeries,
      chats: bucket(
        chatRows.map((c) => c.createdAt),
        days,
      ),
      appointments: bucket(
        apptRows.map((a) => a.createdAt),
        days,
      ),
    },
  };
}

/**
 * Analítica por página / origen. Consultas agregadas sobre PageHit y VisitSession.
 */
export async function getPageAnalytics(days = 14): Promise<PageAnalytics> {
  const since = sinceDate(days);

  const [pathRows, referrerRows, utmRows, localeRows, landingRows, hitRows, agg, uniques] =
    await Promise.all([
      prisma.pageHit.groupBy({
        by: ["path"],
        where: { createdAt: { gte: since } },
        _count: { path: true },
        _avg: { dwellMs: true, scrollPct: true },
        orderBy: { _count: { path: "desc" } },
        take: 20,
      }),
      prisma.visitSession.groupBy({
        by: ["referrer"],
        where: { firstSeenAt: { gte: since } },
        _count: { referrer: true },
        orderBy: { _count: { referrer: "desc" } },
        take: 12,
      }),
      prisma.visitSession.groupBy({
        by: ["utmSource", "utmMedium", "utmCampaign"],
        where: { firstSeenAt: { gte: since }, utmSource: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { utmSource: "desc" } },
        take: 12,
      }),
      prisma.pageHit.groupBy({
        by: ["locale"],
        where: { createdAt: { gte: since } },
        _count: { locale: true },
      }),
      prisma.visitSession.groupBy({
        by: ["landingPath"],
        where: { firstSeenAt: { gte: since } },
        _count: { landingPath: true },
        orderBy: { _count: { landingPath: "desc" } },
        take: 10,
      }),
      prisma.pageHit.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.pageHit.aggregate({
        where: { createdAt: { gte: since } },
        _avg: { dwellMs: true, scrollPct: true },
        _count: true,
      }),
      prisma.visitSession.count({ where: { firstSeenAt: { gte: since } } }),
    ]);

  return {
    days,
    topPaths: pathRows.map((r) => ({
      path: r.path,
      views: r._count.path,
      avgDwellSec: Math.round((r._avg.dwellMs || 0) / 1000),
      avgScrollPct: Math.round(r._avg.scrollPct || 0),
    })),
    topReferrers: referrerRows.map((r) => ({
      referrer: r.referrer || "directo",
      count: r._count.referrer,
    })),
    utm: utmRows.map((r) => ({
      source: r.utmSource || "-",
      medium: r.utmMedium || "-",
      campaign: r.utmCampaign || "-",
      count: r._count._all,
    })),
    byLocale: localeRows.map((r) => ({
      locale: r.locale || "n/d",
      count: r._count.locale,
    })),
    landingPaths: landingRows.map((r) => ({
      path: r.landingPath,
      count: r._count.landingPath,
    })),
    series: { views: bucket(hitRows.map((h) => h.createdAt), days) },
    totals: {
      pageViews: agg._count || 0,
      uniqueVisitors: uniques,
      avgDwellSec: Math.round((agg._avg.dwellMs || 0) / 1000),
      avgScrollPct: Math.round(agg._avg.scrollPct || 0),
    },
  };
}
