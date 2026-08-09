import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

const sqls = [
  `CREATE TABLE IF NOT EXISTS "PracticeProfile" (
  id TEXT PRIMARY KEY,
  "cefrEstimate" TEXT,
  "weeklyGoal" INTEGER NOT NULL DEFAULT 3,
  "streakDays" INTEGER NOT NULL DEFAULT 0,
  "lastPracticeAt" TIMESTAMP(3),
  "dimensionTotals" JSONB,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS "PracticeSession" (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  "scenarioSlug" TEXT,
  difficulty TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  "opportunityId" TEXT,
  "scoreAvg" DOUBLE PRECISION,
  verdict TEXT,
  diagnosis TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3)
)`,
  `CREATE INDEX IF NOT EXISTS "PracticeSession_mode_idx" ON "PracticeSession"(mode)`,
  `CREATE INDEX IF NOT EXISTS "PracticeSession_status_idx" ON "PracticeSession"(status)`,
  `CREATE INDEX IF NOT EXISTS "PracticeSession_createdAt_idx" ON "PracticeSession"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "PracticeSession_opportunityId_idx" ON "PracticeSession"("opportunityId")`,
  `CREATE TABLE IF NOT EXISTS "PracticeTurn" (
  id TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL REFERENCES "PracticeSession"(id) ON DELETE CASCADE,
  idx INTEGER NOT NULL DEFAULT 0,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  feedback JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE INDEX IF NOT EXISTS "PracticeTurn_sessionId_idx" ON "PracticeTurn"("sessionId")`,
  `CREATE TABLE IF NOT EXISTS "PracticeDrillResult" (
  id TEXT PRIMARY KEY,
  "sessionId" TEXT REFERENCES "PracticeSession"(id) ON DELETE SET NULL,
  "questionId" TEXT NOT NULL,
  question TEXT NOT NULL,
  "chosenOption" TEXT NOT NULL,
  "correctOption" TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  explanation TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE INDEX IF NOT EXISTS "PracticeDrillResult_sessionId_idx" ON "PracticeDrillResult"("sessionId")`,
  `CREATE INDEX IF NOT EXISTS "PracticeDrillResult_correct_idx" ON "PracticeDrillResult"(correct)`,
  `CREATE INDEX IF NOT EXISTS "PracticeDrillResult_createdAt_idx" ON "PracticeDrillResult"("createdAt")`,
  `CREATE TABLE IF NOT EXISTS "PracticeScore" (
  id TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL REFERENCES "PracticeSession"(id) ON DELETE CASCADE,
  scores JSONB NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE INDEX IF NOT EXISTS "PracticeScore_sessionId_idx" ON "PracticeScore"("sessionId")`,
  `CREATE INDEX IF NOT EXISTS "PracticeScore_createdAt_idx" ON "PracticeScore"("createdAt")`,
  `CREATE TABLE IF NOT EXISTS "PracticeTermMastery" (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "seenCount" INTEGER NOT NULL DEFAULT 0,
  "correctCount" INTEGER NOT NULL DEFAULT 0,
  "lastScore" DOUBLE PRECISION,
  "masteredAt" TIMESTAMP(3),
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE(kind, "itemId")
)`,
  `CREATE INDEX IF NOT EXISTS "PracticeTermMastery_kind_idx" ON "PracticeTermMastery"(kind)`,
  `CREATE INDEX IF NOT EXISTS "PracticeTermMastery_masteredAt_idx" ON "PracticeTermMastery"("masteredAt")`,
];

async function main() {
  for (const s of sqls) {
    await p.$executeRawUnsafe(s);
  }
  console.log("Practice tables ready");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
