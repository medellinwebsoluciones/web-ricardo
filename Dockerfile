# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl wget
WORKDIR /app

# ---- Dependencias ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npx next build

# ---- Runner ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Biblioteca de documentos del panel (volumen app_uploads en compose).
ENV UPLOAD_DIR=/app/storage/uploads

# App completa: permite `prisma db push` + seed (tsx) en el entrypoint.
COPY --from=builder /app ./
RUN mkdir -p /app/storage/uploads

EXPOSE 3000
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
  && sed -i 's/\r$//' /entrypoint.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3000/es >/dev/null || exit 1

ENTRYPOINT ["/entrypoint.sh"]
