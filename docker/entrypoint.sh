#!/bin/sh
set -e

echo "[entrypoint] Esperando a Postgres..."
node <<'NODE'
const net = require("net");
const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error("DATABASE_URL no definido");
  process.exit(1);
}
const u = new URL(raw);
const host = u.hostname;
const port = Number(u.port || 5432);
let attempt = 0;
const max = 60;

function tryConnect() {
  attempt += 1;
  const socket = net.connect({ host, port }, () => {
    socket.end();
    console.log(`[entrypoint] DB lista en ${host}:${port}`);
    process.exit(0);
  });
  socket.on("error", () => {
    if (attempt >= max) {
      console.error(`[entrypoint] Timeout esperando DB (${host}:${port})`);
      process.exit(1);
    }
    setTimeout(tryConnect, 1000);
  });
}
tryConnect();
NODE

echo "[entrypoint] Preparando almacenamiento de documentos en ${UPLOAD_DIR:-/app/storage/uploads}..."
mkdir -p "${UPLOAD_DIR:-/app/storage/uploads}"

echo "[entrypoint] Aplicando esquema (prisma db push)..."
npx prisma db push --skip-generate --accept-data-loss

if [ "${RUN_SEED:-0}" = "1" ]; then
  echo "[entrypoint] Ejecutando seed (admin + corpus RAG si hay OPENAI_API_KEY)..."
  npx tsx prisma/seed.ts || echo "[entrypoint] seed falló (continuando arranque)."
fi

echo "[entrypoint] Iniciando Next.js en :${PORT:-3000}..."
exec npx next start -p "${PORT:-3000}" -H 0.0.0.0
