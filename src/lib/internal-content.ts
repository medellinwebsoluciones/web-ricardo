import type { Locale } from "@/i18n/config";
import {
  solutionsEs,
  solutionsEn,
  solutionSlugs,
  featuredSlugs,
  type SolutionDetail,
  type SolutionSlug,
} from "@/lib/portfolio-solutions";

export type {
  SolutionDetail,
  SolutionSlug,
  MetaItem,
  Outcome,
  ApproachStep,
  Decision,
  GalleryImage,
} from "@/lib/portfolio-solutions";

export { solutionSlugs, featuredSlugs };

/**
 * Contenido de las vistas internas (paginas dedicadas) del sitio.
 * Soluciones viven en portfolio-solutions.ts
 */

export type ServiceDetail = {
  slug: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  idealFor: string;
};

export type LabItem = {
  slug: string;
  title: string;
  description: string;
  video: string;
  poster: string;
  tags: string[];
  details: string[];
};

export type LabCapture = {
  slug: string;
  title: string;
  caption: string;
  image: string;
  width: number;
  height: number;
  tags: string[];
};

export type LabNarrativeBlock = {
  title: string;
  body: string;
};

export type LabCapability = {
  title: string;
  description: string;
};

export type LabNarrative = {
  eyebrow: string;
  title: string;
  intro: string;
  blocks: LabNarrativeBlock[];
  capabilitiesEyebrow: string;
  capabilitiesTitle: string;
  capabilities: LabCapability[];
};

export type ProcessStep = {
  phase: string;
  title: string;
  description: string;
};

export type ProfileExpertise = {
  area: string;
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

export type ProfileContent = {
  intro: string;
  bio: string[];
  image: string;
  expertise: ProfileExpertise[];
  timeline: { period: string; title: string; description: string }[];
  values: { title: string; description: string }[];
};

export type InternalContent = {
  ui: {
    home: string;
    backToHome: string;
    solutionsTitle: string;
    solutionsEyebrow: string;
    solutionsIntro: string;
    servicesTitle: string;
    servicesEyebrow: string;
    servicesIntro: string;
    labTitle: string;
    labEyebrow: string;
    labIntro: string;
    labDisclaimer: string;
    capturesEyebrow: string;
    capturesTitle: string;
    capturesIntro: string;
    capturesZoom: string;
    galleryLabel: string;
    galleryIntro: string;
    labPrev: string;
    labNext: string;
    labVideosEyebrow: string;
    labVideosTitle: string;
    labVideosIntro: string;
    profileTitle: string;
    profileEyebrow: string;
    viewSolution: string;
    viewAllSolutions: string;
    exploreLab: string;
    bookCta: string;
    contextLabel: string;
    challengeLabel: string;
    approachLabel: string;
    stackLabel: string;
    stackIntro: string;
    outcomesLabel: string;
    architectureLabel: string;
    architectureLayersLabel: string;
    decisionsLabel: string;
    hiringFitLabel: string;
    highlightsLabel: string;
    relatedLabel: string;
    deliverablesLabel: string;
    idealForLabel: string;
    playVideo: string;
    processLabel: string;
    watchLabel: string;
  };
  solutions: SolutionDetail[];
  services: ServiceDetail[];
  lab: LabItem[];
  captures: LabCapture[];
  labNarrative: LabNarrative;
  process: ProcessStep[];
  profile: ProfileContent;
};

const es: InternalContent = {
  ui: {
    home: "Inicio",
    backToHome: "Volver al inicio",
    solutionsTitle: "Soluciones Implementadas",
    solutionsEyebrow: "Casos de exito",
    solutionsIntro:
      "Sistemas reales en produccion priorizados para compradores EU: agentes (Nova), LegalTech (LEXIA), alta disponibilidad, MWS AI y commerce. Cada caso documenta contexto, arquitectura, decisiones y resultado operativo.",
    servicesTitle: "Servicios de consultoria",
    servicesEyebrow: "Que hago",
    servicesIntro:
      "Consultoria tecnica senior bajo un modelo boutique: pocos clientes, ownership total y engagements que puedes escalar de proyecto puntual a retainer.",
    labTitle: "Laboratorio de agentes",
    labEyebrow: "Orquestacion en vivo",
    labIntro:
      "Nova: un ejercito de agentes autonomos con CEO, divisiones y especialistas. Aqui ves como se orquesta trabajo real 24/7 — no un chatbot, sino un sistema operable con trazas, costo y roles.",
    labDisclaimer:
      "Capturas y videos de Nova en ejecucion real. El audio no es necesario para entender el contenido.",
    capturesEyebrow: "Superficies de orquestacion",
    capturesTitle: "Galeria operativa de Nova",
    capturesIntro:
      "Recorre el grafo de roles, el catalogo MIT, la configuracion por agente, el HUD de salud, el RAG y el FinOps. Cada slide es una capa del mismo sistema de orquestacion.",
    capturesZoom: "Abrir a tamano completo",
    galleryLabel: "Galeria de producto",
    galleryIntro: "Capturas reales del sistema en operacion.",
    labPrev: "Anterior",
    labNext: "Siguiente",
    labVideosEyebrow: "Ejecucion en vivo",
    labVideosTitle: "Como se mueve la red de agentes",
    labVideosIntro:
      "Clips cortos de orquestacion, colaboracion multi-agente y paneles Nova. Sirven para validar que el sistema no es un diagrama: corre, rutea y deja evidencia.",
    profileTitle: "Perfil de Ricardo Zuluaga",
    profileEyebrow: "Sobre mi",
    viewSolution: "Ver caso completo",
    viewAllSolutions: "Ver todas las soluciones",
    exploreLab: "Explorar el laboratorio",
    bookCta: "Agendar llamada tecnica",
    contextLabel: "Contexto",
    challengeLabel: "Problema",
    approachLabel: "El enfoque",
    stackLabel: "Stack aplicado",
    stackIntro:
      "Del LAMP clasico a agentes, grafos y bases vectoriales: el stack que uso en sistemas reales, no en tutoriales.",
    outcomesLabel: "Impacto",
    architectureLabel: "Arquitectura",
    architectureLayersLabel: "Capas del sistema",
    decisionsLabel: "Decisiones de diseno",
    hiringFitLabel: "Encaje / como contratar",
    highlightsLabel: "Puntos clave",
    relatedLabel: "Otras soluciones",
    deliverablesLabel: "Entregables",
    idealForLabel: "Ideal para",
    playVideo: "Reproducir",
    processLabel: "Como trabajo con empresas",
    watchLabel: "Ver en el laboratorio",
  },
  solutions: solutionsEs,
  services: [
    {
      slug: "arquitectura",
      icon: "Server",
      title: "Arquitectura de soluciones",
      tagline: "Sistemas que escalan sin reescribirse cada seis meses.",
      description:
        "Diseno y modernizacion de arquitecturas: de monolitos a microservicios, APIs bien disenadas y contenedores Docker para despliegues reproducibles y sin sorpresas.",
      deliverables: [
        "Diagnostico de arquitectura actual",
        "Diseno de arquitectura objetivo",
        "Plan de migracion por fases",
        "Contenerizacion y despliegue",
      ],
      idealFor:
        "Equipos con sistemas que crecieron mas rapido que su arquitectura.",
    },
    {
      slug: "automatizacion-ia",
      icon: "Bot",
      title: "Automatizacion con IA real",
      tagline: "Agentes que ejecutan, no solo responden.",
      description:
        "Orquestacion de agentes (CrewAI), LLMs locales (Ollama), RAG y MCP para automatizar flujos de negocio 24/7 con privacidad de datos garantizada.",
      deliverables: [
        "Diseno del ecosistema de agentes",
        "Inferencia local y privada",
        "Integracion RAG + MCP",
        "Despliegue en Docker con observabilidad",
      ],
      idealFor:
        "Empresas que quieren automatizar operaciones reales, no instalar un chatbot.",
    },
    {
      slug: "alta-disponibilidad",
      icon: "Activity",
      title: "Alta disponibilidad & performance",
      tagline: "Que no se caiga cuando mas importa.",
      description:
        "Optimizacion de backend, redundancia, balanceo y observabilidad para sostener alto volumen bajo estandares corporativos rigurosos.",
      deliverables: [
        "Auditoria de rendimiento",
        "Estrategia de redundancia y escalado",
        "Observabilidad y alertas",
        "Runbook operativo",
      ],
      idealFor:
        "Sistemas criticos donde el downtime tiene costo real de negocio.",
    },
    {
      slug: "full-stack",
      icon: "Layers",
      title: "Desarrollo full-stack end-to-end",
      tagline: "Del backend al pixel.",
      description:
        "Plataformas completas (Python/Node + React/Django/Flask), commerce, pagos y embudos, con ownership de producto de punta a punta.",
      deliverables: [
        "Producto end-to-end",
        "Backend y APIs",
        "Frontend y UX",
        "Automatizaciones de negocio",
      ],
      idealFor:
        "Fundadores y empresas que necesitan construir producto con senioridad, sin depender de media agencia junior.",
    },
  ],
  lab: [
    {
      slug: "ejecucion-agentes",
      title: "Ejecucion de agentes de IA",
      description:
        "Ecosistema de agentes autonomos ejecutando tareas en tiempo real: cada uno asume un rol y colabora en el flujo orquestado por Nova.",
      video: "/media/ejecucion-agentes-ia.mp4",
      poster: "/images/poster-agentes.png",
      tags: ["Agentes IA", "CrewAI", "Nova"],
      details: [
        "Coordinacion multi-agente en vivo.",
        "Ejecucion continua con trazabilidad.",
      ],
    },
    {
      slug: "red-agentes",
      title: "Red de agentes colaborando",
      description:
        "Topologia de una red de agentes: comunicacion, reparto de trabajo y convergencia a un resultado util bajo un CEO y hubs de division.",
      video: "/media/agentes-ia-red.mp4",
      poster: "/images/captures/nova/nova-engine-agentes.png",
      tags: ["Orquestacion", "Multi-agente", "MCP"],
      details: [
        "Grafo tipo /visual de Nova.",
        "Orquestacion como pieza central de la arquitectura.",
      ],
    },
    {
      slug: "nova-visual",
      title: "Nova — panel visual",
      description:
        "Arquitectura operativa de Nova: CEO, divisiones y 29 especialistas visibles como sistema, no como demo.",
      video: "/media/nova-lab-tour.webm",
      poster: "/images/captures/nova/nova-engine-agentes.png",
      tags: ["Nova", "FastAPI", "Grafo 3D"],
      details: [
        "Panel /visual y trazas /vivo.",
        "Configuracion por agente sin redeploy.",
      ],
    },
    {
      slug: "nova-catalogo",
      title: "Nova — catalogo MIT de roles",
      description:
        "Recorrido del catalogo agency-agents (licencia MIT) mapeado a los roles de Nova: 200+ perfiles para decidir que especialista atiende cada tarea.",
      video: "/media/nova-catalogo-tour.webm",
      poster: "/images/captures/nova/nova-catalogo-perfiles.png",
      tags: ["MIT", "Roles", "Catalogo"],
      details: [
        "Catalogo open source navegable como grafo.",
        "Mapeo directo al modelo de divisiones Nova.",
      ],
    },
  ],
  captures: [
    {
      slug: "engine",
      title: "Engine — orquestacion en vivo",
      caption:
        "Grafo de la agencia Nova: 5 areas, 29 roles y 35 nodos. Timeline de ejecucion a la izquierda; directorio de crews a la derecha. Cada nodo es un especialista con configuracion propia — la orquestacion se ve y se opera, no se imagina.",
      image: "/images/captures/nova/nova-engine-agentes.png",
      width: 1600,
      height: 1000,
      tags: ["CrewAI", "FastAPI", "Grafo 3D"],
    },
    {
      slug: "catalogo",
      title: "Catalogo MIT de perfiles",
      caption:
        "202 perfiles de agentes open source (licencia MIT) agrupados en 17 areas y mapeados al modelo de roles Nova. Sirve para decidir que especialista atiende cada tarea sin inventar un organigrama desde cero.",
      image: "/images/captures/nova/nova-catalogo-perfiles.png",
      width: 1600,
      height: 1000,
      tags: ["Catalogo MIT", "Roles", "Grafo"],
    },
    {
      slug: "configuracion",
      title: "Configuracion por agente",
      caption:
        "Centro de integracion: prompts, modelos, tools y estado de modulos por especialista sin redeploy. Aqui se opera la red de roles cuando el negocio cambia el tono, el proveedor o la herramienta.",
      image: "/images/captures/nova/nova-configuracion.png",
      width: 1600,
      height: 1000,
      tags: ["Roles", "Config", "Ops"],
    },
    {
      slug: "hud",
      title: "HUD de subsistemas",
      caption:
        "Once subsistemas monitoreados (LLM, STT/TTS, vision, toolkits, automatizaciones) con estado y modelo activo. Si uno cae, el panel lo muestra: la orquestacion incluye salud del sistema, no solo prompts bonitos.",
      image: "/images/captures/nova/nova-hud-sistemas.png",
      width: 1600,
      height: 1000,
      tags: ["Observabilidad", "Salud", "Ops"],
    },
    {
      slug: "aprendizaje",
      title: "Consola RAG y aprendizaje",
      caption:
        "Miles de chunks indexados, packs de dominio y validacion del RAG antes de fine-tune. El ejercito de agentes responde con conocimiento curado del negocio, no con alucinaciones genericas.",
      image: "/images/captures/nova/nova-rag-aprendizaje.png",
      width: 1600,
      height: 1000,
      tags: ["RAG", "Embeddings", "Conocimiento"],
    },
    {
      slug: "tokens",
      title: "FinOps de la orquestacion",
      caption:
        "Tokens, llamadas de crew y cascada de proveedores (free tiers + Ollama local). La orquestacion se decide tambien por costo: donde corre cada tarea y cuanto consume.",
      image: "/images/captures/nova/nova-tokens.png",
      width: 1600,
      height: 1000,
      tags: ["FinOps", "Multi-proveedor", "Costo"],
    },
    {
      slug: "arquitecturas",
      title: "Arquitecturas versionadas",
      caption:
        "Topologias documentadas dentro del producto y versionadas en git. La arquitectura se consulta donde se opera — util para validar decisiones de diseno multi-agente con evidencia.",
      image: "/images/captures/nova/nova-arquitecturas.png",
      width: 1600,
      height: 1000,
      tags: ["Arquitectura", "Versionado", "Topologias"],
    },
    {
      slug: "engine-mobile",
      title: "Engine en mobile",
      caption:
        "La misma superficie /visual en viewport mobile: roles y timeline legibles fuera del escritorio para demos y operacion en campo.",
      image: "/images/captures/nova/nova-engine-agentes-mobile.png",
      width: 780,
      height: 1688,
      tags: ["Mobile", "Nova", "Demo"],
    },
  ],
  labNarrative: {
    eyebrow: "Que resuelve",
    title: "De la carga operativa manual a una red de agentes gobernada",
    intro:
      "El laboratorio se centra en un solo sistema: Nova, la orquestacion de agentes autonomos. Aqui no mezclamos CRM, landings ni paneles de commerce — solo la capa agentica que coordina trabajo real.",
    blocks: [
      {
        title: "El problema",
        body: "Equipos senior pierden horas en research, contenido, seguimiento y ops repetitivas. Un chatbot suelto no reparte ownership ni deja trazas auditables. Hace falta una red con roles claros, routing explicito y un operador humano que vea el estado sin abrir diez herramientas.",
      },
      {
        title: "Como se aplica",
        body: "Nova organiza un CEO, hubs de division y especialistas (CrewAI + FastAPI). El operador lanza trabajo desde paneles /visual y /vivo, ajusta prompts/modelos/tools por agente sin redeploy, y conecta tools MCP/Composio/MWS cuando la tarea exige accion real — no solo texto. La inferencia puede quedarse en Ollama (local-first) o escalar a proveedores cloud segun costo y riesgo.",
      },
      {
        title: "Que valida esta seccion",
        body: "Que sabes disenar orquestacion multi-agente como producto operable: grafo de roles, catalogo de perfiles, observabilidad, RAG de dominio y FinOps. Sirve para entrevistas y buyers tecnicos que quieren evidencia de arquitectura agentica, no slides genericos de 'IA'.",
      },
    ],
    capabilitiesEyebrow: "Capacidades top",
    capabilitiesTitle: "Lo que hace diferente a esta orquestacion",
    capabilities: [
      {
        title: "Routing por especialidad",
        description:
          "29+ especialistas bajo un CEO y hubs: research, contenido, ops. Cada rol tiene ownership; el sistema no diluye todo en un unico asistente.",
      },
      {
        title: "Observabilidad y trazas",
        description:
          "Timeline en vivo, SSE (/vivo) y HUD de subsistemas. Si un modulo cae o una corrida falla, se ve — no se esconde detras de un chat.",
      },
      {
        title: "Config sin redeploy",
        description:
          "Prompts, modelos y tools por agente desde panel. Operas la red como producto, no como repo que hay que redeployar por cada ajuste.",
      },
      {
        title: "Catalogo MIT de roles",
        description:
          "Perfiles open source mapeados al organigrama Nova: acelera el diseno de capacidades sin inventar taxonomias opacas.",
      },
      {
        title: "RAG de dominio + FinOps",
        description:
          "Conocimiento indexado del negocio y cascada de proveedores con costo visible. La orquestacion decide donde corre cada tarea.",
      },
      {
        title: "Local-first con escapes controlados",
        description:
          "Ollama en el perimetro cuando importa privacidad; tools externas solo cuando el trabajo lo exige. Trade-off explicito, no magia.",
      },
    ],
  },
  process: [
    {
      phase: "01",
      title: "Diagnostico",
      description:
        "Entiendo el reto tecnico y de negocio, reviso la arquitectura actual y defino un objetivo medible desde la primera llamada. Entregable: mapa de riesgos y oportunidades.",
    },
    {
      phase: "02",
      title: "Diseno",
      description:
        "Arquitectura objetivo con trade-offs explicitos (costo, privacidad, time-to-market, operacion). Entregable: diagrama + plan por fases.",
    },
    {
      phase: "03",
      title: "Implementacion",
      description:
        "Construyo con ownership end-to-end, evidencia y observabilidad, sin tumbar tu operacion. Entregable: sistema desplegable.",
    },
    {
      phase: "04",
      title: "Operacion 24/7",
      description:
        "Dejo el sistema medible y operable — runbooks, health checks, trazas — y, si tu equipo lo prefiere, sigo como retainer para evolucion continua. Entregable: operacion autonoma con senales claras.",
    },
  ],
  profile: {
    intro:
      "Arquitecto de Soluciones Senior que entrega sistemas en produccion — agentes, plataformas, commerce y pagos — no demos. Fundador de Medellin Web Soluciones.",
    image: "/images/ricardo-zuluaga.png",
    bio: [
      "Soy Ricardo Zuluaga, Arquitecto de Software Full-Stack con mas de 10 anos de experiencia, enfocado en rentabilidad y eficiencia del codigo.",
      "A traves de Medellin Web Soluciones lidero productos reales: Nova (orquestacion CrewAI), LEXIA (Legal OS), omnicanal + Woo Colombia, MWS AI (agente de ventas SaaS), integrador Bold, LMS con pagos y plataformas como Auge Urbano.",
      "Modelo boutique: pocos clientes, alta senioridad, ownership real de la arquitectura. Hablo el idioma de reclutadores (seniority, stack, dominio) y el de buyers tecnicos (trade-offs, HA, observabilidad) — porque suelo ser ambas cosas en la misma llamada.",
    ],
    expertise: [
      {
        area: "Agentic AI",
        blurb: "Orquestacion local-first con agentes, RAG y tools MCP.",
        icon: "agentic",
        items: [
          "CrewAI",
          "Ollama",
          "RAG",
          "MCP",
          "FastAPI agents",
          "Embeddings",
        ],
      },
      {
        area: "Full Stack LAMP",
        blurb: "El clasico de produccion web: estable, barato y desplegable.",
        icon: "lamp",
        items: ["Linux", "Apache", "MySQL / MariaDB", "PHP", "WordPress"],
      },
      {
        area: "Full Stack Python",
        blurb:
          "El stack primordial para IA y productos potentes: APIs, backends y apps de punta a punta.",
        icon: "python",
        items: ["Python", "FastAPI", "Django", "Flask", "Streamlit", "Celery"],
      },
      {
        area: "Arquitectura HA",
        blurb: "Sin SPOF, observable y listo para escrutinio corporativo.",
        icon: "ha",
        items: [
          "Microservices",
          "Docker",
          "Nginx",
          "Observability",
          "Redis",
          "CI/CD",
        ],
      },
      {
        area: "Commerce / Payments",
        blurb: "Checkout real en Colombia: Woo, Bold, PayPal y HITL.",
        icon: "commerce",
        items: ["WooCommerce", "Bold", "PayPal", "Omnichannel HITL"],
      },
      {
        area: "Product platforms",
        blurb: "Productos full-stack de punta a punta.",
        icon: "product",
        items: ["Django", "Flask", "Next.js", "React", "Streamlit", "HTMX"],
      },
      {
        area: "Bases relacionales",
        blurb: "Consistencia ACID, migraciones y consultas criticas.",
        icon: "relational",
        items: ["PostgreSQL", "MySQL", "MariaDB", "SQL Server"],
      },
      {
        area: "No relacionales",
        blurb: "Documentos, cache y busqueda cuando el modelo no es tabular.",
        icon: "nosql",
        items: ["MongoDB", "Redis", "Elasticsearch", "DynamoDB"],
      },
      {
        area: "Grafos & Vectoriales",
        blurb: "Lo nuevo: relaciones y similitud semantica para IA/RAG.",
        icon: "graph",
        items: ["Neo4j", "pgvector", "Qdrant", "Weaviate", "Chroma"],
      },
    ],
    timeline: [
      {
        period: "+10 anos",
        title: "Arquitectura de plataformas criticas",
        description:
          "Liderazgo en sistemas de alto volumen (incl. modernizacion tipo Carga Control / Feeling) bajo estandares corporativos.",
      },
      {
        period: "Productos",
        title: "Nova · LEXIA · MWS AI · Omnicanal · Bold · LMS",
        description:
          "Ownership de sistemas agenticos, LegalTech, SaaS de ventas con IA, commerce y pagos en produccion.",
      },
      {
        period: "Hoy",
        title: "Medellin Web Soluciones",
        description:
          "Consultoria boutique + productos propios (SaaS y a la medida): discovery 15 min → diagnostico → delivery medible → retainer opcional.",
      },
    ],
    values: [
      {
        title: "Local-first & Seguridad",
        description:
          "IA que corre dentro de tu perimetro cuando la privacidad de los datos no es negociable — sin depender de una API externa que pueda fallar o filtrar informacion.",
      },
      {
        title: "Alta disponibilidad",
        description:
          "Sistemas disenados para no caer: sin punto unico de falla, listos para el escrutinio de un equipo de plataforma corporativo.",
      },
      {
        title: "Observabilidad",
        description:
          "Metricas y trazas en cada capa. Si algo falla, lo veo antes que el cliente — y lo pruebo con evidencia, no con intuicion.",
      },
      {
        title: "Automatizacion 24/7",
        description:
          "Agentes y contenedores que asumen el trabajo operativo repetitivo, para que tu equipo se enfoque en lo que si mueve la aguja.",
      },
    ],
  },
};

const en: InternalContent = {
  ui: {
    home: "Home",
    backToHome: "Back to home",
    solutionsTitle: "Delivered Solutions",
    solutionsEyebrow: "Case studies",
    solutionsIntro:
      "Real production systems prioritized for EU buyers: agents (Nova), LegalTech (LEXIA), high availability, MWS AI and commerce. Each case documents context, architecture, decisions and outcome.",
    servicesTitle: "Consulting services",
    servicesEyebrow: "What I do",
    servicesIntro:
      "Senior technical consulting, boutique model: few clients, full ownership, and engagements you can scale from a one-off project to an ongoing retainer.",
    labTitle: "Agents laboratory",
    labEyebrow: "Live orchestration",
    labIntro:
      "Nova: an army of autonomous agents with a CEO, divisions and specialists. See how real work is orchestrated 24/7 — not a chatbot, but an operable system with traces, cost and roles.",
    labDisclaimer:
      "Screenshots and videos of Nova running for real. Audio is not required to understand the content.",
    capturesEyebrow: "Orchestration surfaces",
    capturesTitle: "Nova operational gallery",
    capturesIntro:
      "Walk the role graph, MIT catalog, per-agent config, health HUD, RAG and FinOps. Each slide is a layer of the same orchestration system.",
    capturesZoom: "Open full size",
    galleryLabel: "Product gallery",
    galleryIntro: "Real screenshots of the system in operation.",
    labPrev: "Previous",
    labNext: "Next",
    labVideosEyebrow: "Live execution",
    labVideosTitle: "How the agent network moves",
    labVideosIntro:
      "Short clips of orchestration, multi-agent collaboration and Nova panels. Proof the system is not a diagram: it runs, routes and leaves evidence.",
    profileTitle: "Ricardo Zuluaga's profile",
    profileEyebrow: "About me",
    viewSolution: "View full case",
    viewAllSolutions: "View all solutions",
    exploreLab: "Explore the lab",
    bookCta: "Book a technical call",
    contextLabel: "Context",
    challengeLabel: "Problem",
    approachLabel: "The approach",
    stackLabel: "Applied stack",
    stackIntro:
      "From classic LAMP to agents, graphs and vector stores: the stack I ship in real systems, not tutorials.",
    outcomesLabel: "Impact",
    architectureLabel: "Architecture",
    architectureLayersLabel: "System layers",
    decisionsLabel: "Design decisions",
    hiringFitLabel: "Fit / how to hire",
    highlightsLabel: "Key points",
    relatedLabel: "Other solutions",
    deliverablesLabel: "Deliverables",
    idealForLabel: "Ideal for",
    playVideo: "Play",
    processLabel: "How I work with companies",
    watchLabel: "Watch in the lab",
  },
  solutions: solutionsEn,
  services: [
    {
      slug: "arquitectura",
      icon: "Server",
      title: "Solutions architecture",
      tagline: "Systems that scale without a rewrite every six months.",
      description:
        "Architecture design and modernization: monoliths to microservices, well-designed APIs and Docker containers for reproducible, no-surprises deploys.",
      deliverables: [
        "Current architecture diagnosis",
        "Target architecture design",
        "Phased migration plan",
        "Containerization and deploy",
      ],
      idealFor: "Teams whose systems outgrew their architecture.",
    },
    {
      slug: "automatizacion-ia",
      icon: "Bot",
      title: "Real AI automation",
      tagline: "Agents that execute, not just reply.",
      description:
        "Agent orchestration (CrewAI), local LLMs (Ollama), RAG and MCP to automate business flows 24/7 with guaranteed data privacy.",
      deliverables: [
        "Agent ecosystem design",
        "Local private inference",
        "RAG + MCP integration",
        "Docker deploy with observability",
      ],
      idealFor:
        "Companies that want to automate real operations—not install a chatbot.",
    },
    {
      slug: "alta-disponibilidad",
      icon: "Activity",
      title: "High availability & performance",
      tagline: "It must not fall when it matters most.",
      description:
        "Backend optimization, redundancy, balancing and observability to sustain high volume under rigorous corporate standards.",
      deliverables: [
        "Performance audit",
        "Redundancy and scaling strategy",
        "Observability and alerts",
        "Ops runbook",
      ],
      idealFor: "Critical systems where downtime has real business cost.",
    },
    {
      slug: "full-stack",
      icon: "Layers",
      title: "End-to-end full-stack development",
      tagline: "From backend to pixel.",
      description:
        "Complete platforms (Python/Node + React/Django/Flask), commerce, payments and funnels, with end-to-end product ownership.",
      deliverables: [
        "End-to-end product",
        "Backend and APIs",
        "Frontend and UX",
        "Business automations",
      ],
      idealFor:
        "Founders and companies that need senior product building, without relying on half a junior agency.",
    },
  ],
  lab: [
    {
      slug: "ejecucion-agentes",
      title: "AI agents executing",
      description:
        "Ecosystem of autonomous agents running tasks in real time: each takes a role and collaborates in the flow orchestrated by Nova.",
      video: "/media/ejecucion-agentes-ia.mp4",
      poster: "/images/poster-agentes.png",
      tags: ["AI agents", "CrewAI", "Nova"],
      details: [
        "Live multi-agent coordination.",
        "Continuous execution with traceability.",
      ],
    },
    {
      slug: "red-agentes",
      title: "A network of agents collaborating",
      description:
        "Topology of an agent network: communication, work split and convergence to a useful result under a CEO and division hubs.",
      video: "/media/agentes-ia-red.mp4",
      poster: "/images/captures/nova/nova-engine-agentes.png",
      tags: ["Orchestration", "Multi-agent", "MCP"],
      details: [
        "Nova-style /visual graph.",
        "Orchestration as the architecture centerpiece.",
      ],
    },
    {
      slug: "nova-visual",
      title: "Nova — visual panel",
      description:
        "Nova's operational architecture: CEO, divisions and 29 specialists as a system—not a demo.",
      video: "/media/nova-lab-tour.webm",
      poster: "/images/captures/nova/nova-engine-agentes.png",
      tags: ["Nova", "FastAPI", "3D graph"],
      details: [
        "/visual panel and /vivo traces.",
        "Per-agent config without redeploy.",
      ],
    },
    {
      slug: "nova-catalogo",
      title: "Nova — MIT role catalog",
      description:
        "Walkthrough of the agency-agents catalog (MIT license) mapped to Nova roles: 200+ profiles to decide which specialist handles each task.",
      video: "/media/nova-catalogo-tour.webm",
      poster: "/images/captures/nova/nova-catalogo-perfiles.png",
      tags: ["MIT", "Roles", "Catalog"],
      details: [
        "Open-source catalog browsable as a graph.",
        "Direct mapping to Nova's division model.",
      ],
    },
  ],
  captures: [
    {
      slug: "engine",
      title: "Engine — live orchestration",
      caption:
        "Nova agency graph: 5 areas, 29 roles and 35 nodes. Execution timeline on the left; crew directory on the right. Every node is a specialist with its own config — orchestration is visible and operable, not imagined.",
      image: "/images/captures/nova/nova-engine-agentes.png",
      width: 1600,
      height: 1000,
      tags: ["CrewAI", "FastAPI", "3D graph"],
    },
    {
      slug: "catalogo",
      title: "MIT profile catalog",
      caption:
        "202 open-source agent profiles (MIT license) grouped into 17 areas and mapped to Nova's role model. Decide which specialist handles each task without inventing an org chart from scratch.",
      image: "/images/captures/nova/nova-catalogo-perfiles.png",
      width: 1600,
      height: 1000,
      tags: ["MIT catalog", "Roles", "Graph"],
    },
    {
      slug: "configuracion",
      title: "Per-agent configuration",
      caption:
        "Integration hub: prompts, models, tools and module status per specialist without redeploy. Operate the role network when the business changes tone, provider or tooling.",
      image: "/images/captures/nova/nova-configuracion.png",
      width: 1600,
      height: 1000,
      tags: ["Roles", "Config", "Ops"],
    },
    {
      slug: "hud",
      title: "Subsystem HUD",
      caption:
        "Eleven monitored subsystems (LLM, STT/TTS, vision, toolkits, automations) with status and active model. If one drops, the panel shows it: orchestration includes system health, not just pretty prompts.",
      image: "/images/captures/nova/nova-hud-sistemas.png",
      width: 1600,
      height: 1000,
      tags: ["Observability", "Health", "Ops"],
    },
    {
      slug: "aprendizaje",
      title: "RAG and learning console",
      caption:
        "Thousands of indexed chunks, domain packs and RAG validation before fine-tune. The agent army answers with curated business knowledge — not generic hallucinations.",
      image: "/images/captures/nova/nova-rag-aprendizaje.png",
      width: 1600,
      height: 1000,
      tags: ["RAG", "Embeddings", "Knowledge"],
    },
    {
      slug: "tokens",
      title: "Orchestration FinOps",
      caption:
        "Tokens, crew calls and a provider cascade (free tiers + local Ollama). Orchestration is also a cost decision: where each task runs and how much it consumes.",
      image: "/images/captures/nova/nova-tokens.png",
      width: 1600,
      height: 1000,
      tags: ["FinOps", "Multi-provider", "Cost"],
    },
    {
      slug: "arquitecturas",
      title: "Versioned architectures",
      caption:
        "Topologies documented inside the product and versioned in git. Architecture is read where the system is operated — useful to validate multi-agent design decisions with evidence.",
      image: "/images/captures/nova/nova-arquitecturas.png",
      width: 1600,
      height: 1000,
      tags: ["Architecture", "Versioning", "Topologies"],
    },
    {
      slug: "engine-mobile",
      title: "Engine on mobile",
      caption:
        "The same /visual surface on a mobile viewport: roles and timeline readable off the desktop for demos and field ops.",
      image: "/images/captures/nova/nova-engine-agentes-mobile.png",
      width: 780,
      height: 1688,
      tags: ["Mobile", "Nova", "Demo"],
    },
  ],
  labNarrative: {
    eyebrow: "What it solves",
    title: "From manual ops load to a governed agent network",
    intro:
      "The lab focuses on one system: Nova, autonomous agent orchestration. No CRM, landings or commerce panels mixed in — only the agentic layer that coordinates real work.",
    blocks: [
      {
        title: "The problem",
        body: "Senior teams burn hours on research, content, follow-up and repetitive ops. A lone chatbot does not assign ownership or leave auditable traces. You need a network with clear roles, explicit routing and a human operator who can see state without opening ten tools.",
      },
      {
        title: "How it applies",
        body: "Nova organizes a CEO, division hubs and specialists (CrewAI + FastAPI). The operator launches work from /visual and /vivo panels, tunes prompts/models/tools per agent without redeploy, and connects MCP/Composio/MWS tools when the task needs real action — not just text. Inference can stay on Ollama (local-first) or scale to cloud providers by cost and risk.",
      },
      {
        title: "What this section validates",
        body: "That you can design multi-agent orchestration as an operable product: role graph, profile catalog, observability, domain RAG and FinOps. It serves interviews and technical buyers who want agentic architecture evidence — not generic 'AI' slides.",
      },
    ],
    capabilitiesEyebrow: "Top capabilities",
    capabilitiesTitle: "What makes this orchestration different",
    capabilities: [
      {
        title: "Routing by specialty",
        description:
          "29+ specialists under a CEO and hubs: research, content, ops. Each role has ownership; the system does not dilute everything into a single assistant.",
      },
      {
        title: "Observability and traces",
        description:
          "Live timeline, SSE (/vivo) and subsystem HUD. If a module drops or a run fails, you see it — it is not hidden behind a chat.",
      },
      {
        title: "Config without redeploy",
        description:
          "Prompts, models and tools per agent from a panel. Operate the network as a product, not as a repo you redeploy for every tweak.",
      },
      {
        title: "MIT role catalog",
        description:
          "Open-source profiles mapped to the Nova org chart: speed up capability design without inventing opaque taxonomies.",
      },
      {
        title: "Domain RAG + FinOps",
        description:
          "Indexed business knowledge and a provider cascade with visible cost. Orchestration decides where each task runs.",
      },
      {
        title: "Local-first with controlled escapes",
        description:
          "Ollama inside the perimeter when privacy matters; external tools only when the work requires it. Explicit trade-off, not magic.",
      },
    ],
  },
  process: [
    {
      phase: "01",
      title: "Diagnosis",
      description:
        "I understand the technical and business challenge, review the current architecture and define a measurable goal on the very first call. Deliverable: risk/opportunity map.",
    },
    {
      phase: "02",
      title: "Design",
      description:
        "Target architecture with explicit trade-offs (cost, privacy, time-to-market, ops). Deliverable: diagram + phased plan.",
    },
    {
      phase: "03",
      title: "Implementation",
      description:
        "I build with end-to-end ownership, evidence and observability, without taking down your ops. Deliverable: deployable system.",
    },
    {
      phase: "04",
      title: "24/7 operation",
      description:
        "I leave the system measurable and operable — runbooks, health checks, traces — and, if your team prefers, I stay on as an ongoing retainer for continuous evolution. Deliverable: autonomous ops with clear signals.",
    },
  ],
  profile: {
    intro:
      "Senior Solutions Architect who ships production systems — agents, platforms, commerce and payments — not demos. Founder of Medellín Web Soluciones.",
    image: "/images/ricardo-zuluaga.png",
    bio: [
      "I'm Ricardo Zuluaga, a Full-Stack Software Architect with 10+ years of experience, focused on code profitability and efficiency.",
      "Through Medellín Web Soluciones I lead real products: Nova (CrewAI orchestration), LEXIA (Legal OS), omnichannel + Woo Colombia, MWS AI (SaaS sales agent), Bold integrator, paid LMS and platforms like Auge Urbano.",
      "Boutique model: few clients, high seniority, real architecture ownership. I speak recruiter language (seniority, stack, domain) and technical-buyer language (trade-offs, HA, observability) — because I'm usually both on the same call.",
    ],
    expertise: [
      {
        area: "Agentic AI",
        blurb: "Local-first orchestration with agents, RAG and MCP tools.",
        icon: "agentic",
        items: [
          "CrewAI",
          "Ollama",
          "RAG",
          "MCP",
          "FastAPI agents",
          "Embeddings",
        ],
      },
      {
        area: "Full Stack LAMP",
        blurb: "The production web classic: stable, lean and deployable.",
        icon: "lamp",
        items: ["Linux", "Apache", "MySQL / MariaDB", "PHP", "WordPress"],
      },
      {
        area: "Full Stack Python",
        blurb:
          "The core stack for AI and powerful products: APIs, backends and end-to-end apps.",
        icon: "python",
        items: ["Python", "FastAPI", "Django", "Flask", "Streamlit", "Celery"],
      },
      {
        area: "HA architecture",
        blurb: "No SPOF, observable and ready for corporate scrutiny.",
        icon: "ha",
        items: [
          "Microservices",
          "Docker",
          "Nginx",
          "Observability",
          "Redis",
          "CI/CD",
        ],
      },
      {
        area: "Commerce / Payments",
        blurb: "Real checkout in Colombia: Woo, Bold, PayPal and HITL.",
        icon: "commerce",
        items: ["WooCommerce", "Bold", "PayPal", "Omnichannel HITL"],
      },
      {
        area: "Product platforms",
        blurb: "End-to-end full-stack product surfaces.",
        icon: "product",
        items: ["Django", "Flask", "Next.js", "React", "Streamlit", "HTMX"],
      },
      {
        area: "Relational databases",
        blurb: "ACID consistency, migrations and mission-critical queries.",
        icon: "relational",
        items: ["PostgreSQL", "MySQL", "MariaDB", "SQL Server"],
      },
      {
        area: "Non-relational",
        blurb: "Documents, cache and search when the model is not tabular.",
        icon: "nosql",
        items: ["MongoDB", "Redis", "Elasticsearch", "DynamoDB"],
      },
      {
        area: "Graph & Vector",
        blurb: "What's new: relationships and semantic similarity for AI/RAG.",
        icon: "graph",
        items: ["Neo4j", "pgvector", "Qdrant", "Weaviate", "Chroma"],
      },
    ],
    timeline: [
      {
        period: "10+ yrs",
        title: "Critical platform architecture",
        description:
          "Leadership on high-volume systems (incl. Carga Control / Feeling-style modernization) under corporate standards.",
      },
      {
        period: "Products",
        title: "Nova · LEXIA · MWS AI · Omnichannel · Bold · LMS",
        description:
          "Ownership of agentic systems, LegalTech, AI sales SaaS, commerce and payments in production.",
      },
      {
        period: "Now",
        title: "Medellín Web Soluciones",
        description:
          "Boutique consulting + own products (SaaS and custom): 15-min discovery → diagnosis → measurable delivery → optional retainer.",
      },
    ],
    values: [
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
};

const content: Record<Locale, InternalContent> = { es, en };

function orderSolutions(list: SolutionDetail[]): SolutionDetail[] {
  const bySlug = new Map(list.map((s) => [s.slug, s]));
  const ordered = solutionSlugs
    .map((slug) => bySlug.get(slug))
    .filter((s): s is SolutionDetail => Boolean(s));
  for (const s of list) {
    if (!solutionSlugs.includes(s.slug)) ordered.push(s);
  }
  return ordered;
}

export function getInternalContent(locale: Locale): InternalContent {
  const base = content[locale] ?? content.es;
  return { ...base, solutions: orderSolutions(base.solutions) };
}

export function getSolution(
  locale: Locale,
  slug: string,
): SolutionDetail | undefined {
  return getInternalContent(locale).solutions.find((s) => s.slug === slug);
}
