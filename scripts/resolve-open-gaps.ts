/**
 * Resuelve huecos abiertos con respuestas canónicas: corpus + training + reindex.
 * Uso: npx tsx scripts/resolve-open-gaps.ts
 * En VPS: dentro del contenedor app con DATABASE_URL y OPENAI_API_KEY.
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { answerForQuestion } from "../src/lib/gap-canonical-answers";
import {
  ensureCollection,
  reindexEntry,
  TRAINING_COLLECTION,
} from "../src/lib/corpus";
import { ingestCorpus } from "../src/lib/ingest";

async function resolveGap(
  gap: { id: string; question: string; audience: string | null },
  answer: string,
) {
  const collectionId = await ensureCollection(
    TRAINING_COLLECTION.slug,
    TRAINING_COLLECTION.name,
  );

  const entry = await prisma.knowledgeEntry.create({
    data: {
      collectionId,
      title: gap.question.slice(0, 160),
      content: `Pregunta: ${gap.question}\n\nRespuesta: ${answer}`,
      sourceType: "manual",
      sourceRef: `hueco:${gap.id}`,
      lang: "es",
      trustTier: "canonical",
    },
  });

  let chunks = 0;
  try {
    chunks = await reindexEntry(entry.id);
  } catch (err) {
    console.error(`Reindex falló para ${gap.id}:`, err);
  }

  await prisma.trainingExample.create({
    data: {
      question: gap.question,
      answer,
      audience: gap.audience || "desconocido",
      source: "correccion",
      approved: true,
    },
  });

  await prisma.knowledgeGap.update({
    where: { id: gap.id },
    data: { status: "resuelto", answer, entryId: entry.id },
  });

  return chunks;
}

async function main() {
  const skipIngest = process.argv.includes("--skip-ingest");
  const dryRun = process.argv.includes("--dry-run");

  const gaps = await prisma.knowledgeGap.findMany({
    where: { status: "abierto" },
    orderBy: [{ hits: "desc" }, { createdAt: "desc" }],
  });

  console.log(`Huecos abiertos: ${gaps.length}`);

  let matched = 0;
  let unresolved: string[] = [];

  for (const gap of gaps) {
    const found = answerForQuestion(gap.question);
    if (!found) {
      unresolved.push(gap.question.slice(0, 100));
      continue;
    }
    matched++;
    if (dryRun) {
      console.log(`[dry] ${found.title}`);
      continue;
    }
    const chunks = await resolveGap(gap, found.answer);
    console.log(`OK ${gap.id.slice(0, 8)}… chunks=${chunks} — ${found.title}`);
  }

  console.log(`Emparejados: ${matched}/${gaps.length}`);
  if (unresolved.length) {
    console.log("Sin respuesta canónica:");
    for (const q of unresolved) console.log(`  - ${q}`);
  }

  if (!dryRun && !skipIngest) {
    console.log("Reingesta corpus base (incluye FAQs de huecos)...");
    const result = await ingestCorpus({ reset: false });
    console.log(
      `Corpus: colecciones=${result.collections} chunks_nuevos_base≈${result.chunks}`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
