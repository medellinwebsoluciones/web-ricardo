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
    labTitle: "Laboratorio de IA",
    labEyebrow: "En vivo",
    labIntro:
      "Sin marketing: un vistazo real a lo que construyo — redes neuronales, ecosistemas de agentes autonomos y el entorno donde nace la arquitectura.",
    labDisclaimer:
      "Grabaciones de sistemas reales en ejecucion. El audio no es necesario para entender el contenido.",
    capturesEyebrow: "Sistemas en operacion",
    capturesTitle: "Capturas de producto y laboratorio",
    capturesIntro:
      "Pantallas reales: Nova OS (orquestacion, RAG, costo, salud), CRM operativo MWS (embudo SECOP/scraper, detalle de lead, finanzas) y MWS AI (agente de ventas WordPress/WooCommerce).",
    capturesZoom: "Abrir a tamano completo",
    galleryLabel: "Galeria de producto",
    galleryIntro: "Capturas reales del sistema en operacion.",
    profileTitle: "Perfil de Ricardo Zuluaga",
    profileEyebrow: "Sobre mi",
    viewSolution: "Ver caso completo",
    viewAllSolutions: "Ver todas las soluciones",
    exploreLab: "Explorar el laboratorio",
    bookCta: "Agendar llamada tecnica",
    contextLabel: "Contexto",
    challengeLabel: "El reto",
    approachLabel: "El enfoque",
    stackLabel: "Stack aplicado",
    stackIntro:
      "Del LAMP clasico a agentes, grafos y bases vectoriales: el stack que uso en sistemas reales, no en tutoriales.",
    outcomesLabel: "Resultados",
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
      slug: "redes-neuronales",
      title: "Redes neuronales en accion",
      description:
        "Visualizacion del comportamiento de una red neuronal: nodos, conexiones y propagacion que sustentan los modelos en produccion.",
      video: "/media/redes-neuronales-short.mp4",
      poster: "/images/poster-redes.png",
      tags: ["Redes neuronales", "Deep Learning", "Visualizacion"],
      details: [
        "Representacion del flujo de informacion entre capas.",
        "Base conceptual de los modelos orquestados en produccion.",
      ],
    },
    {
      slug: "ejecucion-agentes",
      title: "Ejecucion de agentes de IA",
      description:
        "Ecosistema de agentes autonomos ejecutando tareas en tiempo real: cada uno asume un rol y colabora en el flujo.",
      video: "/media/ejecucion-agentes-ia.mp4",
      poster: "/images/poster-agentes.png",
      tags: ["Agentes IA", "CrewAI", "Nova"],
      details: [
        "Coordinacion multi-agente en vivo (Nova).",
        "Ejecucion continua con trazabilidad.",
      ],
    },
    {
      slug: "red-agentes",
      title: "Red de agentes colaborando",
      description:
        "Topologia de una red de agentes: comunicacion, reparto de trabajo y convergencia a un resultado util.",
      video: "/media/agentes-ia-red.mp4",
      poster: "/images/og-laboratorio.png",
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
    {
      slug: "lexia-os",
      title: "LEXIA — OS juridico",
      description:
        "Superficie operativa de LEXIA: API + OS + analytics para trabajo legal asistido por IA.",
      video: "/media/area-desarrollo.mp4",
      poster: "/images/captures/lexia-legal-os-ui.png",
      tags: ["LegalTech", "FastAPI", "Streamlit"],
      details: [
        "Tres superficies: API, OS Streamlit, Dash.",
        "Producto vertical Python end-to-end.",
      ],
    },
    {
      slug: "omnicanal-panel",
      title: "Omnicanal — panel HITL",
      description:
        "Panel operador para radar de oportunidades, scoring y aprobacion antes de publicar a Woo.",
      video: "/media/area-desarrollo.mp4",
      poster: "/images/captures/omnicanal-comercio-ui.png",
      tags: ["Commerce", "HITL", "WooCommerce"],
      details: [
        "Control humano donde importa el margen.",
        "Checkout en Woo Colombia, cerebro aparte.",
      ],
    },
    {
      slug: "area-desarrollo",
      title: "Area de desarrollo",
      description:
        "El entorno real donde se disena, construye y prueba: el taller detras de cada solucion.",
      video: "/media/area-desarrollo.mp4",
      poster: "/images/poster-area.png",
      tags: ["Entorno", "Ingenieria", "Backstage"],
      details: [
        "Espacio de trabajo donde nace la arquitectura.",
        "Flujo de desarrollo diario.",
      ],
    },
    {
      slug: "timelapse-desarrollo",
      title: "Timelapse de desarrollo",
      description:
        "El proceso de construccion condensado: de la primera linea a un sistema funcionando.",
      video: "/media/timelapse-desarrollo.mp4",
      poster: "/images/poster-area.png",
      tags: ["Proceso", "Timelapse", "Build"],
      details: [
        "Ritmo real de construccion de una solucion.",
        "Disciplina de ingenieria de principio a fin.",
      ],
    },
  ],
  captures: [
    {
      slug: "crm-embudo",
      title: "CRM MWS — embudo de leads",
      caption:
        "Vista Embudo con KPIs (activos, presupuesto estimado, SECOP, scraper/IA), filtros por estado/temperatura/fuente/territorio y tabla operativa de leads.",
      image: "/images/captures/crm/crm-embudo.png",
      width: 1024,
      height: 523,
      tags: ["Embudo", "SECOP", "Scraper/IA"],
    },
    {
      slug: "crm-lead",
      title: "CRM MWS — detalle de lead",
      caption:
        "Ficha de lead con temperatura, probabilidad, fuente, territorio y servicio solicitado; acciones para volver al embudo o convertir a cliente.",
      image: "/images/captures/crm/crm-lead.png",
      width: 1024,
      height: 533,
      tags: ["Lead", "Conversion", "Ops"],
    },
    {
      slug: "crm-finanzas",
      title: "CRM MWS — finanzas operativas",
      caption:
        "Dashboard de ingresos, gastos, balance y margen en COP con comparativa al periodo anterior y flujo diario. Desde el mismo admin se abre el embudo CRM.",
      image: "/images/captures/crm/crm-finanzas.png",
      width: 1024,
      height: 486,
      tags: ["Finanzas", "Django Admin", "COP"],
    },
    {
      slug: "mws-ai-hero",
      title: "MWS AI — agente de ventas en WooCommerce",
      caption:
        "Landing del producto: widget AI Sales Assistant con RAG sobre inventario real. Responde stock/tallas, muestra tarjeta de producto y opera 24/7 con objetivo de respuesta <2s.",
      image: "/images/captures/mws-ai/mws-ai-hero-chat.png",
      width: 1024,
      height: 433,
      tags: ["MWS AI", "WooCommerce", "RAG"],
    },
    {
      slug: "mws-ai-agencia",
      title: "MWS AI — agencias y agentes a medida",
      caption:
        "Canal para agencias/distribuidores (licencias en volumen) y puente a agentes IA custom de Medellin Web Soluciones cuando el alcance supera el plugin WordPress.",
      image: "/images/captures/mws-ai/mws-ai-landing-agencia.png",
      width: 844,
      height: 601,
      tags: ["Agencias", "Distribuidores", "Producto"],
    },
    {
      slug: "mws-ai-widget",
      title: "MWS AI — shell del widget de chat",
      caption:
        "Estructura del chat embebible del plugin: cabecera de marca, hilo de mensajes y burbujas del agente listas para conectar al SaaS MWS AI.",
      image: "/images/captures/mws-ai/mws-ai-chat-shell.png",
      width: 634,
      height: 373,
      tags: ["Plugin WP", "Widget", "UX"],
    },
    {
      slug: "engine",
      title: "Engine — orquestacion en vivo",
      caption:
        "Grafo de la agencia Nova: 5 areas, 29 roles y 35 nodos. A la izquierda el timeline de ejecucion en tiempo real; a la derecha el directorio de crews, donde cada nodo es un especialista con su propia configuracion.",
      image: "/images/captures/nova/nova-engine-agentes.png",
      width: 1600,
      height: 1000,
      tags: ["CrewAI", "FastAPI", "Grafo 3D"],
    },
    {
      slug: "catalogo",
      title: "Catalogo MIT de perfiles",
      caption:
        "202 perfiles de agentes de catalogos open source con licencia MIT, agrupados en 17 areas y mapeados al modelo de roles de Nova. Navegable como grafo para decidir que especialista atiende cada tarea.",
      image: "/images/captures/nova/nova-catalogo-perfiles.png",
      width: 1600,
      height: 1000,
      tags: ["Catalogo MIT", "Mapeo de roles", "Grafo"],
    },
    {
      slug: "configuracion",
      title: "Configuracion por agente",
      caption:
        "Centro de integracion Nova: prompts, modelos, tools y estado de modulos por especialista sin redeploy. Aqui se opera la red de roles, no solo se observa.",
      image: "/images/captures/nova/nova-configuracion.png",
      width: 1600,
      height: 1000,
      tags: ["Roles", "Config", "Ops"],
    },
    {
      slug: "arquitecturas",
      title: "Arquitecturas versionadas",
      caption:
        "13 topologias del sistema documentadas dentro del propio producto y versionadas en git: runtime, integraciones, datos y UI. La arquitectura se consulta donde se opera, no en un PDF aparte.",
      image: "/images/captures/nova/nova-arquitecturas.png",
      width: 1600,
      height: 1000,
      tags: ["Documentacion", "Versionado", "Topologias"],
    },
    {
      slug: "tokens",
      title: "Costo y consumo por proveedor",
      caption:
        "12,2 M de tokens y 296 llamadas de crew con USD 29,90 de costo estimado. Cascada de 14 proveedores combinando free tiers y Ollama local, con share y tendencia por modelo para decidir donde corre cada tarea.",
      image: "/images/captures/nova/nova-tokens.png",
      width: 1600,
      height: 1000,
      tags: ["FinOps", "Multi-proveedor", "Observabilidad"],
    },
    {
      slug: "aprendizaje",
      title: "Consola de RAG y aprendizaje",
      caption:
        "2.749 chunks indexados en la coleccion nova_knowledge, 6 packs de dominio y 159 documentos propios. Validacion del RAG, desglose por categoria y mapa de conocimiento antes de pasar a fine-tune.",
      image: "/images/captures/nova/nova-rag-aprendizaje.png",
      width: 1600,
      height: 1000,
      tags: ["RAG", "Embeddings", "Fine-tune"],
    },
    {
      slug: "hud",
      title: "HUD de subsistemas",
      caption:
        "Once subsistemas monitoreados con estado y modelo activo: LLM, STT/TTS, vision, YOLO, toolkits y automatizaciones. La captura muestra 10/11 en linea y uno caido — el panel existe para verlo, no para esconderlo.",
      image: "/images/captures/nova/nova-hud-sistemas.png",
      width: 1600,
      height: 1000,
      tags: ["Observabilidad", "Voz", "Salud del sistema"],
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
    labTitle: "AI Lab",
    labEyebrow: "Live",
    labIntro:
      "No marketing spin: a real look at what I build — neural networks, autonomous agent ecosystems, and the environment where architecture is born.",
    labDisclaimer:
      "Recordings of real systems running. Audio is not required to understand the content.",
    capturesEyebrow: "Systems in operation",
    capturesTitle: "Product and lab screenshots",
    capturesIntro:
      "Real screens: Nova OS (orchestration, RAG, cost, health), MWS operational CRM (SECOP/scraper funnel, lead detail, finance) and MWS AI (WordPress/WooCommerce sales agent).",
    capturesZoom: "Open full size",
    galleryLabel: "Product gallery",
    galleryIntro: "Real screenshots of the system in operation.",
    profileTitle: "Ricardo Zuluaga's profile",
    profileEyebrow: "About me",
    viewSolution: "View full case",
    viewAllSolutions: "View all solutions",
    exploreLab: "Explore the lab",
    bookCta: "Book a technical call",
    contextLabel: "Context",
    challengeLabel: "The challenge",
    approachLabel: "The approach",
    stackLabel: "Applied stack",
    stackIntro:
      "From classic LAMP to agents, graphs and vector stores: the stack I ship in real systems, not tutorials.",
    outcomesLabel: "Outcomes",
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
      slug: "redes-neuronales",
      title: "Neural networks in action",
      description:
        "Visualization of neural network behavior: nodes, connections and propagation that power production models.",
      video: "/media/redes-neuronales-short.mp4",
      poster: "/images/poster-redes.png",
      tags: ["Neural nets", "Deep Learning", "Visualization"],
      details: [
        "Information flow across layers.",
        "Conceptual base of models orchestrated in production.",
      ],
    },
    {
      slug: "ejecucion-agentes",
      title: "AI agents executing",
      description:
        "Autonomous agents running tasks in real time: each takes a role and collaborates on the flow.",
      video: "/media/ejecucion-agentes-ia.mp4",
      poster: "/images/poster-agentes.png",
      tags: ["AI agents", "CrewAI", "Nova"],
      details: [
        "Live multi-agent coordination (Nova).",
        "Continuous execution with traceability.",
      ],
    },
    {
      slug: "red-agentes",
      title: "A network of agents collaborating",
      description:
        "Topology of an agent network: communication, work split and convergence to a useful result.",
      video: "/media/agentes-ia-red.mp4",
      poster: "/images/og-laboratorio.png",
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
    {
      slug: "lexia-os",
      title: "LEXIA — legal OS",
      description:
        "LEXIA operational surface: API + OS + analytics for AI-assisted legal work.",
      video: "/media/area-desarrollo.mp4",
      poster: "/images/captures/lexia-legal-os-ui.png",
      tags: ["LegalTech", "FastAPI", "Streamlit"],
      details: [
        "Three surfaces: API, Streamlit OS, Dash.",
        "Python vertical product end-to-end.",
      ],
    },
    {
      slug: "omnicanal-panel",
      title: "Omnichannel — HITL panel",
      description:
        "Operator panel for opportunity radar, scoring and approval before Woo publish.",
      video: "/media/area-desarrollo.mp4",
      poster: "/images/captures/omnicanal-comercio-ui.png",
      tags: ["Commerce", "HITL", "WooCommerce"],
      details: [
        "Human control where margin matters.",
        "Checkout on Woo Colombia; brain separate.",
      ],
    },
    {
      slug: "area-desarrollo",
      title: "Development environment",
      description:
        "The real environment where we design, build and test: the workshop behind every solution.",
      video: "/media/area-desarrollo.mp4",
      poster: "/images/poster-area.png",
      tags: ["Environment", "Engineering", "Backstage"],
      details: [
        "Workspace where architecture is born.",
        "Day-to-day development flow.",
      ],
    },
    {
      slug: "timelapse-desarrollo",
      title: "Development timelapse",
      description:
        "The build process condensed: from the first line to a running system.",
      video: "/media/timelapse-desarrollo.mp4",
      poster: "/images/poster-area.png",
      tags: ["Process", "Timelapse", "Build"],
      details: [
        "Real rhythm of building a solution.",
        "Engineering discipline end to end.",
      ],
    },
  ],
  captures: [
    {
      slug: "crm-embudo",
      title: "MWS CRM — lead funnel",
      caption:
        "Funnel view with KPIs (active, estimated budget, SECOP, scraper/AI), filters by status/temperature/source/territory and an operational leads table.",
      image: "/images/captures/crm/crm-embudo.png",
      width: 1024,
      height: 523,
      tags: ["Funnel", "SECOP", "Scraper/AI"],
    },
    {
      slug: "crm-lead",
      title: "MWS CRM — lead detail",
      caption:
        "Lead record with temperature, probability, source, territory and requested service; actions to return to the funnel or convert to client.",
      image: "/images/captures/crm/crm-lead.png",
      width: 1024,
      height: 533,
      tags: ["Lead", "Conversion", "Ops"],
    },
    {
      slug: "crm-finanzas",
      title: "MWS CRM — operational finance",
      caption:
        "Income, expense, balance and margin dashboard in COP with prior-period comparison and daily cash flow. The same admin opens the CRM funnel.",
      image: "/images/captures/crm/crm-finanzas.png",
      width: 1024,
      height: 486,
      tags: ["Finance", "Django Admin", "COP"],
    },
    {
      slug: "mws-ai-hero",
      title: "MWS AI — WooCommerce sales agent",
      caption:
        "Product landing: AI Sales Assistant widget with RAG over live inventory. Answers stock/sizes, shows a product card, and runs 24/7 with a <2s response target.",
      image: "/images/captures/mws-ai/mws-ai-hero-chat.png",
      width: 1024,
      height: 433,
      tags: ["MWS AI", "WooCommerce", "RAG"],
    },
    {
      slug: "mws-ai-agencia",
      title: "MWS AI — agencies and custom agents",
      caption:
        "Channel for agencies/distributors (volume licenses) and a bridge to custom AI agents from Medellín Web Soluciones when scope goes beyond the WordPress plugin.",
      image: "/images/captures/mws-ai/mws-ai-landing-agencia.png",
      width: 844,
      height: 601,
      tags: ["Agencies", "Distributors", "Product"],
    },
    {
      slug: "mws-ai-widget",
      title: "MWS AI — chat widget shell",
      caption:
        "Embeddable chat shell from the plugin: brand header, message thread and agent bubbles ready to connect to the MWS AI SaaS.",
      image: "/images/captures/mws-ai/mws-ai-chat-shell.png",
      width: 634,
      height: 373,
      tags: ["WP plugin", "Widget", "UX"],
    },
    {
      slug: "engine",
      title: "Engine — live orchestration",
      caption:
        "Nova agency graph: 5 areas, 29 roles and 35 nodes. Real-time execution timeline on the left, crew directory on the right, where every node is a specialist with its own configuration.",
      image: "/images/captures/nova/nova-engine-agentes.png",
      width: 1600,
      height: 1000,
      tags: ["CrewAI", "FastAPI", "3D graph"],
    },
    {
      slug: "catalogo",
      title: "MIT profile catalog",
      caption:
        "202 agent profiles from MIT-licensed open source catalogs, grouped into 17 areas and mapped onto Nova's role model. Browsable as a graph to decide which specialist handles each task.",
      image: "/images/captures/nova/nova-catalogo-perfiles.png",
      width: 1600,
      height: 1000,
      tags: ["MIT catalog", "Role mapping", "Graph"],
    },
    {
      slug: "configuracion",
      title: "Per-agent configuration",
      caption:
        "Nova integration hub: prompts, models, tools and module status per specialist without redeploy. This is where the role network is operated, not only observed.",
      image: "/images/captures/nova/nova-configuracion.png",
      width: 1600,
      height: 1000,
      tags: ["Roles", "Config", "Ops"],
    },
    {
      slug: "arquitecturas",
      title: "Versioned architectures",
      caption:
        "13 system topologies documented inside the product itself and versioned in git: runtime, integrations, data and UI. Architecture is read where the system is operated, not in a separate PDF.",
      image: "/images/captures/nova/nova-arquitecturas.png",
      width: 1600,
      height: 1000,
      tags: ["Documentation", "Versioning", "Topologies"],
    },
    {
      slug: "tokens",
      title: "Per-provider cost and usage",
      caption:
        "12.2M tokens and 296 crew calls at an estimated USD 29.90. A 14-provider cascade mixing free tiers and local Ollama, with share and trend per model to decide where each task runs.",
      image: "/images/captures/nova/nova-tokens.png",
      width: 1600,
      height: 1000,
      tags: ["FinOps", "Multi-provider", "Observability"],
    },
    {
      slug: "aprendizaje",
      title: "RAG and learning console",
      caption:
        "2,749 chunks indexed in the nova_knowledge collection, 6 domain packs and 159 first-party documents. RAG validation, per-category breakdown and knowledge map before moving to fine-tuning.",
      image: "/images/captures/nova/nova-rag-aprendizaje.png",
      width: 1600,
      height: 1000,
      tags: ["RAG", "Embeddings", "Fine-tune"],
    },
    {
      slug: "hud",
      title: "Subsystem HUD",
      caption:
        "Eleven monitored subsystems with status and active model: LLM, STT/TTS, vision, YOLO, toolkits and automations. The capture shows 10/11 online and one down — the panel exists to surface that, not to hide it.",
      image: "/images/captures/nova/nova-hud-sistemas.png",
      width: 1600,
      height: 1000,
      tags: ["Observability", "Voice", "System health"],
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
