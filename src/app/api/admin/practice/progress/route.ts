import { denyIfNotAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { masteryStats } from "@/lib/practice/mastery";
import {
  ACRONYMS,
  GLOSSARY_TERMS,
  PHRASES,
  WORKPLACE_SCRIPTS,
} from "@/lib/practice";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const [mastery, sessions, scores, drills, profile] = await Promise.all([
    masteryStats(),
    prisma.practiceSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.practiceScore.findMany({
      orderBy: { createdAt: "asc" },
      take: 200,
      select: { score: true, scores: true, createdAt: true, sessionId: true },
    }),
    prisma.practiceDrillResult.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.practiceProfile.findFirst(),
  ]);

  const byWeek = new Map<string, { sum: number; n: number }>();
  for (const s of scores) {
    const d = new Date(s.createdAt);
    const key = `${d.getUTCFullYear()}-W${Math.ceil(d.getUTCDate() / 7)}-${d.getUTCMonth()}`;
    const cur = byWeek.get(key) || { sum: 0, n: 0 };
    cur.sum += s.score;
    cur.n += 1;
    byWeek.set(key, cur);
  }

  const weekSeries = [...byWeek.entries()].map(([week, v]) => ({
    week,
    avg: Math.round((v.sum / v.n) * 10) / 10,
  }));

  const dimAcc: Record<string, { sum: number; n: number }> = {};
  for (const s of scores) {
    const sc = s.scores as Record<string, number>;
    for (const [k, v] of Object.entries(sc)) {
      if (typeof v !== "number") continue;
      dimAcc[k] = dimAcc[k] || { sum: 0, n: 0 };
      dimAcc[k]!.sum += v;
      dimAcc[k]!.n += 1;
    }
  }
  const dimensions = Object.fromEntries(
    Object.entries(dimAcc).map(([k, v]) => [
      k,
      Math.round((v.sum / v.n) * 10) / 10,
    ]),
  );

  return Response.json({
    profile: profile
      ? {
          cefrEstimate: profile.cefrEstimate,
          weeklyGoal: profile.weeklyGoal,
          streakDays: profile.streakDays,
          lastPracticeAt: profile.lastPracticeAt?.toISOString() ?? null,
        }
      : { cefrEstimate: null, weeklyGoal: 3, streakDays: 0, lastPracticeAt: null },
    mastery,
    catalogSizes: {
      terms: GLOSSARY_TERMS.length,
      acronyms: ACRONYMS.length,
      phrases: PHRASES.length,
      scripts: WORKPLACE_SCRIPTS.length,
    },
    weekSeries,
    dimensions,
    recentSessions: sessions.map((s) => ({
      id: s.id,
      mode: s.mode,
      locale: s.locale,
      status: s.status,
      scoreAvg: s.scoreAvg,
      verdict: s.verdict,
      scenarioSlug: s.scenarioSlug,
      createdAt: s.createdAt.toISOString(),
    })),
    recentDrills: drills.map((d) => ({
      id: d.id,
      correct: d.correct,
      question: d.question,
      tags: d.tags,
      createdAt: d.createdAt.toISOString(),
    })),
    drillAccuracy:
      drills.length === 0
        ? null
        : Math.round(
            (drills.filter((d) => d.correct).length / drills.length) * 100,
          ),
  });
}

export async function PATCH(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = (await req.json()) as {
    weeklyGoal?: number;
    cefrEstimate?: string;
  };

  const existing = await prisma.practiceProfile.findFirst();
  const data = {
    weeklyGoal: body.weeklyGoal ?? existing?.weeklyGoal ?? 3,
    cefrEstimate: body.cefrEstimate ?? existing?.cefrEstimate ?? null,
    updatedAt: new Date(),
  };

  const profile = existing
    ? await prisma.practiceProfile.update({
        where: { id: existing.id },
        data,
      })
    : await prisma.practiceProfile.create({
        data: {
          id: crypto.randomUUID(),
          ...data,
        },
      });

  return Response.json({
    id: profile.id,
    weeklyGoal: profile.weeklyGoal,
    cefrEstimate: profile.cefrEstimate,
  });
}
