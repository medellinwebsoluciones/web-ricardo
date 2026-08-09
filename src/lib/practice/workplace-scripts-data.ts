import type { WorkplaceScript } from "./types";

export const WORKPLACE_SCRIPTS: WorkplaceScript[] = [
  {
    id: "kickoff",
    situation: "client_kickoff",
    titleEn: "Client kickoff — scope & success",
    titleEs: "Kickoff con cliente — alcance y éxito",
    contextEs:
      "Primera reunión tras la llamada de 15 min. El cliente quiere 'IA ya'.",
    modelEn:
      "Thanks for the time. Before we build, I want us aligned on three things: the problem, the success metric for the first phase, and what is explicitly out of scope. I recommend a thin pilot—one agent plus curated RAG—with a measurable outcome in 30–90 days. I won’t invent a fixed price or date until that scope is clear. Next step: I’ll send a one-pager with assumptions and options A/B.",
    modelEs:
      "Gracias por el tiempo. Antes de construir, alineemos tres cosas: el problema, la métrica de éxito de la primera fase y qué queda fuera de alcance. Recomiendo un piloto fino—un agente más RAG curado—con resultado medible en 30–90 días. No invento precio ni fecha hasta tener ese alcance. Siguiente paso: envío un one-pager con supuestos y opciones A/B.",
    phraseIds: ["cli-4", "cli-6", "cli-3", "x-17", "clo-2"],
    sourceSlug: "arquitectura",
  },
  {
    id: "ai-rewrite",
    situation: "unrealistic_ask",
    titleEn: "Push back on 'AI now' / full rewrite",
    titleEs: "Reconducir 'IA ya' / rewrite",
    contextEs: "El cliente pide reescribir el monolito y meter IA en dos semanas.",
    modelEn:
      "I hear the urgency. A full rewrite plus AI in two weeks is a high-risk path. Trade-off: speed versus continuity. I’d rather ship a pilot that proves value—RAG over the knowledge you already have, with HITL on irreversible actions—then expand. If the business still chooses speed, we document the risk and protect ourselves with observability and rollback.",
    modelEs:
      "Escucho la urgencia. Rewrite + IA en dos semanas es alto riesgo. Trade-off: velocidad versus continuidad. Prefiero un piloto que pruebe valor—RAG sobre el conocimiento que ya tienen, con HITL en acciones irreversibles—y luego ampliar. Si el negocio elige velocidad igual, documentamos el riesgo y nos protegemos con observabilidad y rollback.",
    phraseIds: ["soft-1", "des-1", "x-13", "cli-8", "des-9"],
    sourceSlug: "faq",
  },
  {
    id: "incident",
    situation: "incident",
    titleEn: "Incident / regression response",
    titleEs: "Respuesta a incidente / regresión",
    contextEs: "Hay una regresión en producción y piden 'arreglar ya'.",
    modelEn:
      "Let’s not deploy blind. First we bound the issue: since when, which cohorts, which release. I’ll instrument—correlated logs and traces—reproduce the mechanism, then fix behind a feature flag with rollback ready. If an agent is involved, we also check RAG context and prompt version for the failing turn.",
    modelEs:
      "No desplegamos a ciegas. Primero acotamos: desde cuándo, qué cohortes, qué release. Instrumento—logs y trazas correlacionadas—reproduzco el mecanismo y arreglo detrás de feature flag con rollback listo. Si hay agente, revisamos contexto RAG y versión de prompt del turno fallido.",
    phraseIds: ["def-3", "x-20", "des-9", "x-16", "clo-1"],
    sourceSlug: "faq",
  },
  {
    id: "demo-rag",
    situation: "demo",
    titleEn: "Demo an agent / RAG system",
    titleEs: "Demo de agente / RAG",
    contextEs: "Demo a un CTO escéptico de alucinaciones.",
    modelEn:
      "Two layers: the LLM reasons; RAG supplies facts from a curated corpus with a similarity threshold. We score answers with evals—grounding weighted highest—and we decline when context is missing instead of inventing SLAs. HITL stays on high-impact actions. Cost and health are measured in the panel, not guessed.",
    modelEs:
      "Dos capas: el LLM razona; el RAG aporta hechos de un corpus curado con umbral de similitud. Puntuamos con evals—grounding pesa más—y declinamos si falta contexto en vez de inventar SLAs. HITL en acciones de alto impacto. Costo y salud se miden en el panel, no se adivinan.",
    phraseIds: ["x-6", "des-6", "cli-8", "def-1", "con-6"],
    sourceSlug: "proyectos",
  },
  {
    id: "timeline",
    situation: "timeline",
    titleEn: "Negotiate timeline honestly",
    titleEs: "Negociar plazo con honestidad",
    contextEs: "Piden una fecha firme sin alcance.",
    modelEn:
      "I won’t invent a timeline. What must be working next week—the true MVP? If that fits a spike, we can start immediately; if not, I’ll say no and propose the first realistic deliverable. Lying with a yes breaks trust and grounding.",
    modelEs:
      "No invento plazos. ¿Qué tiene que estar funcionando la próxima semana—el MVP real? Si cabe en un spike, arrancamos; si no, digo que no y propongo el primer entregable realista. Mentir con un sí rompe confianza y grounding.",
    phraseIds: ["cli-5", "cli-6", "cli-7", "soft-5", "clo-3"],
    sourceSlug: "faq",
  },
  {
    id: "stakeholder-disagree",
    situation: "disagreement",
    titleEn: "Disagree with a stakeholder",
    titleEs: "Discrepar con un stakeholder",
    contextEs: "Producto quiere full-auto publish a Woo; tú ves riesgo de margen.",
    modelEn:
      "I’d push back slightly. The trade-off is speed versus margin risk. In commerce I keep HITL where margin matters—publish only after human review. I’m happy to align on a pilot with a clear success metric; if the business still chooses full-auto, we document the risk and add observability.",
    modelEs:
      "Matizaría un poco. El trade-off es velocidad versus riesgo de margen. En commerce mantengo HITL donde importa el margen—publicar solo tras revisión humana. Alineamos un piloto con métrica clara; si el negocio igual elige full-auto, documentamos el riesgo y sumamos observabilidad.",
    phraseIds: ["soft-1", "des-1", "des-8", "soft-2", "cli-8"],
    sourceSlug: "arquitectura",
  },
  {
    id: "standup-blocked",
    situation: "standup",
    titleEn: "Standup when blocked",
    titleEs: "Standup bloqueado",
    contextEs: "Daily: estás bloqueado por una decisión de producto.",
    modelEn:
      "Yesterday I finished the retrieval eval harness. Today I’m focusing on the prompt versioning UI. Blocked on a product decision: HITL versus full-auto for Woo publish. I need a call on that—ETA for my part is tomorrow EOD once decided.",
    modelEs:
      "Ayer terminé el harness de evals de retrieval. Hoy me centro en la UI de versionado de prompts. Bloqueado por decisión de producto: HITL versus full-auto para publish a Woo. Necesito esa decisión—mi ETA es mañana EOD cuando esté.",
    phraseIds: ["su-1", "su-2", "su-3", "su-7", "su-5"],
  },
  {
    id: "followup",
    situation: "followup",
    titleEn: "Post-meeting follow-up email",
    titleEs: "Follow-up post-reunión",
    contextEs: "Escribir el email de cierre en inglés.",
    modelEn:
      "Thanks for today’s call. Summary: we aligned on a RAG pilot with HITL on publish; success metric is % of assisted queries resolved without inventing facts. Action items: I’ll send the one-pager by EOD; you’ll confirm inventory data owners. Parking lot: multi-agent split—deferred until evals are green. Happy to reconvene next week.",
    modelEs:
      "Gracias por la llamada. Resumen: alineamos piloto RAG con HITL en publish; métrica = % de consultas asistidas resueltas sin inventar hechos. Action items: envío one-pager hoy EOD; ustedes confirman owners de datos de inventario. Parking lot: split multi-agente—aplazado hasta evals en verde. Reconvenimos la próxima semana.",
    phraseIds: ["clo-2", "clo-1", "clo-4", "clo-12", "clo-6"],
  },
  {
    id: "seniority",
    situation: "interview",
    titleEn: "Explain seniority with evidence",
    titleEs: "Explicar seniority con evidencia",
    contextEs: "Hiring manager pregunta por qué senior y no mid.",
    modelEn:
      "Seniority for me is ownership of production systems, not years on a CV. I design and operate Nova—CrewAI orchestration, RAG, token FinOps and a health HUD—plus LEXIA, omnichannel with HITL, and MWS AI. A mid typically executes tickets inside someone else’s design; I decide trade-offs, leave observability, and sustain the system. Details are on the portfolio and /laboratorio; for role fit I’d welcome a 15-minute technical call.",
    modelEs:
      "Seniority para mí es ownership de sistemas en producción, no años en el CV. Diseño y opero Nova—orquestación CrewAI, RAG, FinOps de tokens y HUD de salud—más LEXIA, omnicanal con HITL y MWS AI. Un mid suele ejecutar tickets dentro de un diseño ajeno; yo decido trade-offs, dejo observabilidad y sostengo el sistema. Detalle en portafolio y /laboratorio; para encaje, la llamada técnica de 15 minutos.",
    phraseIds: ["x-7", "star-5", "star-7", "cli-13", "con-6"],
    sourceSlug: "faq",
  },
  {
    id: "proud-project",
    situation: "interview",
    titleEn: "Project you’re most proud of",
    titleEs: "Proyecto del que más orgullo",
    contextEs: "Behavioral: proyecto favorito.",
    modelEn:
      "Nova: moving from 'a chatbot' to an operable agent army. I own architecture and operations—role graph, per-agent config without redeploy, domain RAG, provider cascade with visible cost, and panels that show failures. It was hard because specialization, traces, cost and health must work together. That validates seniority: agentic product ownership in production, not a demo.",
    modelEs:
      "Nova: pasar de 'un chatbot' a un ejército de agentes operable. Ownership de arquitectura y operación—grafo de roles, config por agente sin redeploy, RAG de dominio, cascada con costo visible y paneles que muestran fallos. Fue difícil porque especialización, trazas, costo y salud deben funcionar juntos. Eso valida seniority: ownership agentic en producción, no una demo.",
    phraseIds: ["star-1", "star-2", "star-4", "x-15", "star-7"],
    sourceSlug: "faq",
  },
  {
    id: "bad-decision",
    situation: "interview",
    titleEn: "A decision that went wrong",
    titleEs: "Decisión que salió mal",
    contextEs: "Behavioral: fallo y aprendizaje.",
    modelEn:
      "In agentic systems, a costly mistake is splitting into too many agents or tools too early without evals. Symptom: a demo impresses, then quality or token spend regresses. Learning: start with one well-scoped agent, curated RAG and an eval suite; only split when tasks are separable and verifiable. In commerce the parallel is never auto-publishing to Woo without HITL.",
    modelEs:
      "En sistemas agentic, un error caro es partir en demasiados agentes o tools sin evals. Síntoma: la demo impresiona y luego cae calidad o factura de tokens. Aprendizaje: un agente bien acotado, RAG curado y suite de evals; solo partir cuando las tareas son separables y verificables. En commerce: no publicar a Woo sin HITL.",
    phraseIds: ["star-6", "x-13", "des-6", "des-8", "con-5"],
    sourceSlug: "faq",
  },
  {
    id: "conflict",
    situation: "interview",
    titleEn: "Conflict with client or teammate",
    titleEs: "Conflicto con cliente o compañero",
    contextEs: "Behavioral: conflicto.",
    modelEn:
      "Typical boutique pattern: the client wants 'AI now' and the internal team wants to rewrite the monolith. I document risk—cost, time, SPOF—propose a small pilot with a 30–90 day success criterion, and commit to the business decision even if it’s not my ideal, writing the trade-off down. Outcome: alignment and often proof that RAG + HITL was enough. Sometimes the client still chooses speed; then we mitigate with observability and rollback.",
    modelEs:
      "Patrón boutique: el cliente pide 'IA ya' y el equipo interno quiere rewrite. Documento riesgo—costo, tiempo, SPOF—propongo piloto con criterio a 30–90 días y me comprometo con la decisión de negocio aunque no sea la ideal, dejando el trade-off por escrito. Desenlace: alineación y a veces basta RAG + HITL. Si eligen velocidad, mitigamos con observabilidad y rollback.",
    phraseIds: ["soft-12", "des-1", "x-17", "soft-2", "des-9"],
    sourceSlug: "faq",
  },
  {
    id: "security",
    situation: "client_security",
    titleEn: "Security / secrets stance",
    titleEs: "Postura de seguridad / secretos",
    contextEs: "Cliente pregunta cómo proteges datos y agentes.",
    modelEn:
      "Secrets stay out of the repo and the front end. HTTPS, real authz, rate limits, minimal surface, tested backups, logs without secrets. For agents: least-privilege tools, confirmation on irreversible actions, and we don’t train third-party models on sensitive data without an agreement. HTTPS alone is not enough.",
    modelEs:
      "Secretos fuera del repo y del front. HTTPS, authz real, rate limits, superficie mínima, backups restaurados, logs sin secretos. En agentes: mínimo privilegio de tools, confirmación en acciones irreversibles, y no entrenamos modelos de terceros con datos sensibles sin acuerdo. Solo HTTPS no basta.",
    phraseIds: ["soft-5", "con-9", "cli-11", "clo-8"],
    sourceSlug: "faq",
  },
  {
    id: "pricing",
    situation: "pricing",
    titleEn: "When asked for a blind quote",
    titleEs: "Cuando piden cotización a ciegas",
    contextEs: "Prospecto pide precio sin discovery.",
    modelEn:
      "A blind proposal is usually smoke. I need problem, stack, data, urgency and success criteria first. I recommend the 15-minute technical call; with that I can write a concrete scope. If you prefer not to talk, leave an email and I’ll ask only for the minimum in writing—without inventing a price.",
    modelEs:
      "Una propuesta a ciegas suele ser humo. Necesito problema, stack, datos, urgencia y criterio de éxito. Recomiendo la llamada técnica de 15 minutos; con eso escribo un alcance concreto. Si preferís no hablar, dejen email y pido solo lo mínimo por escrito—sin inventar precio.",
    phraseIds: ["cli-14", "cli-13", "cli-5", "def-1", "clo-3"],
    sourceSlug: "faq",
  },
];

export function getScript(id: string): WorkplaceScript | undefined {
  return WORKPLACE_SCRIPTS.find((s) => s.id === id);
}
