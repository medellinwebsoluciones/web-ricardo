import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { MIN_EXAMPLES } from "../src/lib/finetune";
import {
  getFineTuneJobStatus,
  launchFineTuneJob,
} from "../src/lib/finetune-jobs";

/**
 * Sube el dataset y lanza el job de fine-tuning (misma lib que el panel).
 *
 *   npm run agent:finetune -- --dry-run     solo escribe el JSONL y lo valida
 *   npm run agent:finetune                  sube el archivo y lanza el job
 *   npm run agent:finetune -- --status <id> consulta un job en curso
 */

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const statusIdx = args.indexOf("--status");

  if (!process.env.OPENAI_API_KEY) throw new Error("Falta OPENAI_API_KEY");

  if (statusIdx !== -1) {
    const jobId = args[statusIdx + 1];
    if (!jobId) throw new Error("Uso: --status <job_id>");
    const job = await getFineTuneJobStatus(jobId);
    console.log(`Estado: ${job.status}`);
    console.log(`Modelo base: ${job.baseModel}`);
    console.log(`Modelo resultante: ${job.fineTunedModel ?? "(aún no)"}`);
    if (job.error) console.log(`Error: ${job.error}`);
    return;
  }

  try {
    const result = await launchFineTuneJob({ dryRun });
    if (result.dryRun) {
      console.log(`Ejemplos aprobados: ${result.count}`);
      console.log(`JSONL escrito en ${result.path}`);
      console.log("--dry-run: no se sube nada. Revisa el archivo y vuelve a lanzar.");
      return;
    }
    console.log(`Ejemplos aprobados: ${result.count}`);
    console.log(
      `Job lanzado: ${result.job.openaiJobId} (estado: ${result.job.status})`,
    );
    console.log(
      `Sigue el progreso con: npm run agent:finetune -- --status ${result.job.openaiJobId}`,
    );
    console.log(
      "Cuando termine, aplícalo desde la pestaña Entrenamiento (o pega el modelo en Persona) y corre las suites.",
    );
  } catch (e) {
    const err = e as Error & { count?: number; required?: number };
    if (err.message === "not_enough_examples") {
      console.error(
        `Insuficientes. Hacen falta al menos ${err.required ?? MIN_EXAMPLES}: hay ${err.count ?? 0}.`,
      );
      console.error(
        "Produce más desde el simulador y las evaluaciones del panel, y apruébalos en Entrenamiento.",
      );
      process.exit(1);
    }
    if (err.message === "job_already_running") {
      console.error("Ya hay un job de fine-tuning en curso. Espera a que termine.");
      process.exit(1);
    }
    throw e;
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
