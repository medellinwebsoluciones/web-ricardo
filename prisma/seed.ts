import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { ingestCorpus } from "../src/lib/ingest";

function resolveAdminPasswordHash(): string {
  // Preferir password en claro (más fiable en Docker Compose; evita pelearse con $).
  const plain = process.env.ADMIN_PASSWORD?.trim();
  if (plain) {
    console.log("Admin password desde ADMIN_PASSWORD.");
    return bcrypt.hashSync(plain, 10);
  }

  // Limpia escapes típicos de dotenv / Compose (\$ o $$ residual).
  const raw = (process.env.ADMIN_PASSWORD_HASH || "")
    .trim()
    .replace(/\\\$/g, "$");
  if (raw.startsWith("$2")) return raw;

  const fallback = "cambia-esto-2026";
  console.log(
    `ADMIN_PASSWORD / HASH no válidos. Se creó admin con password: "${fallback}" (cámbialo).`,
  );
  return bcrypt.hashSync(fallback, 10);
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "ricki5789@gmail.com").toLowerCase();
  const passwordHash = resolveAdminPasswordHash();

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`Admin listo: ${email}`);
}

async function main() {
  await seedAdmin();

  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.log(
      "OPENAI_API_KEY vacío: se omite ingesta RAG (admin OK). Añade la clave y corre `npm run db:seed` o reinicia con RUN_SEED=1.",
    );
    return;
  }

  console.log("Ingestando corpus de conocimiento...");
  const result = await ingestCorpus({ reset: true });
  console.log(
    `Corpus listo. Colecciones: ${result.collections}, chunks: ${result.chunks}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
