import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

/**
 * Cambia la password del admin sin tocar el corpus RAG.
 *
 * `prisma/seed.ts` reingesta el corpus con `reset: true`, asi que usarlo solo
 * para cambiar la password borra lo que hayas entrenado desde la consola.
 *
 * Uso:
 *   npx tsx scripts/set-admin-password.ts <password> [email]
 */
async function main() {
  const password = process.argv[2];
  const email = (
    process.argv[3] ||
    process.env.ADMIN_EMAIL ||
    ""
  ).toLowerCase().trim();

  if (!password || password.length < 12) {
    console.error("Uso: npx tsx scripts/set-admin-password.ts <password> [email]");
    console.error("La password debe tener al menos 12 caracteres.");
    process.exit(1);
  }
  if (!email) {
    console.error("Falta el email: pasalo como 2do argumento o define ADMIN_EMAIL.");
    process.exit(1);
  }

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: bcrypt.hashSync(password, 10) },
    create: { email, passwordHash: bcrypt.hashSync(password, 10) },
  });

  console.log(`Password actualizada para ${email}.`);
  console.log("Acuerdate de reflejar el cambio en ADMIN_PASSWORD del .env.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
