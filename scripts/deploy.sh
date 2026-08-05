#!/usr/bin/env bash
# Despliegue en el VPS (Docker Engine + Compose). Uso:
#   ./scripts/deploy.sh           # build + up
#   RUN_SEED=1 ./scripts/deploy.sh  # primera vez / re-seed
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "Falta .env — copia .env.example y completa secretos/URLs."
  exit 1
fi

export RUN_SEED="${RUN_SEED:-0}"
docker compose up -d --build
docker compose ps
echo "OK → app en 127.0.0.1:3000 (pon Nginx delante)."
