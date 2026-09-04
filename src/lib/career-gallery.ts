/**
 * Galería de trayectoria: marcas/proyectos públicos sin detalle confidencial.
 */

export type CareerItem = {
  id: string;
  companyPublic: string;
  sector: { es: string; en: string };
  role: { es: string; en: string };
  summary: { es: string; en: string };
  stack: string[];
  /** Link interno a caso público si existe */
  solutionSlug?: string;
  /** Captura real anonimizada (webp/png bajo /public). Si existe, se muestra en la card. */
  image?: string;
  /** Etiqueta corta bajo la imagen (p.ej. "Datos anonimizados"). */
  imageNote?: { es: string; en: string };
  placeholderHue: number;
};

export const CAREER_ITEMS: CareerItem[] = [
  {
    id: "exito",
    companyPublic: "Grupo Éxito",
    sector: { es: "Retail", en: "Retail" },
    role: {
      es: "Desarrollo / integración en sistemas de negocio",
      en: "Development / integration on business systems",
    },
    summary: {
      es: "Participación en iniciativas tecnológicas para retail a gran escala. Sin detalle interno ni capturas confidenciales.",
      en: "Work on large-scale retail technology initiatives. No internal detail or confidential captures.",
    },
    stack: ["Integraciones", "Sistemas empresariales"],
    placeholderHue: 142,
  },
  {
    id: "nutresa",
    companyPublic: "Nutresa",
    sector: { es: "Alimentos", en: "Food" },
    role: {
      es: "Ingeniería de software en entorno corporativo",
      en: "Software engineering in a corporate environment",
    },
    summary: {
      es: "Colaboración en sistemas de negocio del grupo. Alcance no confidencial.",
      en: "Collaboration on group business systems. Non-confidential scope only.",
    },
    stack: ["Backend", "Integraciones"],
    placeholderHue: 28,
  },
  {
    id: "renault",
    companyPublic: "Renault · E-Tech electric days",
    sector: { es: "Automotriz · Campaña", en: "Automotive · Campaign" },
    role: {
      es: "Full-stack (PHP / CakePHP + MySQL)",
      en: "Full-stack (PHP / CakePHP + MySQL)",
    },
    summary: {
      es: "Plataforma de agendamiento de test-drive para la campaña Renault E-Tech: registro de asistentes, catálogo de vehículos, gestión de citas y panel con KPIs (test drives, usuarios, asistencia) y roles Admin/Asesor. Datos anonimizados.",
      en: "Test-drive scheduling platform for the Renault E-Tech campaign: attendee registration, vehicle catalog, appointment management and a KPI dashboard (test drives, users, attendance) with Admin/Advisor roles. Anonymized data.",
    },
    stack: ["PHP", "CakePHP", "MySQL", "jQuery"],
    image: "/images/captures/renault/renault-agendamientos-card.webp",
    imageNote: {
      es: "Captura real · datos anonimizados",
      en: "Real capture · anonymized data",
    },
    placeholderHue: 210,
  },
  {
    id: "dux",
    companyPublic: "Dux · Promo (Noel)",
    sector: { es: "Consumo masivo · Campaña", en: "CPG · Campaign" },
    role: {
      es: "Full-stack (PHP / CakePHP + MySQL)",
      en: "Full-stack (PHP / CakePHP + MySQL)",
    },
    summary: {
      es: "Microsite promocional gamificado \"Muévete con Promo Dux\": registro de códigos premiados, mecánica de sorteo, catálogo de premios y panel de ganadores. Actividad avalada por Coljuegos, con alto tráfico de campaña.",
      en: "Gamified promotional microsite \"Muévete con Promo Dux\": winning-code registration, prize-draw mechanics, prize catalog and winners panel. Coljuegos-approved activity with high campaign traffic.",
    },
    stack: ["PHP", "CakePHP", "MySQL", "JavaScript"],
    image: "/images/captures/dux/dux-promo-card.webp",
    imageNote: {
      es: "Landing público de campaña",
      en: "Public campaign landing",
    },
    placeholderHue: 42,
  },
  {
    id: "tigo",
    companyPublic: "Tigo",
    sector: { es: "Telecom", en: "Telecom" },
    role: {
      es: "Software e integraciones telco",
      en: "Telco software & integrations",
    },
    summary: {
      es: "Participación en iniciativas tecnológicas de telecomunicaciones.",
      en: "Participation in telecom technology initiatives.",
    },
    stack: ["APIs", "Integraciones"],
    placeholderHue: 265,
  },
  {
    id: "comfama",
    companyPublic: "Comfama",
    sector: { es: "Servicios sociales", en: "Social services" },
    role: {
      es: "Desarrollo de sistemas de servicio",
      en: "Service systems development",
    },
    summary: {
      es: "Trabajo en plataformas de servicio al afiliado / operación. Sin datos sensibles.",
      en: "Work on member-service / operations platforms. No sensitive data.",
    },
    stack: ["Full stack"],
    placeholderHue: 190,
  },
  {
    id: "bancolombia",
    companyPublic: "Bancolombia",
    sector: { es: "Banca", en: "Banking" },
    role: {
      es: "Ingeniería en entorno bancario",
      en: "Engineering in a banking environment",
    },
    summary: {
      es: "Experiencia en contexto financiero regulado. Solo mención pública de participación.",
      en: "Experience in a regulated financial context. Public participation mention only.",
    },
    stack: ["Sistemas críticos", "Integraciones"],
    placeholderHue: 160,
  },
  {
    id: "argos",
    companyPublic: "Argos",
    sector: { es: "Cemento / industrial", en: "Cement / industrial" },
    role: {
      es: "Software e integración industrial",
      en: "Industrial software & integration",
    },
    summary: {
      es: "Colaboración en sistemas de soporte al negocio industrial.",
      en: "Collaboration on industrial business-support systems.",
    },
    stack: ["Backend", "Datos"],
    placeholderHue: 45,
  },
  {
    id: "472",
    companyPublic: "472",
    sector: { es: "Servicios postales / logística", en: "Postal / logistics" },
    role: {
      es: "Desarrollo de sistemas operativos de servicio",
      en: "Service operations systems development",
    },
    summary: {
      es: "Participación en software de operación de servicios. Sin detalle confidencial.",
      en: "Participation in service-operations software. No confidential detail.",
    },
    stack: ["Full stack"],
    placeholderHue: 320,
  },
  {
    id: "noel",
    companyPublic: "Noel",
    sector: { es: "Alimentos", en: "Food" },
    role: {
      es: "Sistemas de negocio",
      en: "Business systems",
    },
    summary: {
      es: "Experiencia en entorno de producción alimentaria / comercial.",
      en: "Experience in a food production / commercial environment.",
    },
    stack: ["Integraciones"],
    placeholderHue: 12,
  },
  {
    id: "rica",
    companyPublic: "Rica",
    sector: { es: "Alimentos", en: "Food" },
    role: {
      es: "Desarrollo de soporte a operación comercial",
      en: "Commercial operations software support",
    },
    summary: {
      es: "Colaboración en sistemas de negocio. Mencionado solo a nivel público.",
      en: "Collaboration on business systems. Public-level mention only.",
    },
    stack: ["Full stack"],
    placeholderHue: 350,
  },
  {
    id: "cantagirone",
    companyPublic: "Cantagirone",
    sector: { es: "Construcción / materiales", en: "Construction / materials" },
    role: {
      es: "Software e integraciones de negocio",
      en: "Business software & integrations",
    },
    summary: {
      es: "Participación en iniciativas tecnológicas del grupo. Sin capturas internas.",
      en: "Participation in group technology initiatives. No internal captures.",
    },
    stack: ["Backend"],
    placeholderHue: 95,
  },
  {
    id: "aroka",
    companyPublic: "Aroka SAS · Transferimos",
    sector: { es: "Fintech / transferencias", en: "Fintech / transfers" },
    role: {
      es: "Freelance full stack (.NET)",
      en: "Freelance full stack (.NET)",
    },
    summary: {
      es: "Freelance sobre el software Transferimos en ecosistema .NET.",
      en: "Freelance work on Transferimos software in the .NET ecosystem.",
    },
    stack: [".NET", "C#", "SQL Server"],
    placeholderHue: 200,
  },
  {
    id: "nova",
    companyPublic: "Nova (propio)",
    sector: { es: "IA agentic", en: "Agentic AI" },
    role: {
      es: "Arquitecto y operador end-to-end",
      en: "End-to-end architect & operator",
    },
    summary: {
      es: "Orquestación multiagente en producción: CrewAI, RAG, FinOps y paneles de salud.",
      en: "Multi-agent orchestration in production: CrewAI, RAG, FinOps and health panels.",
    },
    stack: ["CrewAI", "FastAPI", "RAG", "Ollama"],
    solutionSlug: "orquestacion-agentes",
    placeholderHue: 158,
  },
  {
    id: "lexia",
    companyPublic: "LEXIA Legal OS (propio)",
    sector: { es: "Legal tech", en: "Legal tech" },
    role: {
      es: "Producto Python end-to-end",
      en: "End-to-end Python product",
    },
    summary: {
      es: "Sistema operativo legal multi-superficie: API, workspace y analytics.",
      en: "Multi-surface legal OS: API, workspace and analytics.",
    },
    stack: ["Python", "FastAPI", "Streamlit"],
    solutionSlug: "lexia-legal-os",
    placeholderHue: 230,
  },
  {
    id: "sigueme",
    companyPublic: "Sígueme 4",
    sector: { es: "Telemetría / flotas", en: "Telematics / fleets" },
    role: {
      es: "Owner end-to-end",
      en: "End-to-end owner",
    },
    summary: {
      es: "Plataforma de seguimiento satelital: 100+ licencias al lanzamiento, aún en operación.",
      en: "Satellite tracking platform: 100+ licences at launch, still operating.",
    },
    stack: ["AWS", "Full stack"],
    solutionSlug: "sistemas-criticos",
    placeholderHue: 175,
  },
  {
    id: "feeling-core",
    companyPublic: "Feeling Core (propio)",
    sector: { es: "ERP / Operaciones", en: "ERP / Operations" },
    role: {
      es: "Producto full-stack end-to-end",
      en: "End-to-end full-stack product",
    },
    summary: {
      es: "ERP que unifica bodega, eventos, logística, proyectos y área comercial: stock por estado, cotizaciones, KPIs en vivo y roles. Flask + MySQL.",
      en: "ERP unifying warehouse, events, logistics, projects and sales: state-based stock, quotes, live KPIs and roles. Flask + MySQL.",
    },
    stack: ["Python", "Flask", "SQLAlchemy", "MySQL"],
    solutionSlug: "feeling-core-erp",
    placeholderHue: 168,
  },
  {
    id: "accoop",
    companyPublic: "ACCOOP · Préstamos",
    sector: { es: "Fintech / crédito", en: "Fintech / credit" },
    role: {
      es: "Backend / full-stack",
      en: "Backend / full-stack",
    },
    summary: {
      es: "Plataforma de crédito cooperativo: solicitudes, scoring, préstamos con amortización y pagos, con API REST documentada (JWT + Swagger). Django + DRF.",
      en: "Credit-union lending platform: applications, scoring, amortized loans and payments, with a documented REST API (JWT + Swagger). Django + DRF.",
    },
    stack: ["Python", "Django", "DRF", "SimpleJWT"],
    solutionSlug: "prestamos-fintech",
    placeholderHue: 275,
  },
  {
    id: "microtools",
    companyPublic: "Google Places Scraper (propio)",
    sector: { es: "Automatización / datos", en: "Automation / data" },
    role: {
      es: "Data / tooling",
      en: "Data / tooling",
    },
    summary: {
      es: "Herramienta Python/Streamlit en uso real: scraper de Google Places para prospección comercial geolocalizada con export a CSV/JSON.",
      en: "Python/Streamlit tool in real use: a Google Places scraper for geolocated commercial prospecting with CSV/JSON export.",
    },
    stack: ["Python", "Streamlit", "Google Places API", "pandas"],
    solutionSlug: "automatizacion-datos",
    placeholderHue: 100,
  },
];
