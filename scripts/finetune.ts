import "dotenv/config";
import { writeFile, unlink } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import OpenAI from "openai";
import { prisma } from "../src/lib/prisma";
import { MIN_EXAMPLES, buildJsonl } from "../src/lib/finetune";

/**
 * Sube el dataset y lanza el job de fine-tuning.
 *
 * Uso:
 *   npm run agent:finetune -- --dry-run     solo escribe el JSONL y lo valida
 *   npm run agent:finetune                  sube el archivo y lanza el job
 *   npm run agent:finetune -- --status <id> consulta un job en curso
 *
 * El modelo resultante se pega en `AgentPromptVersion.model` desde el panel:
 * así se puede comparar en las evaluaciones contra la versión base antes de
 * ponerlo en producción.
 */

const BASE_MODEL = process.env.FINETUNE_BASE_MODEL || "gpt-4o-mini-2024-07-18";

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const statusIdx = args.indexOf("--status");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Falta OPENAI_API_KEY");
  const client = new OpenAI({ apiKey });

  if (statusIdx !== -1) {
    const jobId = args[statusIdx + 1];
    if (!jobId) throw new Error("Uso: --status <job_id>");
    const job = await client.fineTuning.jobs.retrieve(jobId);
    console.log(`Estado: ${job.status}`);
    console.log(`Modelo base: ${job.model}`);
    console.log(`Modelo resultante: ${job.fine_tuned_model ?? "(aún no)"}`);
    if (job.error?.message) console.log(`Error: ${job.error.message}`);
    return;
  }

  const { jsonl, count } = await buildJsonl();
  console.log(`Ejemplos aprobados: ${count}`);

  if (count < MIN_EXAMPLES) {
    console.error(
      `Insuficientes. Hacen falta al menos ${MIN_EXAMPLES}: por debajo de eso el fine-tuning rinde peor que meter los ejemplos en el prompt.`,
    );
    console.error(
      "Produce más desde el simulador y las evaluaciones del panel, y apruébalos en la pestaña Fine-tuning.",
    );
    process.exit(1);
  }

  const path = join(tmpdir(), `ricardo-finetune-${Date.now()}.jsonl`);
  await writeFile(path, jsonl, "utf8");
  console.log(`JSONL escrito en ${path}`);

  if (dryRun) {
    console.log("--dry-run: no se sube nada. Revisa el archivo y vuelve a lanzar.");
    return;
  }

  try {
    const file = await client.files.create({
      file: createReadStream(path),
      purpose: "fine-tune",
    });
    console.log(`Archivo subido: ${file.id}`);

    const job = await client.fineTuning.jobs.create({
      training_file: file.id,
      model: BASE_MODEL,
      suffix: "ricardo",
    });

    console.log(`Job lanzado: ${job.id} (estado: ${job.status})`);
    console.log(
      `Sigue el progreso con: npm run agent:finetune -- --status ${job.id}`,
    );
    console.log(
      "Cuando termine, pega el modelo resultante en la versión de persona del panel y corre las suites antes de activarlo.",
    );
  } finally {
    await unlink(path).catch(() => {});
  }
}

main()
  .catch((e) => {
    console.error("Error en fine-tuning:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
