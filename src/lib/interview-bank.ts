/**
 * Banco de preguntas para el simulador de entrevista del panel.
 * Sirve para entrenar el corpus: si la respuesta del agente es débil,
 * se escribe la respuesta correcta y se guarda como entrada de conocimiento.
 */
export type InterviewQuestion = {
  id: string;
  category: string;
  es: string;
  en: string;
};

export const INTERVIEW_CATEGORIES = [
  "Perfil",
  "Arquitectura",
  "IA y agentes",
  "Operación",
  "Consultoría",
  "Logística",
] as const;

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "intro",
    category: "Perfil",
    es: "Cuéntame de ti y de tu experiencia en una respuesta corta.",
    en: "Tell me about yourself and your experience, briefly.",
  },
  {
    id: "seniority",
    category: "Perfil",
    es: "¿Por qué te consideras senior y no mid? Dame evidencia concreta.",
    en: "Why do you consider yourself senior rather than mid-level? Give concrete evidence.",
  },
  {
    id: "proudest",
    category: "Perfil",
    es: "¿Cuál es el proyecto del que estás más orgulloso y por qué?",
    en: "Which project are you proudest of and why?",
  },
  {
    id: "stack",
    category: "Arquitectura",
    es: "Describe tu stack principal y por qué eliges cada pieza.",
    en: "Describe your main stack and why you pick each piece.",
  },
  {
    id: "tradeoffs",
    category: "Arquitectura",
    es: "Cuéntame un trade-off técnico difícil que tomaste y qué pasó después.",
    en: "Tell me about a hard technical trade-off you made and what happened next.",
  },
  {
    id: "scale",
    category: "Arquitectura",
    es: "¿Cómo diseñas para alta disponibilidad con presupuesto limitado?",
    en: "How do you design for high availability on a limited budget?",
  },
  {
    id: "agents",
    category: "IA y agentes",
    es: "¿Qué diferencia lo que construyes de un chatbot con prompt bonito?",
    en: "What separates what you build from a chatbot with a nice prompt?",
  },
  {
    id: "rag",
    category: "IA y agentes",
    es: "Explica cómo montas un RAG en producción y cómo evitas alucinaciones.",
    en: "Explain how you build RAG in production and how you avoid hallucinations.",
  },
  {
    id: "evals",
    category: "IA y agentes",
    es: "¿Cómo mides si un agente está funcionando bien?",
    en: "How do you measure whether an agent is actually working well?",
  },
  {
    id: "cost",
    category: "Operación",
    es: "¿Cómo controlas el coste de inferencia de un sistema con IA?",
    en: "How do you control inference cost in an AI system?",
  },
  {
    id: "observability",
    category: "Operación",
    es: "¿Qué observabilidad dejas montada antes de dar algo por terminado?",
    en: "What observability do you set up before calling something done?",
  },
  {
    id: "incident",
    category: "Operación",
    es: "Cuéntame un incidente en producción y cómo lo resolviste.",
    en: "Tell me about a production incident and how you resolved it.",
  },
  {
    id: "discovery",
    category: "Consultoría",
    es: "¿Cómo llevas un discovery con un cliente que no sabe lo que quiere?",
    en: "How do you run discovery with a client who doesn't know what they want?",
  },
  {
    id: "scope",
    category: "Consultoría",
    es: "¿Cómo manejas un cliente que pide cambios fuera de alcance?",
    en: "How do you handle a client asking for out-of-scope changes?",
  },
  {
    id: "pricing",
    category: "Consultoría",
    es: "¿Trabajas por proyecto cerrado o retainer? ¿Cómo lo decides?",
    en: "Do you work fixed-scope or retainer? How do you decide?",
  },
  {
    id: "remote",
    category: "Logística",
    es: "¿Cómo trabajas en remoto con un equipo en Europa?",
    en: "How do you work remotely with a team in Europe?",
  },
  {
    id: "relocation",
    category: "Logística",
    es: "¿Estás disponible para reubicarte o solo remoto?",
    en: "Are you available to relocate or remote only?",
  },
  {
    id: "availability",
    category: "Logística",
    es: "¿Cuál es tu disponibilidad y cómo es tu proceso de arranque?",
    en: "What's your availability and how does your onboarding work?",
  },
];
