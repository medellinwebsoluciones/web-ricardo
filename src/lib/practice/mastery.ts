import { prisma } from "@/lib/prisma";
import type { StudyKind } from "./types";

const MASTER_THRESHOLD = 3;

export async function recordMastery(params: {
  kind: StudyKind;
  itemId: string;
  correct: boolean;
  score?: number;
}) {
  const existing = await prisma.practiceTermMastery.findUnique({
    where: {
      kind_itemId: { kind: params.kind, itemId: params.itemId },
    },
  });

  const seenCount = (existing?.seenCount ?? 0) + 1;
  const correctCount = (existing?.correctCount ?? 0) + (params.correct ? 1 : 0);
  const masteredAt =
    existing?.masteredAt ??
    (correctCount >= MASTER_THRESHOLD && params.correct
      ? new Date()
      : null);

  return prisma.practiceTermMastery.upsert({
    where: {
      kind_itemId: { kind: params.kind, itemId: params.itemId },
    },
    create: {
      kind: params.kind,
      itemId: params.itemId,
      seenCount: 1,
      correctCount: params.correct ? 1 : 0,
      lastScore: params.score ?? (params.correct ? 100 : 0),
      masteredAt: params.correct && MASTER_THRESHOLD <= 1 ? new Date() : null,
      lastSeenAt: new Date(),
    },
    update: {
      seenCount,
      correctCount,
      lastScore: params.score ?? (params.correct ? 100 : 0),
      masteredAt: masteredAt ?? undefined,
      lastSeenAt: new Date(),
    },
  });
}

export async function masteryStats() {
  const rows = await prisma.practiceTermMastery.findMany();
  const byKind = (kind: StudyKind) => {
    const subset = rows.filter((r) => r.kind === kind);
    const mastered = subset.filter((r) => r.masteredAt).length;
    return {
      tracked: subset.length,
      mastered,
      pct: subset.length
        ? Math.round((mastered / subset.length) * 100)
        : 0,
    };
  };
  return {
    term: byKind("term"),
    acronym: byKind("acronym"),
    phrase: byKind("phrase"),
    script: byKind("script"),
    weak: rows
      .filter((r) => !r.masteredAt && r.seenCount > 0)
      .sort(
        (a, b) =>
          a.correctCount / Math.max(1, a.seenCount) -
          b.correctCount / Math.max(1, b.seenCount),
      )
      .slice(0, 12)
      .map((r) => ({
        kind: r.kind,
        itemId: r.itemId,
        seenCount: r.seenCount,
        correctCount: r.correctCount,
        lastScore: r.lastScore,
      })),
  };
}
