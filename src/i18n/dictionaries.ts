import type { Locale } from "./config";

export type CaseStudyLabels = {
  challengeLabel: string;
  solutionLabel: string;
  resultLabel: string;
};

export type StackTier = "core" | "strong" | "infra" | "ai";

export type StackCategory = {
  title: string;
  items: string[];
  blurb?: string;
  tier: StackTier;
  icon?:
    | "agentic"
    | "ha"
    | "commerce"
    | "product"
    | "lamp"
    | "python"
    | "relational"
    | "nosql"
    | "graph";
};

export type Dictionary = {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  nav: {
    about: string;
    cases: string;
    stack: string;
    booking: string;
    contact: string;
    lab: string;
    services: string;
    career: string;
    recruiters: string;
    langLabel: string;
  };
  hero: {
    availability: string;
    title: string;
    role: string;
    roleSpec: string;
    subtitle: string;
    location: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaCv: string;
    ctaLinkedin: string;
    ctaWhatsapp: string;
    rolesLabel: string;
    roles: string[];
    stats: { value: string; label: string }[];
  };
  enterprise: {
    label: string;
    note: string;
  };
  products: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string[];
    systemsHeading: string;
    systemsIntro: string;
    systems: { name: string; tag: string; blurb: string }[];
    modelHeading: string;
    modelIntro: string;
    modelPillars: { title: string; description: string }[];
    modelFootnote: string;
    domains: string[];
    principlesHeading: string;
    principles: { title: string; description: string }[];
  };
  cases: CaseStudyLabels & {
    eyebrow: string;
    heading: string;
    subheading: string;
  };
  stack: {
    eyebrow: string;
    heading: string;
    subheading: string;
    tiers: Record<StackTier, string>;
    categories: StackCategory[];
  };
  recruiters: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    heading: string;
    intro: string;
    quickFactsHeading: string;
    quickFacts: { label: string; value: string }[];
    rolesHeading: string;
    rolesNote: string;
    workModelHeading: string;
    workModel: { label: string; value: string }[];
    stackHeading: string;
    enterpriseHeading: string;
    systemsHeading: string;
    systemsNote: string;
    ctaHeading: string;
    ctaBody: string;
    downloadCv: string;
    viewLinkedin: string;
    whatsappCta: string;
    bookCall: string;
    emailCta: string;
  };
  booking: {
    eyebrow: string;
    heading: string;
    subheading: string;
    dateLabel: string;
    slotLabel: string;
    nameLabel: string;
    emailLabel: string;
    topicLabel: string;
    topicPlaceholder: string;
    noSlots: string;
    loadingSlots: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    pendingTitle: string;
    pendingBody: string;
    meetLabel: string;
    errorGeneric: string;
    errorRateLimited: string;
    tz: string;
  };
  contact: {
    eyebrow: string;
    heading: string;
    subheading: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    messageLabel: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
  chat: {
    launcher: string;
    title: string;
    subtitle: string;
    placeholder: string;
    greeting: string;
    send: string;
    disclaimer: string;
    error: string;
    bookCta: string;
  };
  footer: {
    heading: string;
    paths: string[];
    cta: string;
    linkedin: string;
    email: string;
    rights: string;
    builtWith: string;
  };
  trust: {
    eyebrow: string;
    heading: string;
    items: { title: string; description: string }[];
    profileHeading: string;
    profile: { label: string; value: string }[];
  };
  mwsAgency: {
    eyebrow: string;
    heading: string;
    body: string;
    bullets: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
};

const es: Dictionary = {
  meta: {
    title:
      "Ricardo Zuluaga | Senior Software Architect · AI & Backend",
    description:
      "Senior Software Architect / Solutions Architect (AI · Backend · Sistemas distribuidos). +10 años y 12+ sistemas en producción. Remoto desde Medellín con solape CET o relocation a España/EU.",
    keywords: [
      "Senior Software Architect",
      "Solutions Architect",
      "Software Architect España",
      "Staff Software Engineer",
      "Principal Software Engineer",
      "AI Architect",
      "Contratar Solutions Architect",
      "Solutions Architect remoto España",
      "AI Automation",
      "Arquitecto de Software",
      "Orquestación de Agentes IA",
      "Consultoría IA para empresas",
      "CrewAI",
      "Ollama",
      "RAG",
      "MCP",
      "Python",
      "FastAPI",
      "Docker",
      "Microservicios",
      "Ricardo Zuluaga",
      "Medellín Web Soluciones",
      "agente WooCommerce España",
    ],
  },
  nav: {
    about: "Perfil",
    cases: "Soluciones",
    stack: "Stack",
    booking: "Agendar",
    contact: "Contacto",
    lab: "Laboratorio",
    services: "Servicios",
    career: "Trayectoria",
    recruiters: "Para reclutadores",
    langLabel: "EN",
  },
  hero: {
    availability:
      "Remoto desde Medellín · solape horario España · abierto a relocation ES",
    title:
      "Ricardo Zuluaga — Senior Software Architect / Solutions Architect",
    role: "Senior Software Architect / Solutions Architect",
    roleSpec: "AI · Backend · Sistemas distribuidos",
    subtitle:
      "Diseño, construyo y opero sistemas en producción donde la arquitectura, la fiabilidad y la IA importan de verdad: +10 años y 12+ sistemas entregados para banca, telco, retail y producto propio.",
    location: "España / EU · Remoto · Relocation",
    ctaPrimary: "Agendar llamada técnica (15 min)",
    ctaSecondary: "Ver sistemas en producción",
    ctaCv: "Descargar CV",
    ctaLinkedin: "LinkedIn",
    ctaWhatsapp: "WhatsApp",
    rolesLabel: "Abierto a",
    roles: [
      "Senior Software Architect",
      "Solutions Architect",
      "Staff Software Engineer",
      "Principal Engineer",
      "AI Architect",
      "Technical Lead",
      "Senior Backend Engineer",
    ],
    stats: [
      { value: "+10", label: "Años en producción" },
      { value: "12+", label: "Sistemas entregados" },
      { value: "24/7", label: "Automatización con IA local" },
    ],
  },
  enterprise: {
    label: "Experiencia enterprise",
    note: "Experiencia pública seleccionada. Parte del trabajo empresarial está bajo acuerdos de confidencialidad: describo responsabilidad técnica y arquitectura solo donde está permitido.",
  },
  products: {
    eyebrow: "Products & Ventures",
    heading: "Producto propio, separado de la trayectoria profesional.",
    body: "Nova, el laboratorio y MWS AI son iniciativas propias con las que pruebo arquitectura agéntica en producción. Van aquí, no mezcladas con la experiencia de empleo, para que quede claro qué es carrera y qué es producto.",
  },
  about: {
    eyebrow: "Executive Summary",
    heading: "El arquitecto al que llaman cuando el sistema no puede fallar.",
    body: [
      "Arquitecto de software con más de 10 años diseñando y operando sistemas que no pueden fallar: desde plataformas críticas bajo estándares corporativos hasta la nueva generación de infraestructura agéntica con IA. Prototipo cuando el problema lo exige, pero mi trabajo se mide en producción: clientes reales, operación 24/7 y responsabilidad de punta a punta.",
    ],
    systemsHeading: "Productos de punta a punta",
    systemsIntro:
      "A través de Medellín Web Soluciones diseño, construyo y opero sistemas reales — no demos — con clientes y operación 24/7.",
    systems: [
      {
        name: "Nova",
        tag: "Agentic AI",
        blurb: "Agencia de agentes orquestada con CrewAI e inferencia local (Ollama).",
      },
      {
        name: "LEXIA",
        tag: "LegalTech",
        blurb: "Legal OS 100% Python: API, panel operativo y analytics integrados.",
      },
      {
        name: "Omnicanal",
        tag: "Commerce",
        blurb: "Ecosistema con control humano del catálogo y checkout WooCommerce.",
      },
      {
        name: "Bold",
        tag: "Payments",
        blurb: "Integrador de pagos listo para producción en Colombia.",
      },
      {
        name: "LMS",
        tag: "EdTech",
        blurb: "Plataforma de formación con doble pasarela de pago.",
      },
      {
        name: "Auge Urbano",
        tag: "PropTech",
        blurb: "Plataforma inmobiliaria construida de cero: captación y operación.",
      },
    ],
    modelHeading: "Modelo boutique",
    modelIntro:
      "Pocos clientes, alta seniority y ownership real de arquitectura — sin intermediarios ni equipos junior de relleno.",
    modelPillars: [
      {
        title: "Para reclutadores",
        description: "Hablo seniority, stack y dominio con claridad técnica.",
      },
      {
        title: "Para compradores técnicos",
        description:
          "Trade-offs, alta disponibilidad, observabilidad y costo total de propiedad.",
      },
      {
        title: "Ownership total",
        description:
          "Arquitectura, entrega y operación bajo una sola firma responsable.",
      },
    ],
    modelFootnote:
      "Base Medellín · remoto preferido con solape España · abierto a indefinido en ES con relocation si el paquete lo justifica.",
    domains: [
      "Agentic AI",
      "LegalTech",
      "Commerce & Payments",
      "EdTech",
      "PropTech",
      "Arquitectura HA / Enterprise",
    ],
    principlesHeading: "Principios de arquitectura",
    principles: [
      {
        title: "Local-first & Seguridad",
        description:
          "IA que corre dentro de tu perímetro cuando la privacidad de los datos no es negociable — sin depender de una API externa que pueda fallar o filtrar información.",
      },
      {
        title: "Alta disponibilidad",
        description:
          "Sistemas diseñados para no caer: sin punto único de falla, listos para el escrutinio de un equipo de plataforma corporativo.",
      },
      {
        title: "Observabilidad",
        description:
          "Métricas y trazas en cada capa. Si algo falla, lo veo antes que el cliente — y lo pruebo con evidencia, no con intuición.",
      },
      {
        title: "Automatización 24/7",
        description:
          "Agentes y contenedores que asumen el trabajo operativo repetitivo, para que tu equipo se enfoque en lo que sí mueve la aguja.",
      },
    ],
  },
  cases: {
    eyebrow: "Casos de éxito",
    heading: "Soluciones Implementadas",
    subheading:
      "Sistemas reales en producción — agentes, alta disponibilidad, LegalTech, commerce y pagos — con arquitectura y trade-offs explícitos, no un portafolio de capturas bonitas.",
    challengeLabel: "Problema",
    solutionLabel: "Solución",
    resultLabel: "Impacto",
  },
  stack: {
    eyebrow: "Tech Stack",
    heading: "Un núcleo técnico claro, con amplitud detrás.",
    subheading:
      "No es una lista de todo lo que he tocado: es el núcleo con el que diseño y opero sistemas, y las capas de soporte que sé cuándo usar.",
    tiers: {
      core: "Núcleo de especialidad",
      strong: "Experiencia sólida",
      infra: "Infraestructura",
      ai: "Infraestructura de IA",
    },
    categories: [
      {
        title: "Arquitectura & Backend",
        blurb:
          "El núcleo: APIs, dominios y backends que sostienen el negocio en producción.",
        icon: "python",
        tier: "core",
        items: [
          "Python",
          "FastAPI",
          "Django",
          "PostgreSQL",
          "Diseño de APIs",
          "Arquitectura de software",
        ],
      },
      {
        title: "Agentic AI",
        blurb:
          "Orquestación local-first de agentes con RAG y herramientas MCP — no un wrapper de ChatGPT.",
        icon: "agentic",
        tier: "core",
        items: ["Agentic AI", "RAG", "CrewAI", "Ollama", "MCP", "Embeddings"],
      },
      {
        title: "Commerce & Product",
        blurb: "Checkout real y plataformas full-stack de punta a punta.",
        icon: "commerce",
        tier: "strong",
        items: ["WooCommerce", "Bold", "Next.js", "React", "HTMX", "PHP / WordPress"],
      },
      {
        title: "Otros stacks en producción",
        blurb:
          "Entornos corporativos donde he entregado sin ser mi núcleo diario.",
        icon: "lamp",
        tier: "strong",
        items: ["Laravel", "Node.js", ".NET", "Java", "Angular", "Flask", "Streamlit"],
      },
      {
        title: "Plataforma & Alta disponibilidad",
        blurb: "Sin SPOF, observable y listo para escrutinio corporativo.",
        icon: "ha",
        tier: "infra",
        items: [
          "Docker",
          "Nginx",
          "Linux",
          "Redis",
          "CI/CD",
          "Observabilidad",
          "Microservicios",
        ],
      },
      {
        title: "Datos operativos",
        blurb: "Consistencia ACID, migraciones y consultas críticas.",
        icon: "relational",
        tier: "infra",
        items: ["PostgreSQL", "MySQL / MariaDB", "SQL Server", "MongoDB", "Elasticsearch"],
      },
      {
        title: "Vectorial & Grafos",
        blurb: "Recuperación semántica y relaciones para sistemas con IA.",
        icon: "graph",
        tier: "ai",
        items: ["pgvector", "Qdrant", "Weaviate", "Chroma", "Neo4j"],
      },
      {
        title: "Operación de modelos",
        blurb: "Inferencia local, control de coste y guardrails en producción.",
        icon: "product",
        tier: "ai",
        items: [
          "Inferencia local",
          "Control de coste",
          "Evaluaciones",
          "Guardrails",
          "Fine-tuning",
        ],
      },
    ],
  },
  booking: {
    eyebrow: "Agenda",
    heading: "Agenda una llamada técnica",
    subheading:
      "15 minutos por Google Meet. Sin vendedor, sin script: hablas directo conmigo sobre arquitectura, automatización con IA o un rol senior. Horarios orientados a solape con España.",
    dateLabel: "Fecha",
    slotLabel: "Horario disponible (Colombia · España)",
    nameLabel: "Nombre",
    emailLabel: "Email",
    topicLabel: "Tema (opcional)",
    topicPlaceholder: "¿Sobre qué quieres conversar?",
    noSlots: "No hay horarios disponibles para esta fecha.",
    loadingSlots: "Cargando disponibilidad...",
    submit: "Confirmar llamada técnica",
    submitting: "Agendando...",
    successTitle: "Reunión confirmada",
    successBody:
      "Revisa tu correo: te acabamos de enviar la invitación con el enlace de Google Meet.",
    pendingTitle: "Solicitud recibida",
    pendingBody:
      "Tu horario quedó reservado. Ricardo te confirmará por email y te enviará el enlace de la reunión.",
    meetLabel: "Unirse a Google Meet",
    errorGeneric: "No se pudo agendar. Intenta con otro horario.",
    errorRateLimited:
      "Demasiados intentos seguidos. Espera unos minutos y vuelve a probar.",
    tz: "Horarios en Colombia (America/Bogota). Cada slot muestra también la hora en España (Europe/Madrid).",
  },
  contact: {
    eyebrow: "Contacto",
    heading: "Escríbeme y te respondo personalmente.",
    subheading:
      "Cuéntame tu reto de arquitectura, IA o producto — leo cada mensaje yo mismo, sin bandeja de soporte ni bot intermedio.",
    nameLabel: "Nombre",
    emailLabel: "Email",
    phoneLabel: "Teléfono",
    messageLabel: "Mensaje",
    submit: "Contactar a Ricardo",
    submitting: "Enviando...",
    success: "Mensaje enviado. Te responderé pronto.",
    error: "No se pudo enviar. Intenta de nuevo.",
  },
  chat: {
    launcher: "Pregúntale a Ricardo (IA)",
    title: "Asistente IA de Ricardo",
    subtitle: "Entrenado con el conocimiento de Ricardo Zuluaga",
    placeholder: "Escribe tu pregunta técnica...",
    greeting:
      "Hola, soy el asistente de IA de Ricardo. Puedo ayudarte con arquitectura, desarrollo full stack senior, IA en producción o si estás evaluando su perfil para un rol. ¿En qué te puedo ayudar?",
    send: "Enviar",
    disclaimer:
      "Asistente de IA entrenado con el conocimiento de Ricardo. Para temas sensibles, agenda una llamada.",
    error: "Hubo un problema. Intenta de nuevo o agenda una llamada.",
    bookCta: "Agendar llamada",
  },
  footer: {
    heading: "Hablemos de arquitectura.",
    paths: [
      "Contratarme para un rol senior",
      "Consultoría técnica",
      "Sistemas de IA en producción",
    ],
    cta: "Contactar a Ricardo",
    linkedin: "LinkedIn",
    email: "Email",
    rights: "Todos los derechos reservados.",
    builtWith: "Diseñado y construido por Ricardo Zuluaga.",
  },
  trust: {
    eyebrow: "Cómo trabajo con España / EU",
    heading: "Remoto primero. Relocation si hace falta. Contratos claros.",
    items: [
      {
        title: "Remoto o relocation",
        description:
          "Base Medellín. Prefiero 100% remoto con solape CET. Si el rol exige presencia, puedo trasladarme a la ciudad del contrato (visado/autorización con apoyo de la empresa).",
      },
      {
        title: "Modelo contractual",
        description:
          "Indefinido en España o contractor B2B / prestación de servicios. Google Meet, ownership end-to-end y banda senior — no mid-dev commodity.",
      },
      {
        title: "RGPD y datos",
        description:
          "Diseño con privacidad por defecto: local-first cuando aplica, procesamiento acotado y guardrails. Listo para conversar cumplimiento AI Act / RGPD en la llamada técnica.",
      },
      {
        title: "Idioma",
        description:
          "Español profesional (neutro ES/LatAm) e inglés técnico para equipos internacionales.",
      },
    ],
    profileHeading: "Perfil de contratación internacional",
    profile: [
      { label: "Base", value: "Medellín, Colombia" },
      { label: "Mercado objetivo", value: "España / EU / internacional" },
      { label: "Zona horaria", value: "COT con solape CET" },
      { label: "Remoto", value: "Preferido" },
      { label: "Relocation", value: "España / EU" },
      { label: "Contrato", value: "Indefinido ES o contractor B2B" },
      { label: "Idiomas", value: "Español · inglés técnico" },
      { label: "Banda objetivo", value: "Senior / Staff / Principal / Architect" },
    ],
  },
  recruiters: {
    metaTitle:
      "Para reclutadores | Ricardo Zuluaga — Senior Software Architect",
    metaDescription:
      "Perfil de contratación: roles objetivo, modelo de trabajo, stack núcleo, experiencia enterprise y CV descargable. Senior Software Architect / Solutions Architect para España/EU.",
    eyebrow: "Perfil de contratación",
    heading: "Todo lo que necesitas para decidir si encajo, en una página.",
    intro:
      "Sin recorrer el portafolio entero: roles a los que aplico, cómo trabajo con España/EU, el stack que domino y los sistemas que puedes revisar en detalle.",
    quickFactsHeading: "Datos rápidos",
    quickFacts: [
      { label: "Ubicación", value: "Medellín, Colombia" },
      { label: "WhatsApp", value: "+57 305 355 4636" },
      { label: "Zona horaria", value: "COT · solape diario con CET" },
      { label: "Experiencia", value: "+10 años · 12+ sistemas en producción" },
      { label: "Especialidad", value: "Arquitectura · IA · Backend" },
      { label: "Idiomas", value: "Español nativo · inglés técnico" },
    ],
    rolesHeading: "Roles objetivo",
    rolesNote:
      "Banda senior/staff. No aplico a posiciones mid ni a roles donde no haya responsabilidad de arquitectura.",
    workModelHeading: "Modelo de trabajo",
    workModel: [
      { label: "Remoto", value: "Preferido, con solape CET" },
      { label: "Relocation", value: "España / EU si el rol lo exige" },
      {
        label: "Contrato",
        value: "Indefinido en España o contractor B2B",
      },
      {
        label: "Autorización",
        value:
          "Traslado a la ciudad del contrato con visado/autorización gestionada con apoyo de la empresa. Como contractor B2B facturo desde Colombia.",
      },
    ],
    stackHeading: "Stack núcleo",
    enterpriseHeading: "Experiencia enterprise",
    systemsHeading: "Sistemas que puedes auditar",
    systemsNote:
      "Cada caso incluye problema, arquitectura, decisiones y resultado. Los productos propios son verificables en vivo.",
    ctaHeading: "Siguiente paso",
    ctaBody:
      "Descarga el CV o agenda 15 minutos: hablas directamente conmigo, sin intermediarios.",
    downloadCv: "Descargar CV (PDF)",
    viewLinkedin: "Ver LinkedIn",
    whatsappCta: "Escribir por WhatsApp",
    bookCall: "Agendar llamada técnica",
    emailCta: "Escribir un email",
  },
  mwsAgency: {
    eyebrow: "Para agencias WooCommerce",
    heading: "MWS AI: margen recurrente, no otro freela de arquitectura.",
    body: "Si sois agencia o distribuidor en España, esto no es un pitch para contratarme como Solutions Architect. Es un producto SaaS white-label: agente de ventas/soporte 24/7 con RAG sobre inventario Woo real, handoff humano y planes anuales Growth/Enterprise.",
    bullets: [
      "Inventario vivo (stock, tallas, precios) — menos alucinaciones que un chatbot genérico",
      "Plugin WordPress + licencia; sin pedir claves de terceros en la tienda del cliente",
      "Canal agencias: volumen / white-label para margen recurrente",
      "Demo de 15 minutos orientada a vuestro catálogo de clientes Woo",
    ],
    ctaPrimary: "Agendar demo agencia",
    ctaSecondary: "Ver caso MWS AI",
  },
};

const en: Dictionary = {
  meta: {
    title: "Ricardo Zuluaga | Senior Software Architect · AI & Backend",
    description:
      "Senior Software Architect / Solutions Architect (AI · Backend · Distributed Systems). 10+ years and 12+ production systems. Remote from Medellín with CET overlap or relocation to Spain/EU.",
    keywords: [
      "Senior Software Architect",
      "Solutions Architect",
      "Software Architect Spain",
      "Staff Software Engineer",
      "Principal Software Engineer",
      "AI Architect",
      "Hire Solutions Architect",
      "Remote Solutions Architect Spain",
      "AI Automation",
      "Software Architect",
      "AI Agents Orchestration",
      "AI Consulting for Enterprises",
      "CrewAI",
      "Ollama",
      "RAG",
      "MCP",
      "Python",
      "FastAPI",
      "Docker",
      "Microservices",
      "Ricardo Zuluaga",
      "Medellin Web Soluciones",
      "WooCommerce AI agent Spain",
    ],
  },
  nav: {
    about: "Profile",
    cases: "Solutions",
    stack: "Stack",
    booking: "Book a call",
    contact: "Contact",
    lab: "Lab",
    services: "Services",
    career: "Career",
    recruiters: "For recruiters",
    langLabel: "ES",
  },
  hero: {
    availability:
      "Remote from Medellín · Spain timezone overlap · open to ES relocation",
    title: "Ricardo Zuluaga — Senior Software Architect / Solutions Architect",
    role: "Senior Software Architect / Solutions Architect",
    roleSpec: "AI · Backend · Distributed Systems",
    subtitle:
      "I design, build and operate production systems where architecture, reliability and AI actually matter: 10+ years and 12+ systems shipped across banking, telco, retail and my own products.",
    location: "Spain / EU · Remote · Relocation",
    ctaPrimary: "Book a 15-Min Technical Call",
    ctaSecondary: "See Production Systems",
    ctaCv: "Download CV",
    ctaLinkedin: "LinkedIn",
    ctaWhatsapp: "WhatsApp",
    rolesLabel: "Open to",
    roles: [
      "Senior Software Architect",
      "Solutions Architect",
      "Staff Software Engineer",
      "Principal Engineer",
      "AI Architect",
      "Technical Lead",
      "Senior Backend Engineer",
    ],
    stats: [
      { value: "10+", label: "Years in production" },
      { value: "12+", label: "Systems delivered" },
      { value: "24/7", label: "Local AI automation" },
    ],
  },
  enterprise: {
    label: "Enterprise experience",
    note: "Selected public experience. Part of the enterprise work sits under confidentiality agreements: I describe technical responsibility and architecture only where permitted.",
  },
  products: {
    eyebrow: "Products & Ventures",
    heading: "My own products, kept separate from my career track.",
    body: "Nova, the lab and MWS AI are my own initiatives, where I push agentic architecture into production. They live here rather than mixed into employment history, so it's clear what is career and what is product.",
  },
  about: {
    eyebrow: "Executive Summary",
    heading: "The architect companies call when the system can't fail.",
    body: [
      "Software architect with 10+ years designing and operating systems that can't afford to fail — from critical platforms under corporate standards to the new generation of agentic AI infrastructure. I prototype when the problem calls for it, but my work is measured in production: real clients, 24/7 operation and end-to-end accountability.",
    ],
    systemsHeading: "End-to-end products",
    systemsIntro:
      "Through Medellín Web Soluciones I design, build and operate real systems — not demos — with clients and 24/7 operation.",
    systems: [
      {
        name: "Nova",
        tag: "Agentic AI",
        blurb: "AI agent agency orchestrated with CrewAI and local inference (Ollama).",
      },
      {
        name: "LEXIA",
        tag: "LegalTech",
        blurb: "100% Python Legal OS: API, operator panel and analytics in one stack.",
      },
      {
        name: "Omnichannel",
        tag: "Commerce",
        blurb: "Human-controlled catalog with WooCommerce checkout.",
      },
      {
        name: "Bold",
        tag: "Payments",
        blurb: "Payments integrator ready for production in Colombia.",
      },
      {
        name: "LMS",
        tag: "EdTech",
        blurb: "Learning platform with a dual payment gateway.",
      },
      {
        name: "Auge Urbano",
        tag: "PropTech",
        blurb: "Real-estate platform built from zero: capture and operations.",
      },
    ],
    modelHeading: "Boutique model",
    modelIntro:
      "Few clients, high seniority and real architecture ownership — no middle layers, no junior teams padding the invoice.",
    modelPillars: [
      {
        title: "For recruiters",
        description: "I speak seniority, stack and domain with technical clarity.",
      },
      {
        title: "For technical buyers",
        description:
          "Trade-offs, high availability, observability and total cost of ownership.",
      },
      {
        title: "Full ownership",
        description:
          "Architecture, delivery and operations under one accountable firm.",
      },
    ],
    modelFootnote:
      "Based in Medellín · remote-first with Spain overlap · open to a Spanish permanent contract with relocation when the package justifies it.",
    domains: [
      "Agentic AI",
      "LegalTech",
      "Commerce & Payments",
      "EdTech",
      "PropTech",
      "Enterprise HA Architecture",
    ],
    principlesHeading: "Architecture principles",
    principles: [
      {
        title: "Local-first & Security",
        description:
          "AI that runs inside your perimeter when data privacy isn't negotiable — no dependency on a third-party API that can fail or leak.",
      },
      {
        title: "High availability",
        description:
          "Systems designed to stay up: no single point of failure, built to survive scrutiny from a corporate platform team.",
      },
      {
        title: "Observability",
        description:
          "Metrics and traces at every layer. If something breaks, I see it before the client does — and prove it with evidence, not guesswork.",
      },
      {
        title: "24/7 automation",
        description:
          "Agents and containers that absorb repetitive operational work, so your team can focus on what actually moves the needle.",
      },
    ],
  },
  cases: {
    eyebrow: "Case studies",
    heading: "Delivered Solutions",
    subheading:
      "Real production systems — agents, high availability, LegalTech, commerce and payments — with explicit architecture and trade-offs, not a portfolio of pretty screenshots.",
    challengeLabel: "Problem",
    solutionLabel: "Solution",
    resultLabel: "Impact",
  },
  stack: {
    eyebrow: "Tech Stack",
    heading: "A clear technical core, with breadth behind it.",
    subheading:
      "Not a list of everything I've touched: the core I design and operate systems with, plus the supporting layers I know when to reach for.",
    tiers: {
      core: "Core expertise",
      strong: "Strong experience",
      infra: "Infrastructure",
      ai: "AI infrastructure",
    },
    categories: [
      {
        title: "Architecture & Backend",
        blurb:
          "The core: APIs, domains and backends that keep the business running in production.",
        icon: "python",
        tier: "core",
        items: [
          "Python",
          "FastAPI",
          "Django",
          "PostgreSQL",
          "API design",
          "Software architecture",
        ],
      },
      {
        title: "Agentic AI",
        blurb:
          "Local-first agent orchestration with RAG and MCP tools — not a ChatGPT wrapper.",
        icon: "agentic",
        tier: "core",
        items: ["Agentic AI", "RAG", "CrewAI", "Ollama", "MCP", "Embeddings"],
      },
      {
        title: "Commerce & Product",
        blurb: "Real checkout and end-to-end full-stack product surfaces.",
        icon: "commerce",
        tier: "strong",
        items: ["WooCommerce", "Bold", "Next.js", "React", "HTMX", "PHP / WordPress"],
      },
      {
        title: "Other production stacks",
        blurb:
          "Corporate environments where I've delivered outside my daily core.",
        icon: "lamp",
        tier: "strong",
        items: ["Laravel", "Node.js", ".NET", "Java", "Angular", "Flask", "Streamlit"],
      },
      {
        title: "Platform & High availability",
        blurb: "No SPOF, observable and ready for corporate scrutiny.",
        icon: "ha",
        tier: "infra",
        items: [
          "Docker",
          "Nginx",
          "Linux",
          "Redis",
          "CI/CD",
          "Observability",
          "Microservices",
        ],
      },
      {
        title: "Operational data",
        blurb: "ACID consistency, migrations and mission-critical queries.",
        icon: "relational",
        tier: "infra",
        items: ["PostgreSQL", "MySQL / MariaDB", "SQL Server", "MongoDB", "Elasticsearch"],
      },
      {
        title: "Vector & Graph",
        blurb: "Semantic retrieval and relationships for AI systems.",
        icon: "graph",
        tier: "ai",
        items: ["pgvector", "Qdrant", "Weaviate", "Chroma", "Neo4j"],
      },
      {
        title: "Model operations",
        blurb: "Local inference, cost control and guardrails in production.",
        icon: "product",
        tier: "ai",
        items: [
          "Local inference",
          "Cost control",
          "Evaluations",
          "Guardrails",
          "Fine-tuning",
        ],
      },
    ],
  },
  booking: {
    eyebrow: "Schedule",
    heading: "Book a technical call",
    subheading:
      "15 minutes on Google Meet. No salesperson, no script: you talk directly to me about architecture, AI automation or a senior role. Slots oriented to Spain overlap.",
    dateLabel: "Date",
    slotLabel: "Available times (Colombia · Spain)",
    nameLabel: "Name",
    emailLabel: "Email",
    topicLabel: "Topic (optional)",
    topicPlaceholder: "What would you like to discuss?",
    noSlots: "No available times for this date.",
    loadingSlots: "Loading availability...",
    submit: "Confirm technical call",
    submitting: "Booking...",
    successTitle: "Meeting confirmed",
    successBody:
      "Check your inbox: the invite with the Google Meet link just landed.",
    pendingTitle: "Request received",
    pendingBody:
      "Your time slot is reserved. Ricardo will confirm by email and send you the meeting link.",
    meetLabel: "Join Google Meet",
    errorGeneric: "Could not book. Please try another time.",
    errorRateLimited:
      "Too many attempts in a row. Please wait a few minutes and try again.",
    tz: "Times in Colombia (America/Bogota). Each slot also shows Spain time (Europe/Madrid).",
  },
  contact: {
    eyebrow: "Contact",
    heading: "Write to me and I'll reply personally.",
    subheading:
      "Tell me about your architecture, AI or product challenge — I read every message myself, no support queue, no bot in between.",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    messageLabel: "Message",
    submit: "Contact Ricardo",
    submitting: "Sending...",
    success: "Message sent. I'll get back to you soon.",
    error: "Could not send. Please try again.",
  },
  chat: {
    launcher: "Ask Ricardo (AI)",
    title: "Ricardo's AI Assistant",
    subtitle: "Trained on Ricardo Zuluaga's knowledge",
    placeholder: "Type your technical question...",
    greeting:
      "Hi — I'm Ricardo's AI assistant. I can help with architecture, senior full-stack work, production AI, or if you're evaluating his profile for a role. How can I help?",
    send: "Send",
    disclaimer:
      "AI assistant trained on Ricardo's knowledge. For sensitive matters, book a call.",
    error: "Something went wrong. Try again or book a call.",
    bookCta: "Book a call",
  },
  footer: {
    heading: "Let's talk architecture.",
    paths: [
      "Hiring me for a senior role",
      "Technical consulting",
      "AI systems in production",
    ],
    cta: "Contact Ricardo",
    linkedin: "LinkedIn",
    email: "Email",
    rights: "All rights reserved.",
    builtWith: "Designed and built by Ricardo Zuluaga.",
  },
  trust: {
    eyebrow: "Working with Spain / EU",
    heading: "Remote first. Relocation if needed. Clear contracts.",
    items: [
      {
        title: "Remote or relocation",
        description:
          "Based in Medellín. Prefer 100% remote with CET overlap. If the role requires presence, I can relocate to the contract city (work authorization with company sponsorship).",
      },
      {
        title: "Contract model",
        description:
          "Spanish permanent contract or B2B contractor. Google Meet, end-to-end ownership and senior banding — not commodity mid-dev rates.",
      },
      {
        title: "GDPR and data",
        description:
          "Privacy by design: local-first when it matters, scoped processing and guardrails. Ready to discuss AI Act / GDPR compliance on the technical call.",
      },
      {
        title: "Language",
        description:
          "Professional Spanish (neutral ES/LatAm) and technical English for international teams.",
      },
    ],
    profileHeading: "International hiring profile",
    profile: [
      { label: "Based in", value: "Medellín, Colombia" },
      { label: "Target market", value: "Spain / EU / international" },
      { label: "Timezone", value: "COT with CET overlap" },
      { label: "Remote", value: "Preferred" },
      { label: "Relocation", value: "Spain / EU" },
      { label: "Contract", value: "Spanish permanent or B2B contractor" },
      { label: "Languages", value: "Spanish · technical English" },
      { label: "Target band", value: "Senior / Staff / Principal / Architect" },
    ],
  },
  recruiters: {
    metaTitle: "For recruiters | Ricardo Zuluaga — Senior Software Architect",
    metaDescription:
      "Hiring profile: target roles, work model, core stack, enterprise experience and downloadable CV. Senior Software Architect / Solutions Architect for Spain/EU.",
    eyebrow: "Hiring profile",
    heading: "Everything you need to decide if I fit, on one page.",
    intro:
      "No need to walk the whole portfolio: the roles I apply for, how I work with Spain/EU, the stack I own and the systems you can review in depth.",
    quickFactsHeading: "Quick facts",
    quickFacts: [
      { label: "Location", value: "Medellín, Colombia" },
      { label: "WhatsApp", value: "+57 305 355 4636" },
      { label: "Timezone", value: "COT · daily CET overlap" },
      { label: "Experience", value: "10+ years · 12+ production systems" },
      { label: "Focus", value: "Architecture · AI · Backend" },
      { label: "Languages", value: "Native Spanish · technical English" },
    ],
    rolesHeading: "Target roles",
    rolesNote:
      "Senior/staff band. I don't apply to mid-level positions or roles without architecture ownership.",
    workModelHeading: "Work model",
    workModel: [
      { label: "Remote", value: "Preferred, with CET overlap" },
      { label: "Relocation", value: "Spain / EU if the role requires it" },
      { label: "Contract", value: "Spanish permanent contract or B2B contractor" },
      {
        label: "Authorization",
        value:
          "Relocation to the contract city with work authorization sponsored by the company. As a B2B contractor I invoice from Colombia.",
      },
    ],
    stackHeading: "Core stack",
    enterpriseHeading: "Enterprise experience",
    systemsHeading: "Systems you can audit",
    systemsNote:
      "Each case covers problem, architecture, decisions and outcome. My own products are verifiable live.",
    ctaHeading: "Next step",
    ctaBody:
      "Download the CV or book 15 minutes: you talk directly to me, no middle layer.",
    downloadCv: "Download CV (PDF)",
    viewLinkedin: "View LinkedIn",
    whatsappCta: "Message on WhatsApp",
    bookCall: "Book a technical call",
    emailCta: "Send an email",
  },
  mwsAgency: {
    eyebrow: "For WooCommerce agencies",
    heading: "MWS AI: recurring margin — not another architecture freela.",
    body: "If you're an agency or reseller in Spain, this isn't a pitch to hire me as a Solutions Architect. It's a white-label SaaS: a 24/7 sales/support agent with RAG over live Woo inventory, human handoff and annual Growth/Enterprise plans.",
    bullets: [
      "Live inventory (stock, sizes, prices) — fewer hallucinations than a generic chatbot",
      "WordPress plugin + license; no third-party API keys in the client's store",
      "Agency channel: volume / white-label for recurring margin",
      "15-minute demo oriented to your Woo client portfolio",
    ],
    ctaPrimary: "Book agency demo",
    ctaSecondary: "See MWS AI case",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.es;
}
