# Plataforma Ricardo Zuluaga

App única y autocontenida (Next.js App Router + TypeScript) que funciona como:

- **Landing boutique bilingüe (ES/EN)** con SEO agresivo (hreflang, JSON-LD, sitemap, OG).
- **Agente IA "Pregúntale a Ricardo"**: chat con persona + RAG (pgvector) grounded con guardrails.
- **Agendamiento con Google Meet**: disponibilidad real + evento en Google Calendar con link de Meet + email de confirmación.
- **Formulario de contacto** con anti-spam (honeypot + rate-limit).
- **Consola de administración** (NextAuth) con 8 módulos: overview, leads, agenda, analytics, entrenador del agente, documentos, oportunidades y generador IA.

Todo en un solo repo/deploy. Backend vía Route Handlers, PostgreSQL + pgvector, OpenAI.

## La consola (`/admin`)

Sidebar con 8 módulos, todos detrás de la sesión de NextAuth:

| Módulo | Qué hace |
| --- | --- |
| **Overview** | KPIs con sparklines, rango 7/14/30/90 días, embudo visita → chat → lead → cita → ganado, acciones vencidas. |
| **Leads** | Tabla con filtros por estado/fuente/temperatura, ficha con notas e historial, pipeline comercial, perfilado con IA y export CSV ampliado. |
| **Agenda Meets** | Vista semana + lista, detalle con enlace de Meet, cancelar y reprogramar (sincroniza con Google Calendar). |
| **Analytics** | Top páginas con dwell y scroll, referrers, campañas UTM, reparto por idioma y serie diaria. |
| **Agente / RAG** | CRUD del corpus con reindexado, playground que muestra las fuentes citadas y su similitud, detector de huecos de contexto, y simulador de entrevista que guarda tus respuestas correctas directamente en el corpus. |
| **Documentos** | Subida de CV, propuestas, certificados y casos al volumen del servidor. Extrae texto de PDF/DOCX y permite enviarlo al RAG. Descarga siempre autenticada. |
| **Oportunidades** | Tablero por etapa (guardada → aplicada → entrevista → oferta → cerrada) para empleo fijo remoto, consultoría y freelance, con siguiente acción e historial de eventos. |
| **Generador IA** | Pegas la oferta y obtienes match score contra tu corpus (con huecos y argumentos), CV adaptado, carta y propuesta. Todo se guarda y se puede descargar en Markdown. |

El generador y el agente usan **solo** hechos presentes en el corpus: lo que no pueden verificar lo dejan como `[marcador]` para que lo completes.

## Stack

- Next.js 16 (App Router) + React + TypeScript
- Tailwind CSS, Framer Motion, lucide-react
- Prisma + PostgreSQL (extensión `pgvector`)
- OpenAI (chat + embeddings `text-embedding-3-small`)
- googleapis (Google Calendar + Meet)
- NextAuth (admin), Recharts (dashboard), Nodemailer (emails)

## Requisitos

- Node.js 20+
- PostgreSQL con `pgvector` (o usar el `docker-compose` incluido)
- Claves: `OPENAI_API_KEY`, credenciales OAuth de Google, SMTP.

## Configuración

1. Copia las variables de entorno:

```bash
cp .env.example .env
```

2. Rellena `.env` como mínimo: `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
   Opcional: `OPENAI_API_KEY`, Google OAuth, SMTP.

## Despliegue en VPS (Docker Engine + Compose)

Pensado para Linux en el servidor (no hace falta Docker Desktop).

1. En el VPS: clona el repo, instala Docker Engine + plugin Compose.

2. Configura entorno:

```bash
cp .env.example .env
nano .env   # NEXTAUTH_SECRET, ADMIN_*, POSTGRES_PASSWORD, URLs https://tudominio.com, OPENAI_API_KEY
```

   `NEXT_PUBLIC_SITE_URL` tiene que estar puesta **antes** del build: Next la
   inlinea al compilar, así que el canonical, los `hreflang`, el Open Graph y el
   sitemap salen del valor que hubiera en ese momento. Si cambias de dominio,
   toca reconstruir (`docker compose up -d --build`), no basta con reiniciar.

   `APP_PORT` es el puerto del host (solo `127.0.0.1`) al que se publica la app.
   Cámbialo si el 3000 ya está ocupado por otro sitio del servidor.

3. Primera vez (build + Postgres pgvector + seed admin; RAG si hay `OPENAI_API_KEY`):

```bash
RUN_SEED=1 docker compose up -d --build
```

4. Pon Nginx + TLS delante de `127.0.0.1:$APP_PORT` (`docker/nginx.conf.example` + certbot).

5. Arranques posteriores:

```bash
docker compose up -d --build
```

Operación:
- Logs: `docker compose logs -f app`
- Re-sembrar corpus: `docker compose exec app npx tsx prisma/seed.ts`
  ⚠️ El seed reingesta con `reset: true`: **borra lo que hayas entrenado desde
  la consola** y vuelve a gastar embeddings.
- Cambiar la contraseña del admin (sin tocar el corpus):

```bash
docker compose exec app npm run admin:password -- 'nueva-password-larga'
# revocar la anterior: auth.ts acepta ADMIN_PASSWORD del entorno como fallback
sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=\"nueva-password-larga\"|" .env
docker compose up -d --force-recreate app
```
- Parar: `docker compose down` (conserva volúmenes). `docker compose down -v` borra DB **y documentos**.
- Postgres solo en red interna; datos en volumen `postgres_data`.
- Documentos del panel en volumen `app_uploads` (montado en `/app/storage/uploads`).

### Backups

Base de datos:

```bash
docker compose exec -T db pg_dump -U ricardo webricardo | gzip > db-$(date +%F).sql.gz
```

Documentos (volumen `app_uploads`; el nombre real lo prefija Compose con el
del proyecto, compruébalo con `docker volume ls`):

```bash
docker run --rm \
  -v webricardo_app_uploads:/data:ro \
  -v "$PWD":/backup \
  alpine tar czf /backup/uploads-$(date +%F).tgz -C /data .
```

Restaurar documentos:

```bash
docker run --rm \
  -v webricardo_app_uploads:/data \
  -v "$PWD":/backup \
  alpine sh -c "tar xzf /backup/uploads-FECHA.tgz -C /data"
```

## Desarrollo local (sin Docker)

```bash
npm install
npx prisma db push        # crea el esquema + extensión vector
npm run db:seed           # crea admin + ingesta el corpus RAG
npm run dev
```

Abre http://localhost:3000 (redirige a `/es`). Admin en `/admin`.

## RAG (base de conocimiento)

- El corpus base vive en `src/lib/knowledge-corpus.ts` (bilingüe).
- Reindexar todo desde el corpus base: `npm run rag:ingest -- --reset`
- Día a día se entrena desde la consola: módulo **Agente / RAG** para escribir
  entradas a mano o corregir respuestas del simulador, y módulo **Documentos**
  para subir un PDF/DOCX y enviar su texto al índice.
- `pgvector` es obligatorio para los embeddings. En Docker lo trae la imagen
  `pgvector/pgvector`; en una instalación local de Postgres hay que instalar la
  extensión aparte (sin ella el resto de la consola funciona, pero no se puede
  indexar ni probar el agente).

## Documentos (biblioteca)

- Los archivos se guardan en `UPLOAD_DIR` (por defecto `/app/storage/uploads` en
  Docker, `./storage/uploads` en dev) con un nombre aleatorio; el nombre real y
  los metadatos viven en la tabla `Document`.
- Nunca se sirven desde `public/`: la descarga pasa por
  `/api/admin/documents/[id]/download`, que exige sesión de admin.
- Límite de tamaño con `MAX_UPLOAD_MB` (15 MB por defecto) y whitelist de MIME
  (PDF, DOCX/DOC, TXT, MD, JSON, PNG, JPEG).
- PDF se extrae con `pdf-parse` y DOCX con `mammoth`. Las imágenes se guardan
  pero no se indexan.

## Google Calendar + Meet

1. En Google Cloud Console crea credenciales OAuth (tipo Web), con `GOOGLE_REDIRECT_URI` = `https://TU_DOMINIO/api/google/callback`.
2. Habilita la Google Calendar API.
3. Define `GOOGLE_SETUP_TOKEN` (largo y aleatorio) en `.env`, o inicia sesión en `/admin`.
4. Autoriza tu cuenta:

```
https://TU_DOMINIO/api/google/auth?key=GOOGLE_SETUP_TOKEN
```

   (Si ya tienes sesión admin, puedes omitir `?key=`.)
5. El callback **no** muestra el refresh token en el navegador: cópialo desde los logs del contenedor (`docker compose logs app`) y pégalo como `GOOGLE_REFRESH_TOKEN` en `.env`, luego reinicia.

Sin estas credenciales, el panel de citas muestra "no disponible" (el resto del sitio funciona).

## Estructura

```
src/
  app/
    [locale]/            # landing bilingüe (page + layout + metadata)
    admin/
      login/             # login público
      (panel)/           # consola: layout con guard + los 8 módulos
    api/
      admin/             # leads, appointments, corpus, agent, documents,
                         # opportunities, generate, export
      chat, booking, contact, track, google, auth
    sitemap.ts, robots.ts
  components/
    admin/               # Shell, ui, Overview, LeadsBoard, AgendaBoard,
                         # AnalyticsBoard, AgentStudio, DocumentsLibrary,
                         # OpportunitiesBoard, Generator
    ...                  # secciones públicas, chat, header
  i18n/                  # config + diccionarios ES/EN
  lib/                   # prisma, openai, rag, corpus, storage, booking,
                         # google-calendar, mailer, metrics, auth, admin-auth,
                         # interview-bank
prisma/
  schema.prisma, seed.ts
scripts/
  ingest.ts, deploy.sh
docker/
  entrypoint.sh, nginx.conf.example
```

## Notas de seguridad

- El agente se presenta como "asistente de IA entrenado con el conocimiento de Ricardo" y responde solo con el contexto RAG; ante dudas deriva a agendar/contactar.
- Rate-limit en memoria por IP en chat, booking, contacto, login admin e ingest. Para multi-instancia, migrar a Redis.
- En producción el login no acepta `ADMIN_PASSWORD` en claro: usa `AdminUser` en BD (seed) o `ADMIN_PASSWORD_HASH`.
- Todas las rutas `/api/admin/*` comparten el guard de `src/lib/admin-auth.ts` y devuelven 401 sin sesión.
- Las descargas de documentos validan la ruta en disco para bloquear path traversal.
- Setup de Google Calendar usa `GOOGLE_SETUP_TOKEN` o sesión admin; el refresh token no se pinta en el HTML del callback.
