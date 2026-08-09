import type { PracticeTerm } from "./types";

/**
 * Términos técnicos verídicos anclados al corpus / CV / casos del sitio.
 * sourceSlug apunta a la colección o caso de origen.
 */
export const GLOSSARY_TERMS: PracticeTerm[] = [
  {
    id: "rag",
    category: "agents_rag",
    en: "RAG",
    es: "RAG (generación aumentada por recuperación)",
    definitionEn:
      "Retrieve relevant documents, then generate an answer grounded in that context instead of model memory alone.",
    definitionEs:
      "Recuperar documentos relevantes y generar la respuesta anclada a ese contexto, no solo a la memoria del modelo.",
    interviewLineEn:
      "I treat RAG as the source of truth for facts: curated corpus, similarity threshold, and evals before any fine-tune.",
    exampleEn:
      "On this site and MWS AI, answers are grounded with pgvector retrieval over a curated knowledge base.",
    sourceSlug: "arquitectura",
  },
  {
    id: "hitl",
    category: "agents_rag",
    en: "Human-in-the-loop (HITL)",
    es: "Humano en el bucle (HITL)",
    definitionEn:
      "A human must approve high-impact actions before the system executes them automatically.",
    definitionEs:
      "Un humano aprueba acciones de alto impacto antes de que el sistema las ejecute solos.",
    interviewLineEn:
      "In commerce I keep HITL where margin matters—publish to Woo only after human review.",
    exampleEn:
      "Omnichannel + Woo Colombia uses a HITL panel before catalog publish.",
    sourceSlug: "proyectos",
  },
  {
    id: "crewai",
    category: "agents_rag",
    en: "CrewAI orchestration",
    es: "Orquestación CrewAI",
    definitionEn:
      "Multi-agent framework that coordinates specialized roles instead of one monolithic chatbot.",
    definitionEs:
      "Framework multi-agente que coordina roles especializados en vez de un chatbot monolítico.",
    interviewLineEn:
      "With Nova I run CrewAI with a CEO hub, divisions and 29 specialists—not a single assistant.",
    exampleEn: "Nova MWS: CrewAI orchestration with observable ops panels.",
    sourceSlug: "proyectos",
  },
  {
    id: "local-first",
    category: "architecture",
    en: "Local-first AI",
    es: "IA local-first",
    definitionEn:
      "Prefer inference and tools that can run inside the client perimeter (e.g. Ollama) for privacy and predictable cost.",
    definitionEs:
      "Preferir inferencia y tools que puedan correr en el perímetro del cliente (p. ej. Ollama) por privacidad y costo predecible.",
    interviewLineEn:
      "I default to local-first when privacy or token cost predictability matters, then cascade to cloud providers.",
    exampleEn: "Nova combines Ollama local with a cascade of free/paid providers.",
    sourceSlug: "perfil-ricardo",
  },
  {
    id: "spof",
    category: "architecture",
    en: "SPOF (single point of failure)",
    es: "SPOF (punto único de fallo)",
    definitionEn:
      "A component whose failure takes down the whole system; architecture should eliminate it.",
    definitionEs:
      "Componente cuyo fallo tumba todo el sistema; la arquitectura debe eliminarlo.",
    interviewLineEn:
      "On critical backends I design for no SPOF—redundancy and metrics-backed operations.",
    exampleEn: "Carga Control / Feeling modernization targeted HA without SPOF.",
    sourceSlug: "proyectos",
  },
  {
    id: "observability",
    category: "architecture",
    en: "Observability",
    es: "Observabilidad",
    definitionEn:
      "Metrics, traces and health signals at every layer so failures are visible, not guessed.",
    definitionEs:
      "Métricas, trazas y señales de salud en cada capa para ver fallos, no adivinarlos.",
    interviewLineEn:
      "I expose health in a HUD—LLM, tools, automations—so ops sees failures instead of hiding them.",
    exampleEn: "Nova OS monitors 11 subsystems with live status in the panel.",
    sourceSlug: "arquitectura",
  },
  {
    id: "evals",
    category: "agents_rag",
    en: "Evaluation suite (evals)",
    es: "Suite de evaluaciones",
    definitionEn:
      "Versioned questions and multi-dimension judges to compare agent prompt/versions before merge.",
    definitionEs:
      "Preguntas versionadas y jueces multi-dimensión para comparar versiones del agente antes de merge.",
    interviewLineEn:
      "I do not ship prompt changes on vibes—same cases, scored dimensions, grounding weighted highest.",
    exampleEn: "This site's agent studio runs evals with mustCover/redFlags rubrics.",
    sourceSlug: "faq",
  },
  {
    id: "finops-tokens",
    category: "agents_rag",
    en: "Token FinOps",
    es: "FinOps de tokens",
    definitionEn:
      "Measure and control LLM spend (tokens, crew calls, provider cascade) as an operating metric.",
    definitionEs:
      "Medir y controlar el gasto de LLM (tokens, llamadas de crew, cascada de proveedores) como métrica operativa.",
    interviewLineEn:
      "On Nova I track tokens and crew calls against estimated USD—cost is measured, not estimated from thin air.",
    exampleEn:
      "Nova OS reported ~12.2M tokens and 296 crew calls for ~USD 29.90 via a 14-provider cascade.",
    sourceSlug: "arquitectura",
  },
  {
    id: "hallucination",
    category: "agents_rag",
    en: "Hallucination control",
    es: "Control de alucinaciones",
    definitionEn:
      "Prevent invented facts by grounding answers, declining when context is missing, and evaluating retrieval quality.",
    definitionEs:
      "Evitar hechos inventados anclando respuestas, declinando sin contexto y evaluando la calidad del retrieval.",
    interviewLineEn:
      "If similarity is low I treat it as a knowledge gap—I do not invent SLAs or numbers.",
    exampleEn: "Public chat RAG is publicOnly with gap detection when similarity is low.",
    sourceSlug: "faq",
  },
  {
    id: "pgvector",
    category: "cloud_infra",
    en: "PostgreSQL + pgvector",
    es: "PostgreSQL + pgvector",
    definitionEn:
      "Postgres extension storing embeddings for similarity search used by the site RAG.",
    definitionEs:
      "Extensión de Postgres que guarda embeddings para búsqueda por similitud del RAG del sitio.",
    interviewLineEn:
      "I keep the corpus in Postgres with pgvector so retrieval and app data share one operational store.",
    exampleEn: "This Next.js site uses Prisma + PostgreSQL + pgvector for the agent knowledge base.",
    sourceSlug: "servicios-mws",
  },
  {
    id: "fastapi",
    category: "fullstack",
    en: "FastAPI",
    es: "FastAPI",
    definitionEn:
      "Python async API framework used across Nova, LEXIA-related stacks, and catalog APIs.",
    definitionEs:
      "Framework Python async para APIs usado en Nova, stacks LEXIA y APIs de catálogo.",
    interviewLineEn:
      "I ship production APIs in FastAPI when the product is Python-first—Nova and omnichannel catalog APIs.",
    exampleEn: "Nova exposes FastAPI with /visual, /vivo (SSE), /configuracion panels.",
    sourceSlug: "proyectos",
  },
  {
    id: "nextjs",
    category: "fullstack",
    en: "Next.js",
    es: "Next.js",
    definitionEn:
      "React full-stack framework used for this public site and admin coach surfaces.",
    definitionEs:
      "Framework React full-stack usado en este sitio público y paneles admin.",
    interviewLineEn:
      "I build product UIs in Next.js and TypeScript when I need SSR, API routes and a tight admin experience.",
    exampleEn: "Web Ricardo: Next.js 16, React 19, Prisma, NextAuth, Tailwind.",
    sourceSlug: "proyectos",
  },
  {
    id: "prisma",
    category: "fullstack",
    en: "Prisma",
    es: "Prisma",
    definitionEn: "Type-safe ORM over PostgreSQL for sessions, leads, RAG metadata and practice progress.",
    definitionEs:
      "ORM tipado sobre PostgreSQL para sesiones, leads, metadatos RAG y progreso de práctica.",
    interviewLineEn:
      "I use Prisma so schema, migrations and TypeScript types stay aligned for operational data.",
    exampleEn: "ChatSession, Opportunity and Practice* models live in prisma/schema.prisma.",
    sourceSlug: "proyectos",
  },
  {
    id: "aws-stack",
    category: "cloud_infra",
    en: "AWS (EC2, RDS, S3, SNS, SES)",
    es: "AWS (EC2, RDS, S3, SNS, SES)",
    definitionEn:
      "Core AWS services used in production logistics systems (compute, DB, storage, notifications, email).",
    definitionEs:
      "Servicios AWS usados en sistemas de logística en producción (compute, DB, storage, notificaciones, email).",
    interviewLineEn:
      "On Carga Control I operated EC2, RDS, S3, SNS and SES—real infra ownership, not slideware.",
    exampleEn: "CV and portfolio back AWS claims with the Carga Control production case.",
    sourceSlug: "proyectos",
  },
  {
    id: "docker",
    category: "cloud_infra",
    en: "Docker",
    es: "Docker",
    definitionEn: "Container packaging for reproducible deploys of APIs and demos.",
    definitionEs: "Empaquetado en contenedores para deploys reproducibles de APIs y demos.",
    interviewLineEn:
      "I document Docker deploys so demos and services are reproducible—LEXIA and pagos_bold included.",
    exampleEn: "LEXIA and Bold integrator ship with documented Docker deployment.",
    sourceSlug: "proyectos",
  },
  {
    id: "microservices",
    category: "architecture",
    en: "Microservices / HA",
    es: "Microservicios / alta disponibilidad",
    definitionEn:
      "Split high-volume backends into services with redundancy and corporate-grade observability.",
    definitionEs:
      "Partir backends de alto volumen en servicios con redundancia y observabilidad corporativa.",
    interviewLineEn:
      "I modernize high-volume backends toward microservices with phased migration—no big-bang rewrite.",
    exampleEn: "Carga Control / Feeling: phased HA modernization.",
    sourceSlug: "proyectos",
  },
  {
    id: "mcp",
    category: "agents_rag",
    en: "MCP tools",
    es: "Tools MCP",
    definitionEn:
      "Model Context Protocol style tooling so agents call external capabilities with clear boundaries.",
    definitionEs:
      "Tooling estilo Model Context Protocol para que agentes invoquen capacidades externas con límites claros.",
    interviewLineEn:
      "Nova agents use MCP/Composio/MWS tools with least privilege—not unbounded tool access.",
    exampleEn: "Nova integrates MCP/Composio/MWS tools alongside Ollama.",
    sourceSlug: "proyectos",
  },
  {
    id: "sse",
    category: "fullstack",
    en: "SSE (Server-Sent Events)",
    es: "SSE (eventos enviados por el servidor)",
    definitionEn: "One-way server push stream used for live agent timelines and chat-like UIs.",
    definitionEs:
      "Stream unidireccional del servidor usado para timelines de agentes y UIs en vivo.",
    interviewLineEn:
      "For live ops panels I prefer SSE—Nova /vivo streams execution timelines that way.",
    exampleEn: "Nova /vivo panel uses SSE for live execution.",
    sourceSlug: "proyectos",
  },
  {
    id: "woocommerce",
    category: "products",
    en: "WooCommerce integrations",
    es: "Integraciones WooCommerce",
    definitionEn:
      "Commerce platform extended with catalog APIs, HITL publish and AI sales agents.",
    definitionEs:
      "Plataforma commerce extendida con APIs de catálogo, publish HITL y agentes de ventas IA.",
    interviewLineEn:
      "I extend Woo where the business already lives—HITL publish and RAG over real inventory.",
    exampleEn: "Omnichannel brain + MWS AI Woo sales agent.",
    sourceSlug: "proyectos",
  },
  {
    id: "nova",
    category: "products",
    en: "Nova (agent OS)",
    es: "Nova (sistema de agentes)",
    definitionEn:
      "Production agent army: CrewAI, 29 specialists, FinOps, knowledge packs and health HUD.",
    definitionEs:
      "Ejército de agentes en producción: CrewAI, 29 especialistas, FinOps, packs de conocimiento y HUD de salud.",
    interviewLineEn:
      "Nova is my proof of ownership: multi-agent ops with measured cost, RAG validation and visible health.",
    exampleEn: "Public case /soluciones/orquestacion-agentes and /laboratorio captures.",
    sourceSlug: "proyectos",
  },
  {
    id: "lexia",
    category: "products",
    en: "LEXIA Legal OS",
    es: "LEXIA Legal OS",
    definitionEn:
      "Multi-branch legal operating system with AI across API, workspace and analytics surfaces.",
    definitionEs:
      "Sistema operativo legal multi-sede con IA en API, workspace y analytics.",
    interviewLineEn:
      "LEXIA shows full Python product ownership—API, workspace, analytics, Docker demos with seed data.",
    exampleEn: "FastAPI + Streamlit/Dash stack with documented Docker deploy.",
    sourceSlug: "proyectos",
  },
  {
    id: "mws-ai",
    category: "products",
    en: "MWS AI (WP/Woo agent)",
    es: "MWS AI (agente WP/Woo)",
    definitionEn:
      "WordPress plugin + SaaS 24/7 sales/support agent with live inventory RAG and human handoff.",
    definitionEs:
      "Plugin WordPress + SaaS de agente 24/7 con RAG de inventario real y handoff humano.",
    interviewLineEn:
      "For Woo shops that need 24/7 sales, I ship MWS AI with inventory RAG—not a generic chatbot.",
    exampleEn: "Growth/Enterprise plans for agencies (USA/Spain).",
    sourceSlug: "proyectos",
  },
  {
    id: "bold",
    category: "products",
    en: "Bold payments library",
    es: "Librería de pagos Bold",
    definitionEn:
      "Reusable Python library for Bold checkout/health (third-party, not affiliated with Bold SAS).",
    definitionEs:
      "Librería Python reutilizable para checkout/health Bold (terceros, no afiliada a Bold SAS).",
    interviewLineEn:
      "I extracted pagos_bold as a reusable library so checkout is not trapped inside one monolith.",
    exampleEn: "Used as plug-in across own products with Docker VPS deploy.",
    sourceSlug: "proyectos",
  },
  {
    id: "sigueme4",
    category: "products",
    en: "Sígueme 4",
    es: "Sígueme 4",
    definitionEn:
      "Satellite-tracking platform built end-to-end; 100+ contractual licences at launch, still operating.",
    definitionEs:
      "Plataforma de seguimiento satelital end-to-end; 100+ licencias contractuales al lanzamiento, aún en operación.",
    interviewLineEn:
      "Sígueme 4 is my long-running ownership story—shipped solo, still in production years later.",
    exampleEn: "Documented in CV as production logistics/tracking system.",
    sourceSlug: "perfil-ricardo",
  },
  {
    id: "phased-migration",
    category: "architecture",
    en: "Phased migration",
    es: "Migración por fases",
    definitionEn:
      "Modernize critical systems incrementally instead of a big-bang rewrite.",
    definitionEs:
      "Modernizar sistemas críticos de forma incremental en vez de un rewrite big-bang.",
    interviewLineEn:
      "I prefer phased migration on critical systems—continuity first, rewrite only when measurable risk is lower.",
    exampleEn: "Architecture principles and Carga Control case.",
    sourceSlug: "arquitectura",
  },
  {
    id: "feature-flags",
    category: "architecture",
    en: "Feature flags / rollback",
    es: "Feature flags / rollback",
    definitionEn:
      "Ship changes behind flags with a ready rollback path during incidents.",
    definitionEs:
      "Desplegar cambios detrás de flags con rollback listo durante incidentes.",
    interviewLineEn:
      "During regressions I instrument first and keep feature flags/rollback ready—no blind deploys.",
    exampleEn: "Incident FAQ in gap-canonical answers.",
    sourceSlug: "faq",
  },
  {
    id: "grounding",
    category: "agents_rag",
    en: "Grounding",
    es: "Grounding (anclaje factual)",
    definitionEn:
      "Every factual claim must be supported by retrieved context or explicitly declined.",
    definitionEs:
      "Cada afirmación factual debe sostenerse en contexto recuperado o declinarse explícitamente.",
    interviewLineEn:
      "Grounding is non-negotiable in my agents—invented numbers fail the judge harder than a dry answer.",
    exampleEn: "Agent eval dimensions weight grounding highest.",
    sourceSlug: "faq",
  },
  {
    id: "embeddings",
    category: "agents_rag",
    en: "Embeddings",
    es: "Embeddings",
    definitionEn:
      "Vector representations of text used for semantic retrieval in the knowledge base.",
    definitionEs:
      "Representaciones vectoriales de texto para retrieval semántico en la base de conocimiento.",
    interviewLineEn:
      "I freeze embedding dimension to the corpus column—switching providers would force a full reindex.",
    exampleEn: "Site RAG uses text-embedding-3-small into vector(1536).",
    sourceSlug: "arquitectura",
  },
  {
    id: "django",
    category: "fullstack",
    en: "Django",
    es: "Django",
    definitionEn:
      "Python web framework used for LMS, CRM admin and HTMX lesson surfaces.",
    definitionEs:
      "Framework web Python usado en LMS, admin CRM y superficies HTMX de lecciones.",
    interviewLineEn:
      "For content-heavy products I still choose Django—LMS with HTMX lessons and a custom CRM admin.",
    exampleEn: "Claude Architect LMS + MWS operational CRM.",
    sourceSlug: "proyectos",
  },
  {
    id: "dual-psp",
    category: "products",
    en: "Dual PSP checkout",
    es: "Checkout doble PSP",
    definitionEn:
      "Guest checkout with Bold (LatAm) and PayPal (global) plus idempotent webhooks.",
    definitionEs:
      "Checkout invitado con Bold (LatAm) y PayPal (global) más webhooks idempotentes.",
    interviewLineEn:
      "On the LMS I designed dual PSP guest checkout for LatAm and global coverage with idempotent webhooks.",
    exampleEn: "Course platform + payments public case.",
    sourceSlug: "proyectos",
  },
  {
    id: "tradeoff",
    category: "architecture",
    en: "Architecture trade-off",
    es: "Trade-off de arquitectura",
    definitionEn:
      "Explicit choice between competing goals (cost, privacy, speed, autonomy) with documented rationale.",
    definitionEs:
      "Elección explícita entre objetivos en conflicto (costo, privacidad, velocidad, autonomía) con razón documentada.",
    interviewLineEn:
      "I state the trade-off out loud—HITL vs full-auto, local-first vs cloud-only—then accept the business decision.",
    exampleEn: "Corpus architecture decisions entry.",
    sourceSlug: "arquitectura",
  },
];

export function getTerm(id: string): PracticeTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.id === id);
}

export function termsByCategory(category?: string): PracticeTerm[] {
  if (!category) return GLOSSARY_TERMS;
  return GLOSSARY_TERMS.filter((t) => t.category === category);
}
