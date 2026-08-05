/**
 * Corpus base de conocimiento para el RAG del agente "Ricardo".
 * Contenido curado (bilingue) — alineado con portfolio-briefs y soluciones públicas.
 */

export type CorpusCollection = {
  slug: string;
  name: string;
  isPublic: boolean;
};

export type CorpusEntry = {
  collectionSlug: string;
  title: string;
  lang: "es" | "en";
  sourceType: "manual" | "site" | "doc" | "faq";
  content: string;
};

export const collections: CorpusCollection[] = [
  { slug: "perfil-ricardo", name: "Perfil de Ricardo", isPublic: true },
  { slug: "servicios-mws", name: "Servicios MWS", isPublic: true },
  { slug: "proyectos", name: "Proyectos y casos de exito", isPublic: true },
  { slug: "arquitectura", name: "Arquitectura y decisiones", isPublic: true },
  { slug: "faq", name: "Preguntas frecuentes", isPublic: true },
  { slug: "agenda", name: "Agenda y contacto", isPublic: true },
];

export const entries: CorpusEntry[] = [
  {
    collectionSlug: "perfil-ricardo",
    title: "Quién es Ricardo Zuluaga",
    lang: "es",
    sourceType: "manual",
    content: `Ricardo Zuluaga es Arquitecto de Soluciones Senior y Experto en Automatización con IA, con más de 10 años de experiencia. Fundador de Medellín Web Soluciones (firma boutique en Medellín, Colombia).

Entrega sistemas en producción — no demos: Nova (orquestación CrewAI con 29 especialistas), LEXIA (Legal OS), omnicanal + WooCommerce Colombia, MWS AI (agente de ventas WP/Woo), integrador Bold, LMS con pagos, Auge Urbano y landings boutique.

Dominios: arquitectura de soluciones, HA/microservicios, agentic AI local-first (CrewAI/Ollama/RAG/MCP), commerce/payments, product platforms (Django/Flask/Next.js/FastAPI).`,
  },
  {
    collectionSlug: "perfil-ricardo",
    title: "Who is Ricardo Zuluaga",
    lang: "en",
    sourceType: "manual",
    content: `Ricardo Zuluaga is a Senior Solutions Architect and AI Automation Expert with 10+ years of experience. Founder of Medellín Web Soluciones (boutique firm in Medellín, Colombia).

He ships production systems — not demos: Nova (CrewAI orchestration with 29 specialists), LEXIA (Legal OS), omnichannel + WooCommerce Colombia, MWS AI (WP/Woo sales agent), Bold integrator, paid LMS, Auge Urbano and boutique landings.

Domains: solutions architecture, HA/microservices, local-first agentic AI (CrewAI/Ollama/RAG/MCP), commerce/payments, product platforms (Django/Flask/Next.js/FastAPI).`,
  },
  {
    collectionSlug: "perfil-ricardo",
    title: "Principios de arquitectura de Ricardo",
    lang: "es",
    sourceType: "manual",
    content: `Cuatro principios:
1. Local-first y seguridad: IA que puede correr en el perímetro del cliente (Ollama/CrewAI).
2. Alta disponibilidad: sin SPOF, listo para escrutinio corporativo.
3. Observabilidad: métricas y trazas en cada capa.
4. Automatización 24/7: agentes y pipelines que quitan carga operativa de forma continua.`,
  },
  {
    collectionSlug: "perfil-ricardo",
    title: "Ricardo's architecture principles",
    lang: "en",
    sourceType: "manual",
    content: `Four principles:
1. Local-first & security: AI that can run inside the customer perimeter (Ollama/CrewAI).
2. High availability: no SPOFs, ready for corporate scrutiny.
3. Observability: metrics and traces at every layer.
4. 24/7 automation: agents and pipelines that continuously remove operational load.`,
  },
  {
    collectionSlug: "servicios-mws",
    title: "Servicios de Medellín Web Soluciones",
    lang: "es",
    sourceType: "manual",
    content: `Servicios boutique:
- Arquitectura de soluciones y modernización (microservicios, APIs, Docker).
- Automatización con IA real: CrewAI, Ollama, RAG, MCP.
- Alta disponibilidad y performance.
- Desarrollo full-stack end-to-end (Python/Node, Django/Flask/Next, commerce, pagos).

Modelo: pocos clientes, alta senioridad, ownership. Engagement típico: discovery 15 min → diagnóstico → delivery por fases.`,
  },
  {
    collectionSlug: "servicios-mws",
    title: "Medellín Web Soluciones services",
    lang: "en",
    sourceType: "manual",
    content: `Boutique services:
- Solutions architecture and modernization (microservices, APIs, Docker).
- Real AI automation: CrewAI, Ollama, RAG, MCP.
- High availability and performance.
- End-to-end full-stack (Python/Node, Django/Flask/Next, commerce, payments).

Model: few clients, high seniority, ownership. Typical engagement: 15-min discovery → diagnosis → phased delivery.`,
  },
  {
    collectionSlug: "servicios-mws",
    title: "Stack tecnológico",
    lang: "es",
    sourceType: "manual",
    content: `Stack:
- Backend: Python, Node.js, Django, FastAPI, Flask, Docker, PostgreSQL, microservicios.
- AI: CrewAI, Ollama, RAG, MCP, Streamlit, SSE.
- Commerce/payments: WooCommerce, Bold, PayPal, HTMX panels.
- Frontend/product: Next.js, React, Tailwind, Angular (legacy MWS).`,
  },
  {
    collectionSlug: "servicios-mws",
    title: "Technology stack",
    lang: "en",
    sourceType: "manual",
    content: `Stack:
- Backend: Python, Node.js, Django, FastAPI, Flask, Docker, PostgreSQL, microservices.
- AI: CrewAI, Ollama, RAG, MCP, Streamlit, SSE.
- Commerce/payments: WooCommerce, Bold, PayPal, HTMX panels.
- Frontend/product: Next.js, React, Tailwind, Angular (legacy MWS).`,
  },

  // ---- PROYECTOS ----
  {
    collectionSlug: "proyectos",
    title: "Caso: Nova — Orquestación de Agentes",
    lang: "es",
    sourceType: "manual",
    content: `Proyecto Nova MWS: orquestación CrewAI con CEO, 5 divisiones y 29 especialistas. API FastAPI, paneles /visual (grafo 3D), /vivo (SSE), /configuracion. Inferencia local Ollama, tools MCP/Composio/MWS. Resultado: operación continua observable, no un chatbot. Complemento: agente de leads inmobiliarios (agentes IA) con calificación alto/medio/bajo.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: Nova — Agent Orchestration",
    lang: "en",
    sourceType: "manual",
    content: `Nova MWS project: CrewAI orchestration with CEO, 5 divisions and 29 specialists. FastAPI, /visual (3D graph), /vivo (SSE), /configuracion. Local Ollama inference, MCP/Composio/MWS tools. Outcome: continuous observable ops—not a chatbot. Companion: real-estate lead agent with high/medium/low scoring.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: Sistemas críticos (Carga Control / Feeling)",
    lang: "es",
    sourceType: "manual",
    content: `Modernización de backends de alto volumen hacia microservicios con HA, redundancia y observabilidad bajo estándares corporativos. Migración por fases sin big-bang. Resultado: diseño sin SPOF y operación basada en métricas.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: Critical systems (Carga Control / Feeling)",
    lang: "en",
    sourceType: "manual",
    content: `High-volume backend modernization to microservices with HA, redundancy and observability under corporate standards. Phased migration—no big-bang. Outcome: SPOF-free design and metrics-driven ops.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: Auge Urbano",
    lang: "es",
    sourceType: "manual",
    content: `Plataforma PropTech en Flask desplegada en VPS (Docker, Gunicorn, Nginx con TLS): 159 rutas, 45 tablas MySQL 8 InnoDB, CRM propio (leads, citas, cierres, ingresos y gastos), portal de colegas inmobiliarios y portal de captadores, blog, pagos con Bold y pila SEO/GEO/AEO con IndexNow, sitemaps y llms.txt. Agentes IA integrados (asesor público, copiloto de negocio, generación SEO de fichas) con guards de prompt injection. Resultado: el negocio completo operado desde un solo sistema, no un brochure.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: Auge Urbano",
    lang: "en",
    sourceType: "manual",
    content: `Flask PropTech platform deployed on a VPS (Docker, Gunicorn, Nginx with TLS): 159 routes, 45 MySQL 8 InnoDB tables, in-house CRM (leads, viewings, closings, income and expenses), partner-agent portal and street-scout portal, blog, Bold payments and a SEO/GEO/AEO stack with IndexNow, sitemaps and llms.txt. Embedded AI agents (public advisor, business copilot, listing SEO generation) behind prompt-injection guards. Outcome: the whole business operated from one system—not a brochure.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: LEXIA Legal OS",
    lang: "es",
    sourceType: "manual",
    content: `LEXIA: sistema operativo jurídico. FastAPI + Streamlit OS + Dash analytics. Stack Python-only, seed demo, Docker dev/prod. Resultado: tres superficies de producto integradas para trabajo legal asistido por IA.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: LEXIA Legal OS",
    lang: "en",
    sourceType: "manual",
    content: `LEXIA: legal operating system. FastAPI + Streamlit OS + Dash analytics. Python-only stack, demo seed, Docker dev/prod. Outcome: three integrated product surfaces for AI-assisted legal work.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: Omnicanal + Woo Colombia",
    lang: "es",
    sourceType: "manual",
    content: `Cerebro omnicanal (stock propio + dropship): worker radar Dropi, scoring, panel HITL, API catálogo FastAPI, publish Woo. Tienda woo-store-co solo Colombia; vertical Tecnopets. Resultado: control humano donde importa el margen; checkout desacoplado del marketing.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: Omnichannel + Woo Colombia",
    lang: "en",
    sourceType: "manual",
    content: `Omnichannel brain (owned stock + dropship): Dropi radar worker, scoring, HITL panel, FastAPI catalog, Woo publish. woo-store-co Colombia-only store; Tecnopets vertical. Outcome: human control where margin matters; checkout decoupled from marketing.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: Plataforma curso + pagos",
    lang: "es",
    sourceType: "manual",
    content: `LMS Django bilingüe para certificación Claude Architect: checkout invitado, Bold + PayPal idempotentes, acceso 12 meses, examen 100 preguntas, tutor RAG con rate-limit, lead magnet y tracks mentoring/B2B.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: Course platform + payments",
    lang: "en",
    sourceType: "manual",
    content: `Bilingual Django LMS for Claude Architect certification: guest checkout, idempotent Bold + PayPal, 12-month access, 100-question exam, rate-limited RAG tutor, lead magnet and mentoring/B2B tracks.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: pagos_bold",
    lang: "es",
    sourceType: "manual",
    content: `Librería Python reutilizable para Bold (terceros, no afiliada a Bold SAS): CheckoutService, IntegrationHealth, bold-console, deploy Docker VPS. Usada como pieza plug-in en productos propios.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: pagos_bold",
    lang: "en",
    sourceType: "manual",
    content: `Reusable Python library for Bold (third-party, not affiliated with Bold SAS): CheckoutService, IntegrationHealth, bold-console, Docker VPS deploy. Plug-in piece across own products.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: Embudo de recomendación",
    lang: "es",
    sourceType: "manual",
    content: `Experiencia Flask de 60–90s (estilo Chef Virtual): 5 pasos, reglas determinísticas, menú ≤3 cursos, CTA a tienda. Conversión por claridad sin costo de LLM.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: Recommendation funnel",
    lang: "en",
    sourceType: "manual",
    content: `60–90s Flask experience (Chef Virtual style): 5 steps, deterministic rules, ≤3 course menu, store CTA. Conversion through clarity without LLM cost.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: Sitio MWS",
    lang: "es",
    sourceType: "manual",
    content: `Sitio Django de Medellín Web Soluciones: 18 servicios, blog, portal, billing y agent_knowledge (sync de arquitectura/equipo/cotizaciones al RAG). Angular legacy separado; Woo es checkout de productos aparte.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: MWS site",
    lang: "en",
    sourceType: "manual",
    content: `Medellín Web Soluciones Django site: 18 services, blog, portal, billing and agent_knowledge (architecture/team/quote sync into RAG). Legacy Angular separate; Woo is product checkout aside.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: CRM operativo MWS",
    lang: "es",
    sourceType: "manual",
    content: `CRM Django custom de Medellín Web Soluciones: embudo con KPIs, import SECOP II, prospectos scraper/SERP con perfilado IA, temperatura/territorio/probabilidad, detalle de lead con conversión a cliente, y finanzas (ingresos/gastos/flujo) en el mismo admin.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: MWS operational CRM",
    lang: "en",
    sourceType: "manual",
    content: `Custom Django CRM for Medellín Web Soluciones: funnel with KPIs, SECOP II import, scraper/SERP prospects with AI profiling, temperature/territory/probability, lead detail with convert-to-client, and finance (income/expense/flow) in the same admin.`,
  },
  {
    collectionSlug: "proyectos",
    title: "Caso: Landings cliente y WP AI Agent",
    lang: "es",
    sourceType: "manual",
    content: `Landings estáticas boutique (ej. Julio Zapata). MWS AI: plugin WordPress + SaaS de agente de ventas/soporte 24/7 para WooCommerce con RAG de inventario real, widget en tienda, handoff humano y planes Growth/Enterprise para agencias y empresas (USA/España).`,
  },
  {
    collectionSlug: "proyectos",
    title: "Case: Client landings and WP AI Agent",
    lang: "en",
    sourceType: "manual",
    content: `Boutique static landings (e.g. Julio Zapata). MWS AI: WordPress plugin + SaaS 24/7 sales/support agent for WooCommerce with live inventory RAG, storefront widget, human handoff, and Growth/Enterprise plans for agencies and companies (USA/Spain).`,
  },

  // ---- ARQUITECTURA ----
  {
    collectionSlug: "arquitectura",
    title: "Decisiones típicas de arquitectura",
    lang: "es",
    sourceType: "doc",
    content: `Trade-offs recurrentes en el portafolio de Ricardo:
- Local-first LLM vs solo cloud: privacidad y costo predecible (Nova).
- Red multi-agente vs un asistente: especialización y routing (Nova).
- HITL vs full-auto en commerce: protege margen (omnicanal).
- Checkout invitado + doble PSP: conversión y cobertura LatAm/global (LMS).
- Librería de pagos vs monolito: reutilización (pagos_bold).
- Extender WordPress vs greenfield: adopta IA donde ya está el negocio.
- Migración por fases vs rewrite: continuidad en sistemas críticos.`,
  },
  {
    collectionSlug: "arquitectura",
    title: "Typical architecture decisions",
    lang: "en",
    sourceType: "doc",
    content: `Recurring trade-offs in Ricardo's portfolio:
- Local-first LLM vs cloud-only: privacy and predictable cost (Nova).
- Multi-agent network vs one assistant: specialization and routing (Nova).
- HITL vs full-auto in commerce: protects margin (omnichannel).
- Guest checkout + dual PSP: conversion and LatAm/global coverage (LMS).
- Payments library vs monolith: reuse (pagos_bold).
- Extend WordPress vs greenfield: AI where the business already lives.
- Phased migration vs rewrite: continuity on critical systems.`,
  },
  {
    collectionSlug: "arquitectura",
    title: "Cómo contratar / engagement",
    lang: "es",
    sourceType: "doc",
    content: `Modelo boutique. Engagement típico: llamada técnica de 15 minutos (Google Meet) → diagnóstico → diseño con trade-offs → implementación por fases → operación con observabilidad. Al cierre de la implementación, el engagement puede continuar como retainer para evolución continua, o cerrarse como proyecto de alcance fijo — según lo que necesite el cliente. Ideal para empresas que buscan Solutions Architect / Tech Lead con ownership, o roles senior de agentic AI, HA, commerce o product platforms. Si el negocio corre en WordPress/WooCommerce y necesita ventas o soporte 24/7, la vía más rápida es MWS AI (SaaS con planes anuales Growth/Enterprise) en vez de un desarrollo a medida. No vende humo ni métricas inventadas; no hay precios fijos publicados — cada alcance se cotiza en la llamada.`,
  },
  {
    collectionSlug: "arquitectura",
    title: "How to hire / engagement",
    lang: "en",
    sourceType: "doc",
    content: `Boutique model. Typical engagement: 15-minute technical call (Google Meet) → diagnosis → design with trade-offs → phased implementation → ops with observability. Once implementation wraps, the engagement can continue as an ongoing retainer for continuous evolution, or close out as a fixed-scope project — depending on what the client needs. Best for companies seeking a Solutions Architect / Tech Lead with ownership, or senior roles in agentic AI, HA, commerce or product platforms. If the business runs on WordPress/WooCommerce and needs 24/7 sales or support, the faster path is MWS AI (SaaS on annual Growth/Enterprise plans) instead of custom development. No hype, no invented metrics; no fixed public prices — every scope is quoted on the call.`,
  },
  {
    collectionSlug: "arquitectura",
    title: "Nova OS: métricas de operación real",
    lang: "es",
    sourceType: "doc",
    content: `Nova OS es la plataforma de agentes que Ricardo opera a diario. Cifras verificables tomadas de sus propios paneles (capturas publicadas en /laboratorio):

- Orquestación: 5 áreas, 29 roles y 35 nodos en el grafo de la agencia, con timeline de ejecución en vivo.
- Arquitectura: 13 topologías del sistema documentadas dentro del producto y versionadas en git (runtime, integraciones, datos, UI).
- Costo: 12,2 millones de tokens y 296 llamadas de crew por USD 29,90 estimados, usando una cascada de 14 proveedores que combina free tiers y Ollama local.
- Conocimiento: 2.749 chunks indexados en la colección nova_knowledge, 6 packs de dominio y 159 documentos propios, con validación de RAG antes de fine-tune.
- Salud: 11 subsistemas monitoreados (LLM, STT/TTS, visión, YOLO, toolkits, automatizaciones) con estado y modelo activo visibles en un HUD.
- Catálogo: 202 perfiles de agentes de catálogos open source con licencia MIT, agrupados en 17 áreas y mapeados al modelo de roles de Nova.

La lectura de fondo: Ricardo mide costo, salud y conocimiento del sistema en vez de estimarlos, y expone los fallos en el panel en lugar de esconderlos.`,
  },
  {
    collectionSlug: "arquitectura",
    title: "Nova OS: real operating metrics",
    lang: "en",
    sourceType: "doc",
    content: `Nova OS is the agent platform Ricardo runs daily. Verifiable figures taken from his own panels (screenshots published on /laboratorio):

- Orchestration: 5 areas, 29 roles and 35 nodes in the agency graph, with a live execution timeline.
- Architecture: 13 system topologies documented inside the product and versioned in git (runtime, integrations, data, UI).
- Cost: 12.2M tokens and 296 crew calls for an estimated USD 29.90, using a 14-provider cascade mixing free tiers and local Ollama.
- Knowledge: 2,749 chunks indexed in the nova_knowledge collection, 6 domain packs and 159 first-party documents, with RAG validation before fine-tuning.
- Health: 11 monitored subsystems (LLM, STT/TTS, vision, YOLO, toolkits, automations) with status and active model surfaced in a HUD.
- Catalog: 202 agent profiles from MIT-licensed open source catalogs, grouped into 17 areas and mapped onto Nova's role model.

The underlying point: Ricardo measures cost, health and system knowledge instead of estimating them, and surfaces failures on the panel instead of hiding them.`,
  },

  // ---- FAQ ----
  {
    collectionSlug: "faq",
    title: "FAQ: tipo de proyectos",
    lang: "es",
    sourceType: "faq",
    content: `Pregunta: ¿Qué tipo de proyectos toma Ricardo?
Respuesta: Retos de arquitectura e IA en producción: orquestación de agentes, HA/microservicios, LegalTech, commerce/omnicanal, pagos, LMS y plataformas full-stack. Firma boutique: pocos clientes, alta senioridad. Agenda una llamada técnica de 15 minutos.`,
  },
  {
    collectionSlug: "faq",
    title: "FAQ: project types",
    lang: "en",
    sourceType: "faq",
    content: `Question: What kind of projects does Ricardo take?
Answer: Production architecture and AI challenges: agent orchestration, HA/microservices, LegalTech, omnichannel commerce, payments, LMS and full-stack platforms. Boutique firm: few clients, high seniority. Book a 15-minute technical call.`,
  },
  {
    collectionSlug: "faq",
    title: "FAQ: automatización con IA",
    lang: "es",
    sourceType: "faq",
    content: `Pregunta: ¿Qué significa automatización con IA real?
Respuesta: No son solo chatbots. Diseña ecosistemas de agentes (ej. Nova con 29 especialistas) que ejecutan trabajo de negocio con CrewAI, Ollama local, RAG y MCP, con paneles operativos y trazas.`,
  },
  {
    collectionSlug: "faq",
    title: "FAQ: real AI automation",
    lang: "en",
    sourceType: "faq",
    content: `Question: What does real AI automation mean?
Answer: Not just chatbots. He designs agent ecosystems (e.g. Nova with 29 specialists) that execute business work with CrewAI, local Ollama, RAG and MCP, with ops panels and traces.`,
  },
  {
    collectionSlug: "faq",
    title: "FAQ: hiring / seniority",
    lang: "es",
    sourceType: "faq",
    content: `Pregunta: ¿Ricardo encaja como hire senior / contractor?
Respuesta: Sí para roles Solutions Architect, Tech Lead o specialist en agentic AI, platform HA, commerce integrations o product engineering. Prefiere 100% remoto desde Medellín con solape horario España (CET). Está abierto a trasladarse a la ciudad del contrato en España si el rol lo requiere (indefinido ES con visado/autorización, o contractor B2B). Evaluar fit en llamada de 15 minutos.`,
  },
  {
    collectionSlug: "faq",
    title: "FAQ: hiring / seniority",
    lang: "en",
    sourceType: "faq",
    content: `Question: Is Ricardo a fit as a senior hire / contractor?
Answer: Yes for Solutions Architect, Tech Lead or specialist roles in agentic AI, platform HA, commerce integrations or product engineering. Prefers 100% remote from Medellín with Spain timezone overlap (CET). Open to relocating to the contract city in Spain if the role requires it (Spanish permanent contract with work authorization, or B2B contractor). Assess fit on a 15-minute call.`,
  },
  {
    collectionSlug: "faq",
    title: "FAQ: ubicación / remoto / España",
    lang: "es",
    sourceType: "faq",
    content: `Pregunta: ¿Dónde trabaja Ricardo y puede mudarse a España?
Respuesta: Vive en Medellín, Colombia. Prioridad: remoto. Disponible para relocation a Madrid, Barcelona u otra ciudad del contrato si la empresa lo exige y apoya el trámite de autorización de trabajo. Las llamadas técnicas usan horarios con solape España (slots muestran hora Colombia y España).`,
  },
  {
    collectionSlug: "faq",
    title: "FAQ: location / remote / Spain",
    lang: "en",
    sourceType: "faq",
    content: `Question: Where does Ricardo work and can he move to Spain?
Answer: He lives in Medellín, Colombia. Priority: remote. Available to relocate to Madrid, Barcelona or another contract city if the company requires it and supports work-authorization sponsorship. Technical calls use Spain-overlap slots (labels show Colombia and Spain times).`,
  },
  {
    collectionSlug: "faq",
    title: "FAQ: precios",
    lang: "es",
    sourceType: "faq",
    content: `Pregunta: ¿Cuánto cuesta?
Respuesta: Cada proyecto se cotiza a la medida según alcance y complejidad — como proyecto de precio fijo o como retainer continuo, lo que se ajuste mejor al caso. No hay precios fijos publicados. Excepción: MWS AI (agente de ventas WordPress/WooCommerce) sí es un producto SaaS con planes anuales Growth/Enterprise, también para agencias/distribuidores en España (white-label/volumen). Para cualquier otro caso, lo mejor es agendar una llamada técnica de 15 minutos y cotizar ahí.`,
  },
  {
    collectionSlug: "faq",
    title: "FAQ: pricing",
    lang: "en",
    sourceType: "faq",
    content: `Question: How much does it cost?
Answer: Every project is quoted individually by scope and complexity — as a fixed-price project or as an ongoing retainer, whichever fits the case better. No fixed public prices. Exception: MWS AI (the WordPress/WooCommerce sales agent) is a SaaS product sold on annual Growth/Enterprise plans, including agency/reseller white-label in Spain. For anything else, the best step is to book a 15-minute technical call and get a quote there.`,
  },

  // ---- AGENDA ----
  {
    collectionSlug: "agenda",
    title: "Cómo agendar una llamada",
    lang: "es",
    sourceType: "manual",
    content: `Para agendar una llamada técnica de 15 minutos usa el panel de citas del sitio (sección Agendar). Se genera evento con Google Meet y email de confirmación. Zona horaria base America/Bogota; cada slot muestra también la hora en Europe/Madrid (España). También email de contacto del sitio o LinkedIn.`,
  },
  {
    collectionSlug: "agenda",
    title: "How to book a call",
    lang: "en",
    sourceType: "manual",
    content: `To book a 15-minute technical call use the site booking panel. Creates a Google Meet event and confirmation email. Base timezone America/Bogota; each slot also shows Europe/Madrid (Spain) time. Also site contact email or LinkedIn.`,
  },
];
