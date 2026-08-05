import "dotenv/config";
import { ingestCorpus } from "../src/lib/ingest";
import { prisma } from "../src/lib/prisma";

async function main() {
  const reset = process.argv.includes("--reset");
  console.log(`Ingestando corpus base${reset ? " (reset)" : ""}...`);
  const result = await ingestCorpus({ reset });
  console.log(
    `Listo. Colecciones: ${result.collections}, chunks embebidos: ${result.chunks}`,
  );
}

main()
  .catch((e) => {
    console.error("Error en ingesta:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
