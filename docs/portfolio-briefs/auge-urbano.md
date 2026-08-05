# Auge Urbano — Plataforma PropTech end-to-end

Verificado contra el codigo y la infraestructura reales (VPS: `/opt/auge-urbano-web/auge-urbano-web`,
contenedores `auge-urbano-web-web-1` y `auge-urbano-web-mysql-1`).

## Negocio
Venta de propiedad raiz en Medellin y el Valle de Aburra. La plataforma no es un sitio de
presentacion: es el sistema con el que corre el negocio — catalogo de inmuebles, CRM de leads y
cierres, portal para colegas inmobiliarios, portal de captadores de calle, blog, finanzas y un
motor de posicionamiento para Google y para LLM.

## Escala real
- ~43.000 lineas de Python (`app.py` concentra ~25.000) repartidas en 33 modulos de dominio.
- 159 rutas Flask (publico, admin, `/colega`, `/captador`, APIs JSON).
- MySQL 8 InnoDB utf8mb4: 45 tablas, 440 columnas, 21 claves ajenas, 115 indices.
- Maestra geografica: 2 regiones, 22 municipios, 232 zonas (comuna/corregimiento/sector), 343 barrios.
- Maestra de amenidades: 119 items (73 de unidad, 46 de zonas comunes) y 833 reglas de visibilidad por tipo.
- Catalogo: 36 inmuebles (34 activos) en 5 municipios, 912 medios (~25 por ficha).
- 14 landings de intencion estaticas mas landings dinamicas por barrio.
- Descubrimiento: sitemap-index con 99 URLs y 800 entradas de imagen, `llms.txt`, `ai.txt`, catalogo JSON-LD.
- Pipeline WebP: 1.338 conversiones registradas en BD, 459 MB de origen -> 53 MB.
- 99 tests con pytest (`tests/test_app.py`, `test_image_webp.py`, `test_integration_settings.py`, `test_seo_indexing.py`).
- Telemetria propia: 20 tipos de evento instrumentados (`/api/pub/ix`).

## Arquitectura
- Nginx: TLS Let's Encrypt, 301 `www` -> apex, `client_max_body_size 300M`, timeouts largos para subidas.
- Gunicorn: 3 workers x 2 threads, timeout 120s, `python:3.12-slim-bookworm`.
- Flask monolito modular; el dominio vive en modulos (`geo_maestra`, `amenity_maestra`, `blog_db`,
  `finance`, `seo_*`, `llm_discovery`, `business_ai_agent`, `landing_ai_agent`, `admin_copilot`,
  `captador_portal`, `bold_link_payments`, `wasi_import`, `image_webp`, `google_metrics_integration`).
- Persistencia dual: MySQL 8 en produccion, SQLite conmutable con `AUGE_FORCE_SQLITE` como rescate.
- Esquema idempotente: funciones `ensure_*_schema` + seeds en cada arranque, sin runner de migraciones.
- Volumen `./data/instance:/app/instance` para BD de rescate y subidas de leads/captadores.

## Integraciones
- OpenAI y Gemini con fallback entre proveedores; claves en `integration_settings` o entorno.
- Bold Link API (`integrations.api.bold.co`) para paquetes de pauta de colegas.
- Google Analytics 4 Data API y Search Console (cuenta de servicio / OAuth) con snapshots en BD.
- IndexNow y Google Indexing API al publicar contenido.
- SMTP para notificaciones y recuperacion de contrasena.
- Importador de fichas publicas `info.wasi.co` (BeautifulSoup) para alta asistida en admin.

## Decisiones
1. MySQL 8 en produccion con SQLite como fallback conmutable — el mismo codigo crea el esquema en ambos motores.
2. Monolito modular en vez de microservicios — limites por modulo Python, no por red.
3. Esquema idempotente al arrancar en vez de migraciones — despliegue reproducible para un operador.
4. AEO/GEO como datos: cada ficha guarda pregunta primaria, snippet, FAQ extra y coordenadas.
5. Guards propios (`security_guards`, `public_abuse_guard`) antes de exponer IA al publico: prompt
   injection, SQLi, honeypot y rate limit en memoria, sin dependencias extra.

## Outcomes
- 159 rutas y 45 tablas en un solo despliegue.
- -88% de peso de imagen tras el pipeline WebP.
- 597 nodos de geografia normalizada para filtros, URLs y senales GEO.
- Costos de cierre colombianos codificados: notariado 0,54%, beneficencia 1%, registro 0,67%,
  retencion 1% / 2,5% segun umbral (685.000.000 COP).

## Notas de verificacion
- Los volumenes de `leads` y `contact_requests` incluyen datos sembrados (`seed_fake_leads.py`,
  rutas `/admin/seed-fake-*`): no usar como metrica de negocio.
- El dominio publico `augeurbano.com` todavia resuelve al hosting anterior; la app corre en el VPS
  detras de Nginx con certificado emitido para ese dominio, pendiente el cutover de DNS.

## Hiring fit
Ownership full-stack de un vertical: catalogo, CRM, portales de terceros, pagos, SEO/AEO y agentes IA
en la infraestructura del cliente.
