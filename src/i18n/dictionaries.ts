import type { Locale } from "./config";

export type CaseStudyLabels = {
  challengeLabel: string;
  solutionLabel: string;
  resultLabel: string;
};

export type StackCategory = {
  title: string;
  items: string[];
  blurb?: string;
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
    langLabel: string;
  };
  hero: {
    availability: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: string; label: string }[];
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
    categories: StackCategory[];
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
    meetLabel: string;
    errorGeneric: string;
    tz: string;
  };
  contact: {
    eyebrow: string;
    heading: string;
    subheading: string;
    nameLabel: string;
    emailLabel: string;
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
      "Ricardo Zuluaga | Senior Solutions Architect & AI Automation Expert",
    description:
      "Arquitecto de Soluciones Senior disponible remoto desde Medellín (solape España) o con relocation a ES. Agentic AI, RAG, CrewAI, MCP y alta disponibilidad en producción — para reclutadores y empresas EU.",
    keywords: [
      "Solutions Architect",
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
    langLabel: "EN",
  },
  hero: {
    availability:
      "Remoto desde Medellín · solape horario España · abierto a relocation ES",
    title:
      "Ricardo Zuluaga — Senior Solutions Architect & AI Automation Expert",
    subtitle:
      "Arquitectura y agentes de IA en producción para empresas y reclutadores en España/EU: +10 años, 12 sistemas entregados. Prefiero 100% remoto; disponible para trasladarme si el rol lo exige.",
    ctaPrimary: "Agendar llamada técnica (15 min)",
    ctaSecondary: "Ver sistemas en producción",
    stats: [
      { value: "+10", label: "Años en producción" },
      { value: "12", label: "Sistemas entregados" },
      { value: "24/7", label: "Automatización con IA local" },
    ],
  },
  about: {
    eyebrow: "Executive Summary",
    heading: "El arquitecto al que llaman cuando el sistema no puede fallar.",
    body: [
      "Arquitecto de Software Full-Stack con más de 10 años diseñando y operando sistemas que no pueden fallar: desde plataformas críticas bajo estándares corporativos hasta la nueva generación de infraestructura agéntica con IA. No entrego demos ni POCs — entrego sistemas en producción, con clientes reales y operación 24/7.",
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
    challengeLabel: "Reto",
    solutionLabel: "Solución",
    resultLabel: "Resultado",
  },
  stack: {
    eyebrow: "Tech Stack",
    heading: "Herramientas de precisión.",
    subheading:
      "Del LAMP clásico a Full Stack Python, agentes, grafos y bases vectoriales: el stack que uso en sistemas reales, no en tutoriales.",
    categories: [
      {
        title: "Agentic AI",
        blurb:
          "Orquestación local-first de agentes con RAG y herramientas MCP — no un wrapper de ChatGPT.",
        icon: "agentic",
        items: ["CrewAI", "Ollama", "RAG", "MCP", "FastAPI agents", "Embeddings"],
      },
      {
        title: "Full Stack LAMP",
        blurb: "El clásico de producción web: estable, barato y desplegable.",
        icon: "lamp",
        items: ["Linux", "Apache", "MySQL / MariaDB", "PHP", "WordPress"],
      },
      {
        title: "Full Stack Python",
        blurb:
          "El stack primordial para IA y productos potentes: APIs, backends y apps de punta a punta.",
        icon: "python",
        items: ["Python", "FastAPI", "Django", "Flask", "Streamlit", "Celery"],
      },
      {
        title: "Arquitectura HA",
        blurb: "Sin SPOF, observable y listo para escrutinio corporativo.",
        icon: "ha",
        items: ["Microservices", "Docker", "Nginx", "Observability", "Redis", "CI/CD"],
      },
      {
        title: "Commerce & Product",
        blurb: "Checkout real y plataformas full-stack de punta a punta.",
        icon: "commerce",
        items: ["WooCommerce", "Bold", "Next.js", "Django", "React", "HTMX"],
      },
      {
        title: "Bases relacionales",
        blurb: "Consistencia ACID, migraciones y consultas críticas.",
        icon: "relational",
        items: ["PostgreSQL", "MySQL", "MariaDB", "SQL Server"],
      },
      {
        title: "No relacionales",
        blurb: "Documentos, caché y búsqueda cuando el modelo no es tabular.",
        icon: "nosql",
        items: ["MongoDB", "Redis", "Elasticsearch", "DynamoDB"],
      },
      {
        title: "Grafos & Vectoriales",
        blurb: "Lo nuevo: relaciones y similitud semántica para IA/RAG.",
        icon: "graph",
        items: ["Neo4j", "pgvector", "Qdrant", "Weaviate", "Chroma"],
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
    submit: "Confirmar y generar Google Meet",
    submitting: "Agendando...",
    successTitle: "Reunión confirmada",
    successBody:
      "Revisa tu correo: te acabamos de enviar la invitación con el enlace de Google Meet.",
    meetLabel: "Unirse a Google Meet",
    errorGeneric: "No se pudo agendar. Intenta con otro horario.",
    tz: "Horarios en Colombia (America/Bogota). Cada slot muestra también la hora en España (Europe/Madrid).",
  },
  contact: {
    eyebrow: "Contacto",
    heading: "Escríbeme y te respondo personalmente.",
    subheading:
      "Cuéntame tu reto de arquitectura, IA o producto — leo cada mensaje yo mismo, sin bandeja de soporte ni bot intermedio.",
    nameLabel: "Nombre",
    emailLabel: "Email",
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
      "Hola, soy el asistente de IA de Ricardo. Respondo dudas técnicas sobre arquitectura, automatización con IA y los proyectos de Medellín Web Soluciones — y si tu caso amerita una evaluación real, te ayudo a agendar la llamada. ¿En qué te ayudo?",
    send: "Enviar",
    disclaimer:
      "Asistente de IA entrenado con el conocimiento de Ricardo. Para temas sensibles, agenda una llamada.",
    error: "Hubo un problema. Intenta de nuevo o agenda una llamada.",
    bookCta: "Agendar llamada",
  },
  footer: {
    heading:
      "¿Tu equipo enfrenta un techo de escalabilidad o necesita automatización con IA que funcione en producción, no en un pitch deck? Hablemos de arquitectura.",
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
    title:
      "Ricardo Zuluaga | Senior Solutions Architect & AI Automation Expert",
    description:
      "Senior Solutions Architect available remote from Medellín (Spain overlap) or open to ES relocation. Agentic AI, RAG, CrewAI, MCP and high availability in production — for EU recruiters and companies.",
    keywords: [
      "Solutions Architect",
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
    langLabel: "ES",
  },
  hero: {
    availability:
      "Remote from Medellín · Spain timezone overlap · open to ES relocation",
    title:
      "Ricardo Zuluaga — Senior Solutions Architect & AI Automation Expert",
    subtitle:
      "Production architecture and AI agents for companies and recruiters in Spain/EU: 10+ years, 12 systems shipped. Prefer 100% remote; ready to relocate if the role requires it.",
    ctaPrimary: "Book a 15-Min Technical Call",
    ctaSecondary: "See Production Systems",
    stats: [
      { value: "10+", label: "Years in production" },
      { value: "12", label: "Systems delivered" },
      { value: "24/7", label: "Local AI automation" },
    ],
  },
  about: {
    eyebrow: "Executive Summary",
    heading: "The architect companies call when the system can't fail.",
    body: [
      "Full-Stack Software Architect with 10+ years designing and operating systems that can't afford to fail — from critical platforms under corporate standards to the new generation of agentic AI infrastructure. I don't ship demos or POCs. I ship production systems, with real clients and 24/7 operation.",
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
    challengeLabel: "Challenge",
    solutionLabel: "Solution",
    resultLabel: "Result",
  },
  stack: {
    eyebrow: "Tech Stack",
    heading: "Precision tooling.",
    subheading:
      "From classic LAMP to Full Stack Python, agents, graphs and vector stores: the stack I use in real systems, not tutorials.",
    categories: [
      {
        title: "Agentic AI",
        blurb:
          "Local-first agent orchestration with RAG and MCP tools — not a ChatGPT wrapper.",
        icon: "agentic",
        items: ["CrewAI", "Ollama", "RAG", "MCP", "FastAPI agents", "Embeddings"],
      },
      {
        title: "Full Stack LAMP",
        blurb: "The production web classic: stable, lean and deployable.",
        icon: "lamp",
        items: ["Linux", "Apache", "MySQL / MariaDB", "PHP", "WordPress"],
      },
      {
        title: "Full Stack Python",
        blurb:
          "The core stack for AI and powerful products: APIs, backends and end-to-end apps.",
        icon: "python",
        items: ["Python", "FastAPI", "Django", "Flask", "Streamlit", "Celery"],
      },
      {
        title: "HA architecture",
        blurb: "No SPOF, observable and ready for corporate scrutiny.",
        icon: "ha",
        items: ["Microservices", "Docker", "Nginx", "Observability", "Redis", "CI/CD"],
      },
      {
        title: "Commerce & Product",
        blurb: "Real checkout and end-to-end full-stack product surfaces.",
        icon: "commerce",
        items: ["WooCommerce", "Bold", "Next.js", "Django", "React", "HTMX"],
      },
      {
        title: "Relational databases",
        blurb: "ACID consistency, migrations and mission-critical queries.",
        icon: "relational",
        items: ["PostgreSQL", "MySQL", "MariaDB", "SQL Server"],
      },
      {
        title: "Non-relational",
        blurb: "Documents, cache and search when the model is not tabular.",
        icon: "nosql",
        items: ["MongoDB", "Redis", "Elasticsearch", "DynamoDB"],
      },
      {
        title: "Graph & Vector",
        blurb: "What's new: relationships and semantic similarity for AI/RAG.",
        icon: "graph",
        items: ["Neo4j", "pgvector", "Qdrant", "Weaviate", "Chroma"],
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
    submit: "Confirm and create Google Meet",
    submitting: "Booking...",
    successTitle: "Meeting confirmed",
    successBody:
      "Check your inbox: the invite with the Google Meet link just landed.",
    meetLabel: "Join Google Meet",
    errorGeneric: "Could not book. Please try another time.",
    tz: "Times in Colombia (America/Bogota). Each slot also shows Spain time (Europe/Madrid).",
  },
  contact: {
    eyebrow: "Contact",
    heading: "Write to me and I'll reply personally.",
    subheading:
      "Tell me about your architecture, AI or product challenge — I read every message myself, no support queue, no bot in between.",
    nameLabel: "Name",
    emailLabel: "Email",
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
      "Hi, I'm Ricardo's AI assistant. I answer technical questions about architecture, AI automation and Medellín Web Soluciones' projects — and if your case needs a real assessment, I'll help you book the call. How can I help?",
    send: "Send",
    disclaimer:
      "AI assistant trained on Ricardo's knowledge. For sensitive matters, book a call.",
    error: "Something went wrong. Try again or book a call.",
    bookCta: "Book a call",
  },
  footer: {
    heading:
      "Is your team hitting a scalability ceiling, or do you need AI automation that works in production — not just in a pitch deck? Let's talk architecture.",
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
