/**
 * Casos de solución bilingües (páginas /soluciones + featured home).
 * Fuente curada desde docs/portfolio-briefs — sin secretos ni PII.
 */

export type SolutionSlug =
  | "orquestacion-agentes"
  | "sistemas-criticos"
  | "auge-urbano"
  | "lexia-legal-os"
  | "omnicanal-comercio"
  | "plataforma-aprendizaje"
  | "pagos-bold"
  | "experiencia-recomendacion"
  | "sitio-mws"
  | "crm-mws"
  | "landings-cliente"
  | "wp-ai-agent"
  | "feeling-core-erp"
  | "prestamos-fintech"
  | "landing-mws"
  | "automatizacion-datos";

export const solutionSlugs: SolutionSlug[] = [
  "orquestacion-agentes",
  "lexia-legal-os",
  "sistemas-criticos",
  "feeling-core-erp",
  "prestamos-fintech",
  "wp-ai-agent",
  "omnicanal-comercio",
  "plataforma-aprendizaje",
  "pagos-bold",
  "experiencia-recomendacion",
  "auge-urbano",
  "landing-mws",
  "automatizacion-datos",
  "sitio-mws",
  "crm-mws",
  "landings-cliente",
];

/** Destacados en home (orden = cards). EU-first: agentes, LegalTech, HA, MWS AI. */
export const featuredSlugs: SolutionSlug[] = [
  "orquestacion-agentes",
  "lexia-legal-os",
  "feeling-core-erp",
  "sistemas-criticos",
  "prestamos-fintech",
  "wp-ai-agent",
  "omnicanal-comercio",
  "plataforma-aprendizaje",
];

export type MetaItem = { label: string; value: string };
export type Outcome = { value: string; label: string };
export type ApproachStep = { title: string; description: string };
export type Decision = { title: string; why: string };

/** Capturas reales de producto (galería en la página del caso). */
export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type SolutionDetail = {
  slug: SolutionSlug;
  tag: string;
  title: string;
  summary: string;
  heroImage: string;
  archImage: string;
  /** Mapa HTML interactivo (parcial) cuando existe en /images/arch/{slug}.html */
  archInteractive?: string;
  archCaption: string;
  /** Captura de producto/UI real (opcional; se muestra tras el contexto). */
  productImage?: string;
  /** Galería de capturas reales (destaca UI del producto). */
  gallery?: GalleryImage[];
  video?: string;
  videoPoster?: string;
  meta: MetaItem[];
  context: string;
  challenges: string[];
  approach: ApproachStep[];
  stack: string[];
  outcomes: Outcome[];
  highlights: string[];
  architectureLayers: string[];
  decisions: Decision[];
  hiringFit: string;
};

function img(slug: SolutionSlug) {
  return {
    heroImage: `/images/captures/${slug}-hero.png`,
    archImage: `/images/arch/${slug}.png`,
    archInteractive: `/images/arch/${slug}.html`,
  };
}

export const solutionsEs: SolutionDetail[] = [
  {
    slug: "orquestacion-agentes",
    tag: "IA & Arquitectura",
    title: "Orquestacion de Agentes Autonomos (Nova)",
    summary:
      "Agencia de agentes CrewAI con CEO, 5 divisiones y 29 especialistas que ejecutan trabajo real 24/7 — API FastAPI, grafo 3D, trazas SSE e inferencia local. No es un chatbot: es un negocio operado por IA.",
    ...img("orquestacion-agentes"),
    productImage: "/images/captures/nova/nova-card.webp",
    gallery: [
      {
        src: "/images/captures/nova/nova-engine-agentes.png",
        alt: "Nova — grafo de orquestacion con roles y timeline en vivo",
        width: 1600,
        height: 1000,
        caption: "Panel /visual: CEO, divisiones y especialistas como sistema operable",
      },
      {
        src: "/images/captures/nova/nova-catalogo-perfiles.png",
        alt: "Nova — catalogo MIT de perfiles de agentes",
        width: 1600,
        height: 1000,
        caption: "Catalogo MIT (agency-agents) mapeado a roles Nova",
      },
      {
        src: "/images/captures/nova/nova-configuracion.png",
        alt: "Nova — centro de configuracion por agente",
        width: 1600,
        height: 1000,
        caption: "Configuracion por agente sin redeploy",
      },
      {
        src: "/images/captures/nova/nova-arquitecturas.png",
        alt: "Nova — arquitecturas y topologias del sistema",
        width: 1600,
        height: 1000,
        caption: "Arquitecturas: topologias y capas del runtime",
      },
      {
        src: "/images/captures/nova/nova-hud-sistemas.png",
        alt: "Nova — HUD de salud de subsistemas",
        width: 1600,
        height: 1000,
        caption: "HUD de subsistemas LLM, voz, vision y tools",
      },
      {
        src: "/images/captures/nova/nova-rag-aprendizaje.png",
        alt: "Nova — consola RAG y aprendizaje",
        width: 1600,
        height: 1000,
        caption: "Consola RAG: chunks, packs de dominio y validacion",
      },
      {
        src: "/images/captures/nova/nova-tokens.png",
        alt: "Nova — consumo de tokens y proveedores",
        width: 1600,
        height: 1000,
        caption: "FinOps: tokens, llamadas y cascada de proveedores",
      },
      {
        src: "/images/captures/nova/nova-engine-agentes-mobile.png",
        alt: "Nova — panel visual en mobile",
        width: 780,
        height: 1688,
        caption: "Superficie operativa en viewport mobile",
      },
    ],
    archCaption:
      "Mapa parcial del plano de control: operador y panel vivo → API de orquestacion → hub director / divisiones / especialistas → inferencia local, tools acotadas y estado. No expone configs ni el inventario completo de agentes.",
    video: "/media/ejecucion-agentes-ia.mp4",
    videoPoster: "/images/captures/nova/nova-engine-agentes.png",
    meta: [
      { label: "Dominio", value: "Agentic AI / Ops" },
      { label: "Rol", value: "Solutions Architect / Owner" },
      { label: "Modelo", value: "Local-first + API" },
      { label: "Escala", value: "29 especialistas + CEO" },
    ],
    context:
      "Nova MWS es un producto de orquestacion real, no un chatbot con nombre bonito. Coordina una red de 29 agentes especializados (research, contenido, ops) con configuracion por agente, trazabilidad en vivo y puente directo a los datos de negocio de MWS.",
    challenges: [
      "Reducir carga operativa manual sin perder control.",
      "Mantener privacidad con inferencia local cuando aplica.",
      "Hacer observable una red de 30 roles.",
      "Desplegar de forma reproducible (Docker / VPS).",
    ],
    approach: [
      {
        title: "Diseno multi-agente",
        description:
          "CEO + divisiones + 29 especialistas con routing explicito y overrides de runtime.",
      },
      {
        title: "API + paneles operativos",
        description:
          "FastAPI con /visual (grafo 3D), /vivo (SSE), /configuracion y health.",
      },
      {
        title: "Inferencia local y tools",
        description:
          "Ollama + herramientas MCP/Composio/MWS para ejecutar trabajo real, no solo texto.",
      },
      {
        title: "Observabilidad",
        description:
          "Trazas de corrida, Langfuse opcional y estado de modulos en configuracion.",
      },
    ],
    stack: [
      "Python",
      "CrewAI",
      "FastAPI",
      "Ollama",
      "RAG",
      "MCP",
      "Docker",
      "SSE",
    ],
    outcomes: [
      { value: "29+1", label: "Especialistas + CEO orquestados" },
      { value: "12,2M", label: "Tokens y 296 llamadas de crew por ~USD 29,90 (cascada de 14 proveedores)" },
      { value: "2.749", label: "Chunks RAG indexados sobre 159 documentos propios" },
      { value: "11", label: "Subsistemas monitoreados en el HUD de salud" },
      { value: "24/7", label: "Operacion continua con trazas" },
      { value: "Local", label: "Inferencia privada con Ollama" },
    ],
    highlights: [
      "Producto con panel visual y ejecucion en vivo, no solo notebook.",
      "Arquitectura local-first con escapes a tools externas controladas.",
      "Ownership end-to-end: agentes, API, UI operativa y deploy.",
    ],
    architectureLayers: [
      "UI operativa: /visual, /vivo, /configuracion",
      "API FastAPI: ejecutar, stream SSE, graph, health",
      "Orquestacion CrewAI: CEO → hubs → especialistas",
      "Inferencia: Ollama + overrides por agente",
      "Tools: MCP, Composio, pack MWS, n8n",
      "Datos: SQLite/PostgreSQL + runtime overrides",
    ],
    decisions: [
      {
        title: "Local-first vs solo cloud LLM",
        why: "Privacidad, costo predecible y operacion en perimetro del cliente.",
      },
      {
        title: "Red especializada vs un solo asistente",
        why: "Routing por dominio y ownership claro de cada capacidad.",
      },
      {
        title: "Config por agente sin redeploy",
        why: "Operar prompts/modelos/tools desde panel, no desde git cada vez.",
      },
    ],
    hiringFit:
      "Contrata esto si necesitas un Solutions Architect / AI automation lead que ya probo que un ecosistema de 29 agentes puede operar en produccion, no solo en un notebook. Empezamos con una llamada de 15 min; si el alcance lo pide, sigo como retainer de evolucion continua.",
  },
  {
    slug: "sistemas-criticos",
    tag: "Arquitectura Corporativa",
    title: "Escalabilidad en Sistemas Criticos",
    summary:
      "Modernizacion de backend y microservicios para alta disponibilidad bajo estandares corporativos (Carga Control / Feeling) — sin detener la operacion mientras se reconstruye el motor.",
    ...img("sistemas-criticos"),
    productImage: "/images/captures/sistemas-criticos/sistemas-criticos-card.webp",
    gallery: [
      {
        src: "/images/captures/sistemas-criticos/sistemas-criticos-area.png",
        alt: "Estacion de trabajo de sistemas criticos — monitores, telemetria y codigo",
        width: 1600,
        height: 1000,
        caption: "Operacion de plataforma HA: telemetria, codigo y monitoreo continuo",
      },
    ],
    archCaption:
      "Clientes → load balancer → cluster de servicios redundantes, DB primaria + replica y observabilidad transversal.",
    video: "/media/area-desarrollo.mp4",
    videoPoster: "/images/poster-area.png",
    meta: [
      { label: "Dominio", value: "Platform / HA" },
      { label: "Rol", value: "Senior Architect / Full-Stack" },
      { label: "Foco", value: "Alta disponibilidad" },
      { label: "Estandar", value: "Corporativo" },
    ],
    context:
      "Sistemas de alto volumen donde el downtime tiene costo real. Se diagnostico el backend, se migro por fases a microservicios y se endurecio HA, redundancia y observabilidad sin detener el negocio.",
    challenges: [
      "Sostener picos sin SPOF.",
      "Migrar monolito sin big-bang.",
      "Cumplir estandares corporativos de estabilidad.",
      "Operar con metricas, no intuicion.",
    ],
    approach: [
      {
        title: "Diagnostico de rendimiento",
        description: "Cuellos de botella y deuda de arquitectura priorizada por impacto.",
      },
      {
        title: "Migracion progresiva",
        description: "Extraccion de servicios criticos con contratos API claros.",
      },
      {
        title: "HA y redundancia",
        description: "Balanceo, replicas y eliminacion de puntos unicos de fallo.",
      },
      {
        title: "Observabilidad",
        description: "Metricas, logs y trazas para incident response con evidencia.",
      },
    ],
    stack: ["Node.js", "Microservices", "REST", "Docker", "PostgreSQL", "Observability"],
    outcomes: [
      { value: "HA", label: "Diseno sin SPOF" },
      { value: "Fases", label: "Migracion sin corte de negocio" },
      { value: "Ops", label: "Operacion basada en metricas" },
    ],
    highlights: [
      "Modernizacion compatible con continuidad operativa.",
      "Enfoque de platform engineering, no rewrite estetico.",
      "Listo para auditoria de estabilidad corporativa.",
    ],
    architectureLayers: [
      "Edge / load balancer",
      "Cluster de microservicios",
      "APIs REST versionadas",
      "Primary + replica de datos",
      "Contenedores Docker",
      "Observabilidad transversal",
    ],
    decisions: [
      {
        title: "Migracion por fases vs rewrite",
        why: "Protege revenue y reduce riesgo de regresion.",
      },
      {
        title: "Split solo donde duele",
        why: "Evita microservicios cosméticos y costo operativo innecesario.",
      },
      {
        title: "Observabilidad antes de scale-out ciego",
        why: "Escalar sin telemetria multiplica el caos.",
      },
    ],
    hiringFit:
      "Contrata esto si tu backend crecio mas rapido que su arquitectura y el downtime ya te cuesta dinero real. Encaja como rol Staff/Senior Platform, o como auditoria puntual seguida de implementacion por olas.",
  },
  {
    slug: "auge-urbano",
    tag: "PropTech & SEO",
    title: "Plataforma PropTech End-to-End (Auge Urbano)",
    summary:
      "Portal inmobiliario desplegado en VPS: 159 rutas Flask sobre MySQL 8 con 45 tablas, CRM propio, portales de colegas y captadores, agentes IA integrados y una pila SEO/GEO/AEO con IndexNow. ~43.000 lineas de Python que operan el negocio completo, no una landing con formulario.",
    ...img("auge-urbano"),
    productImage: "/images/captures/auge/auge-card.webp",
    gallery: [
      {
        src: "/images/captures/auge/auge-home.webp",
        alt: "Auge Urbano — home con hero rotativo y contadores de catalogo",
        width: 1600,
        height: 1000,
        caption: "Home: hero rotativo y contadores servidos desde BD (34 activas, 5 zonas)",
      },
      {
        src: "/images/captures/auge/auge-catalogo.webp",
        alt: "Auge Urbano — catalogo con buscador especializado por region, municipio, comuna y barrio",
        width: 1600,
        height: 1000,
        caption: "Catalogo: buscador especializado sobre la maestra geografica de cuatro niveles",
      },
      {
        src: "/images/captures/auge/auge-ficha.webp",
        alt: "Auge Urbano — ficha de propiedad con galeria, resumen citable y datos de avaluo",
        width: 1600,
        height: 1000,
        caption: "Ficha: galeria WebP, resumen citable por LLM (AEO) y datos de avaluo/estrato",
      },
      {
        src: "/images/captures/auge/auge-zonas.webp",
        alt: "Auge Urbano — exploracion por sector con rangos de precio y costo por m2",
        width: 1600,
        height: 1000,
        caption: "Zonas: filtros por presupuesto y agregados de precio y costo por m2",
      },
      {
        src: "/images/captures/auge/auge-home-mobile.png",
        alt: "Auge Urbano — home mobile",
        width: 780,
        height: 1688,
        caption: "Home en viewport mobile",
      },
      {
        src: "/images/captures/auge/auge-catalogo-mobile.png",
        alt: "Auge Urbano — catalogo mobile",
        width: 780,
        height: 1688,
        caption: "Catalogo en viewport mobile",
      },
    ],
    archCaption:
      "Nginx (TLS, apex canonico, 301 desde www) → Gunicorn 3 workers x 2 threads → monolito Flask modular con 159 rutas → MySQL 8 InnoDB (45 tablas) mas volumen de subidas; encima, agentes IA (asesor publico, copiloto de negocio, SEO de fichas) y el paquete de descubrimiento sitemaps + llms.txt + ai.txt.",
    meta: [
      { label: "Sector", value: "Real Estate / PropTech" },
      { label: "Rol", value: "Full-stack owner" },
      { label: "Escala", value: "159 rutas · 45 tablas" },
      { label: "Despliegue", value: "Docker + Nginx en VPS" },
    ],
    context:
      "Auge Urbano opera venta de propiedad raiz en Medellin y el Valle de Aburra. La plataforma no es un brochure: es el sistema con el que corre el negocio — catalogo de inmuebles con ~900 fotos, CRM de leads y cierres, portal para colegas inmobiliarios, portal de captadores de calle, blog, finanzas y un motor de posicionamiento pensado tanto para Google como para LLM.",
    challenges: [
      "Un solo sistema para tres audiencias con sesion propia: comprador, colega inmobiliario y captador de calle.",
      "Operar el negocio sin CRM externo: leads, contactos, citas, cierres, ingresos y gastos en el mismo admin.",
      "Posicionar un catalogo pequeno en un mercado saturado y hacerlo citable por LLM, no solo indexable por Google.",
      "Servir ~25 fotos por inmueble sin destruir el LCP en moviles de gama media.",
      "Normalizar la geografia del Valle de Aburra (municipio → comuna/corregimiento → barrio) para filtros, URLs y senales GEO.",
      "Exponer agentes IA a internet sin abrir la puerta a prompt injection ni a fuga de claves de integracion.",
    ],
    approach: [
      {
        title: "Monolito Flask modularizado",
        description:
          "159 rutas en un solo proceso, con el dominio partido en 33 modulos Python (geo, amenidades, SEO, IA, finanzas, pagos, correo) importados como paquetes en vez de un framework nuevo por feature.",
      },
      {
        title: "Persistencia dual conmutable",
        description:
          "MySQL 8 InnoDB utf8mb4 en produccion (45 tablas, 440 columnas, 21 claves ajenas, 115 indices) con SQLite como modo de rescate via AUGE_FORCE_SQLITE; el mismo codigo crea y completa el esquema en ambos motores.",
      },
      {
        title: "Portales con auth propia",
        description:
          "Admin sin enlace publico, portal /colega (registro, inmuebles, agenda, pedidos, recuperacion por correo) y portal de captadores con deduplicacion por telefono + municipio y bono liquidado al cierre de venta.",
      },
      {
        title: "Pila SEO/GEO/AEO propia",
        description:
          "14 landings de intencion mas landings dinamicas por barrio, JSON-LD RealEstateListing/FAQPage, sitemap-index con 99 URLs y 800 imagenes, y notificacion automatica a IndexNow y Google Indexing API al publicar.",
      },
      {
        title: "IA integrada, no de demo",
        description:
          "Asesor comercial en landings, copiloto de negocio que responde sobre KPIs con graficos Chart.js y generacion masiva de SEO/AEO por ficha; OpenAI o Gemini con fallback entre proveedores y presets de prompt versionados en BD.",
      },
      {
        title: "Pipeline WebP con auditoria",
        description:
          "Conversion automatica al subir imagenes, log por archivo en BD y modal de optimizacion en admin: 1.338 conversiones registradas, de 459 MB a 53 MB de origen.",
      },
    ],
    stack: [
      "Python 3.12",
      "Flask",
      "Gunicorn",
      "MySQL 8 / InnoDB",
      "PyMySQL",
      "Jinja2",
      "Pillow",
      "OpenAI + Gemini",
      "Bold Link API",
      "GA4 + Search Console",
      "Docker",
      "Nginx",
    ],
    outcomes: [
      { value: "159", label: "Rutas Flask en produccion" },
      { value: "45", label: "Tablas InnoDB (440 columnas, 21 FKs)" },
      { value: "-88%", label: "Peso de imagen tras WebP (459 → 53 MB)" },
      { value: "597", label: "Nodos geo normalizados (22 municipios · 232 zonas · 343 barrios)" },
      { value: "99", label: "Tests automatizados con pytest" },
      { value: "20", label: "Tipos de evento en telemetria propia" },
    ],
    highlights: [
      "Despliegue real: contenedor Gunicorn tras Nginx con TLS Let's Encrypt y apex canonico — no un demo local.",
      "CRM inmobiliario completo (leads, contactos, citas, cierres, referidos, ingresos y gastos) sin renta por asiento.",
      "Agentes IA expuestos a internet con guards de prompt injection y SQLi, honeypot y rate limit en formularios publicos.",
      "Costos de cierre colombianos codificados en el simulador: notariado 0,54%, beneficencia 1%, registro 0,67% y retencion 1% / 2,5% segun umbral.",
      "Telemetria de embudo propia (form_start → form_change → form_submit) para no depender solo de GA4.",
    ],
    architectureLayers: [
      "Nginx: TLS Let's Encrypt, 301 www → apex, body hasta 300 MB",
      "Gunicorn: 3 workers x 2 threads, timeout 120s",
      "Flask: 159 rutas (publico, admin, /colega, /captador, API JSON)",
      "Dominio: 33 modulos Python (geo, amenidades, SEO, IA, finanzas, pagos)",
      "MySQL 8 InnoDB utf8mb4: 45 tablas con esquema autocreado e idempotente",
      "Volumen /app/instance: BD de rescate y subidas de leads/captadores",
      "IA: OpenAI/Gemini con fallback, guards y claves en integration_settings",
      "Descubrimiento: robots, sitemap-index, sitemap-images, llms.txt, ai.txt, catalogo JSON-LD",
    ],
    decisions: [
      {
        title: "MySQL 8 en produccion con SQLite como fallback conmutable",
        why: "El catalogo con ~900 medios, los agregados de negocio y la maestra geografica piden InnoDB e indices reales; SQLite queda como via de recuperacion si MySQL o sus credenciales fallan, ejecutando el mismo codigo de esquema.",
      },
      {
        title: "Monolito modular en vez de microservicios",
        why: "Un negocio operado por un equipo pequeno no necesita limites de red: los limites se marcan por modulo Python y el coste operativo se queda en un contenedor y un proxy.",
      },
      {
        title: "Esquema idempotente al arrancar en vez de migraciones",
        why: "Funciones ensure_*_schema mas seeds crean y completan tablas en cada arranque; despliegue reproducible sin mantener un runner de migraciones para un solo operador.",
      },
      {
        title: "AEO y GEO como datos, no como plantilla",
        why: "Cada ficha guarda pregunta primaria, snippet de respuesta, FAQ extra y coordenadas: lo que un LLM puede citar se edita en el admin, no se improvisa en el HTML.",
      },
      {
        title: "Guards propios antes de exponer IA al publico",
        why: "Marcadores internos, deteccion de prompt injection y SQLi, honeypot y rate limit en memoria: proteccion suficiente sin sumar dependencias ni un WAF de pago.",
      },
    ],
    hiringFit:
      "Contrata esto si necesitas un full-stack que entienda el vertical inmobiliario de punta a punta — catalogo, CRM, portales de terceros, pagos, SEO/AEO y agentes IA — y lo deje corriendo en tu propia infraestructura, no repartido entre cinco SaaS. Discovery → producto operable → automatizacion e IA cuando el volumen lo justifique.",
  },
  {
    slug: "lexia-legal-os",
    tag: "Producto Vertical IA",
    title: "LEXIA — Legal Intelligence OS",
    summary:
      "Sistema operativo juridico con API FastAPI, OS Streamlit y analytics Dash: producto Python completo para trabajo legal asistido por IA.",
    ...img("lexia-legal-os"),
    productImage: "/images/captures/lexia/lexia-card.webp",
    gallery: [
      {
        src: "/images/captures/lexia/lexia-os.png",
        alt: "LEXIA — OS juridico en produccion",
        width: 1600,
        height: 1000,
        caption: "OS Streamlit en produccion (lexia.medellinweb.co)",
      },
      {
        src: "/images/captures/lexia/lexia-os-mobile.png",
        alt: "LEXIA — OS en mobile",
        width: 780,
        height: 1688,
        caption: "Vista mobile del OS juridico",
      },
    ],
    archCaption:
      "Usuario → Streamlit OS / Dash analytics → FastAPI → dominio legal IA + data store, empaquetado en Docker.",
    meta: [
      { label: "Dominio", value: "LegalTech" },
      { label: "Rol", value: "Product Architect" },
      { label: "Stack", value: "Python-only" },
      { label: "Superficies", value: "API · OS · Analytics" },
    ],
    context:
      "LEXIA ataca el trabajo juridico como sistema operativo: no un chat suelto. Separo la superficie operativa (Streamlit), analitica (Dash) y API, con seed demo y path Docker a produccion.",
    challenges: [
      "Producto multi-superficie sin fragmentar el dominio.",
      "Onboarding demo reproducible.",
      "Deploy serio (dev bind-mount vs prod).",
      "Roles de usuario distintos (operacion vs analytics).",
    ],
    approach: [
      {
        title: "API como nucleo",
        description: "FastAPI concentra dominio y contratos.",
      },
      {
        title: "OS Streamlit",
        description: "Interfaz operativa rapida para flujo diario.",
      },
      {
        title: "Analytics Dash",
        description: "Separacion de lecturas gerenciales/analiticas.",
      },
      {
        title: "Docker dual",
        description: "Compose de desarrollo y guia de produccion en VPS.",
      },
    ],
    stack: ["Python", "FastAPI", "Streamlit", "Dash", "Docker"],
    outcomes: [
      { value: "3", label: "Superficies de producto integradas" },
      { value: "Demo", label: "Seed + login de evaluacion" },
      { value: "VPS", label: "Path Docker documentado" },
    ],
    highlights: [
      "Ownership de producto vertical, no solo integracion.",
      "Python end-to-end sin dependencia de React.",
      "Pensado para demo comercial y operacion real.",
    ],
    architectureLayers: [
      "Streamlit OS (operacion)",
      "Dash (analytics)",
      "FastAPI (dominio)",
      "Auth / roles demo",
      "Data + seed scripts",
      "Infra Docker",
    ],
    decisions: [
      {
        title: "Python-only vs SPA React",
        why: "Acelera un vertical legal con un solo lenguaje y equipo.",
      },
      {
        title: "OS separado de analytics",
        why: "Distintos jobs-to-be-done y cadencias de uso.",
      },
      {
        title: "Seed demo first-class",
        why: "Ventas y QA necesitan un entorno reproducible.",
      },
    ],
    hiringFit:
      "Contrata esto si necesitas un arquitecto de producto vertical para un sector regulado (LegalTech y similares) que entregue API, UX operativa y analytics como un solo sistema — no tres proveedores que no se hablan.",
  },
  {
    slug: "omnicanal-comercio",
    tag: "Commerce & Integraciones",
    title: "Omnicanal + WooCommerce Colombia",
    summary:
      "Cerebro omnicanal (stock propio + dropship) con panel HITL, radar Dropi, API de catalogo y tienda Woo solo Colombia.",
    ...img("omnicanal-comercio"),
    productImage: "/images/captures/omnicanal/omnicanal-card.webp",
    gallery: [
      {
        src: "/images/captures/omnicanal/omnicanal-oportunidades.png",
        alt: "Omnicanal MWS — radar de oportunidades AliExpress/MeLi",
        width: 1600,
        height: 1000,
        caption: "Radar HITL: URL AliExpress, scoring y aprobacion humana",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-panel.png",
        alt: "Omnicanal MWS — dashboard operativo Colombia",
        width: 1600,
        height: 1000,
        caption: "Dashboard: SKUs, stock bajo, POs y productos recientes",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-productos.png",
        alt: "Omnicanal MWS — catalogo de productos",
        width: 1600,
        height: 1000,
        caption: "Catalogo operativo: SKUs, precios COP y publicacion",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-trends.png",
        alt: "Omnicanal MWS — tendencias de demanda",
        width: 1600,
        height: 1000,
        caption: "Tendencias: busquedas y scans de demanda",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-stock.png",
        alt: "Omnicanal MWS — control de stock",
        width: 1600,
        height: 1000,
        caption: "Stock propio vs dropship en un solo panel",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-settings.png",
        alt: "Omnicanal MWS — configuracion e integraciones",
        width: 1600,
        height: 1000,
        caption: "Settings: margenes, canales y conexiones",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-panel-mobile.png",
        alt: "Omnicanal — panel en mobile",
        width: 780,
        height: 1688,
        caption: "Superficie operativa en viewport mobile",
      },
    ],
    archCaption:
      "Feeds Dropi → worker/scoring → panel HITL → FastAPI catalogo → WooCommerce CO, con Postgres/Redis.",
    meta: [
      { label: "Dominio", value: "E-commerce ops" },
      { label: "Rol", value: "Tech Lead Commerce" },
      { label: "Control", value: "HITL oportunidades" },
      { label: "Checkout", value: "WooCommerce CO" },
    ],
    context:
      "Separar marketing del checkout: el cerebro omnicanal decide que publicar; WooCommerce Colombia cobra. Incluye radar de oportunidades, enrich con IA (fallback plantilla) y vertical Tecnopets como instancia Woo.",
    challenges: [
      "Hibrido stock propio + dropship.",
      "No publicar basura: score + aprobacion humana.",
      "Integracion Woo REST/webhooks.",
      "Operacion diaria con panel, no solo scripts.",
    ],
    approach: [
      {
        title: "Dominio + worker",
        description: "Packages de pricing/inventario y worker de radar.",
      },
      {
        title: "Panel HITL",
        description: "Jinja/HTMX para aprobar winners antes de publish.",
      },
      {
        title: "Woo como checkout",
        description: "woo-store-co como tienda canonica Colombia.",
      },
      {
        title: "Enrich con fallback",
        description: "IA opcional; plantilla si no hay key — resiliencia.",
      },
    ],
    stack: ["Python", "FastAPI", "HTMX", "Postgres", "Redis", "WooCommerce", "Docker"],
    outcomes: [
      { value: "HITL", label: "Radar → score → aprobacion" },
      { value: "Woo", label: "Publish catalogo operable" },
      { value: "CO", label: "Checkout solo Colombia" },
    ],
    highlights: [
      "Commerce brain con control humano donde importa el margen.",
      "Separacion limpia landing vs tienda.",
      "Stack listo para VPS con compose.",
    ],
    architectureLayers: [
      "Feeds / Dropi",
      "Worker + scoring",
      "Panel operador HITL",
      "API catalogo FastAPI",
      "WooCommerce REST",
      "Postgres + Redis",
    ],
    decisions: [
      {
        title: "HITL vs full-auto publish",
        why: "Protege margen y reputacion de catalogo.",
      },
      {
        title: "Woo como checkout canonico",
        why: "La landing vende servicios; la tienda cobra productos.",
      },
      {
        title: "Monorepo packages",
        why: "Limites claros domain / api / worker.",
      },
    ],
    hiringFit:
      "Contrata esto si necesitas un lead de integraciones commerce que sepa donde poner control humano sin frenar el negocio (marketplaces, Woo, pricing). Empezamos con un mapa de canales, seguimos con un panel MVP y automatizamos por etapas.",
  },
  {
    slug: "plataforma-aprendizaje",
    tag: "EdTech & Payments",
    title: "Plataforma de curso + pagos",
    summary:
      "Django bilingue para vender curso experto: checkout invitado, Bold + PayPal, acceso 12 meses, examen de 100 preguntas y tutor IA con control de costo.",
    ...img("plataforma-aprendizaje"),
    productImage: "/images/captures/plataforma-aprendizaje/plataforma-aprendizaje-card.webp",
    gallery: [
      {
        src: "/images/captures/plataforma-aprendizaje/curso-home.png",
        alt: "Curso Claude Architect — landing ES",
        width: 1600,
        height: 1000,
        caption: "Landing bilingue ES: planes, promesa y CTA de checkout",
      },
      {
        src: "/images/captures/plataforma-aprendizaje/curso-home-en.png",
        alt: "Claude Architect course — English landing",
        width: 1600,
        height: 1000,
        caption: "Landing EN del mismo producto LMS",
      },
      {
        src: "/images/captures/plataforma-aprendizaje/curso-planes.png",
        alt: "Curso — planes y oferta",
        width: 1600,
        height: 1000,
        caption: "Oferta Fast-Track / Mentoring / B2B",
      },
      {
        src: "/images/captures/plataforma-aprendizaje/curso-home-mobile.png",
        alt: "Curso — landing mobile",
        width: 780,
        height: 1688,
        caption: "Landing mobile ES",
      },
    ],
    archCaption:
      "Visitante → Django LMS → Bold/PayPal → acceso 12 meses → lecciones/examen + tutor RAG sobre Postgres.",
    meta: [
      { label: "Dominio", value: "EdTech / LMS" },
      { label: "Rol", value: "Full-stack Product Owner" },
      { label: "Pagos", value: "Bold + PayPal" },
      { label: "Acceso", value: "12 meses" },
    ],
    context:
      "Producto digital de preparacion a certificacion Claude Architect: embudo sin friccion (checkout invitado), retencion, lead magnet, mentoring 1:1 y track B2B, con tutor IA rate-limited.",
    challenges: [
      "Cobrar global y local (PayPal + Bold).",
      "Liberar acceso automaticamente post-pago.",
      "Controlar costo del tutor IA.",
      "SEO/GEO/AEO + i18n ES/EN.",
    ],
    approach: [
      {
        title: "Django + HTMX",
        description: "LMS y catalogo con i18n nativo y Tailwind estatico.",
      },
      {
        title: "Pagos idempotentes",
        description: "Bold (HMAC) y PayPal Smart Buttons + webhooks.",
      },
      {
        title: "Tutor con guardrails",
        description: "RAG por keywords + cache/rate-limit.",
      },
      {
        title: "Growth loops",
        description: "Lead magnet mini-quiz y planes mentoring/B2B.",
      },
    ],
    stack: ["Django", "HTMX", "PostgreSQL", "Bold", "PayPal", "RAG", "Tailwind"],
    outcomes: [
      { value: "12m", label: "Acceso post-pago" },
      { value: "100", label: "Preguntas de examen" },
      { value: "2", label: "PSP (Bold + PayPal)" },
    ],
    highlights: [
      "Checkout invitado: cuenta creada tras el pago.",
      "Economia unitaria cuidada en el tutor IA.",
      "Listo para Render/Railway con WhiteNoise.",
    ],
    architectureLayers: [
      "Catalogo / landing ventas",
      "Accounts + acceso temporal",
      "Payments Bold/PayPal",
      "Courses + examen",
      "Assistant RAG",
      "Leads B2B / mentoring",
    ],
    decisions: [
      {
        title: "Checkout invitado",
        why: "Menos friccion = mas conversion en producto digital.",
      },
      {
        title: "Doble PSP",
        why: "Cobertura LatAm (Bold) + global (PayPal).",
      },
      {
        title: "Rate-limit del tutor",
        why: "El margen del curso no puede evaporarse en tokens.",
      },
    ],
    hiringFit:
      "Contrata esto si necesitas product/engineering senior en EdTech o growth-con-pagos que cuide la economia unitaria del producto, no solo el checkout. Entregables: embudo → cobro → acceso → retencion, con el tutor de IA bajo control de costo.",
  },
  {
    slug: "pagos-bold",
    tag: "Payments",
    title: "Integrador Bold (pagos_bold)",
    summary:
      "Libreria Python reutilizable para Bold: checkout, health checks, consola operativa y deploy Docker en VPS.",
    ...img("pagos-bold"),
    productImage: "/images/captures/bold/bold-card.webp",
    gallery: [
      {
        src: "/images/captures/bold/bold-console.png",
        alt: "Bold Console — dashboard de transacciones",
        width: 1600,
        height: 1000,
        caption: "Dashboard: facturacion, comision, aprobacion y volumen por comercio",
      },
      {
        src: "/images/captures/bold/bold-screen-01.png",
        alt: "Bold Console — listado de transacciones",
        width: 1600,
        height: 1000,
        caption: "Transacciones: estados, metodos y filtros operativos",
      },
      {
        src: "/images/captures/bold/bold-screen-02.png",
        alt: "Bold Console — comercios / tenants",
        width: 1600,
        height: 1000,
        caption: "Comercios multi-tenant y afiliacion",
      },
      {
        src: "/images/captures/bold/bold-screen-03.png",
        alt: "Bold Console — panel de integracion",
        width: 1600,
        height: 1000,
        caption: "Integracion: keys, webhooks y health del SDK",
      },
      {
        src: "/images/captures/bold/bold-screen-04.png",
        alt: "Bold Console — wizard de integracion",
        width: 1600,
        height: 1000,
        caption: "Wizard guiado para conectar un host a Bold",
      },
      {
        src: "/images/captures/bold/bold-screen-05.png",
        alt: "Bold Console — probar pago sandbox",
        width: 1600,
        height: 1000,
        caption: "Sandbox: probar checkout sin cobro real",
      },
    ],
    archCaption:
      "Producto host → SDK pagos_bold (Checkout + Health) → Bold API/webhooks; consola bold-console para operacion.",
    meta: [
      { label: "Dominio", value: "Payments LatAm" },
      { label: "Rol", value: "Integrations Engineer" },
      { label: "Forma", value: "SDK + consola" },
      { label: "Ops", value: "Docker VPS" },
    ],
    context:
      "Paquete de terceros (no afiliado a Bold SAS) para no reimplementar checkout/firma/webhooks en cada producto. Usado como pieza plug-in en plataformas propias.",
    challenges: [
      "Reutilizar integracion en varios hosts.",
      "Detectar misconfig temprano (health).",
      "Operar en VPS con path de deploy claro.",
    ],
    approach: [
      {
        title: "SDK tipado",
        description: "BoldSettings, CheckoutService, IntegrationHealth.",
      },
      {
        title: "Consola",
        description: "bold-console serve para operacion local.",
      },
      {
        title: "Deploy docs",
        description: "Scripts y guia de produccion Docker.",
      },
    ],
    stack: ["Python", "Bold API", "Docker", "Webhooks", "HMAC"],
    outcomes: [
      { value: "SDK", label: "Checkout reusable" },
      { value: "Health", label: "Checks de integracion" },
      { value: "VPS", label: "Deploy documentado" },
    ],
    highlights: [
      "Pensado como libreria, no como app atrapada.",
      "Idempotencia y firmas como ciudadanos de primera clase.",
      "Sirve a LMS y otros productos del portafolio.",
    ],
    architectureLayers: [
      "Host application",
      "pagos_bold SDK",
      "CheckoutService",
      "IntegrationHealth",
      "Bold API + webhooks",
      "bold-console / Docker",
    ],
    decisions: [
      {
        title: "Libreria vs monolito de pagos",
        why: "Un solo lugar para hardening; muchos productos consumidores.",
      },
      {
        title: "Health sync checks",
        why: "Falla rapido ante keys/env incorrectos.",
      },
      {
        title: "Path Docker VPS",
        why: "La integracion debe vivir en produccion, no solo en README.",
      },
    ],
    hiringFit:
      "Contrata esto si necesitas un especialista de pagos/PSP LatAm que no te deje atado a su cabeza: entrega un SDK operable con runbook. Empezamos con un health audit y seguimos con checkout, webhooks y documentacion real.",
  },
  {
    slug: "experiencia-recomendacion",
    tag: "Product / UX",
    title: "Embudo de recomendacion de cursos",
    summary:
      "Experiencia Flask de 60–90s que recomienda hasta 3 cursos segun interes, tiempo y modalidad, con CTA a tienda.",
    ...img("experiencia-recomendacion"),
    productImage: "/images/captures/experiencia-recomendacion/experiencia-recomendacion-card.webp",
    gallery: [
      {
        src: "/images/captures/experiencia-recomendacion/embudo-home.png",
        alt: "Chef del Saber — bienvenida del embudo de recomendacion",
        width: 1600,
        height: 1000,
        caption: "Paso inicial: captura de contacto y CTA al menu",
      },
      {
        src: "/images/captures/experiencia-recomendacion/embudo-interes.png",
        alt: "Chef del Saber — seleccion de interes",
        width: 1600,
        height: 1000,
        caption: "Paso de interes dentro del embudo de 60–90s",
      },
    ],
    archCaption:
      "5 pasos guiados → motor de reglas → menu ≤3 cursos → CTA tienda externa.",
    meta: [
      { label: "Dominio", value: "Growth / UX" },
      { label: "Rol", value: "Product Engineer" },
      { label: "Duracion", value: "60–90s" },
      { label: "Salida", value: "≤3 cursos" },
    ],
    context:
      "Flujo inspirado en experiencias de recomendacion de matrículas: convierte indecision en un menu corto accionable, sin IA costosa — reglas deterministicas y sesion Flask.",
    challenges: [
      "Completar embudo en menos de 90s.",
      "Recomendaciones explicables.",
      "CTA hacia tienda real sin rehacer checkout.",
    ],
    approach: [
      {
        title: "Wizard corto",
        description: "Bienvenida → interes → tiempo → modalidad → menu.",
      },
      {
        title: "Reglas",
        description: "Motor deterministico, barato y auditable.",
      },
      {
        title: "Handoff tienda",
        description: "CTA a catalogo externo de cursos.",
      },
    ],
    stack: ["Python", "Flask", "Jinja", "Sesion", "UX funnel"],
    outcomes: [
      { value: "5", label: "Pantallas del embudo" },
      { value: "≤3", label: "Cursos recomendados" },
      { value: "90s", label: "Duracion objetivo" },
    ],
    highlights: [
      "Conversion por claridad, no por chatbot.",
      "Costo marginal casi cero.",
      "Patron reutilizable en otros catalogos.",
    ],
    architectureLayers: [
      "Templates multi-paso",
      "Sesion Flask",
      "Motor de reglas",
      "Modelo de cursos",
      "CTA tienda",
    ],
    decisions: [
      {
        title: "Reglas vs LLM",
        why: "Explicabilidad y costo cero en un flujo corto.",
      },
      {
        title: "Menu corto",
        why: "Paralisis por exceso de opciones mata conversion.",
      },
      {
        title: "Checkout externo",
        why: "No reinventar pagos/matricula.",
      },
    ],
    hiringFit:
      "Contrata esto si tu equipo de growth/product necesita embudos medibles que conviertan por claridad, no por un LLM caro, con handoff limpio a tu tienda. Discovery → prototipo → instrumentacion.",
  },
  {
    slug: "sitio-mws",
    tag: "Agency Platform",
    title: "Sitio Medellin Web Soluciones",
    summary:
      "Sitio Django de la firma: servicios, proyectos, FAQ, portal, billing y hub de knowledge para el agente (sync de arquitectura/equipo/cotizaciones).",
    ...img("sitio-mws"),
    productImage: "/images/captures/sitio-mws/sitio-mws-card.webp",
    gallery: [
      {
        src: "/images/captures/sitio-mws/mws-home.png",
        alt: "Medellin Web Soluciones — home en produccion",
        width: 1600,
        height: 1000,
        caption: "Landing comercial en www.medellinweb.co",
      },
      {
        src: "/images/captures/sitio-mws/mws-agentes.png",
        alt: "MWS — pagina Agentes IA con atencion Nova",
        width: 1600,
        height: 1000,
        caption: "Agentes IA: oferta y atencion con Nova",
      },
      {
        src: "/images/captures/sitio-mws/mws-servicios.png",
        alt: "MWS — catalogo de servicios",
        width: 1600,
        height: 1000,
        caption: "Catalogo de servicios de la firma",
      },
      {
        src: "/images/captures/sitio-mws/mws-contacto.png",
        alt: "MWS — contacto y cotizacion",
        width: 1600,
        height: 1000,
        caption: "Contacto / cotizacion (entrada a CRM)",
      },
      {
        src: "/images/captures/sitio-mws/mws-home-mobile.png",
        alt: "MWS — home mobile",
        width: 780,
        height: 1688,
        caption: "Home mobile de la landing",
      },
    ],
    archCaption:
      "Django 6 sirve el sitio + agent_knowledge (RAG sync); Angular legacy permanece separado; Woo es checkout aparte.",
    meta: [
      { label: "Dominio", value: "Agency / Marketing" },
      { label: "Rol", value: "Technical Founder" },
      { label: "Servicios", value: "18 en catalogo" },
      { label: "AI", value: "Knowledge hub" },
    ],
    context:
      "La presencia comercial de MWS es tambien backend de conocimiento: sync de about, arquitectura y cotizaciones aceptadas hacia el agente, con i18n y operacion admin.",
    challenges: [
      "Unificar mensaje comercial y knowledge del agente.",
      "Separar front Angular historico del site Django.",
      "No mezclar checkout de productos con servicios.",
    ],
    approach: [
      {
        title: "Django site of record",
        description: "Paginas, servicios, blog, portal, billing.",
      },
      {
        title: "agent_knowledge",
        description: "Ingest/sync hacia RAG del assistant.",
      },
      {
        title: "Fronteras claras",
        description: "Angular aparte; Woo para tienda.",
      },
    ],
    stack: ["Django", "Python", "WhiteNoise", "PostgreSQL", "RAG", "Angular"],
    outcomes: [
      { value: "18", label: "Servicios documentados" },
      { value: "RAG", label: "Knowledge sync al agente" },
      { value: "Admin", label: "Operacion de contenidos" },
    ],
    highlights: [
      "El sitio alimenta al agente — no son silos.",
      "Arquitectura de agencia lista para crecer.",
      "SEO + operacion en un solo stack.",
    ],
    architectureLayers: [
      "Paginas marketing Django",
      "Catalogo de servicios",
      "Portal / billing",
      "agent_knowledge + embeddings",
      "Admin hub",
      "Estaticos WhiteNoise",
    ],
    decisions: [
      {
        title: "Django como source of truth",
        why: "Admin, SEO y knowledge en el mismo sistema.",
      },
      {
        title: "Sync selectivo al RAG",
        why: "El agente habla con datos curados, no con todo el CMS crudo.",
      },
      {
        title: "Tienda desacoplada",
        why: "Servicios ≠ SKUs de producto.",
      },
    ],
    hiringFit:
      "Contrata esto si necesitas un technical founder/lead que una el sitio comercial con el knowledge ops del agente de IA — un solo dueno tecnico, no un mosaico de proveedores. Engagement boutique de ownership total, con opcion de retainer.",
  },
  {
    slug: "crm-mws",
    tag: "Ops Comercial",
    title: "CRM operativo MWS",
    summary:
      "Embudo comercial con captacion SECOP/scraper+IA, temperatura y probabilidad, conversion a cliente y puente a finanzas — operacion diaria, no un CRM generico.",
    ...img("crm-mws"),
    productImage: "/images/captures/crm/crm-card.webp",
    gallery: [
      {
        src: "/images/captures/crm/crm-embudo.png",
        alt: "CRM MWS — embudo de leads con KPIs y filtros",
        width: 1600,
        height: 1000,
        caption: "Embudo operativo: KPIs, filtros y tabla de leads",
      },
      {
        src: "/images/captures/crm/crm-dashboard.png",
        alt: "CRM MWS — resumen operativo con KPIs",
        width: 1600,
        height: 1000,
        caption: "Resumen: clientes, embudo, proyectos y tiempo trabajado",
      },
      {
        src: "/images/captures/crm/crm-lead.png",
        alt: "CRM MWS — detalle de lead con temperatura y conversion",
        width: 1600,
        height: 1000,
        caption: "Detalle de lead: temperatura, probabilidad, expediente y conversion",
      },
      {
        src: "/images/captures/crm/crm-scrapeo.png",
        alt: "CRM MWS — scrapeo e ingestion de prospectos",
        width: 1600,
        height: 1000,
        caption: "Scrapeo/IA: captacion de prospectos y SECOP",
      },
      {
        src: "/images/captures/crm/crm-cotizaciones.png",
        alt: "CRM MWS — cotizaciones en el admin",
        width: 1600,
        height: 1000,
        caption: "Cotizaciones conectadas al embudo y clientes",
      },
      {
        src: "/images/captures/crm/crm-finanzas.png",
        alt: "CRM MWS — dashboard de finanzas en COP",
        width: 1600,
        height: 1000,
        caption: "Finanzas en el mismo admin: ingresos, gastos y flujo",
      },
      {
        src: "/images/captures/crm/crm-embudo-mobile.png",
        alt: "CRM MWS — embudo en mobile",
        width: 780,
        height: 1688,
        caption: "Embudo operable en viewport mobile",
      },
    ],
    archCaption:
      "Fuentes SECOP II + scraper/IA → embudo CRM (leads, temperatura, territorio) → clientes / cotizaciones / proyectos, con finanzas y conocimiento IA en el mismo admin.",
    meta: [
      { label: "Dominio", value: "CRM / Licitaciones" },
      { label: "Rol", value: "Full-stack / Ops" },
      { label: "Fuentes", value: "SECOP + Scraper/IA" },
      { label: "Stack", value: "Django Admin custom" },
    ],
    context:
      "Medellin Web Soluciones necesita un embudo operable: licitaciones publicas, prospectos perfilados por IA y seguimiento hasta cliente, con inteligencia financiera en el mismo ecosistema admin.",
    challenges: [
      "Ingerir licitaciones SECOP y prospectos scraper sin perder trazabilidad.",
      "Priorizar por temperatura, territorio y probabilidad — no por volumen.",
      "Conectar embudo comercial con finanzas y conocimiento IA.",
      "UI densa pero usable para operacion diaria (lista + detalle + KPIs).",
    ],
    approach: [
      {
        title: "Embudo como superficie principal",
        description:
          "KPIs, filtros y tabla de leads en una sola vista operativa.",
      },
      {
        title: "Fuentes publicas + IA",
        description:
          "Import SECOP II y captura scraper/SERP con perfilado automatico.",
      },
      {
        title: "Ciclo lead → cliente",
        description:
          "Detalle editable, temperatura/probabilidad y conversion a cliente.",
      },
      {
        title: "Finanzas en el mismo admin",
        description:
          "Resumen de ingresos/gastos/balance con acceso directo al CRM.",
      },
    ],
    stack: [
      "Django",
      "Admin custom",
      "PostgreSQL",
      "SECOP II",
      "Scraper / SERP",
      "IA de perfilado",
    ],
    outcomes: [
      { value: "Embudo", label: "Leads activos con KPIs" },
      { value: "SECOP", label: "Import de licitaciones" },
      { value: "IA", label: "Prospectos scraper + perfilado" },
      { value: "COP", label: "Finanzas ligadas al ops" },
    ],
    highlights: [
      "CRM hecho para operar licitaciones y prospectos en Colombia.",
      "Temperatura, territorio y probabilidad visibles en el embudo.",
      "Finanzas e IA de equipo en el mismo admin Django.",
    ],
    architectureLayers: [
      "Fuentes: SECOP II, scraper, SERP/IA",
      "Embudo CRM (KPIs + filtros + tabla)",
      "Detalle de lead / conversion a cliente",
      "Clientes, cotizaciones, proyectos, tareas",
      "Finanzas (ingresos / gastos / flujo)",
      "Conocimiento IA + Pomodoro ops",
    ],
    decisions: [
      {
        title: "Admin Django custom vs SaaS CRM",
        why: "Control total del dominio (SECOP, territorio, COP) sin renta por asiento.",
      },
      {
        title: "Embudo primero, no solo fichas",
        why: "La operacion diaria vive en la lista filtrable con KPIs.",
      },
      {
        title: "Finanzas al lado del CRM",
        why: "El cierre comercial y el cashflow se miran en el mismo sistema.",
      },
    ],
    hiringFit:
      "Contrata esto si tu equipo comercial opera en hojas de calculo y necesita un CRM a medida (licitaciones, captacion con IA, finanzas) sin pagar renta por asiento a un SaaS generico. Discovery → embudo → integraciones → operacion, con soporte continuo opcional.",
  },
  {
    slug: "landings-cliente",
    tag: "Delivery Boutique",
    title: "Landings de cliente",
    summary:
      "Entrega de landing profesional estatica (caso Julio Zapata): marca personal, build dist y deploy ligero.",
    ...img("landings-cliente"),
    productImage: "/images/captures/landings-cliente/landings-cliente-card.webp",
    gallery: [
      {
        src: "/images/captures/landings-cliente/jz-home.png",
        alt: "Julio Zapata — hero de landing de marca personal",
        width: 1600,
        height: 1000,
        caption: "Primer viewport: marca personal y CTA principal",
      },
    ],
    archCaption:
      "Diseno a medida → HTML/CSS/JS → build dist → hosting estatico con CTA de contacto.",
    meta: [
      { label: "Dominio", value: "Personal brand" },
      { label: "Rol", value: "Frontend delivery" },
      { label: "Forma", value: "Estatico" },
      { label: "Ops", value: "Deploy simple" },
    ],
    context:
      "Landings de alto acabado para profesionales: rapidas, baratas de hostear y con mensaje claro. Ejemplo del portafolio: juliocv / Julio Zapata.",
    challenges: [
      "Marca personal fuerte en primer viewport.",
      "Performance de sitio estatico.",
      "Deploy repetible.",
    ],
    approach: [
      {
        title: "Diseno a medida",
        description: "Sin plantilla generica; narrativa del cliente.",
      },
      {
        title: "Build estatico",
        description: "dist/ listo para hosting.",
      },
      {
        title: "CTA claro",
        description: "Contacto / siguiente paso sin ruido.",
      },
    ],
    stack: ["HTML", "CSS", "JavaScript", "Static hosting"],
    outcomes: [
      { value: "Static", label: "Hosting barato y rapido" },
      { value: "Brand", label: "Primer viewport con identidad" },
      { value: "Deploy", label: "Pipeline simple" },
    ],
    highlights: [
      "Entrega boutique enfocada en conversion personal.",
      "Sin CMS cuando no hace falta.",
      "Patron repetible para otros profesionales.",
    ],
    architectureLayers: [
      "Contenido / copy",
      "HTML semantico",
      "CSS/JS assets",
      "Build dist",
      "Deploy scripts",
    ],
    decisions: [
      {
        title: "Estatico vs CMS",
        why: "Menos superficie de ataque y costo casi cero.",
      },
      {
        title: "Custom vs theme",
        why: "La marca personal no puede verse generica.",
      },
      {
        title: "Un CTA principal",
        why: "Claridad > multiplica botones.",
      },
    ],
    hiringFit:
      "Contrata esto si necesitas una landing de marca personal con acabado senior y sin dramas de CMS. Scope cerrado, precio fijo, entrega rapida.",
  },
  {
    slug: "wp-ai-agent",
    tag: "Commerce + IA",
    title: "MWS AI — Agente de ventas WooCommerce",
    summary:
      "Plugin WordPress + SaaS con ingresos anuales recurrentes: un agente de ventas y soporte 24/7 que conoce tu inventario WooCommerce en tiempo real (RAG), responde en <2s y escala a un humano cuando importa.",
    ...img("wp-ai-agent"),
    productImage: "/images/captures/mws-ai/mws-ai-card.webp",
    gallery: [
      {
        src: "/images/captures/mws-ai/mws-ai-hero-chat.png",
        alt: "MWS AI — landing con widget de chat y RAG de inventario",
        width: 1024,
        height: 433,
        caption: "Landing del producto con widget AI Sales Assistant",
      },
      {
        src: "/images/captures/mws-ai/mws-ai-landing-agencia.png",
        alt: "MWS AI — canal agencias y agentes a medida",
        width: 844,
        height: 601,
        caption: "Canal agencias / distribuidores y agentes custom",
      },
      {
        src: "/images/captures/mws-ai/mws-ai-chat-shell.png",
        alt: "MWS AI — shell del widget de chat embebible",
        width: 634,
        height: 373,
        caption: "Shell del widget de chat del plugin WordPress",
      },
    ],
    archCaption:
      "Visitante Woo → widget MWS AI → SaaS (RAG catalogo + KB) → respuesta / handoff humano; licencia y admin en WP.",
    meta: [
      { label: "Dominio", value: "WooCommerce + AI" },
      { label: "Rol", value: "Product / Integration" },
      { label: "Host", value: "WordPress plugin + SaaS" },
      { label: "Foco", value: "Ventas 24/7 sin rewrite" },
    ],
    context:
      "MWS AI es el producto SaaS de Medellin Web Soluciones para agencias y empresas en USA/Espana: convierte cualquier tienda WooCommerce en un vendedor IA que responde con stock, tallas y precios reales, con planes anuales Growth/Enterprise — sin reescribir el negocio ni pedir claves de terceros en el plugin.",
    challenges: [
      "Vender y soportar 24/7 sin inflar el equipo.",
      "Responder con inventario real (sin alucinaciones de stock).",
      "Adoptar IA en sitios WP existentes sin migracion.",
      "Escalar a humano cuando el caso lo requiere.",
    ],
    approach: [
      {
        title: "Plugin en ecosistema WP",
        description: "Activacion por licencia, widget en tienda y monitor en wp-admin.",
      },
      {
        title: "RAG sobre WooCommerce",
        description: "Catalogo live: stock, variantes, precios y politicas.",
      },
      {
        title: "Handoff humano",
        description: "El equipo toma el chat cuando el agente no debe cerrar solo.",
      },
      {
        title: "SaaS con guardrails",
        description: "IA centralizada en MWS AI; planes Growth / Enterprise anuales.",
      },
    ],
    stack: ["WordPress", "WooCommerce", "PHP", "RAG", "SaaS", "REST"],
    outcomes: [
      { value: "24/7", label: "Ventas y soporte automaticos" },
      { value: "<2s", label: "Objetivo de respuesta" },
      { value: "RAG", label: "Inventario Woo real" },
    ],
    highlights: [
      "Producto real con landing, licencias y widget de chat en tienda.",
      "Conoce stock/tallas/precios; empuja checkout y escala a humano.",
      "Pensado para agencias (volumen) y empresas (Growth / Enterprise).",
      "Complementa el stack omnicanal y commerce de MWS.",
    ],
    architectureLayers: [
      "WordPress / WooCommerce storefront",
      "Plugin MWS AI (widget + admin)",
      "SaaS MWS AI (licencias, chat, embeddings)",
      "RAG catalogo + base de conocimiento",
      "Monitor / handoff humano",
    ],
    decisions: [
      {
        title: "Extender WP/Woo vs greenfield",
        why: "Preserva SEO, catalogo y habitos del equipo de la tienda.",
      },
      {
        title: "IA en SaaS (sin BYOK publico)",
        why: "Operacion, costo y guardrails centralizados; el plugin solo activa licencia.",
      },
      {
        title: "Agente acotado a ventas/soporte",
        why: "Menos riesgo de tono/costo fuera de control; handoff cuando importa.",
      },
    ],
    hiringFit:
      "Agencias/distribuidores en Espana y USA: canal white-label o volumen (margen recurrente Growth/Enterprise) — no es un pitch para contratarme como Solutions Architect. Tiendas Woo: licencia lista (audit → plugin → piloto). Demo en #mws-agencias o llamada de 15 min.",
  },
  {
    slug: "feeling-core-erp",
    tag: "ERP & Producto propio",
    title: "Feeling Core — ERP de bodega y eventos",
    summary:
      "ERP propio que unifica bodega, eventos, logística, proyectos y área comercial de una empresa de producción de eventos: un solo sistema con control de stock por estado, cotizaciones, KPIs en vivo y roles — reemplaza el caos de hojas de cálculo sueltas.",
    ...img("feeling-core-erp"),
    productImage: "/images/captures/feeling-core/feeling-core-card.webp",
    gallery: [
      {
        src: "/images/captures/feeling-core/feeling-inventario.png",
        alt: "Feeling Core — inventario de bodega con stock por estado",
        width: 1024,
        height: 640,
        caption: "Bodega: stock por estado (disponible/en uso/mantenimiento), categorías y filtros",
      },
      {
        src: "/images/captures/feeling-core/feeling-proyectos.png",
        alt: "Feeling Core — gestión de proyectos por cliente",
        width: 1024,
        height: 640,
        caption: "Proyectos: estado, prioridad, responsable y entrega por cliente",
      },
      {
        src: "/images/captures/feeling-core/feeling-eventos.png",
        alt: "Feeling Core — planificación y seguimiento de eventos",
        width: 1024,
        height: 640,
        caption: "Eventos: agenda, ubicación, personal y despachos",
      },
      {
        src: "/images/captures/feeling-core/feeling-login.png",
        alt: "Feeling Core — acceso con control de roles",
        width: 1024,
        height: 640,
        caption: "Acceso seguro con roles (admin, bodega, comercial) y bloqueo por intentos",
      },
    ],
    archCaption:
      "Login por rol → módulos operativos (bodega, eventos, proyectos, comercial) → MySQL único con dashboards de KPI y auditoría.",
    meta: [
      { label: "Dominio", value: "ERP / Operaciones" },
      { label: "Rol", value: "Product / Full-stack" },
      { label: "Stack", value: "Flask + MySQL" },
      { label: "Foco", value: "Un sistema para toda la operación" },
    ],
    context:
      "Una empresa de producción de eventos manejaba bodega, montajes, personal, proyectos y cotizaciones en hojas sueltas y WhatsApp. Feeling Core es el ERP que diseñé y construí para centralizar todo: inventario con stock por estado, agenda de eventos, logística de despachos, proyectos con tiempo y presupuesto, y un área comercial con cotizaciones numeradas — con dashboards que muestran el negocio en tiempo real.",
    challenges: [
      "Stock que se descuadra entre montajes (disponible vs en uso vs dañado).",
      "Cero visibilidad de proyectos, horas y cotizaciones en un solo lugar.",
      "Datos sensibles de clientes y operación sin control de acceso.",
      "Decisiones a ciegas por falta de KPIs consolidados.",
    ],
    approach: [
      {
        title: "Modelo de dominio unificado",
        description: "40+ entidades (inventario, eventos, despachos, proyectos, cotizaciones) en un esquema relacional coherente.",
      },
      {
        title: "Inventario por estado",
        description: "Cantidad disponible/en uso/mantenimiento/dañado, categorías, alertas de mínimos y auditorías.",
      },
      {
        title: "Dashboards en vivo",
        description: "KPIs de clientes, proyectos, cotizaciones, horas y tendencias a 6 meses sin exportar nada.",
      },
      {
        title: "Seguridad por rol",
        description: "Login PBKDF2, bloqueo por intentos y RBAC (admin/supervisor/bodega/comercial).",
      },
    ],
    stack: ["Python", "Flask", "SQLAlchemy", "MySQL", "Flask-Migrate", "Chart.js"],
    outcomes: [
      { value: "1", label: "Sistema para toda la operación" },
      { value: "40+", label: "Entidades de dominio modeladas" },
      { value: "Tiempo real", label: "KPIs sin hojas de cálculo" },
    ],
    highlights: [
      "Bodega con control de stock por estado, categorías y auditorías.",
      "Eventos, despachos, personal, vehículos y horas en un flujo logístico.",
      "Proyectos con tareas, tiempo, presupuestos y cotizaciones numeradas.",
      "Dashboards de KPI y control de acceso por rol.",
    ],
    architectureLayers: [
      "Acceso: login PBKDF2 + RBAC",
      "Bodega / inventario",
      "Eventos / despachos / logística",
      "Proyectos / comercial (cotizaciones)",
      "MySQL + dashboards KPI + auditoría",
    ],
    decisions: [
      {
        title: "Monolito modular (Flask + blueprints)",
        why: "Un dominio muy interconectado; los módulos comparten datos sin la complejidad de microservicios.",
      },
      {
        title: "MySQL relacional",
        why: "Integridad referencial entre inventario, eventos y comercial; reportes con SQL directo.",
      },
      {
        title: "RBAC desde el día uno",
        why: "Bodega, comercial y administración ven solo lo suyo — dato sensible protegido.",
      },
    ],
    hiringFit:
      "Producto propio end-to-end: modelé el dominio, construí backend, UI y dashboards, y lo puse a operar con datos reales. Si buscas alguien que traduzca una operación desordenada en un sistema usable, este es el ejemplo. Demo con datos de muestra en 15 min.",
  },
  {
    slug: "prestamos-fintech",
    tag: "Fintech & Backend",
    title: "ACCOOP — gestión de préstamos",
    summary:
      "Plataforma fintech para una cooperativa: solicitudes de crédito, scoring/aprobación, préstamos con amortización, cuotas y pagos, con API REST documentada (JWT + Swagger), panel administrativo y portal del asociado.",
    ...img("prestamos-fintech"),
    productImage: "/images/captures/prestamos/prestamos-card.webp",
    gallery: [
      {
        src: "/images/captures/prestamos/prestamos-solicitudes.png",
        alt: "ACCOOP — gestión de solicitudes de crédito con KPIs",
        width: 1024,
        height: 640,
        caption: "Solicitudes: pendientes, en evaluación, aprobadas y monto total",
      },
      {
        src: "/images/captures/prestamos/prestamos-clientes.png",
        alt: "ACCOOP — cartera de clientes/asociados",
        width: 1024,
        height: 640,
        caption: "Clientes / asociados con historial de crédito",
      },
      {
        src: "/images/captures/prestamos/prestamos-swagger.png",
        alt: "ACCOOP — API REST documentada con Swagger",
        width: 1024,
        height: 640,
        caption: "API REST documentada (DRF + Swagger/OpenAPI)",
      },
      {
        src: "/images/captures/prestamos/prestamos-django-admin.png",
        alt: "ACCOOP — panel Django admin",
        width: 1024,
        height: 640,
        caption: "Back-office sobre Django admin para operación interna",
      },
    ],
    archCaption:
      "Portal cliente y panel admin → API DRF con JWT y Swagger → dominio de crédito (solicitudes, préstamos, pagos) → base relacional.",
    meta: [
      { label: "Dominio", value: "Fintech / Crédito" },
      { label: "Rol", value: "Backend / Full-stack" },
      { label: "Stack", value: "Django + DRF" },
      { label: "Foco", value: "Crédito con API documentada" },
    ],
    context:
      "Una cooperativa necesitaba salir de los cálculos manuales de préstamos y llevar el ciclo completo a software: recibir solicitudes, evaluarlas, aprobar, generar el préstamo con su amortización, cobrar cuotas y controlar la cartera. Construí la plataforma con Django + DRF, con panel administrativo, portal del asociado y una API REST documentada para integraciones.",
    challenges: [
      "Cálculo manual de cuotas y saldos propenso a error.",
      "Sin trazabilidad del estado de cada solicitud y su cartera.",
      "Necesidad de integraciones (API) sin exponer la base directamente.",
      "Operación interna que requería un back-office confiable.",
    ],
    approach: [
      {
        title: "Ciclo de crédito completo",
        description: "Solicitud → evaluación/scoring → aprobación → préstamo → cuotas → pagos, cada uno con su estado.",
      },
      {
        title: "API REST documentada",
        description: "DRF + SimpleJWT + Swagger/OpenAPI: contrato claro para portal y terceros.",
      },
      {
        title: "Doble superficie",
        description: "Panel administrativo para la cooperativa y portal para el asociado.",
      },
      {
        title: "Back-office sobre Django admin",
        description: "Operación interna sin construir CRUD desde cero.",
      },
    ],
    stack: ["Python", "Django", "Django REST Framework", "SimpleJWT", "drf-yasg", "SQLite/MySQL"],
    outcomes: [
      { value: "100%", label: "Ciclo de crédito digitalizado" },
      { value: "API", label: "REST documentada con Swagger" },
      { value: "JWT", label: "Autenticación para integraciones" },
    ],
    highlights: [
      "Solicitudes con estados (pendiente, en evaluación, aprobada, rechazada) y KPIs.",
      "Préstamos con amortización, cuotas y control de cartera/pagos.",
      "API REST con JWT y documentación Swagger/ReDoc.",
      "Panel admin + portal del asociado sobre un mismo dominio.",
    ],
    architectureLayers: [
      "Canales: portal cliente + panel admin",
      "API DRF + JWT + Swagger",
      "Dominio: solicitudes / scoring",
      "Dominio: préstamos / cuotas / pagos",
      "Persistencia relacional (SQLite/MySQL)",
    ],
    decisions: [
      {
        title: "Django + DRF",
        why: "Admin listo, ORM robusto y DRF para una API bien tipada — velocidad sin sacrificar orden.",
      },
      {
        title: "JWT además de sesión",
        why: "La web usa sesión; las integraciones usan tokens, sin abrir la base.",
      },
      {
        title: "SQLite en dev, MySQL en prod",
        why: "Onboarding inmediato local; misma capa ORM para producción.",
      },
    ],
    hiringFit:
      "Backend de dominio sensible (dinero) con reglas explícitas, API documentada y seguridad por token. Si necesitas modelar un flujo financiero con trazabilidad y una API limpia, puedo replicarlo. Recorrido del sistema en una llamada de 15 min.",
  },
  {
    slug: "landing-mws",
    tag: "Frontend & Web",
    title: "Landing de agencia — Angular SPA",
    summary:
      "Landing de alto impacto para una agencia de software: SPA en Angular con hero animado, secciones de servicios y portafolio, y prueba social — pensada para convertir visitas en contactos, con build estático y foco en performance.",
    ...img("landing-mws"),
    productImage: "/images/captures/landing-mws-ng/landing-mws-ng-card.webp",
    gallery: [
      {
        src: "/images/captures/landing-mws-ng/landingng-home.png",
        alt: "Landing de agencia — hero animado y propuesta de valor",
        width: 1024,
        height: 640,
        caption: "Hero de alto impacto con una acción primaria clara",
      },
      {
        src: "/images/captures/landing-mws-ng/landingng-home-mobile.png",
        alt: "Landing de agencia — versión móvil responsive",
        width: 390,
        height: 844,
        caption: "Mobile-first: la mayoría del tráfico llega desde el móvil",
      },
    ],
    archCaption:
      "UX de conversión (hero + prueba social) → Angular SPA con componentes standalone → build estático optimizado para SEO/performance.",
    meta: [
      { label: "Dominio", value: "Marketing / Web" },
      { label: "Rol", value: "Frontend" },
      { label: "Stack", value: "Angular SPA" },
      { label: "Foco", value: "Convertir visitas en contactos" },
    ],
    context:
      "Una agencia necesitaba una landing que comunicara solidez y empujara al contacto. La construí como SPA en Angular: hero animado con propuesta clara, secciones de servicios y proyectos, prueba social (volumen de proyectos) y una única acción primaria — todo con build estático para bajo costo y buena performance.",
    challenges: [
      "Comunicar valor en segundos y guiar a una sola acción.",
      "Mantener animaciones atractivas sin sacrificar performance.",
      "Estructura escalable para agregar secciones sin desorden.",
      "Buen comportamiento en móvil, donde llega la mayoría del tráfico.",
    ],
    approach: [
      {
        title: "Hero orientado a conversión",
        description: "Mensaje claro + CTA primaria; jerarquía visual que lleva al contacto.",
      },
      {
        title: "Arquitectura por componentes",
        description: "Componentes standalone de Angular; secciones desacopladas y reutilizables.",
      },
      {
        title: "Prueba social",
        description: "Volumen de proyectos y servicios visibles arriba para generar confianza.",
      },
      {
        title: "Entrega estática",
        description: "Build optimizado sin runtime de servidor; menos superficie de fallo.",
      },
    ],
    stack: ["Angular", "TypeScript", "RxJS", "SCSS", "HTML5"],
    outcomes: [
      { value: "SPA", label: "Angular con componentes standalone" },
      { value: "1", label: "Acción primaria hacia el contacto" },
      { value: "Estático", label: "Build sin servidor, bajo costo" },
    ],
    highlights: [
      "Hero animado con propuesta de valor y CTA clara.",
      "Secciones de servicios y portafolio con prueba social.",
      "Arquitectura por componentes fácil de extender.",
      "Responsive mobile-first con foco en performance.",
    ],
    architectureLayers: [
      "UX de conversión (hero + prueba social)",
      "Angular SPA (componentes standalone)",
      "Build estático optimizado",
      "SEO / performance",
    ],
    decisions: [
      {
        title: "SPA en Angular",
        why: "Interacciones ricas y estructura por componentes para crecer sin deuda.",
      },
      {
        title: "Build estático",
        why: "Sin runtime de app = menor costo, latencia y superficie de fallo.",
      },
      {
        title: "Una sola CTA primaria",
        why: "Reduce la paradoja de elección y sube la conversión a contacto.",
      },
    ],
    hiringFit:
      "Frontend orientado a negocio: no solo se ve bien, está pensado para convertir. Si necesitas una landing que traduzca tráfico en leads, puedo diseñarla y construirla. Reviso tu caso en una llamada de 15 min.",
  },
  {
    slug: "automatizacion-datos",
    tag: "Automatización & Datos",
    title: "Google Places Scraper — prospección",
    summary:
      "Herramienta en Python/Streamlit para prospección comercial: busca negocios por zona geográfica y tipo usando la API de Google Places, normaliza los datos (nombre, dirección, teléfono, rating) y los exporta a CSV/JSON listos para CRM o campañas.",
    ...img("automatizacion-datos"),
    productImage: "/images/captures/google-places/google-places-card.webp",
    gallery: [
      {
        src: "/images/captures/google-places/places-app.png",
        alt: "Google Places Scraper — prospección geolocalizada",
        width: 1024,
        height: 640,
        caption: "Búsqueda por geo/tipo, resultados normalizados y export",
      },
      {
        src: "/images/captures/google-places/places-app-mobile.png",
        alt: "Google Places Scraper — vista móvil",
        width: 390,
        height: 844,
        caption: "UI Streamlit responsive, usable desde el móvil",
      },
    ],
    archCaption:
      "Parámetros (geo + tipo) → API de Google Places con paginación → normalización → export CSV/JSON + historial.",
    meta: [
      { label: "Dominio", value: "Automatización" },
      { label: "Rol", value: "Data / Tooling" },
      { label: "Stack", value: "Python + Streamlit" },
      { label: "Foco", value: "Prospección sin trabajo manual" },
    ],
    context:
      "No todo problema necesita una plataforma: a veces una micro-herramienta bien hecha ahorra horas. Construí un scraper de Google Places que arma listas de prospección por zona y tipo de negocio: en lugar de copiar datos de mapas uno por uno, define geo + categoría, obtiene los lugares con su detalle y exporta todo limpio para usarlo en CRM o campañas.",
    challenges: [
      "Prospección manual copiando datos de mapas, una por una.",
      "Rate limits y paginación de la API de Places.",
      "Datos crudos con duplicados y campos inconsistentes.",
      "Necesidad de una UI usable sin instalar nada complejo.",
    ],
    approach: [
      {
        title: "Scraper geolocalizado",
        description: "Búsqueda por lat/lng, radio y tipo; detalle por lugar (dirección, teléfono, rating).",
      },
      {
        title: "Manejo de límites",
        description: "Paginación y pausas para respetar rate limits sin perder resultados.",
      },
      {
        title: "Normalización y export",
        description: "Datos limpios y deduplicados exportados a CSV/JSON para CRM/campañas.",
      },
      {
        title: "UI Streamlit",
        description: "Interfaz web inmediata: parametrizar y descargar, sin fricción.",
      },
    ],
    stack: ["Python", "Streamlit", "Google Places API", "pandas", "requests"],
    outcomes: [
      { value: "Horas", label: "Ahorro por lista de prospección" },
      { value: "CSV/JSON", label: "Export listo para CRM" },
      { value: "1-click", label: "Descarga inmediata" },
    ],
    highlights: [
      "Prospección geolocalizada por zona y tipo de negocio.",
      "Manejo de paginación y rate limits de la API de Places.",
      "Datos normalizados (nombre, dirección, teléfono, rating) exportables.",
      "UI Streamlit lista para usar sin instalación local.",
    ],
    architectureLayers: [
      "Entrada: parámetros geo + tipo",
      "Proceso: Google Places API (paginación)",
      "Normalización y deduplicado",
      "Salida: CSV/JSON + historial",
    ],
    decisions: [
      {
        title: "Streamlit sobre SPA",
        why: "Time-to-value: una herramienta interna útil en horas, no en semanas.",
      },
      {
        title: "Export a formatos operativos",
        why: "CSV/JSON que encajan directo en el flujo real (CRM, campañas).",
      },
      {
        title: "Pausas anti rate-limit",
        why: "Prioriza completar el trabajo sobre velocidad bruta con la API.",
      },
    ],
    hiringFit:
      "Pragmatismo: identifico trabajo repetitivo y lo automatizo con la herramienta correcta (a veces un script, no una plataforma). Si tienes una tarea manual que se repite, probablemente la puedo eliminar. Cuéntamela en una llamada corta.",
  },
];

export const solutionsEn: SolutionDetail[] = [
  {
    slug: "orquestacion-agentes",
    tag: "AI & Architecture",
    title: "Autonomous Agent Orchestration (Nova)",
    summary:
      "CrewAI agency with CEO, 5 divisions and 29 specialists running real work 24/7 — FastAPI, 3D graph, SSE traces and local inference. This isn't a chatbot with a nice name: it's a business operated by AI.",
    ...img("orquestacion-agentes"),
    productImage: "/images/captures/nova/nova-card.webp",
    gallery: [
      {
        src: "/images/captures/nova/nova-engine-agentes.png",
        alt: "Nova — live orchestration graph with roles and timeline",
        width: 1600,
        height: 1000,
        caption: "/visual panel: CEO, divisions and specialists as an operable system",
      },
      {
        src: "/images/captures/nova/nova-catalogo-perfiles.png",
        alt: "Nova — MIT agent profile catalog",
        width: 1600,
        height: 1000,
        caption: "MIT agency-agents catalog mapped to Nova roles",
      },
      {
        src: "/images/captures/nova/nova-configuracion.png",
        alt: "Nova — per-agent configuration hub",
        width: 1600,
        height: 1000,
        caption: "Per-agent configuration without redeploy",
      },
      {
        src: "/images/captures/nova/nova-arquitecturas.png",
        alt: "Nova — system architectures and topologies",
        width: 1600,
        height: 1000,
        caption: "Architectures: topologies and runtime layers",
      },
      {
        src: "/images/captures/nova/nova-hud-sistemas.png",
        alt: "Nova — subsystem health HUD",
        width: 1600,
        height: 1000,
        caption: "HUD for LLM, voice, vision and tool subsystems",
      },
      {
        src: "/images/captures/nova/nova-rag-aprendizaje.png",
        alt: "Nova — RAG and learning console",
        width: 1600,
        height: 1000,
        caption: "RAG console: chunks, domain packs and validation",
      },
      {
        src: "/images/captures/nova/nova-tokens.png",
        alt: "Nova — token usage and providers",
        width: 1600,
        height: 1000,
        caption: "FinOps: tokens, calls and provider cascade",
      },
      {
        src: "/images/captures/nova/nova-engine-agentes-mobile.png",
        alt: "Nova — visual panel on mobile",
        width: 780,
        height: 1688,
        caption: "Operational surface on mobile viewport",
      },
    ],
    archCaption:
      "Partial control-plane map: operator and live panel → orchestration API → director hub / divisions / specialists → local inference, bounded tools and state. No private configs or full agent inventory.",
    video: "/media/ejecucion-agentes-ia.mp4",
    videoPoster: "/images/captures/nova/nova-engine-agentes.png",
    meta: [
      { label: "Domain", value: "Agentic AI / Ops" },
      { label: "Role", value: "Solutions Architect / Owner" },
      { label: "Model", value: "Local-first + API" },
      { label: "Scale", value: "29 specialists + CEO" },
    ],
    context:
      "Nova MWS is a real orchestration product, not a chatbot with a nice name. It coordinates a network of 29 specialist agents (research, content, ops) with per-agent config, live traceability and a direct bridge into MWS business data.",
    challenges: [
      "Cut manual ops without losing control.",
      "Keep privacy with local inference when needed.",
      "Make a 30-role network observable.",
      "Ship reproducibly (Docker / VPS).",
    ],
    approach: [
      {
        title: "Multi-agent design",
        description:
          "CEO + divisions + 29 specialists with explicit routing and runtime overrides.",
      },
      {
        title: "API + ops panels",
        description: "FastAPI with /visual, /vivo (SSE), /configuracion and health.",
      },
      {
        title: "Local inference & tools",
        description: "Ollama plus MCP/Composio/MWS tools for real work.",
      },
      {
        title: "Observability",
        description: "Run traces, optional Langfuse, module status in config.",
      },
    ],
    stack: [
      "Python",
      "CrewAI",
      "FastAPI",
      "Ollama",
      "RAG",
      "MCP",
      "Docker",
      "SSE",
    ],
    outcomes: [
      { value: "29+1", label: "Specialists + CEO orchestrated" },
      { value: "12.2M", label: "Tokens and 296 crew calls for ~USD 29.90 (14-provider cascade)" },
      { value: "2,749", label: "RAG chunks indexed over 159 first-party documents" },
      { value: "11", label: "Subsystems monitored in the health HUD" },
      { value: "24/7", label: "Continuous ops with traces" },
      { value: "Local", label: "Private inference via Ollama" },
    ],
    highlights: [
      "Ships with visual panel and live execution—not a notebook demo.",
      "Local-first architecture with controlled external tools.",
      "End-to-end ownership: agents, API, ops UI, deploy.",
    ],
    architectureLayers: [
      "Ops UI: /visual, /vivo, /configuracion",
      "FastAPI: run, SSE stream, graph, health",
      "CrewAI orchestration: CEO → hubs → specialists",
      "Inference: Ollama + per-agent overrides",
      "Tools: MCP, Composio, MWS pack, n8n",
      "Data: SQLite/PostgreSQL + runtime overrides",
    ],
    decisions: [
      {
        title: "Local-first vs cloud-only LLMs",
        why: "Privacy, predictable cost, customer perimeter control.",
      },
      {
        title: "Specialist network vs one assistant",
        why: "Domain routing and clear capability ownership.",
      },
      {
        title: "Per-agent config without redeploy",
        why: "Operate prompts/models/tools from a panel, not git every time.",
      },
    ],
    hiringFit:
      "Hire this if you need a Solutions Architect / AI automation lead who has already proven a 29-agent ecosystem can run in production, not just in a notebook. We start with a 15-min call; if scope calls for it, I stay on as an ongoing retainer.",
  },
  {
    slug: "sistemas-criticos",
    tag: "Enterprise Architecture",
    title: "Scalability in Critical Systems",
    summary:
      "Backend and microservices modernization for high availability under corporate standards (Carga Control / Feeling) — without stopping the business while the engine gets rebuilt.",
    ...img("sistemas-criticos"),
    productImage: "/images/captures/sistemas-criticos/sistemas-criticos-card.webp",
    gallery: [
      {
        src: "/images/captures/sistemas-criticos/sistemas-criticos-area.png",
        alt: "Critical systems workstation — monitors, telemetry and code",
        width: 1600,
        height: 1000,
        caption: "HA platform ops: telemetry, code and continuous monitoring",
      },
    ],
    archCaption:
      "Clients → load balancer → redundant service cluster, primary + replica DB and cross-cutting observability.",
    video: "/media/area-desarrollo.mp4",
    videoPoster: "/images/poster-area.png",
    meta: [
      { label: "Domain", value: "Platform / HA" },
      { label: "Role", value: "Senior Architect / Full-Stack" },
      { label: "Focus", value: "High availability" },
      { label: "Standard", value: "Enterprise" },
    ],
    context:
      "High-volume systems where downtime has real cost. Backend diagnosis, phased microservice migration, HA/redundancy and observability without stopping the business.",
    challenges: [
      "Sustain peaks without SPOFs.",
      "Migrate the monolith without a big-bang.",
      "Meet corporate stability standards.",
      "Operate on metrics, not intuition.",
    ],
    approach: [
      {
        title: "Performance diagnosis",
        description: "Bottlenecks and architecture debt prioritized by impact.",
      },
      {
        title: "Progressive migration",
        description: "Extract critical services with clear API contracts.",
      },
      {
        title: "HA and redundancy",
        description: "Balancing, replicas, remove single points of failure.",
      },
      {
        title: "Observability",
        description: "Metrics, logs, traces for evidence-based incident response.",
      },
    ],
    stack: ["Node.js", "Microservices", "REST", "Docker", "PostgreSQL", "Observability"],
    outcomes: [
      { value: "HA", label: "Design without SPOFs" },
      { value: "Phased", label: "Migration without business cutover" },
      { value: "Ops", label: "Metrics-driven operations" },
    ],
    highlights: [
      "Modernization compatible with operational continuity.",
      "Platform engineering focus—not cosmetic rewrite.",
      "Ready for corporate stability scrutiny.",
    ],
    architectureLayers: [
      "Edge / load balancer",
      "Microservice cluster",
      "Versioned REST APIs",
      "Primary + replica data",
      "Docker containers",
      "Cross-cutting observability",
    ],
    decisions: [
      {
        title: "Phased migration vs rewrite",
        why: "Protects revenue and reduces regression risk.",
      },
      {
        title: "Split only where it hurts",
        why: "Avoids cosmetic microservices and ops cost.",
      },
      {
        title: "Observability before blind scale-out",
        why: "Scaling without telemetry multiplies chaos.",
      },
    ],
    hiringFit:
      "Hire this if your backend outgrew its architecture and downtime already costs you real money. Fits as a Staff/Senior Platform role, or as a one-off audit followed by phased implementation.",
  },
  {
    slug: "auge-urbano",
    tag: "PropTech & SEO",
    title: "End-to-End PropTech Platform (Auge Urbano)",
    summary:
      "Real-estate portal deployed on a VPS: 159 Flask routes over MySQL 8 with 45 tables, an in-house CRM, partner and street-scout portals, embedded AI agents and a SEO/GEO/AEO stack with IndexNow. ~43,000 lines of Python that run the whole business, not a landing page with a form.",
    ...img("auge-urbano"),
    productImage: "/images/captures/auge/auge-card.webp",
    gallery: [
      {
        src: "/images/captures/auge/auge-home.webp",
        alt: "Auge Urbano — home with rotating hero and catalogue counters",
        width: 1600,
        height: 1000,
        caption: "Home: rotating hero and counters served from the database (34 active, 5 zones)",
      },
      {
        src: "/images/captures/auge/auge-catalogo.webp",
        alt: "Auge Urbano — catalogue with specialised search by region, municipality, commune and neighbourhood",
        width: 1600,
        height: 1000,
        caption: "Catalogue: specialised search over the four-level geo master",
      },
      {
        src: "/images/captures/auge/auge-ficha.webp",
        alt: "Auge Urbano — listing page with gallery, citable summary and appraisal data",
        width: 1600,
        height: 1000,
        caption: "Listing: WebP gallery, LLM-citable summary (AEO) and appraisal/stratum data",
      },
      {
        src: "/images/captures/auge/auge-zonas.webp",
        alt: "Auge Urbano — browse by sector with price ranges and cost per m2",
        width: 1600,
        height: 1000,
        caption: "Zones: budget filters plus aggregated price and cost per m2",
      },
      {
        src: "/images/captures/auge/auge-home-mobile.png",
        alt: "Auge Urbano — mobile home",
        width: 780,
        height: 1688,
        caption: "Home on mobile viewport",
      },
      {
        src: "/images/captures/auge/auge-catalogo-mobile.png",
        alt: "Auge Urbano — mobile catalogue",
        width: 780,
        height: 1688,
        caption: "Catalogue on mobile viewport",
      },
    ],
    archCaption:
      "Nginx (TLS, canonical apex, 301 from www) → Gunicorn 3 workers x 2 threads → modular Flask monolith with 159 routes → MySQL 8 InnoDB (45 tables) plus an uploads volume; on top, AI agents (public advisor, business copilot, listing SEO) and the discovery pack of sitemaps + llms.txt + ai.txt.",
    meta: [
      { label: "Sector", value: "Real Estate / PropTech" },
      { label: "Role", value: "Full-stack owner" },
      { label: "Scale", value: "159 routes · 45 tables" },
      { label: "Deployment", value: "Docker + Nginx on VPS" },
    ],
    context:
      "Auge Urbano sells residential property in Medellín and the Aburrá Valley. The platform is not a brochure: it is the system the business runs on — a listing catalogue with ~900 photos, a lead and closing CRM, a portal for partner agents, a portal for street scouts, blog, finance and a ranking engine built for Google and for LLMs alike.",
    challenges: [
      "One system, three audiences with their own session: buyer, partner agent and street scout.",
      "Run the business without an external CRM: leads, contacts, viewings, closings, income and expenses in the same admin.",
      "Rank a small catalogue in a saturated market and make it citable by LLMs, not just indexable by Google.",
      "Serve ~25 photos per listing without wrecking LCP on mid-range phones.",
      "Normalise Aburrá Valley geography (municipality → commune/rural district → neighbourhood) for filters, URLs and GEO signals.",
      "Expose AI agents to the internet without opening the door to prompt injection or leaking integration keys.",
    ],
    approach: [
      {
        title: "Modularised Flask monolith",
        description:
          "159 routes in a single process, with the domain split across 33 Python modules (geo, amenities, SEO, AI, finance, payments, mail) imported as packages instead of a new framework per feature.",
      },
      {
        title: "Switchable dual persistence",
        description:
          "MySQL 8 InnoDB utf8mb4 in production (45 tables, 440 columns, 21 foreign keys, 115 indexes) with SQLite as a rescue mode via AUGE_FORCE_SQLITE; the same code creates and backfills the schema on both engines.",
      },
      {
        title: "Portals with their own auth",
        description:
          "Unlinked admin, a /colega portal (signup, listings, agenda, orders, email password reset) and a scout portal with phone + municipality dedup and a bonus settled when the sale closes.",
      },
      {
        title: "In-house SEO/GEO/AEO stack",
        description:
          "14 intent landings plus neighbourhood-driven dynamic landings, RealEstateListing/FAQPage JSON-LD, a sitemap index with 99 URLs and 800 images, and automatic pings to IndexNow and the Google Indexing API on publish.",
      },
      {
        title: "Embedded AI, not a demo",
        description:
          "Commercial advisor on landings, a business copilot that answers on KPIs with Chart.js charts, and bulk SEO/AEO generation per listing; OpenAI or Gemini with provider fallback and prompt presets versioned in the database.",
      },
      {
        title: "Audited WebP pipeline",
        description:
          "Automatic conversion on upload, per-file log in the database and an optimisation modal in the admin: 1,338 recorded conversions, from 459 MB down to 53 MB of source images.",
      },
    ],
    stack: [
      "Python 3.12",
      "Flask",
      "Gunicorn",
      "MySQL 8 / InnoDB",
      "PyMySQL",
      "Jinja2",
      "Pillow",
      "OpenAI + Gemini",
      "Bold Link API",
      "GA4 + Search Console",
      "Docker",
      "Nginx",
    ],
    outcomes: [
      { value: "159", label: "Flask routes in production" },
      { value: "45", label: "InnoDB tables (440 columns, 21 FKs)" },
      { value: "-88%", label: "Image weight after WebP (459 → 53 MB)" },
      { value: "597", label: "Normalised geo nodes (22 municipalities · 232 zones · 343 neighbourhoods)" },
      { value: "99", label: "Automated tests with pytest" },
      { value: "20", label: "Event types in first-party telemetry" },
    ],
    highlights: [
      "Real deployment: a Gunicorn container behind Nginx with Let's Encrypt TLS and a canonical apex — not a local demo.",
      "Full real-estate CRM (leads, contacts, viewings, closings, referrals, income and expenses) with no per-seat fee.",
      "AI agents exposed to the internet behind prompt-injection and SQLi guards, honeypot and rate limiting on public forms.",
      "Colombian closing costs encoded in the simulator: notary 0.54%, charity levy 1%, registry 0.67% and 1% / 2.5% withholding by threshold.",
      "First-party funnel telemetry (form_start → form_change → form_submit) so the business does not depend on GA4 alone.",
    ],
    architectureLayers: [
      "Nginx: Let's Encrypt TLS, 301 www → apex, body up to 300 MB",
      "Gunicorn: 3 workers x 2 threads, 120s timeout",
      "Flask: 159 routes (public, admin, /colega, /captador, JSON API)",
      "Domain: 33 Python modules (geo, amenities, SEO, AI, finance, payments)",
      "MySQL 8 InnoDB utf8mb4: 45 tables with idempotent self-creating schema",
      "/app/instance volume: rescue database and lead/scout uploads",
      "AI: OpenAI/Gemini with fallback, guards and keys in integration_settings",
      "Discovery: robots, sitemap index, image sitemap, llms.txt, ai.txt, JSON-LD catalogue",
    ],
    decisions: [
      {
        title: "MySQL 8 in production with SQLite as switchable fallback",
        why: "A catalogue with ~900 media items, business aggregates and the geo master needs real InnoDB indexes; SQLite stays as a recovery path if MySQL or its credentials fail, running the very same schema code.",
      },
      {
        title: "Modular monolith instead of microservices",
        why: "A business run by a small team does not need network boundaries: boundaries live in Python modules and operating cost stays at one container plus a proxy.",
      },
      {
        title: "Idempotent schema on boot instead of migrations",
        why: "ensure_*_schema functions plus seeds create and backfill tables on every boot; a reproducible deploy without maintaining a migration runner for a single operator.",
      },
      {
        title: "AEO and GEO as data, not as template",
        why: "Every listing stores its primary question, answer snippet, extra FAQ and coordinates: what an LLM can cite is edited in the admin, not improvised in the HTML.",
      },
      {
        title: "Own guards before exposing AI to the public",
        why: "Internal markers, prompt-injection and SQLi detection, honeypot and in-memory rate limiting: enough protection without adding dependencies or a paid WAF.",
      },
    ],
    hiringFit:
      "Hire this if you need a full-stack who understands the real-estate vertical end to end — catalogue, CRM, third-party portals, payments, SEO/AEO and AI agents — and leaves it running on your own infrastructure instead of spread across five SaaS tools. Discovery → working product → automation and AI once volume justifies it.",
  },
  {
    slug: "lexia-legal-os",
    tag: "Vertical AI Product",
    title: "LEXIA — Legal Intelligence OS",
    summary:
      "Legal operating system with FastAPI, Streamlit OS and Dash analytics: a full Python product for AI-assisted legal work.",
    ...img("lexia-legal-os"),
    productImage: "/images/captures/lexia/lexia-card.webp",
    gallery: [
      {
        src: "/images/captures/lexia/lexia-os.png",
        alt: "LEXIA — legal OS in production",
        width: 1600,
        height: 1000,
        caption: "Streamlit OS in production (lexia.medellinweb.co)",
      },
      {
        src: "/images/captures/lexia/lexia-os-mobile.png",
        alt: "LEXIA — OS on mobile",
        width: 780,
        height: 1688,
        caption: "Legal OS on mobile viewport",
      },
    ],
    archCaption:
      "User → Streamlit OS / Dash analytics → FastAPI → legal AI domain + data store, Docker-packaged.",
    meta: [
      { label: "Domain", value: "LegalTech" },
      { label: "Role", value: "Product Architect" },
      { label: "Stack", value: "Python-only" },
      { label: "Surfaces", value: "API · OS · Analytics" },
    ],
    context:
      "LEXIA treats legal work as an OS—not a loose chat. Operational surface (Streamlit), analytics (Dash) and API are separated, with demo seed and Docker path to production.",
    challenges: [
      "Multi-surface product without splitting the domain.",
      "Reproducible demo onboarding.",
      "Serious deploy (dev vs prod).",
      "Distinct user roles (ops vs analytics).",
    ],
    approach: [
      {
        title: "API as core",
        description: "FastAPI owns domain and contracts.",
      },
      {
        title: "Streamlit OS",
        description: "Fast operational UI for daily flow.",
      },
      {
        title: "Dash analytics",
        description: "Separate managerial/analytical reads.",
      },
      {
        title: "Dual Docker",
        description: "Dev compose plus production VPS guide.",
      },
    ],
    stack: ["Python", "FastAPI", "Streamlit", "Dash", "Docker"],
    outcomes: [
      { value: "3", label: "Integrated product surfaces" },
      { value: "Demo", label: "Seed + evaluation login" },
      { value: "VPS", label: "Documented Docker path" },
    ],
    highlights: [
      "Vertical product ownership—not just an integration.",
      "Python end-to-end without React dependency.",
      "Built for commercial demos and real ops.",
    ],
    architectureLayers: [
      "Streamlit OS (ops)",
      "Dash (analytics)",
      "FastAPI (domain)",
      "Auth / demo roles",
      "Data + seed scripts",
      "Docker infra",
    ],
    decisions: [
      {
        title: "Python-only vs React SPA",
        why: "Faster vertical delivery with one language/team.",
      },
      {
        title: "OS separated from analytics",
        why: "Different jobs-to-be-done and usage cadence.",
      },
      {
        title: "First-class demo seed",
        why: "Sales and QA need a reproducible environment.",
      },
    ],
    hiringFit:
      "Hire this if you need a vertical-product architect for a regulated sector (LegalTech and similar) who delivers API, ops UX and analytics as one system—not three vendors that don't talk to each other.",
  },
  {
    slug: "omnicanal-comercio",
    tag: "Commerce & Integrations",
    title: "Omnichannel + WooCommerce Colombia",
    summary:
      "Omnichannel brain (owned stock + dropship) with HITL panel, Dropi radar, catalog API and Colombia-only Woo store.",
    ...img("omnicanal-comercio"),
    productImage: "/images/captures/omnicanal/omnicanal-card.webp",
    gallery: [
      {
        src: "/images/captures/omnicanal/omnicanal-oportunidades.png",
        alt: "Omnichannel MWS — AliExpress/MeLi opportunity radar",
        width: 1600,
        height: 1000,
        caption: "HITL radar: AliExpress URL, scoring and human approval",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-panel.png",
        alt: "Omnichannel MWS — Colombia ops dashboard",
        width: 1600,
        height: 1000,
        caption: "Dashboard: SKUs, low stock, POs and recent products",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-productos.png",
        alt: "Omnichannel MWS — product catalog",
        width: 1600,
        height: 1000,
        caption: "Ops catalog: SKUs, COP prices and publish controls",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-trends.png",
        alt: "Omnichannel MWS — demand trends",
        width: 1600,
        height: 1000,
        caption: "Trends: search queries and demand scans",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-stock.png",
        alt: "Omnichannel MWS — stock control",
        width: 1600,
        height: 1000,
        caption: "Owned stock vs dropship in one panel",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-settings.png",
        alt: "Omnichannel MWS — settings and integrations",
        width: 1600,
        height: 1000,
        caption: "Settings: margins, channels and connections",
      },
      {
        src: "/images/captures/omnicanal/omnicanal-panel-mobile.png",
        alt: "Omnichannel — panel on mobile",
        width: 780,
        height: 1688,
        caption: "Ops surface on mobile viewport",
      },
    ],
    archCaption:
      "Dropi feeds → worker/scoring → HITL panel → FastAPI catalog → WooCommerce CO, with Postgres/Redis.",
    meta: [
      { label: "Domain", value: "E-commerce ops" },
      { label: "Role", value: "Tech Lead Commerce" },
      { label: "Control", value: "HITL opportunities" },
      { label: "Checkout", value: "WooCommerce CO" },
    ],
    context:
      "Keep marketing separate from checkout: the omnichannel brain decides what to publish; WooCommerce Colombia charges. Includes opportunity radar, AI enrich with template fallback, and Tecnopets as a Woo vertical.",
    challenges: [
      "Hybrid owned stock + dropship.",
      "No junk publish: score + human approval.",
      "Woo REST/webhooks integration.",
      "Day-to-day ops via panel, not only scripts.",
    ],
    approach: [
      {
        title: "Domain + worker",
        description: "Pricing/inventory packages and radar worker.",
      },
      {
        title: "HITL panel",
        description: "Jinja/HTMX to approve winners before publish.",
      },
      {
        title: "Woo as checkout",
        description: "woo-store-co as Colombia canonical store.",
      },
      {
        title: "Enrich with fallback",
        description: "Optional AI; template if no key—resilience.",
      },
    ],
    stack: ["Python", "FastAPI", "HTMX", "Postgres", "Redis", "WooCommerce", "Docker"],
    outcomes: [
      { value: "HITL", label: "Radar → score → approval" },
      { value: "Woo", label: "Operable catalog publish" },
      { value: "CO", label: "Colombia-only checkout" },
    ],
    highlights: [
      "Commerce brain with human control where margin matters.",
      "Clean split between landing and store.",
      "VPS-ready compose stack.",
    ],
    architectureLayers: [
      "Feeds / Dropi",
      "Worker + scoring",
      "Operator HITL panel",
      "FastAPI catalog",
      "WooCommerce REST",
      "Postgres + Redis",
    ],
    decisions: [
      {
        title: "HITL vs full-auto publish",
        why: "Protects margin and catalog reputation.",
      },
      {
        title: "Woo as canonical checkout",
        why: "Landing sells services; store sells products.",
      },
      {
        title: "Package monorepo",
        why: "Clear domain / api / worker boundaries.",
      },
    ],
    hiringFit:
      "Hire this if you need a commerce integrations lead who knows where to put human control without slowing the business (marketplaces, Woo, pricing). We start with a channel map, move to a panel MVP, and automate in stages.",
  },
  {
    slug: "plataforma-aprendizaje",
    tag: "EdTech & Payments",
    title: "Course platform + payments",
    summary:
      "Bilingual Django LMS: guest checkout, Bold + PayPal, 12-month access, 100-question exam and cost-controlled AI tutor.",
    ...img("plataforma-aprendizaje"),
    productImage: "/images/captures/plataforma-aprendizaje/plataforma-aprendizaje-card.webp",
    gallery: [
      {
        src: "/images/captures/plataforma-aprendizaje/curso-home.png",
        alt: "Claude Architect course — Spanish landing",
        width: 1600,
        height: 1000,
        caption: "ES landing: plans, promise and checkout CTA",
      },
      {
        src: "/images/captures/plataforma-aprendizaje/curso-home-en.png",
        alt: "Claude Architect course — English landing",
        width: 1600,
        height: 1000,
        caption: "EN landing of the same LMS product",
      },
      {
        src: "/images/captures/plataforma-aprendizaje/curso-planes.png",
        alt: "Course — plans and offer",
        width: 1600,
        height: 1000,
        caption: "Fast-Track / Mentoring / B2B offer",
      },
      {
        src: "/images/captures/plataforma-aprendizaje/curso-home-mobile.png",
        alt: "Course — mobile landing",
        width: 780,
        height: 1688,
        caption: "ES landing on mobile",
      },
    ],
    archCaption:
      "Visitor → Django LMS → Bold/PayPal → 12-month access → lessons/exam + RAG tutor on Postgres.",
    meta: [
      { label: "Domain", value: "EdTech / LMS" },
      { label: "Role", value: "Full-stack Product Owner" },
      { label: "Payments", value: "Bold + PayPal" },
      { label: "Access", value: "12 months" },
    ],
    context:
      "Digital product for Claude Architect certification prep: low-friction funnel (guest checkout), retention, lead magnet, 1:1 mentoring and B2B track, with rate-limited AI tutor.",
    challenges: [
      "Charge locally and globally (Bold + PayPal).",
      "Unlock access automatically after payment.",
      "Control AI tutor cost.",
      "SEO/GEO/AEO + ES/EN i18n.",
    ],
    approach: [
      {
        title: "Django + HTMX",
        description: "LMS and catalog with native i18n and static Tailwind.",
      },
      {
        title: "Idempotent payments",
        description: "Bold (HMAC) and PayPal Smart Buttons + webhooks.",
      },
      {
        title: "Guarded tutor",
        description: "Keyword RAG + cache/rate-limit.",
      },
      {
        title: "Growth loops",
        description: "Lead-magnet mini-quiz and mentoring/B2B plans.",
      },
    ],
    stack: ["Django", "HTMX", "PostgreSQL", "Bold", "PayPal", "RAG", "Tailwind"],
    outcomes: [
      { value: "12m", label: "Post-payment access" },
      { value: "100", label: "Exam questions" },
      { value: "2", label: "PSPs (Bold + PayPal)" },
    ],
    highlights: [
      "Guest checkout: account created after payment.",
      "Unit economics protected on the AI tutor.",
      "Render/Railway ready with WhiteNoise.",
    ],
    architectureLayers: [
      "Sales catalog / landing",
      "Accounts + timed access",
      "Bold/PayPal payments",
      "Courses + exam",
      "RAG assistant",
      "B2B leads / mentoring",
    ],
    decisions: [
      {
        title: "Guest checkout",
        why: "Less friction = more conversion for digital goods.",
      },
      {
        title: "Dual PSP",
        why: "LatAm coverage (Bold) + global (PayPal).",
      },
      {
        title: "Tutor rate-limits",
        why: "Course margin must not evaporate into tokens.",
      },
    ],
    hiringFit:
      "Hire this if you need senior product/engineering for EdTech or growth-with-payments who protects unit economics, not just checkout. Deliverables: funnel → charge → access → retention, with the AI tutor's cost under control.",
  },
  {
    slug: "pagos-bold",
    tag: "Payments",
    title: "Bold integrator (pagos_bold)",
    summary:
      "Reusable Python library for Bold: checkout, health checks, ops console and Docker VPS deploy.",
    ...img("pagos-bold"),
    productImage: "/images/captures/bold/bold-card.webp",
    gallery: [
      {
        src: "/images/captures/bold/bold-console.png",
        alt: "Bold Console — transactions dashboard",
        width: 1600,
        height: 1000,
        caption: "Dashboard: billing, commission, approval rate and volume by merchant",
      },
      {
        src: "/images/captures/bold/bold-screen-01.png",
        alt: "Bold Console — transactions list",
        width: 1600,
        height: 1000,
        caption: "Transactions: statuses, methods and ops filters",
      },
      {
        src: "/images/captures/bold/bold-screen-02.png",
        alt: "Bold Console — merchants / tenants",
        width: 1600,
        height: 1000,
        caption: "Multi-tenant merchants and affiliation",
      },
      {
        src: "/images/captures/bold/bold-screen-03.png",
        alt: "Bold Console — integration panel",
        width: 1600,
        height: 1000,
        caption: "Integration: keys, webhooks and SDK health",
      },
      {
        src: "/images/captures/bold/bold-screen-04.png",
        alt: "Bold Console — integration wizard",
        width: 1600,
        height: 1000,
        caption: "Guided wizard to connect a host to Bold",
      },
      {
        src: "/images/captures/bold/bold-screen-05.png",
        alt: "Bold Console — sandbox payment test",
        width: 1600,
        height: 1000,
        caption: "Sandbox: test checkout without real charges",
      },
    ],
    archCaption:
      "Host product → pagos_bold SDK (Checkout + Health) → Bold API/webhooks; bold-console for ops.",
    meta: [
      { label: "Domain", value: "LatAm payments" },
      { label: "Role", value: "Integrations Engineer" },
      { label: "Shape", value: "SDK + console" },
      { label: "Ops", value: "Docker VPS" },
    ],
    context:
      "Third-party package (not affiliated with Bold SAS) so checkout/signing/webhooks are not reimplemented per product. Plug-in piece across own platforms.",
    challenges: [
      "Reuse integration across hosts.",
      "Detect misconfig early (health).",
      "Operate on VPS with a clear deploy path.",
    ],
    approach: [
      {
        title: "Typed SDK",
        description: "BoldSettings, CheckoutService, IntegrationHealth.",
      },
      {
        title: "Console",
        description: "bold-console serve for local ops.",
      },
      {
        title: "Deploy docs",
        description: "Scripts and production Docker guide.",
      },
    ],
    stack: ["Python", "Bold API", "Docker", "Webhooks", "HMAC"],
    outcomes: [
      { value: "SDK", label: "Reusable checkout" },
      { value: "Health", label: "Integration checks" },
      { value: "VPS", label: "Documented deploy" },
    ],
    highlights: [
      "Designed as a library, not a trapped app.",
      "Idempotency and signatures as first-class concerns.",
      "Serves LMS and other portfolio products.",
    ],
    architectureLayers: [
      "Host application",
      "pagos_bold SDK",
      "CheckoutService",
      "IntegrationHealth",
      "Bold API + webhooks",
      "bold-console / Docker",
    ],
    decisions: [
      {
        title: "Library vs payments monolith",
        why: "One place to harden; many consuming products.",
      },
      {
        title: "Sync health checks",
        why: "Fail fast on bad keys/env.",
      },
      {
        title: "Docker VPS path",
        why: "Integration must live in production, not only in a README.",
      },
    ],
    hiringFit:
      "Hire this if you need a LatAm payments/PSP specialist who won't leave you dependent on him: he ships an operable SDK with a runbook. We start with a health audit, then checkout, webhooks and real documentation.",
  },
  {
    slug: "experiencia-recomendacion",
    tag: "Product / UX",
    title: "Course recommendation funnel",
    summary:
      "60–90s Flask experience recommending up to 3 courses by interest, time and modality, with store CTA.",
    ...img("experiencia-recomendacion"),
    productImage: "/images/captures/experiencia-recomendacion/experiencia-recomendacion-card.webp",
    gallery: [
      {
        src: "/images/captures/experiencia-recomendacion/embudo-home.png",
        alt: "Chef del Saber — recommendation funnel welcome",
        width: 1600,
        height: 1000,
        caption: "First step: contact capture and menu CTA",
      },
      {
        src: "/images/captures/experiencia-recomendacion/embudo-interes.png",
        alt: "Chef del Saber — interest selection",
        width: 1600,
        height: 1000,
        caption: "Interest step inside the 60–90s funnel",
      },
    ],
    archCaption:
      "5 guided steps → rules engine → ≤3 course menu → external store CTA.",
    meta: [
      { label: "Domain", value: "Growth / UX" },
      { label: "Role", value: "Product Engineer" },
      { label: "Duration", value: "60–90s" },
      { label: "Output", value: "≤3 courses" },
    ],
    context:
      "Enrollment-style recommendation flow: turns indecision into a short actionable menu without expensive AI—deterministic rules and Flask session.",
    challenges: [
      "Complete the funnel under 90s.",
      "Explainable recommendations.",
      "CTA to a real store without rebuilding checkout.",
    ],
    approach: [
      {
        title: "Short wizard",
        description: "Welcome → interest → time → modality → menu.",
      },
      {
        title: "Rules",
        description: "Deterministic, cheap, auditable engine.",
      },
      {
        title: "Store handoff",
        description: "CTA into external course catalog.",
      },
    ],
    stack: ["Python", "Flask", "Jinja", "Session", "UX funnel"],
    outcomes: [
      { value: "5", label: "Funnel screens" },
      { value: "≤3", label: "Recommended courses" },
      { value: "90s", label: "Target duration" },
    ],
    highlights: [
      "Conversion through clarity, not a chatbot.",
      "Near-zero marginal cost.",
      "Reusable pattern for other catalogs.",
    ],
    architectureLayers: [
      "Multi-step templates",
      "Flask session",
      "Rules engine",
      "Course model",
      "Store CTA",
    ],
    decisions: [
      {
        title: "Rules vs LLM",
        why: "Explainability and zero cost on a short flow.",
      },
      {
        title: "Short menu",
        why: "Choice overload kills conversion.",
      },
      {
        title: "External checkout",
        why: "Do not reinvent payments/enrollment.",
      },
    ],
    hiringFit:
      "Hire this if your growth/product team needs measurable funnels that convert through clarity, not an expensive LLM, with a clean handoff to your store. Discovery → prototype → instrumentation.",
  },
  {
    slug: "sitio-mws",
    tag: "Agency Platform",
    title: "Medellín Web Soluciones site",
    summary:
      "Firm Django site: services, projects, FAQ, portal, billing and knowledge hub for the agent (architecture/team/quote sync).",
    ...img("sitio-mws"),
    productImage: "/images/captures/sitio-mws/sitio-mws-card.webp",
    gallery: [
      {
        src: "/images/captures/sitio-mws/mws-home.png",
        alt: "Medellín Web Soluciones — production home",
        width: 1600,
        height: 1000,
        caption: "Commercial landing at www.medellinweb.co",
      },
      {
        src: "/images/captures/sitio-mws/mws-agentes.png",
        alt: "MWS — AI Agents page with Nova attention",
        width: 1600,
        height: 1000,
        caption: "AI Agents: offer and Nova-assisted attention",
      },
      {
        src: "/images/captures/sitio-mws/mws-servicios.png",
        alt: "MWS — services catalog",
        width: 1600,
        height: 1000,
        caption: "Firm services catalog",
      },
      {
        src: "/images/captures/sitio-mws/mws-contacto.png",
        alt: "MWS — contact and quote",
        width: 1600,
        height: 1000,
        caption: "Contact / quote (CRM entry)",
      },
      {
        src: "/images/captures/sitio-mws/mws-home-mobile.png",
        alt: "MWS — mobile home",
        width: 780,
        height: 1688,
        caption: "Landing home on mobile",
      },
    ],
    archCaption:
      "Django 6 serves the site + agent_knowledge (RAG sync); legacy Angular stays separate; Woo is a separate checkout.",
    meta: [
      { label: "Domain", value: "Agency / Marketing" },
      { label: "Role", value: "Technical Founder" },
      { label: "Services", value: "18 in catalog" },
      { label: "AI", value: "Knowledge hub" },
    ],
    context:
      "MWS commercial presence is also a knowledge backend: sync about/architecture/accepted quotes into the agent, with i18n and admin ops.",
    challenges: [
      "Unify commercial message and agent knowledge.",
      "Split legacy Angular from Django site.",
      "Keep product checkout separate from services.",
    ],
    approach: [
      {
        title: "Django site of record",
        description: "Pages, services, blog, portal, billing.",
      },
      {
        title: "agent_knowledge",
        description: "Ingest/sync into assistant RAG.",
      },
      {
        title: "Clear boundaries",
        description: "Angular aside; Woo for store.",
      },
    ],
    stack: ["Django", "Python", "WhiteNoise", "PostgreSQL", "RAG", "Angular"],
    outcomes: [
      { value: "18", label: "Documented services" },
      { value: "RAG", label: "Knowledge sync to agent" },
      { value: "Admin", label: "Content operations" },
    ],
    highlights: [
      "The site feeds the agent—not silos.",
      "Agency architecture ready to grow.",
      "SEO + ops in one stack.",
    ],
    architectureLayers: [
      "Django marketing pages",
      "Services catalog",
      "Portal / billing",
      "agent_knowledge + embeddings",
      "Admin hub",
      "WhiteNoise statics",
    ],
    decisions: [
      {
        title: "Django as source of truth",
        why: "Admin, SEO and knowledge in one system.",
      },
      {
        title: "Selective RAG sync",
        why: "Agent speaks from curated data, not raw CMS dump.",
      },
      {
        title: "Decoupled store",
        why: "Services ≠ product SKUs.",
      },
    ],
    hiringFit:
      "Hire this if you need a technical founder/lead who unites the marketing site with the AI agent's knowledge ops—one technical owner, not a patchwork of vendors. Boutique full-ownership engagement, with an optional retainer.",
  },
  {
    slug: "crm-mws",
    tag: "Commercial Ops",
    title: "MWS Operational CRM",
    summary:
      "Sales funnel with SECOP/scraper+AI capture, temperature and probability, convert-to-client and a bridge to finance — daily ops, not a generic CRM.",
    ...img("crm-mws"),
    productImage: "/images/captures/crm/crm-card.webp",
    gallery: [
      {
        src: "/images/captures/crm/crm-embudo.png",
        alt: "MWS CRM — lead funnel with KPIs and filters",
        width: 1600,
        height: 1000,
        caption: "Operational funnel: KPIs, filters and lead table",
      },
      {
        src: "/images/captures/crm/crm-dashboard.png",
        alt: "MWS CRM — ops summary with KPIs",
        width: 1600,
        height: 1000,
        caption: "Summary: clients, funnel, projects and time worked",
      },
      {
        src: "/images/captures/crm/crm-lead.png",
        alt: "MWS CRM — lead detail with temperature and conversion",
        width: 1600,
        height: 1000,
        caption: "Lead detail: temperature, probability, dossier and convert-to-client",
      },
      {
        src: "/images/captures/crm/crm-scrapeo.png",
        alt: "MWS CRM — scrape and prospect ingestion",
        width: 1600,
        height: 1000,
        caption: "Scrape/AI: prospect capture and SECOP intake",
      },
      {
        src: "/images/captures/crm/crm-cotizaciones.png",
        alt: "MWS CRM — quotes in the admin",
        width: 1600,
        height: 1000,
        caption: "Quotes connected to the funnel and clients",
      },
      {
        src: "/images/captures/crm/crm-finanzas.png",
        alt: "MWS CRM — finance dashboard in COP",
        width: 1600,
        height: 1000,
        caption: "Finance in the same admin: income, expense and cashflow",
      },
      {
        src: "/images/captures/crm/crm-embudo-mobile.png",
        alt: "MWS CRM — funnel on mobile",
        width: 780,
        height: 1688,
        caption: "Operable funnel on mobile viewport",
      },
    ],
    archCaption:
      "SECOP II + scraper/AI sources → CRM funnel (leads, temperature, territory) → clients / quotes / projects, with finance and AI knowledge in the same admin.",
    meta: [
      { label: "Domain", value: "CRM / Procurement" },
      { label: "Role", value: "Full-stack / Ops" },
      { label: "Sources", value: "SECOP + Scraper/AI" },
      { label: "Stack", value: "Custom Django Admin" },
    ],
    context:
      "Medellin Web Soluciones needed an operable funnel: public tenders, AI-profiled prospects and follow-up through to client, with financial intelligence in the same admin ecosystem.",
    challenges: [
      "Ingest SECOP tenders and scraper prospects without losing traceability.",
      "Prioritize by temperature, territory and probability — not by volume.",
      "Connect the commercial funnel with finance and AI knowledge.",
      "Dense but usable UI for daily ops (list + detail + KPIs).",
    ],
    approach: [
      {
        title: "Funnel as primary surface",
        description: "KPIs, filters and lead table in one operational view.",
      },
      {
        title: "Public sources + AI",
        description:
          "SECOP II import and scraper/SERP capture with automatic profiling.",
      },
      {
        title: "Lead → client cycle",
        description:
          "Editable detail, temperature/probability and convert-to-client.",
      },
      {
        title: "Finance in the same admin",
        description:
          "Income/expense/balance summary with direct CRM access.",
      },
    ],
    stack: [
      "Django",
      "Custom admin",
      "PostgreSQL",
      "SECOP II",
      "Scraper / SERP",
      "Profiling AI",
    ],
    outcomes: [
      { value: "Funnel", label: "Active leads with KPIs" },
      { value: "SECOP", label: "Tender import" },
      { value: "AI", label: "Scraper prospects + profiling" },
      { value: "COP", label: "Finance tied to ops" },
    ],
    highlights: [
      "CRM built to operate Colombian tenders and prospects.",
      "Temperature, territory and probability visible in the funnel.",
      "Finance and team AI in the same Django admin.",
    ],
    architectureLayers: [
      "Sources: SECOP II, scraper, SERP/AI",
      "CRM funnel (KPIs + filters + table)",
      "Lead detail / convert to client",
      "Clients, quotes, projects, tasks",
      "Finance (income / expense / flow)",
      "AI knowledge + Pomodoro ops",
    ],
    decisions: [
      {
        title: "Custom Django admin vs SaaS CRM",
        why: "Full domain control (SECOP, territory, COP) without per-seat rent.",
      },
      {
        title: "Funnel first, not only cards",
        why: "Daily ops live in the filterable list with KPIs.",
      },
      {
        title: "Finance beside the CRM",
        why: "Commercial close and cashflow are viewed in one system.",
      },
    ],
    hiringFit:
      "Hire this if your sales team runs on spreadsheets and needs a custom CRM (tenders, AI-driven capture, finance) without paying per-seat rent to a generic SaaS. Discovery → funnel → integrations → ops, with optional ongoing support.",
  },
  {
    slug: "landings-cliente",
    tag: "Boutique Delivery",
    title: "Client landings",
    summary:
      "Static professional landing delivery (Julio Zapata case): personal brand, dist build and light deploy.",
    ...img("landings-cliente"),
    productImage: "/images/captures/landings-cliente/landings-cliente-card.webp",
    gallery: [
      {
        src: "/images/captures/landings-cliente/jz-home.png",
        alt: "Julio Zapata — personal brand landing hero",
        width: 1600,
        height: 1000,
        caption: "First viewport: personal brand and primary CTA",
      },
    ],
    archCaption:
      "Custom design → HTML/CSS/JS → dist build → static hosting with contact CTA.",
    meta: [
      { label: "Domain", value: "Personal brand" },
      { label: "Role", value: "Frontend delivery" },
      { label: "Shape", value: "Static" },
      { label: "Ops", value: "Simple deploy" },
    ],
    context:
      "High-finish landings for professionals: fast, cheap to host, clear message. Portfolio example: juliocv / Julio Zapata.",
    challenges: [
      "Strong personal brand in the first viewport.",
      "Static-site performance.",
      "Repeatable deploy.",
    ],
    approach: [
      {
        title: "Custom design",
        description: "No generic template; client narrative.",
      },
      {
        title: "Static build",
        description: "dist/ ready for hosting.",
      },
      {
        title: "Clear CTA",
        description: "Contact / next step without noise.",
      },
    ],
    stack: ["HTML", "CSS", "JavaScript", "Static hosting"],
    outcomes: [
      { value: "Static", label: "Cheap fast hosting" },
      { value: "Brand", label: "Identity-first viewport" },
      { value: "Deploy", label: "Simple pipeline" },
    ],
    highlights: [
      "Boutique delivery focused on personal conversion.",
      "No CMS when unnecessary.",
      "Repeatable pattern for other professionals.",
    ],
    architectureLayers: [
      "Content / copy",
      "Semantic HTML",
      "CSS/JS assets",
      "Dist build",
      "Deploy scripts",
    ],
    decisions: [
      {
        title: "Static vs CMS",
        why: "Smaller attack surface and near-zero cost.",
      },
      {
        title: "Custom vs theme",
        why: "Personal brand cannot look generic.",
      },
      {
        title: "One primary CTA",
        why: "Clarity beats button sprawl.",
      },
    ],
    hiringFit:
      "Hire this if you need a personal-brand landing with senior-level finish and zero CMS drama. Closed scope, fixed price, fast delivery.",
  },
  {
    slug: "wp-ai-agent",
    tag: "Commerce + AI",
    title: "MWS AI — WooCommerce sales agent",
    summary:
      "WordPress plugin + SaaS with recurring annual revenue: a 24/7 sales and support agent that knows your live WooCommerce inventory (RAG), replies in under 2s, and escalates to a human when it matters.",
    ...img("wp-ai-agent"),
    productImage: "/images/captures/mws-ai/mws-ai-card.webp",
    gallery: [
      {
        src: "/images/captures/mws-ai/mws-ai-hero-chat.png",
        alt: "MWS AI — landing with chat widget and inventory RAG",
        width: 1024,
        height: 433,
        caption: "Product landing with AI Sales Assistant widget",
      },
      {
        src: "/images/captures/mws-ai/mws-ai-landing-agencia.png",
        alt: "MWS AI — agency channel and custom agents",
        width: 844,
        height: 601,
        caption: "Agency / distributor channel and custom agents",
      },
      {
        src: "/images/captures/mws-ai/mws-ai-chat-shell.png",
        alt: "MWS AI — embeddable chat widget shell",
        width: 634,
        height: 373,
        caption: "WordPress plugin chat widget shell",
      },
    ],
    archCaption:
      "Woo visitor → MWS AI widget → SaaS (catalog RAG + KB) → reply / human handoff; license and admin in WP.",
    meta: [
      { label: "Domain", value: "WooCommerce + AI" },
      { label: "Role", value: "Product / Integration" },
      { label: "Host", value: "WordPress plugin + SaaS" },
      { label: "Focus", value: "24/7 sales without rewrite" },
    ],
    context:
      "MWS AI is Medellín Web Soluciones' SaaS product for agencies and companies in the USA/Spain: it turns any WooCommerce store into an AI seller that answers with real stock, sizes and prices, on annual Growth/Enterprise plans — without rewriting the business or putting third-party API keys in the plugin.",
    challenges: [
      "Sell and support 24/7 without bloating the team.",
      "Answer with real inventory (no stock hallucinations).",
      "Adopt AI on existing WP sites without migration.",
      "Escalate to humans when the case requires it.",
    ],
    approach: [
      {
        title: "Plugin in the WP ecosystem",
        description: "License activation, storefront widget and wp-admin monitor.",
      },
      {
        title: "RAG over WooCommerce",
        description: "Live catalog: stock, variants, prices and policies.",
      },
      {
        title: "Human handoff",
        description: "The team takes over the chat when the agent should not close alone.",
      },
      {
        title: "SaaS with guardrails",
        description: "Centralized AI on MWS AI; annual Growth / Enterprise plans.",
      },
    ],
    stack: ["WordPress", "WooCommerce", "PHP", "RAG", "SaaS", "REST"],
    outcomes: [
      { value: "24/7", label: "Automated sales & support" },
      { value: "<2s", label: "Response target" },
      { value: "RAG", label: "Real Woo inventory" },
    ],
    highlights: [
      "Real product with landing, licensing and in-store chat widget.",
      "Knows stock/sizes/prices; pushes checkout and escalates to humans.",
      "Built for agencies (volume) and companies (Growth / Enterprise).",
      "Complements MWS omnichannel and commerce stack.",
    ],
    architectureLayers: [
      "WordPress / WooCommerce storefront",
      "MWS AI plugin (widget + admin)",
      "MWS AI SaaS (licenses, chat, embeddings)",
      "Catalog RAG + knowledge base",
      "Monitor / human handoff",
    ],
    decisions: [
      {
        title: "Extend WP/Woo vs greenfield",
        why: "Preserves SEO, catalog and store team habits.",
      },
      {
        title: "AI on SaaS (no public BYOK)",
        why: "Centralized ops, cost and guardrails; the plugin only activates a license.",
      },
      {
        title: "Bounded sales/support agent",
        why: "Lower risk of tone/cost runaway; handoff when it matters.",
      },
    ],
    hiringFit:
      "Agencies/distributors in Spain and the USA: white-label or volume channel (recurring Growth/Enterprise margin) — not a pitch to hire me as a Solutions Architect. Woo stores: ready-to-activate license (audit → plugin → pilot). Demo via #mws-agencias or a 15-min call.",
  },
  {
    slug: "feeling-core-erp",
    tag: "ERP & Own product",
    title: "Feeling Core — warehouse & events ERP",
    summary:
      "An ERP I built to unify warehouse, events, logistics, projects and sales for an event-production company: one system with state-based stock control, quotes, live KPIs and roles — replacing a mess of disconnected spreadsheets.",
    ...img("feeling-core-erp"),
    productImage: "/images/captures/feeling-core/feeling-core-card.webp",
    gallery: [
      {
        src: "/images/captures/feeling-core/feeling-inventario.png",
        alt: "Feeling Core — warehouse inventory with state-based stock",
        width: 1024,
        height: 640,
        caption: "Warehouse: stock by state (available/in-use/maintenance), categories and filters",
      },
      {
        src: "/images/captures/feeling-core/feeling-proyectos.png",
        alt: "Feeling Core — project management by client",
        width: 1024,
        height: 640,
        caption: "Projects: status, priority, owner and delivery per client",
      },
      {
        src: "/images/captures/feeling-core/feeling-eventos.png",
        alt: "Feeling Core — event planning and tracking",
        width: 1024,
        height: 640,
        caption: "Events: schedule, location, staff and dispatches",
      },
      {
        src: "/images/captures/feeling-core/feeling-login.png",
        alt: "Feeling Core — role-based access",
        width: 1024,
        height: 640,
        caption: "Secure access with roles (admin, warehouse, sales) and lockout on attempts",
      },
    ],
    archCaption:
      "Role-based login → operational modules (warehouse, events, projects, sales) → single MySQL with KPI dashboards and audit trail.",
    meta: [
      { label: "Domain", value: "ERP / Operations" },
      { label: "Role", value: "Product / Full-stack" },
      { label: "Stack", value: "Flask + MySQL" },
      { label: "Focus", value: "One system for the whole operation" },
    ],
    context:
      "An event-production company ran warehouse, setups, staff, projects and quotes on loose spreadsheets and WhatsApp. Feeling Core is the ERP I designed and built to centralize everything: state-based inventory, event scheduling, dispatch logistics, projects with time and budget, and a sales area with numbered quotes — with dashboards that show the business in real time.",
    challenges: [
      "Stock drifting between setups (available vs in-use vs damaged).",
      "Zero visibility of projects, hours and quotes in one place.",
      "Sensitive client and operational data without access control.",
      "Blind decisions from a lack of consolidated KPIs.",
    ],
    approach: [
      {
        title: "Unified domain model",
        description: "40+ entities (inventory, events, dispatches, projects, quotes) in one coherent relational schema.",
      },
      {
        title: "State-based inventory",
        description: "Available/in-use/maintenance/damaged quantities, categories, low-stock alerts and audits.",
      },
      {
        title: "Live dashboards",
        description: "KPIs for clients, projects, quotes, hours and 6-month trends with no exports.",
      },
      {
        title: "Role-based security",
        description: "PBKDF2 login, lockout on attempts and RBAC (admin/supervisor/warehouse/sales).",
      },
    ],
    stack: ["Python", "Flask", "SQLAlchemy", "MySQL", "Flask-Migrate", "Chart.js"],
    outcomes: [
      { value: "1", label: "System for the whole operation" },
      { value: "40+", label: "Domain entities modeled" },
      { value: "Real-time", label: "KPIs without spreadsheets" },
    ],
    highlights: [
      "Warehouse with state-based stock control, categories and audits.",
      "Events, dispatches, staff, vehicles and hours in one logistics flow.",
      "Projects with tasks, time, budgets and numbered quotes.",
      "KPI dashboards and role-based access control.",
    ],
    architectureLayers: [
      "Access: PBKDF2 login + RBAC",
      "Warehouse / inventory",
      "Events / dispatches / logistics",
      "Projects / sales (quotes)",
      "MySQL + KPI dashboards + audit",
    ],
    decisions: [
      {
        title: "Modular monolith (Flask + blueprints)",
        why: "A highly interconnected domain; modules share data without microservice complexity.",
      },
      {
        title: "Relational MySQL",
        why: "Referential integrity across inventory, events and sales; reporting with direct SQL.",
      },
      {
        title: "RBAC from day one",
        why: "Warehouse, sales and admin see only what's theirs — sensitive data protected.",
      },
    ],
    hiringFit:
      "An end-to-end own product: I modeled the domain, built backend, UI and dashboards, and put it to work with real data. If you want someone who turns a messy operation into a usable system, this is the example. Demo with sample data in 15 min.",
  },
  {
    slug: "prestamos-fintech",
    tag: "Fintech & Backend",
    title: "ACCOOP — loan management",
    summary:
      "A fintech platform for a credit union: loan applications, scoring/approval, loans with amortization, installments and payments, with a documented REST API (JWT + Swagger), an admin panel and a member portal.",
    ...img("prestamos-fintech"),
    productImage: "/images/captures/prestamos/prestamos-card.webp",
    gallery: [
      {
        src: "/images/captures/prestamos/prestamos-solicitudes.png",
        alt: "ACCOOP — loan application management with KPIs",
        width: 1024,
        height: 640,
        caption: "Applications: pending, under review, approved and total amount",
      },
      {
        src: "/images/captures/prestamos/prestamos-clientes.png",
        alt: "ACCOOP — member/client portfolio",
        width: 1024,
        height: 640,
        caption: "Clients / members with credit history",
      },
      {
        src: "/images/captures/prestamos/prestamos-swagger.png",
        alt: "ACCOOP — REST API documented with Swagger",
        width: 1024,
        height: 640,
        caption: "REST API documented (DRF + Swagger/OpenAPI)",
      },
      {
        src: "/images/captures/prestamos/prestamos-django-admin.png",
        alt: "ACCOOP — Django admin panel",
        width: 1024,
        height: 640,
        caption: "Back-office on Django admin for internal operations",
      },
    ],
    archCaption:
      "Member portal and admin panel → DRF API with JWT and Swagger → credit domain (applications, loans, payments) → relational store.",
    meta: [
      { label: "Domain", value: "Fintech / Credit" },
      { label: "Role", value: "Backend / Full-stack" },
      { label: "Stack", value: "Django + DRF" },
      { label: "Focus", value: "Credit with a documented API" },
    ],
    context:
      "A credit union needed to move off manual loan math and bring the full cycle into software: receive applications, evaluate them, approve, generate the loan with its amortization, collect installments and control the portfolio. I built the platform with Django + DRF, including an admin panel, a member portal and a documented REST API for integrations.",
    challenges: [
      "Manual installment and balance math prone to error.",
      "No traceability of each application's status and its portfolio.",
      "Need for integrations (API) without exposing the database directly.",
      "Internal operations requiring a reliable back-office.",
    ],
    approach: [
      {
        title: "Full credit cycle",
        description: "Application → evaluation/scoring → approval → loan → installments → payments, each with its state.",
      },
      {
        title: "Documented REST API",
        description: "DRF + SimpleJWT + Swagger/OpenAPI: a clear contract for the portal and third parties.",
      },
      {
        title: "Dual surface",
        description: "Admin panel for the union and a portal for the member.",
      },
      {
        title: "Back-office on Django admin",
        description: "Internal operations without building CRUD from scratch.",
      },
    ],
    stack: ["Python", "Django", "Django REST Framework", "SimpleJWT", "drf-yasg", "SQLite/MySQL"],
    outcomes: [
      { value: "100%", label: "Digitized credit cycle" },
      { value: "API", label: "REST documented with Swagger" },
      { value: "JWT", label: "Auth for integrations" },
    ],
    highlights: [
      "Applications with states (pending, under review, approved, rejected) and KPIs.",
      "Loans with amortization, installments and portfolio/payment control.",
      "REST API with JWT and Swagger/ReDoc docs.",
      "Admin panel + member portal over one domain.",
    ],
    architectureLayers: [
      "Channels: member portal + admin panel",
      "DRF API + JWT + Swagger",
      "Domain: applications / scoring",
      "Domain: loans / installments / payments",
      "Relational persistence (SQLite/MySQL)",
    ],
    decisions: [
      {
        title: "Django + DRF",
        why: "Admin out of the box, a robust ORM and DRF for a well-typed API — speed without losing order.",
      },
      {
        title: "JWT alongside sessions",
        why: "The web uses sessions; integrations use tokens, without opening the database.",
      },
      {
        title: "SQLite in dev, MySQL in prod",
        why: "Instant local onboarding; the same ORM layer for production.",
      },
    ],
    hiringFit:
      "Backend for a sensitive domain (money) with explicit rules, a documented API and token security. If you need to model a financial flow with traceability and a clean API, I can replicate it. System walkthrough in a 15-min call.",
  },
  {
    slug: "landing-mws",
    tag: "Frontend & Web",
    title: "Agency landing — Angular SPA",
    summary:
      "A high-impact landing for a software agency: an Angular SPA with an animated hero, services and portfolio sections, and social proof — built to convert visits into contacts, with a static build and a performance focus.",
    ...img("landing-mws"),
    productImage: "/images/captures/landing-mws-ng/landing-mws-ng-card.webp",
    gallery: [
      {
        src: "/images/captures/landing-mws-ng/landingng-home.png",
        alt: "Agency landing — animated hero and value proposition",
        width: 1024,
        height: 640,
        caption: "High-impact hero with one clear primary action",
      },
      {
        src: "/images/captures/landing-mws-ng/landingng-home-mobile.png",
        alt: "Agency landing — responsive mobile version",
        width: 390,
        height: 844,
        caption: "Mobile-first: most traffic arrives on mobile",
      },
    ],
    archCaption:
      "Conversion UX (hero + social proof) → Angular SPA with standalone components → static build optimized for SEO/performance.",
    meta: [
      { label: "Domain", value: "Marketing / Web" },
      { label: "Role", value: "Frontend" },
      { label: "Stack", value: "Angular SPA" },
      { label: "Focus", value: "Turn visits into contacts" },
    ],
    context:
      "An agency needed a landing that conveyed solidity and pushed toward contact. I built it as an Angular SPA: an animated hero with a clear value proposition, services and projects sections, social proof (project volume) and a single primary action — all with a static build for low cost and good performance.",
    challenges: [
      "Communicate value in seconds and guide to a single action.",
      "Keep engaging animations without sacrificing performance.",
      "A scalable structure to add sections without clutter.",
      "Solid mobile behavior, where most traffic arrives.",
    ],
    approach: [
      {
        title: "Conversion-oriented hero",
        description: "Clear message + primary CTA; visual hierarchy that leads to contact.",
      },
      {
        title: "Component architecture",
        description: "Angular standalone components; decoupled, reusable sections.",
      },
      {
        title: "Social proof",
        description: "Project volume and services visible up top to build trust.",
      },
      {
        title: "Static delivery",
        description: "Optimized build with no server runtime; less failure surface.",
      },
    ],
    stack: ["Angular", "TypeScript", "RxJS", "SCSS", "HTML5"],
    outcomes: [
      { value: "SPA", label: "Angular with standalone components" },
      { value: "1", label: "Primary action toward contact" },
      { value: "Static", label: "Serverless build, low cost" },
    ],
    highlights: [
      "Animated hero with a value proposition and clear CTA.",
      "Services and portfolio sections with social proof.",
      "Component architecture that's easy to extend.",
      "Mobile-first responsive with a performance focus.",
    ],
    architectureLayers: [
      "Conversion UX (hero + social proof)",
      "Angular SPA (standalone components)",
      "Optimized static build",
      "SEO / performance",
    ],
    decisions: [
      {
        title: "Angular SPA",
        why: "Rich interactions and a component structure to grow without debt.",
      },
      {
        title: "Static build",
        why: "No app runtime = lower cost, latency and failure surface.",
      },
      {
        title: "One primary CTA",
        why: "Reduces the paradox of choice and lifts conversion to contact.",
      },
    ],
    hiringFit:
      "Business-oriented frontend: it doesn't just look good, it's built to convert. If you need a landing that turns traffic into leads, I can design and build it. I'll review your case in a 15-min call.",
  },
  {
    slug: "automatizacion-datos",
    tag: "Automation & Data",
    title: "Google Places Scraper — prospecting",
    summary:
      "A Python/Streamlit tool for commercial prospecting: it searches businesses by geographic area and type using the Google Places API, normalizes the data (name, address, phone, rating) and exports it to CSV/JSON ready for CRM or campaigns.",
    ...img("automatizacion-datos"),
    productImage: "/images/captures/google-places/google-places-card.webp",
    gallery: [
      {
        src: "/images/captures/google-places/places-app.png",
        alt: "Google Places Scraper — geolocated prospecting",
        width: 1024,
        height: 640,
        caption: "Search by geo/type, normalized results and export",
      },
      {
        src: "/images/captures/google-places/places-app-mobile.png",
        alt: "Google Places Scraper — mobile view",
        width: 390,
        height: 844,
        caption: "Responsive Streamlit UI, usable on mobile",
      },
    ],
    archCaption:
      "Parameters (geo + type) → Google Places API with pagination → normalization → CSV/JSON export + history.",
    meta: [
      { label: "Domain", value: "Automation" },
      { label: "Role", value: "Data / Tooling" },
      { label: "Stack", value: "Python + Streamlit" },
      { label: "Focus", value: "Prospecting without manual work" },
    ],
    context:
      "Not every problem needs a platform: sometimes a well-made micro-tool saves hours. I built a Google Places scraper that assembles prospecting lists by area and business type: instead of copying map data one by one, you set geo + category, get the places with their detail and export everything clean to use in a CRM or campaigns.",
    challenges: [
      "Manual prospecting copying data from maps, one by one.",
      "Rate limits and pagination of the Places API.",
      "Raw data with duplicates and inconsistent fields.",
      "Need for a usable UI without installing anything complex.",
    ],
    approach: [
      {
        title: "Geolocated scraper",
        description: "Search by lat/lng, radius and type; per-place detail (address, phone, rating).",
      },
      {
        title: "Limit handling",
        description: "Pagination and pauses to respect rate limits without losing results.",
      },
      {
        title: "Normalization and export",
        description: "Clean, deduplicated data exported to CSV/JSON for CRM/campaigns.",
      },
      {
        title: "Streamlit UI",
        description: "An immediate web interface: parameterize and download, frictionless.",
      },
    ],
    stack: ["Python", "Streamlit", "Google Places API", "pandas", "requests"],
    outcomes: [
      { value: "Hours", label: "Saved per prospecting list" },
      { value: "CSV/JSON", label: "Export ready for CRM" },
      { value: "1-click", label: "Instant download" },
    ],
    highlights: [
      "Geolocated prospecting by area and business type.",
      "Handles pagination and rate limits of the Places API.",
      "Normalized data (name, address, phone, rating) exportable.",
      "Streamlit UI ready to use with no local install.",
    ],
    architectureLayers: [
      "Input: geo + type parameters",
      "Processing: Google Places API (pagination)",
      "Normalization and dedup",
      "Output: CSV/JSON + history",
    ],
    decisions: [
      {
        title: "Streamlit over an SPA",
        why: "Time-to-value: a useful internal tool in hours, not weeks.",
      },
      {
        title: "Export to operational formats",
        why: "CSV/JSON that fit straight into the real flow (CRM, campaigns).",
      },
      {
        title: "Anti rate-limit pauses",
        why: "Prioritizes completing the job over raw speed against the API.",
      },
    ],
    hiringFit:
      "Pragmatism: I spot repetitive work and automate it with the right tool (sometimes a script, not a platform). If you have a manual task that repeats, I can probably eliminate it. Tell me about it in a short call.",
  },
];
