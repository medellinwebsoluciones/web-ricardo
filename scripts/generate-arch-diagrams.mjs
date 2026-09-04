/**
 * Genera mapas de arquitectura parciales (HTML interactivo + PNG).
 * Enfoque: capas conceptuales y trade-offs — no dump del sistema completo.
 *
 * Uso: node scripts/generate-arch-diagrams.mjs [slug ...]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const archDir = join(root, "public", "images", "arch");
const captureDir = join(root, "public", "images", "captures");
const mmdDir = join(root, "docs", "portfolio-briefs", "arch");

/**
 * @typedef {{ id: string, label: string, tip: string }} ArchNode
 * @typedef {{ name: string, role: string, nodes: ArchNode[] }} ArchLayer
 * @typedef {{
 *   slug: string,
 *   title: string,
 *   focus: string,
 *   layers: ArchLayer[],
 *   tradeoffs: string[],
 *   mmd?: string,
 * }} ArchDiagram
 */

/** @type {ArchDiagram[]} */
const diagrams = [
  {
    slug: "orquestacion-agentes",
    title: "Orquestación multi-agente",
    focus: "Vista parcial: plano de control → routing → ejecución",
    layers: [
      {
        name: "Canal",
        role: "Interfaces operativas",
        nodes: [
          {
            id: "op",
            label: "Operador",
            tip: "Humano en el loop: dispara, observa y corrige sin redeploy.",
          },
          {
            id: "ui",
            label: "Panel vivo",
            tip: "Superficie de observabilidad (grafo / stream) separada del runtime.",
          },
        ],
      },
      {
        name: "API",
        role: "Control plane",
        nodes: [
          {
            id: "api",
            label: "API de orquestación",
            tip: "Contrato estable: run, health, stream. El cliente no habla con agentes directos.",
          },
        ],
      },
      {
        name: "Orquestación",
        role: "Routing + ownership",
        nodes: [
          {
            id: "ceo",
            label: "Hub director",
            tip: "Decide qué capacidad atiende el pedido; evita un monolito de prompts.",
          },
          {
            id: "div",
            label: "Divisiones",
            tip: "Agrupan especialistas por dominio para ownership claro.",
          },
          {
            id: "spec",
            label: "Especialistas",
            tip: "Roles acotados; cada uno con tools e inferencia propias.",
          },
        ],
      },
      {
        name: "Ejecución",
        role: "Inferencia + tools",
        nodes: [
          {
            id: "llm",
            label: "Inferencia local",
            tip: "Local-first para privacidad y costo; cloud solo como escape controlado.",
          },
          {
            id: "tools",
            label: "Tools externas",
            tip: "Límite explícito: MCP / integraciones con permisos, no acceso libre.",
          },
          {
            id: "data",
            label: "Estado / memoria",
            tip: "Persistencia de corridas y overrides — no mezclar con secretos de runtime.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Local-first vs cloud LLM",
      "Red especializada vs un solo asistente",
      "Observabilidad vs complejidad",
    ],
    mmd: `flowchart TB
  Op[Operador] --> API[API orquestación]
  UI[Panel vivo] --> API
  API --> Hub[Hub director]
  Hub --> Div[Divisiones]
  Div --> Spec[Especialistas]
  Spec --> LLM[Inferencia local]
  Spec --> Tools[Tools acotadas]
  Spec --> DB[(Estado / memoria)]`,
  },
  {
    slug: "sistemas-criticos",
    title: "Alta disponibilidad — servicios críticos",
    focus: "Vista parcial: edge → servicios → datos + observabilidad",
    layers: [
      {
        name: "Edge",
        role: "Entrada y balanceo",
        nodes: [
          {
            id: "cli",
            label: "Clientes",
            tip: "Tráfico multi-canal que no debe acoplarse a un solo nodo.",
          },
          {
            id: "lb",
            label: "Load balancer",
            tip: "Punto único de entrada; health checks y failover.",
          },
        ],
      },
      {
        name: "Servicios",
        role: "Unidades desplegables",
        nodes: [
          {
            id: "sa",
            label: "Servicio A",
            tip: "Bounded context independiente; falla sin tumbar todo el sistema.",
          },
          {
            id: "sb",
            label: "Servicio B",
            tip: "Escalado horizontal por demanda, no por monolito.",
          },
          {
            id: "sc",
            label: "Servicio C",
            tip: "Contratos claros entre servicios; sin DB compartida implícita.",
          },
        ],
      },
      {
        name: "Datos & Ops",
        role: "Resiliencia",
        nodes: [
          {
            id: "pri",
            label: "Primary DB",
            tip: "Escrituras; punto de verdad con réplica asíncrona.",
          },
          {
            id: "rep",
            label: "Réplica",
            tip: "Lecturas y failover — trade-off de consistencia eventual.",
          },
          {
            id: "obs",
            label: "Observabilidad",
            tip: "Métricas, trazas y alertas: requisito de HA, no opcional.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Disponibilidad vs consistencia fuerte",
      "Microservicios vs monolito modular",
      "Costo de observabilidad vs MTTR",
    ],
    mmd: `flowchart TB
  C[Clientes] --> LB[Load balancer]
  LB --> A[Servicio A]
  LB --> B[Servicio B]
  LB --> C2[Servicio C]
  A --> P[(Primary)]
  B --> P
  C2 --> R[(Réplica)]
  A --> O[Observabilidad]
  B --> O
  C2 --> O`,
  },
  {
    slug: "auge-urbano",
    title: "Auge Urbano — PropTech",
    focus: "Vista parcial: audiencias → edge → app → dominio / IA / datos",
    layers: [
      {
        name: "Audiencias",
        role: "Canales con auth propia",
        nodes: [
          {
            id: "buy",
            label: "Compradores",
            tip: "Catálogo y lead capture públicos; sesión distinta al admin.",
          },
          {
            id: "col",
            label: "Colegas / captadores",
            tip: "Portales B2B con ownership de inmuebles y agenda.",
          },
          {
            id: "adm",
            label: "Operación",
            tip: "Admin interno: CRM, finanzas y publicación.",
          },
        ],
      },
      {
        name: "Edge + App",
        role: "Runtime de producción",
        nodes: [
          {
            id: "ngx",
            label: "Reverse proxy TLS",
            tip: "TLS, apex canónico y límites de body — borde del sistema.",
          },
          {
            id: "app",
            label: "App modular",
            tip: "Monolito modular: un proceso, dominios partidos en módulos.",
          },
        ],
      },
      {
        name: "Capacidades",
        role: "Dominio + descubrimiento",
        nodes: [
          {
            id: "dom",
            label: "Dominio inmobiliario",
            tip: "Geo, fichas, leads, finanzas — el core del negocio.",
          },
          {
            id: "ai",
            label: "Agentes IA + guards",
            tip: "IA expuesta con rate limit, honeypot y anti prompt-injection.",
          },
          {
            id: "seo",
            label: "SEO / GEO / AEO",
            tip: "Indexabilidad humana + citabilidad por LLM (sitemaps, llms.txt).",
          },
          {
            id: "db",
            label: "Persistencia relacional",
            tip: "Esquema autocurado; volumen aparte para media y rescate.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Monolito modular vs microservicios",
      "MySQL prod + SQLite rescate",
      "IA pública vs superficie de ataque",
    ],
    mmd: `flowchart TB
  Buy[Compradores] --> Edge[Reverse proxy TLS]
  Col[Colegas / captadores] --> Edge
  Adm[Operación] --> Edge
  Edge --> App[App modular]
  App --> Dom[Dominio inmobiliario]
  App --> AI[Agentes IA + guards]
  App --> SEO[SEO / GEO / AEO]
  Dom --> DB[(Persistencia)]
  AI --> DB
  SEO --> DB`,
  },
  {
    slug: "lexia-legal-os",
    title: "LEXIA — Legal Intelligence OS",
    focus: "Vista parcial: UX jurídica → API → dominio IA → datos",
    layers: [
      {
        name: "UX",
        role: "Superficies por rol",
        nodes: [
          {
            id: "usr",
            label: "Usuario jurídico",
            tip: "Abogado / analista: flujo de trabajo, no chat genérico.",
          },
          {
            id: "os",
            label: "OS interactivo",
            tip: "Workspace operativo (casos, documentos, acciones).",
          },
          {
            id: "dash",
            label: "Analytics",
            tip: "Separación: operar vs medir — evita mezclar KPI con edición.",
          },
        ],
      },
      {
        name: "Backend",
        role: "Contrato + dominio",
        nodes: [
          {
            id: "api",
            label: "API",
            tip: "Capa estable entre UI y lógica legal; facilita demos y prod.",
          },
          {
            id: "dom",
            label: "Dominio Legal IA",
            tip: "Reglas y prompts versionados del dominio jurídico.",
          },
          {
            id: "auth",
            label: "Auth / roles",
            tip: "Least privilege: no todo el staff ve todos los casos.",
          },
        ],
      },
      {
        name: "Datos",
        role: "Runtime reproducible",
        nodes: [
          {
            id: "store",
            label: "Data store",
            tip: "Persistencia de casos y artefactos.",
          },
          {
            id: "seed",
            label: "Seed demo",
            tip: "Datos sintéticos para demos sin PII real.",
          },
          {
            id: "dock",
            label: "Contenedores",
            tip: "Misma forma local y en VPS — onboarding rápido.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Demo segura vs datos reales",
      "OS unificado vs apps sueltas",
      "Roles finos vs fricción UX",
    ],
    mmd: `flowchart TB
  U[Usuario jurídico] --> OS[OS interactivo]
  U --> Dash[Analytics]
  OS --> API[API]
  Dash --> API
  API --> Dom[Dominio Legal IA]
  API --> Auth[Auth / roles]
  Dom --> DB[(Data store)]
  Auth --> DB`,
  },
  {
    slug: "omnicanal-comercio",
    title: "Omnicanal — commerce brain",
    focus: "Vista parcial: ingestión → decisión HITL → canal de venta",
    layers: [
      {
        name: "Ingestión",
        role: "Señales de oferta",
        nodes: [
          {
            id: "feed",
            label: "Feeds proveedores",
            tip: "Fuentes externas de stock/precio; no se publican crudas.",
          },
          {
            id: "radar",
            label: "Worker / scoring",
            tip: "Normaliza y puntúa oportunidades antes del humano.",
          },
        ],
      },
      {
        name: "Decisión",
        role: "HITL + catálogo",
        nodes: [
          {
            id: "hitl",
            label: "Panel HITL",
            tip: "Humano aprueba qué entra al catálogo — control de margen/riesgo.",
          },
          {
            id: "api",
            label: "API catálogo",
            tip: "Contrato hacia la tienda; el brain no es el checkout.",
          },
          {
            id: "enrich",
            label: "Enrich IA",
            tip: "Copy/atributos asistidos; no sustituye la decisión comercial.",
          },
        ],
      },
      {
        name: "Canal",
        role: "Venta + estado",
        nodes: [
          {
            id: "woo",
            label: "Tienda checkout",
            tip: "Canal de cobro separado del motor de decisión.",
          },
          {
            id: "pg",
            label: "Postgres",
            tip: "Estado del catálogo y oportunidades.",
          },
          {
            id: "rd",
            label: "Cola / cache",
            tip: "Amortigua picos de feeds y jobs.",
          },
        ],
      },
    ],
    tradeoffs: [
      "HITL vs automatización total",
      "Brain vs tienda (límites claros)",
      "Velocidad de feed vs calidad",
    ],
    mmd: `flowchart TB
  F[Feeds] --> W[Worker / scoring]
  W --> H[Panel HITL]
  H --> API[API catálogo]
  H --> AI[Enrich IA]
  API --> Shop[Tienda checkout]
  API --> PG[(Postgres)]
  W --> Q[(Cola / cache)]`,
  },
  {
    slug: "plataforma-aprendizaje",
    title: "LMS — curso + pagos",
    focus: "Vista parcial: visita → checkout → aprendizaje + tutor",
    layers: [
      {
        name: "Entrada",
        role: "Adquisición",
        nodes: [
          {
            id: "v",
            label: "Visitante",
            tip: "Landing y catálogo con i18n; fricción mínima al explorar.",
          },
          {
            id: "lms",
            label: "LMS web",
            tip: "App de curso: lecciones, progreso, examen.",
          },
        ],
      },
      {
        name: "Pagos",
        role: "Monetización",
        nodes: [
          {
            id: "b",
            label: "Pasarela A",
            tip: "Método local / LatAm — cobertura de mercado.",
          },
          {
            id: "p",
            label: "Pasarela B",
            tip: "Método internacional — redundancia de cobro.",
          },
          {
            id: "chk",
            label: "Checkout invitado",
            tip: "Compra sin cuenta previa; cuenta al desbloquear contenido.",
          },
        ],
      },
      {
        name: "Aprendizaje",
        role: "Valor post-pago",
        nodes: [
          {
            id: "les",
            label: "Lecciones / examen",
            tip: "Progreso medible; gate de certificación.",
          },
          {
            id: "rag",
            label: "Tutor RAG",
            tip: "Ayuda contextual sobre el corpus del curso, no chat abierto.",
          },
          {
            id: "db",
            label: "Postgres",
            tip: "Usuarios, progreso y transacciones.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Multi-pasarela vs una sola",
      "Invitado vs cuenta primero",
      "Tutor acotado vs LLM general",
    ],
    mmd: `flowchart TB
  V[Visitante] --> LMS[LMS web]
  LMS --> PA[Pasarela A]
  LMS --> PB[Pasarela B]
  PA --> Unlock[Contenido]
  PB --> Unlock
  Unlock --> Les[Lecciones / examen]
  Unlock --> RAG[Tutor RAG]
  Les --> DB[(Postgres)]
  RAG --> DB`,
  },
  {
    slug: "pagos-bold",
    title: "Integrador de pagos",
    focus: "Vista parcial: host → SDK → API de pago + ops",
    layers: [
      {
        name: "Host",
        role: "Producto consumidor",
        nodes: [
          {
            id: "prod",
            label: "Producto host",
            tip: "Cualquier app que necesite checkout sin reimplementar firma.",
          },
          {
            id: "sdk",
            label: "SDK pagos",
            tip: "Biblioteca reusable: checkout, health, webhooks.",
          },
          {
            id: "ops",
            label: "Consola ops",
            tip: "Diagnóstico operativo separado del path de cobro.",
          },
        ],
      },
      {
        name: "Servicios",
        role: "Contratos internos",
        nodes: [
          {
            id: "co",
            label: "CheckoutService",
            tip: "Orquesta sesión de pago y redirección.",
          },
          {
            id: "hh",
            label: "IntegrationHealth",
            tip: "Verifica llaves, endpoints y firma antes de producción.",
          },
          {
            id: "wh",
            label: "Webhooks",
            tip: "Confirmación asíncrona; idempotencia obligatoria.",
          },
        ],
      },
      {
        name: "Externo",
        role: "Proveedor + deploy",
        nodes: [
          {
            id: "api",
            label: "API proveedor",
            tip: "Límite del sistema: solo a través del SDK.",
          },
          {
            id: "sig",
            label: "Firma / HMAC",
            tip: "Integridad de notificaciones; secretos fuera del repo.",
          },
          {
            id: "dep",
            label: "Deploy Docker",
            tip: "Misma forma en demos y VPS.",
          },
        ],
      },
    ],
    tradeoffs: [
      "SDK reusable vs copy-paste",
      "Sync checkout vs webhook truth",
      "Consola ops vs logs crudos",
    ],
    mmd: `flowchart TB
  Host[Producto host] --> SDK[SDK pagos]
  SDK --> CO[CheckoutService]
  SDK --> HH[IntegrationHealth]
  SDK --> WH[Webhooks]
  CO --> API[API proveedor]
  WH --> SIG[Firma / HMAC]
  SDK --> Ops[Consola ops]`,
  },
  {
    slug: "experiencia-recomendacion",
    title: "Embudo de recomendación",
    focus: "Vista parcial: pasos → motor de reglas → CTA",
    layers: [
      {
        name: "Entrada",
        role: "Calificación",
        nodes: [
          {
            id: "w",
            label: "Bienvenida",
            tip: "Contexto mínimo; reduce abandono temprano.",
          },
          {
            id: "i",
            label: "Interés",
            tip: "Señal de dominio — alimenta el motor de reglas.",
          },
          {
            id: "t",
            label: "Tiempo / modalidad",
            tip: "Restricciones prácticas (ritmo, formato).",
          },
        ],
      },
      {
        name: "Motor",
        role: "Decisión determinística",
        nodes: [
          {
            id: "r",
            label: "Motor de reglas",
            tip: "Explicable y testeable; no caja negra de ranking.",
          },
          {
            id: "m",
            label: "Menú ≤3 opciones",
            tip: "Paradoja de elección: pocas recomendaciones fuertes.",
          },
        ],
      },
      {
        name: "Salida",
        role: "Conversión",
        nodes: [
          {
            id: "cta",
            label: "CTA tienda",
            tip: "Puente claro al checkout / catálogo.",
          },
          {
            id: "sess",
            label: "Sesión web",
            tip: "Estado efímero del embudo; sin PII innecesaria.",
          },
          {
            id: "tpl",
            label: "Templates",
            tip: "UI ligera; el valor está en el flujo, no en SPA pesada.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Reglas vs ML opaco",
      "Pocas opciones vs catálogo completo",
      "Sesión ligera vs perfil persistente",
    ],
    mmd: `flowchart TB
  W[Bienvenida] --> I[Interés]
  I --> T[Tiempo / modalidad]
  T --> R[Motor de reglas]
  R --> M[Menú ≤3]
  M --> CTA[CTA tienda]
  R --> S[Sesión web]`,
  },
  {
    slug: "sitio-mws",
    title: "Sitio corporativo MWS",
    focus: "Vista parcial: superficies → módulos → conocimiento",
    layers: [
      {
        name: "Superficies",
        role: "Marketing + portal",
        nodes: [
          {
            id: "home",
            label: "Home / servicios",
            tip: "Narrativa comercial; no acoplada al CRM interno.",
          },
          {
            id: "blog",
            label: "Blog / portal",
            tip: "Contenido y acceso cliente en el mismo host con módulos claros.",
          },
          {
            id: "bill",
            label: "Billing / contacto",
            tip: "Flujos sensibles aislados del marketing estático.",
          },
        ],
      },
      {
        name: "Plataforma",
        role: "Stack web",
        nodes: [
          {
            id: "dj",
            label: "Backend web",
            tip: "App server que orquesta templates, auth y APIs internas.",
          },
          {
            id: "leg",
            label: "Front legacy",
            tip: "Islas legacy conviviendo — migración incremental.",
          },
        ],
      },
      {
        name: "Conocimiento",
        role: "RAG sync",
        nodes: [
          {
            id: "ak",
            label: "Corpus agente",
            tip: "Fuente curada para respuestas del asistente del sitio.",
          },
          {
            id: "rag",
            label: "Sync RAG",
            tip: "Ingesta controlada; no indexar secretos ni PII.",
          },
          {
            id: "st",
            label: "Estáticos",
            tip: "Assets versionados / WhiteNoise — deploy simple.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Un host vs muchos micrositios",
      "Legacy gradual vs rewrite",
      "RAG útil vs sobre-indexar",
    ],
    mmd: `flowchart TB
  Home[Home / servicios] --> BE[Backend web]
  Blog[Blog / portal] --> BE
  Bill[Billing / contacto] --> BE
  BE --> Leg[Front legacy]
  BE --> AK[Corpus agente]
  AK --> RAG[Sync RAG]
  BE --> ST[Estáticos]`,
  },
  {
    slug: "crm-mws",
    title: "CRM operativo — embudo",
    focus: "Vista parcial: captación → calificación → ejecución comercial",
    layers: [
      {
        name: "Captación",
        role: "Fuentes",
        nodes: [
          {
            id: "sec",
            label: "Licitaciones",
            tip: "Fuente B2G; entra al embudo, no directo a cotización.",
          },
          {
            id: "scr",
            label: "Scraper / SERP",
            tip: "Señales web normalizadas; humano valida antes de avanzar.",
          },
          {
            id: "ai",
            label: "Perfilado IA",
            tip: "Enriquece leads; no cierra deals solo.",
          },
        ],
      },
      {
        name: "Embudo",
        role: "Calificación",
        nodes: [
          {
            id: "kpi",
            label: "KPIs embudo",
            tip: "Visibilidad de conversión por etapa.",
          },
          {
            id: "lead",
            label: "Leads / detalle",
            tip: "Ficha única: contexto, temperatura, territorio.",
          },
          {
            id: "temp",
            label: "Temperatura",
            tip: "Prioriza follow-up; evita tratar todos igual.",
          },
        ],
      },
      {
        name: "Ejecución",
        role: "Cierre operativo",
        nodes: [
          {
            id: "cli",
            label: "Clientes / cotizaciones",
            tip: "Paso de lead a cuenta con documentos.",
          },
          {
            id: "prj",
            label: "Proyectos / tareas",
            tip: "Entrega post-venta visible en el mismo sistema.",
          },
          {
            id: "fin",
            label: "Finanzas",
            tip: "Flujo de caja ligado al embudo, no hoja aparte.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Automatizar captación vs ruido",
      "CRM unificado vs tools sueltas",
      "IA como copiloto, no dueño del deal",
    ],
    mmd: `flowchart TB
  Sec[Licitaciones] --> KPI[KPIs embudo]
  Scr[Scraper / SERP] --> KPI
  AI[Perfilado IA] --> Lead[Leads / detalle]
  KPI --> Lead
  Lead --> Temp[Temperatura]
  Temp --> Cli[Clientes / cotizaciones]
  Cli --> Prj[Proyectos / tareas]
  Cli --> Fin[Finanzas]`,
  },
  {
    slug: "landings-cliente",
    title: "Landing boutique",
    focus: "Vista parcial: marca → build estático → publicación",
    layers: [
      {
        name: "Marca",
        role: "Contenido",
        nodes: [
          {
            id: "br",
            label: "Marca personal",
            tip: "Narrativa y visuales primero; la tech sirve a la marca.",
          },
          {
            id: "html",
            label: "HTML / CSS / JS",
            tip: "Stack mínimo: performance y control total del pixel.",
          },
          {
            id: "as",
            label: "Assets",
            tip: "Imágenes optimizadas; LCP como KPI de diseño.",
          },
        ],
      },
      {
        name: "Build",
        role: "Artefacto",
        nodes: [
          {
            id: "dist",
            label: "Build dist",
            tip: "Salida estática reproducible.",
          },
          {
            id: "dep",
            label: "Deploy estático",
            tip: "Sin runtime de app = menos superficie de fallo.",
          },
          {
            id: "perf",
            label: "Performance",
            tip: "Presupuesto de peso y CLS antes de features.",
          },
        ],
      },
      {
        name: "Resultado",
        role: "Conversión",
        nodes: [
          {
            id: "cta",
            label: "CTA contacto",
            tip: "Una acción primaria clara.",
          },
          {
            id: "resp",
            label: "Responsive",
            tip: "Mobile-first: la mayoría del tráfico llega ahí.",
          },
          {
            id: "host",
            label: "Hosting",
            tip: "CDN / estático — costo y latencia bajos.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Estático vs CMS",
      "Custom pixel vs template",
      "Una CTA vs muchas ofertas",
    ],
    mmd: `flowchart TB
  Brand[Marca] --> Build[HTML / CSS / JS]
  Build --> Dist[Build dist]
  Dist --> Host[Hosting estático]
  Host --> CTA[CTA contacto]`,
  },
  {
    slug: "wp-ai-agent",
    title: "WordPress AI Agent",
    focus: "Vista parcial: WP → puente agente → LLM + guardrails",
    layers: [
      {
        name: "WordPress",
        role: "CMS host",
        nodes: [
          {
            id: "v",
            label: "Visitante WP",
            tip: "Experiencia en el sitio; el agente es un canal más.",
          },
          {
            id: "th",
            label: "Theme / plugin",
            tip: "Punto de integración sin forzar headless completo.",
          },
          {
            id: "adm",
            label: "wp-admin",
            tip: "Config y moderación desde el flujo que el editor ya conoce.",
          },
        ],
      },
      {
        name: "Agente",
        role: "Puente controlado",
        nodes: [
          {
            id: "br",
            label: "AI bridge",
            tip: "Traduce intents WP ↔ LLM; no expone claves al front.",
          },
          {
            id: "llm",
            label: "LLM API",
            tip: "Proveedor intercambiable detrás del bridge.",
          },
          {
            id: "g",
            label: "Guardrails",
            tip: "Límites de acción (publicar, editar, borrar) por rol.",
          },
        ],
      },
      {
        name: "Efectos",
        role: "Automatización",
        nodes: [
          {
            id: "wc",
            label: "wp-content",
            tip: "Contenido generado o editado queda auditado en WP.",
          },
          {
            id: "hk",
            label: "Hooks WP",
            tip: "Extensión idiomática: actions/filters, no forks del core.",
          },
          {
            id: "auto",
            label: "Automatización",
            tip: "Jobs acotados (borrador, SEO, respuestas) con aprobación.",
          },
        ],
      },
    ],
    tradeoffs: [
      "Plugin bridge vs headless",
      "Autonomía vs aprobación humana",
      "Guardrails vs velocidad editorial",
    ],
    mmd: `flowchart TB
  V[Visitante WP] --> TH[Theme / plugin]
  TH --> BR[AI bridge]
  ADM[wp-admin] --> BR
  BR --> LLM[LLM API]
  BR --> G[Guardrails]
  G --> WC[wp-content]
  BR --> HK[Hooks WP]`,
  },
  {
    slug: "feeling-core-erp",
    title: "Feeling Core — ERP de bodega y eventos",
    focus: "Vista parcial: acceso por rol → módulos operativos → datos + KPIs",
    layers: [
      {
        name: "Acceso",
        role: "Auth + roles",
        nodes: [
          { id: "login", label: "Login PBKDF2", tip: "Hash PBKDF2-SHA256 + bloqueo tras 5 intentos; cookies HttpOnly." },
          { id: "rbac", label: "RBAC", tip: "Roles admin/supervisor/bodega/comercial con decoradores reutilizables." },
        ],
      },
      {
        name: "Operación",
        role: "Módulos de negocio",
        nodes: [
          { id: "bod", label: "Bodega / inventario", tip: "Stock por estado, categorías, alertas de mínimos y auditorías." },
          { id: "eve", label: "Eventos / despachos", tip: "Personal, horas, vehículos y logística de montaje/desmontaje." },
          { id: "pry", label: "Proyectos / tareas", tip: "Tiempo, presupuestos e interacciones por proyecto." },
          { id: "com", label: "Comercial", tip: "Clientes, cotizaciones y ventas con numeración propia." },
        ],
      },
      {
        name: "Datos",
        role: "Persistencia + KPIs",
        nodes: [
          { id: "db", label: "MySQL", tip: "SQLAlchemy + Flask-Migrate; un esquema relacional para toda la operación." },
          { id: "kpi", label: "Dashboards KPI", tip: "Tendencias 6 meses, valor de cotizaciones y horas — no hojas sueltas." },
          { id: "aud", label: "Auditoría", tip: "Bitácora de accesos (IP, motivo) y auditorías de inventario." },
        ],
      },
    ],
    tradeoffs: [
      "Monolito modular vs microservicios",
      "RBAC fino vs fricción operativa",
      "Un ERP integrado vs herramientas sueltas",
    ],
    mmd: `flowchart TB
  Login[Login PBKDF2] --> RBAC[RBAC]
  RBAC --> Bod[Bodega / inventario]
  RBAC --> Eve[Eventos / despachos]
  RBAC --> Pry[Proyectos / tareas]
  RBAC --> Com[Comercial]
  Bod --> DB[(MySQL)]
  Eve --> DB
  Pry --> DB
  Com --> DB
  DB --> KPI[Dashboards KPI]
  DB --> Aud[Auditoría]`,
  },
  {
    slug: "prestamos-fintech",
    title: "ACCOOP — gestión de préstamos fintech",
    focus: "Vista parcial: canales → API JWT → dominio de crédito → datos",
    layers: [
      {
        name: "Canales",
        role: "Superficies por rol",
        nodes: [
          { id: "cli", label: "Portal cliente", tip: "Solicitudes, extractos y pago de cuotas para el asociado." },
          { id: "adm", label: "Panel admin", tip: "Aprobación de solicitudes, cartera y reportes." },
        ],
      },
      {
        name: "API",
        role: "Contrato + seguridad",
        nodes: [
          { id: "drf", label: "DRF + JWT", tip: "API REST con SimpleJWT; sesión para web, tokens para integraciones." },
          { id: "doc", label: "Swagger/OpenAPI", tip: "Contrato documentado (drf-yasg) para clientes y front." },
        ],
      },
      {
        name: "Dominio",
        role: "Reglas de crédito",
        nodes: [
          { id: "sol", label: "Solicitudes / scoring", tip: "Evaluación y aprobación explícita; nada de caja negra." },
          { id: "pre", label: "Préstamos / cuotas", tip: "Amortización, tasas y saldos por préstamo." },
          { id: "pag", label: "Pagos", tip: "Registro de pagos y estado de cartera vencida." },
        ],
      },
      {
        name: "Datos",
        role: "Persistencia",
        nodes: [
          { id: "db", label: "SQLite / MySQL", tip: "SQLite para desarrollo, MySQL en producción — misma capa ORM." },
        ],
      },
    ],
    tradeoffs: [
      "JWT vs sesión pura",
      "SQLite dev vs MySQL prod",
      "Aprobación con reglas explícitas vs automática",
    ],
    mmd: `flowchart TB
  Cli[Portal cliente] --> DRF[DRF + JWT]
  Adm[Panel admin] --> DRF
  DRF --> Sol[Solicitudes / scoring]
  DRF --> Pre[Préstamos / cuotas]
  DRF --> Pag[Pagos]
  Sol --> DB[(SQLite / MySQL)]
  Pre --> DB
  Pag --> DB`,
  },
  {
    slug: "landing-mws",
    title: "Landing de agencia — Angular SPA",
    focus: "Vista parcial: UX de alto impacto → SPA → entrega estática",
    layers: [
      {
        name: "UX",
        role: "Conversión",
        nodes: [
          { id: "hero", label: "Hero animado", tip: "Animación tech + propuesta clara; una acción primaria (Contrátanos)." },
          { id: "sec", label: "Servicios / proyectos", tip: "Prueba social (150+ proyectos) y portafolio navegable." },
        ],
      },
      {
        name: "App",
        role: "Angular",
        nodes: [
          { id: "spa", label: "Angular 20 SPA", tip: "Componentes standalone; routing por secciones." },
          { id: "cmp", label: "Componentes", tip: "UI modular reutilizable; estado local ligero." },
        ],
      },
      {
        name: "Entrega",
        role: "Performance + SEO",
        nodes: [
          { id: "build", label: "Build estático", tip: "Bundle optimizado; sin runtime de servidor = menos superficie de fallo." },
          { id: "perf", label: "SEO / performance", tip: "Presupuesto de peso y metadatos; LCP como KPI de diseño." },
        ],
      },
    ],
    tradeoffs: [
      "SPA vs multipágina",
      "Animaciones vs performance",
      "Estático vs CMS",
    ],
    mmd: `flowchart TB
  Hero[Hero animado] --> SPA[Angular SPA]
  Sec[Servicios / proyectos] --> SPA
  SPA --> Build[Build estático]
  Build --> Perf[SEO / performance]
  Perf --> CTA[CTA contacto]`,
  },
  {
    slug: "automatizacion-datos",
    title: "Google Places Scraper — prospección",
    focus: "Vista parcial: parámetros geo → Places API → export operativo",
    layers: [
      {
        name: "Entrada",
        role: "Parámetros",
        nodes: [
          { id: "geo", label: "Geo / radio", tip: "lat/lng y radio de búsqueda para acotar la zona." },
          { id: "tipo", label: "Tipo de negocio", tip: "Filtro por categoría/keyword para segmentar prospectos." },
        ],
      },
      {
        name: "Proceso",
        role: "Lógica Python",
        nodes: [
          { id: "api", label: "Google Places API", tip: "Paginación y detalle por lugar con pausas anti rate-limit." },
          { id: "norm", label: "Normalización", tip: "Nombre, dirección, teléfono, rating — deduplicado y limpio." },
        ],
      },
      {
        name: "Salida",
        role: "Export",
        nodes: [
          { id: "csv", label: "CSV / JSON", tip: "Listas exportables listas para CRM o campañas." },
          { id: "hist", label: "Historial", tip: "Búsquedas guardadas para reutilizar y comparar." },
        ],
      },
    ],
    tradeoffs: [
      "Streamlit rápido vs SPA",
      "Local vs cloud",
      "Rate limits vs cobertura",
    ],
    mmd: `flowchart TB
  Geo[Geo / radio] --> API[Google Places API]
  Tipo[Tipo de negocio] --> API
  API --> Norm[Normalización]
  Norm --> CSV[CSV / JSON]
  Norm --> Hist[Historial]`,
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @param {ArchDiagram} d */
function htmlFor(d) {
  const layerBlocks = d.layers
    .map((layer, li) => {
      const cols = Math.min(layer.nodes.length, 4);
      const nodes = layer.nodes
        .map(
          (n, ni) => `
          <button type="button" class="node" data-tip="${esc(n.tip)}" style="--d:${li * 90 + ni * 40}ms" aria-describedby="tip">
            <span class="node-label">${esc(n.label)}</span>
          </button>`,
        )
        .join("");
      return `
      <div class="layer" style="--d:${li * 90}ms">
        <div class="layer-meta">
          <span class="layer-name">${esc(layer.name)}</span>
          <span class="layer-role">${esc(layer.role)}</span>
        </div>
        <div class="nodes" style="--cols:${cols}">${nodes}</div>
      </div>
      ${li < d.layers.length - 1 ? '<div class="flow" aria-hidden="true"><span></span></div>' : ""}`;
    })
    .join("");

  const chips = d.tradeoffs
    .map((t) => `<span class="chip">${esc(t)}</span>`)
    .join("");

  return `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(d.title)} — Architecture</title>
<style>
  :root {
    --bg0: #050506;
    --bg1: #09090b;
    --green: #34d399;
    --green-dim: rgba(52,211,153,0.14);
    --line: #27272a;
    --text: #fafafa;
    --muted: #a1a1aa;
    --dim: #71717a;
    --card: rgba(24,24,27,0.88);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    min-height: 720px;
    background:
      radial-gradient(1100px 520px at 18% -10%, #0f2918 0%, transparent 55%),
      radial-gradient(900px 480px at 90% 110%, rgba(16,185,129,0.08) 0%, transparent 50%),
      linear-gradient(180deg, var(--bg1), var(--bg0));
    color: var(--text);
    font-family: "Segoe UI", ui-sans-serif, system-ui, sans-serif;
    display: flex; flex-direction: column;
    padding: 36px 44px 28px;
  }
  .eyebrow {
    color: var(--green); letter-spacing: 0.22em;
    font-size: 11px; text-transform: uppercase; font-weight: 650;
  }
  h1 {
    margin-top: 10px; font-size: 28px; font-weight: 600;
    letter-spacing: -0.025em; line-height: 1.15;
  }
  .focus {
    margin-top: 8px; font-size: 13px; color: var(--muted); max-width: 52rem;
  }
  .map {
    margin-top: 22px; flex: 1; display: flex; flex-direction: column;
    justify-content: center; gap: 0;
  }
  .layer {
    display: grid; grid-template-columns: 148px 1fr; gap: 16px; align-items: center;
    animation: rise 0.55s ease both; animation-delay: var(--d);
  }
  .layer-meta { display: flex; flex-direction: column; gap: 2px; }
  .layer-name {
    font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--green);
  }
  .layer-role { font-size: 12px; color: var(--dim); }
  .nodes {
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
    gap: 12px;
  }
  .node {
    appearance: none; border: 1px solid var(--line);
    background: var(--card);
    border-radius: 12px; padding: 16px 14px; text-align: left;
    color: var(--text); cursor: pointer;
    box-shadow: 0 0 0 1px var(--green-dim);
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s, background 0.2s;
    animation: rise 0.55s ease both; animation-delay: var(--d);
    font: inherit;
  }
  .node-label { font-size: 15px; font-weight: 560; display: block; }
  .node:hover, .node:focus-visible, .node.is-active {
    outline: none;
    border-color: rgba(52,211,153,0.55);
    background: rgba(16,185,129,0.08);
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(52,211,153,0.25), 0 10px 28px rgba(0,0,0,0.35);
  }
  .flow {
    display: flex; justify-content: center; padding: 6px 0 6px 148px;
  }
  .flow span {
    width: 2px; height: 14px;
    background: linear-gradient(180deg, transparent, var(--green), transparent);
    opacity: 0.55; position: relative;
  }
  .flow span::after {
    content: ""; position: absolute; left: 50%; bottom: -3px;
    width: 6px; height: 6px; border-right: 1.5px solid var(--green);
    border-bottom: 1.5px solid var(--green); transform: translateX(-50%) rotate(45deg);
    opacity: 0.8;
  }
  .tip {
    margin-top: 18px; min-height: 52px;
    border: 1px solid var(--line); border-radius: 12px;
    background: rgba(9,9,11,0.75);
    padding: 12px 16px; display: flex; gap: 12px; align-items: flex-start;
  }
  .tip-k {
    flex-shrink: 0; margin-top: 2px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--green);
  }
  .tip-v { font-size: 13px; line-height: 1.45; color: var(--muted); }
  .chips { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; }
  .chip {
    font-size: 11px; color: #d4d4d8;
    border: 1px solid #3f3f46; background: rgba(24,24,27,0.7);
    border-radius: 999px; padding: 5px 10px;
  }
  .footer {
    margin-top: 14px; font-size: 12px; color: var(--dim);
    display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: none; }
  }
  @media (max-width: 820px) {
    body { padding: 20px; }
    .layer { grid-template-columns: 1fr; gap: 8px; }
    .flow { padding-left: 0; }
    h1 { font-size: 22px; }
  }
</style>
</head>
<body>
  <div class="eyebrow">Architecture</div>
  <h1>${esc(d.title)}</h1>
  <p class="focus">${esc(d.focus)}</p>
  <div class="map">${layerBlocks}</div>
  <div class="tip" id="tip" role="status" aria-live="polite">
    <span class="tip-k">Insight</span>
    <span class="tip-v" id="tip-text">Pasa el cursor o enfoca un bloque para ver el criterio arquitectónico de esa capa.</span>
  </div>
  <div class="chips">${chips}</div>
  <div class="footer">
    <span>Ricardo Zuluaga · Medellín Web Soluciones · Mapa parcial (portfolio)</span>
    <span>No revela internals propietarios</span>
  </div>
<script>
(function () {
  var tip = document.getElementById("tip-text");
  var nodes = Array.prototype.slice.call(document.querySelectorAll(".node"));
  var defaultTip = tip.textContent;
  function setActive(btn) {
    nodes.forEach(function (n) { n.classList.toggle("is-active", n === btn); });
    tip.textContent = btn.getAttribute("data-tip") || defaultTip;
  }
  nodes.forEach(function (btn) {
    btn.addEventListener("mouseenter", function () { setActive(btn); });
    btn.addEventListener("focus", function () { setActive(btn); });
    btn.addEventListener("click", function () { setActive(btn); });
  });
  document.querySelector(".map").addEventListener("mouseleave", function () {
    nodes.forEach(function (n) { n.classList.remove("is-active"); });
    tip.textContent = defaultTip;
  });
})();
</script>
</body></html>`;
}

async function main() {
  const only = new Set(process.argv.slice(2));
  const selected = only.size
    ? diagrams.filter((d) => only.has(d.slug))
    : diagrams;
  if (!selected.length) {
    throw new Error(`Sin diagramas para: ${[...only].join(", ")}`);
  }

  await mkdir(archDir, { recursive: true });
  await mkdir(captureDir, { recursive: true });
  await mkdir(mmdDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  for (const d of selected) {
    const html = htmlFor(d);
    const htmlPath = join(archDir, `${d.slug}.html`);
    await writeFile(htmlPath, html, "utf8");
    if (d.mmd) {
      await writeFile(join(mmdDir, `${d.slug}.mmd`), `${d.mmd}\n`, "utf8");
    }
    await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`);
    await page.waitForTimeout(200);
    const archPath = join(archDir, `${d.slug}.png`);
    await page.screenshot({ path: archPath, type: "png", fullPage: false });
    console.log("ok", d.slug);
  }

  await browser.close();
  console.log("Done", selected.length, "interactive architecture maps");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
