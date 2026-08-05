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
  | "wp-ai-agent";

export const solutionSlugs: SolutionSlug[] = [
  "orquestacion-agentes",
  "lexia-legal-os",
  "sistemas-criticos",
  "wp-ai-agent",
  "omnicanal-comercio",
  "plataforma-aprendizaje",
  "pagos-bold",
  "experiencia-recomendacion",
  "auge-urbano",
  "sitio-mws",
  "crm-mws",
  "landings-cliente",
];

/** Destacados en home (orden = cards). EU-first: agentes, LegalTech, HA, MWS AI. */
export const featuredSlugs: SolutionSlug[] = [
  "orquestacion-agentes",
  "lexia-legal-os",
  "sistemas-criticos",
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
    archCaption:
      "Operador → FastAPI Nova → CEO → hubs de division → 29 especialistas, con Ollama local, tools MCP/Composio/MWS y panel /visual + /vivo.",
    video: "/media/ejecucion-agentes-ia.mp4",
    videoPoster: "/images/poster-agentes.png",
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
    tag: "Producto & Negocio",
    title: "Plataforma End-to-End (Auge Urbano)",
    summary:
      "Plataforma Flask de Real Estate que capta compradores y propietarios en paralelo, con admin de leads propio y el terreno listo para automatizar el embudo con un agente de calificacion.",
    ...img("auge-urbano"),
    archCaption:
      "Dos embudos (comprador/propietario) alimentan Flask → SQLite leads → admin y seguimiento.",
    meta: [
      { label: "Sector", value: "Real Estate" },
      { label: "Rol", value: "Full-stack owner" },
      { label: "Foco", value: "Captacion de leads" },
      { label: "Modelo", value: "End-to-end" },
    ],
    context:
      "Auge Urbano necesitaba una presencia web que no fuera brochure: captura de compradores y propietarios, administracion de leads y un camino claro hacia automatizacion (agente inmobiliario).",
    challenges: [
      "Dos audiencias con mensajes distintos.",
      "Capturar y operar leads sin CRM caro al inicio.",
      "Admin usable para el negocio.",
      "Dejar gancho para IA de calificacion.",
    ],
    approach: [
      {
        title: "Producto Flask integral",
        description: "Rutas, templates y flujos de captacion en un monolito deliberado.",
      },
      {
        title: "Leads en SQLite",
        description: "Persistencia simple para fase temprana con admin local.",
      },
      {
        title: "Embudo dual",
        description: "Captacion de compradores y de propietarios en paralelo.",
      },
      {
        title: "Puente a automatizacion",
        description: "Compatible con agente de leads (calificacion IA / visitas).",
      },
    ],
    stack: ["Python", "Flask", "SQLite", "Jinja", "Automatizacion"],
    outcomes: [
      { value: "E2E", label: "Captura + admin de leads" },
      { value: "2", label: "Embudos (compra / propiedad)" },
      { value: "Auto", label: "Listo para agente de seguimiento" },
    ],
    highlights: [
      "Producto de captacion, no solo landing.",
      "Time-to-market con stack simple y operable.",
      "Camino natural a IA de calificacion.",
    ],
    architectureLayers: [
      "Web Flask + templates",
      "Formularios comprador/propietario",
      "SQLite leads (instance)",
      "Admin autenticado",
      "Static/assets",
      "Handoff a automatizacion",
    ],
    decisions: [
      {
        title: "Flask monolito al inicio",
        why: "Velocidad de entrega y operacion simple en VPS/local.",
      },
      {
        title: "SQLite antes que CRM cloud",
        why: "Reduce costo y friccion mientras se valida el embudo.",
      },
      {
        title: "Separar audiencias",
        why: "Mejor conversion que un unico formulario generico.",
      },
    ],
    hiringFit:
      "Contrata esto si necesitas un full-stack que entienda el embudo inmobiliario de punta a punta y te deje el producto listo para automatizar, no un MVP desechable. Discovery → MVP operable → automatizacion cuando el volumen lo justifique.",
  },
  {
    slug: "lexia-legal-os",
    tag: "Producto Vertical IA",
    title: "LEXIA — Legal Intelligence OS",
    summary:
      "Sistema operativo juridico con API FastAPI, OS Streamlit y analytics Dash: producto Python completo para trabajo legal asistido por IA.",
    ...img("lexia-legal-os"),
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
    productImage: "/images/captures/crm/crm-embudo.png",
    gallery: [
      {
        src: "/images/captures/crm/crm-embudo.png",
        alt: "CRM MWS — embudo de leads con KPIs y filtros",
        width: 1024,
        height: 523,
        caption: "Embudo operativo: KPIs, filtros y tabla de leads",
      },
      {
        src: "/images/captures/crm/crm-lead.png",
        alt: "CRM MWS — detalle de lead con temperatura y conversion",
        width: 1024,
        height: 533,
        caption: "Detalle de lead: temperatura, probabilidad y conversion",
      },
      {
        src: "/images/captures/crm/crm-finanzas.png",
        alt: "CRM MWS — dashboard de finanzas en COP",
        width: 1024,
        height: 486,
        caption: "Finanzas en el mismo admin: ingresos, gastos y flujo",
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
    productImage: "/images/captures/mws-ai/mws-ai-hero-chat.png",
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
];

export const solutionsEn: SolutionDetail[] = [
  {
    slug: "orquestacion-agentes",
    tag: "AI & Architecture",
    title: "Autonomous Agent Orchestration (Nova)",
    summary:
      "CrewAI agency with CEO, 5 divisions and 29 specialists running real work 24/7 — FastAPI, 3D graph, SSE traces and local inference. This isn't a chatbot with a nice name: it's a business operated by AI.",
    ...img("orquestacion-agentes"),
    archCaption:
      "Operator → FastAPI Nova → CEO → division hubs → 29 specialists, with local Ollama, MCP/Composio/MWS tools and /visual + /vivo panels.",
    video: "/media/ejecucion-agentes-ia.mp4",
    videoPoster: "/images/poster-agentes.png",
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
    tag: "Product & Business",
    title: "End-to-End Platform (Auge Urbano)",
    summary:
      "Flask Real Estate platform that captures buyers and owners in parallel, with its own lead admin and the groundwork ready to automate the funnel with a scoring agent.",
    ...img("auge-urbano"),
    archCaption:
      "Two funnels (buyer/owner) feed Flask → SQLite leads → admin and follow-up.",
    meta: [
      { label: "Sector", value: "Real Estate" },
      { label: "Role", value: "Full-stack owner" },
      { label: "Focus", value: "Lead capture" },
      { label: "Model", value: "End-to-end" },
    ],
    context:
      "Auge Urbano needed more than a brochure: buyer/owner capture, lead administration and a clear path to automation (real-estate agent).",
    challenges: [
      "Two audiences, two messages.",
      "Capture and operate leads without an expensive CRM at first.",
      "Usable admin for the business.",
      "Hook for AI qualification later.",
    ],
    approach: [
      {
        title: "Integral Flask product",
        description: "Routes, templates and capture flows in a deliberate monolith.",
      },
      {
        title: "SQLite leads",
        description: "Simple persistence for early stage with local admin.",
      },
      {
        title: "Dual funnel",
        description: "Buyer and owner capture in parallel.",
      },
      {
        title: "Automation bridge",
        description: "Compatible with lead agent (AI scoring / visits).",
      },
    ],
    stack: ["Python", "Flask", "SQLite", "Jinja", "Automation"],
    outcomes: [
      { value: "E2E", label: "Capture + lead admin" },
      { value: "2", label: "Funnels (buy / list)" },
      { value: "Auto", label: "Ready for follow-up agent" },
    ],
    highlights: [
      "Capture product, not just a landing.",
      "Time-to-market with a simple operable stack.",
      "Natural path to AI qualification.",
    ],
    architectureLayers: [
      "Flask web + templates",
      "Buyer/owner forms",
      "SQLite leads",
      "Authenticated admin",
      "Static assets",
      "Automation handoff",
    ],
    decisions: [
      {
        title: "Flask monolith first",
        why: "Delivery speed and simple ops on VPS/local.",
      },
      {
        title: "SQLite before cloud CRM",
        why: "Lower cost while validating the funnel.",
      },
      {
        title: "Split audiences",
        why: "Better conversion than one generic form.",
      },
    ],
    hiringFit:
      "Hire this if you need a full-stack who understands the real-estate funnel end to end and leaves you a product ready to automate—not a throwaway MVP. Discovery → working MVP → automation once volume justifies it.",
  },
  {
    slug: "lexia-legal-os",
    tag: "Vertical AI Product",
    title: "LEXIA — Legal Intelligence OS",
    summary:
      "Legal operating system with FastAPI, Streamlit OS and Dash analytics: a full Python product for AI-assisted legal work.",
    ...img("lexia-legal-os"),
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
    productImage: "/images/captures/crm/crm-embudo.png",
    gallery: [
      {
        src: "/images/captures/crm/crm-embudo.png",
        alt: "MWS CRM — lead funnel with KPIs and filters",
        width: 1024,
        height: 523,
        caption: "Operational funnel: KPIs, filters and lead table",
      },
      {
        src: "/images/captures/crm/crm-lead.png",
        alt: "MWS CRM — lead detail with temperature and conversion",
        width: 1024,
        height: 533,
        caption: "Lead detail: temperature, probability and convert-to-client",
      },
      {
        src: "/images/captures/crm/crm-finanzas.png",
        alt: "MWS CRM — finance dashboard in COP",
        width: 1024,
        height: 486,
        caption: "Finance in the same admin: income, expense and cashflow",
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
    productImage: "/images/captures/mws-ai/mws-ai-hero-chat.png",
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
];
