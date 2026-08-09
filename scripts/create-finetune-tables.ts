/**
 * Asegura columnas nuevas de TrainingExample y la tabla FineTuneJob.
 * Uso: npx tsx scripts/create-finetune-tables.ts
 */
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

const sqls = [
  `ALTER TABLE "TrainingExample" ADD COLUMN IF NOT EXISTS "rejectedAnswer" TEXT`,
  `ALTER TABLE "TrainingExample" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[]`,
  `ALTER TABLE "TrainingExample" ADD COLUMN IF NOT EXISTS "notes" TEXT`,
  `ALTER TABLE "TrainingExample" ADD COLUMN IF NOT EXISTS "quality" INTEGER`,
  `ALTER TABLE "TrainingExample" ADD COLUMN IF NOT EXISTS "simulationRunId" TEXT`,
  `ALTER TABLE "TrainingExample" ADD COLUMN IF NOT EXISTS "evalResultId" TEXT`,
  `CREATE INDEX IF NOT EXISTS "TrainingExample_simulationRunId_idx" ON "TrainingExample"("simulationRunId")`,
  `CREATE INDEX IF NOT EXISTS "TrainingExample_evalResultId_idx" ON "TrainingExample"("evalResultId")`,
  `CREATE TABLE IF NOT EXISTS "FineTuneJob" (
  id TEXT PRIMARY KEY,
  "openaiJobId" TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  "baseModel" TEXT NOT NULL,
  "fineTunedModel" TEXT,
  "fileId" TEXT,
  "exampleCount" INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  "promptVersionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3)
)`,
  `CREATE INDEX IF NOT EXISTS "FineTuneJob_status_idx" ON "FineTuneJob"(status)`,
  `CREATE INDEX IF NOT EXISTS "FineTuneJob_createdAt_idx" ON "FineTuneJob"("createdAt")`,
];

async function main() {
  for (const sql of sqls) {
    await p.$executeRawUnsafe(sql);
    console.log("OK:", sql.split("\n")[0].slice(0, 80));
  }
  console.log("Fine-tune tables ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
