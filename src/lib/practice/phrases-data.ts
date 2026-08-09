import type { PhraseSituation, PracticePhrase } from "./types";

function p(
  id: string,
  situation: PhraseSituation,
  en: string,
  es: string,
  whenToUse: string,
  variant: string,
): PracticePhrase {
  return { id, situation, en, es, whenToUse, variant };
}

/** Frases y conectores para conversación rápida (inglés profesional). */
export const PHRASES: PracticePhrase[] = [
  // open
  p("open-1", "open", "Building on that…", "Partiendo de eso…", "Continuar una idea de alguien", "To build on what you said…"),
  p("open-2", "open", "Quick clarification…", "Una aclaración rápida…", "Pedir precisión sin cortar", "Just to clarify…"),
  p("open-3", "open", "If I understand correctly…", "Si entiendo bien…", "Reformular para confirmar", "So if I’m hearing you right…"),
  p("open-4", "open", "Let me take a step back…", "Déjame dar un paso atrás…", "Reencuadrar el problema", "Zooming out for a second…"),
  p("open-5", "open", "Happy to walk through that.", "Con gusto lo recorro.", "Ofrecer explicación", "I can walk you through it."),
  p("open-6", "open", "Thanks for flagging that.", "Gracias por señalarlo.", "Reconocer un punto", "Appreciate you calling that out."),
  p("open-7", "open", "Good catch.", "Buen ojo.", "Validar un hallazgo", "Nice catch."),
  p("open-8", "open", "I’ll keep this short.", "Lo haré breve.", "Abrir con respeto al tiempo", "I’ll be brief."),
  p("open-9", "open", "Two things stand out for me.", "Me resaltan dos cosas.", "Estructurar turno", "Two points from my side."),
  p("open-10", "open", "Before we decide, a constraint…", "Antes de decidir, una restricción…", "Meter contexto crítico", "One constraint before we decide…"),
  p("open-11", "open", "I’d frame it this way…", "Lo enmarcaría así…", "Proponer framing", "The way I’d frame it…"),
  p("open-12", "open", "What success looks like here is…", "El éxito aquí se ve como…", "Alinear criterio", "Success looks like…"),

  // connectors
  p("con-1", "connectors", "However,…", "Sin embargo,…", "Contraste suave", "That said,…"),
  p("con-2", "connectors", "Therefore,…", "Por lo tanto,…", "Consecuencia", "As a result,…"),
  p("con-3", "connectors", "That said,…", "Dicho eso,…", "Conceder y matizar", "Having said that,…"),
  p("con-4", "connectors", "On the flip side,…", "Por el otro lado,…", "Contraste", "On the other hand,…"),
  p("con-5", "connectors", "As a result,…", "Como resultado,…", "Causa → efecto", "Consequently,…"),
  p("con-6", "connectors", "In practice,…", "En la práctica,…", "Bajar a realidad", "In reality,…"),
  p("con-7", "connectors", "More importantly,…", "Más importante,…", "Priorizar", "What matters more is…"),
  p("con-8", "connectors", "For context,…", "Como contexto,…", "Dar background", "For some context,…"),
  p("con-9", "connectors", "Specifically,…", "En concreto,…", "Precisar", "To be specific,…"),
  p("con-10", "connectors", "In other words,…", "En otras palabras,…", "Reformular", "Put differently,…"),
  p("con-11", "connectors", "At the same time,…", "Al mismo tiempo,…", "Dos verdades", "Meanwhile,…"),
  p("con-12", "connectors", "Ultimately,…", "En última instancia,…", "Cerrar argumento", "In the end,…"),
  p("con-13", "connectors", "For example,…", "Por ejemplo,…", "Evidencia", "For instance,…"),
  p("con-14", "connectors", "In contrast,…", "En contraste,…", "Comparar", "By contrast,…"),
  p("con-15", "connectors", "Even so,…", "Aun así,…", "Conceder", "Still,…"),
  p("con-16", "connectors", "Given that,…", "Dado que,…", "Premisa", "Since,…"),

  // soften
  p("soft-1", "soften", "I’d push back slightly…", "Matizaría un poco…", "Discrepar sin pelear", "I’d gently push back…"),
  p("soft-2", "soften", "Happy to align on…", "Con gusto alineamos…", "Buscar acuerdo", "I’m happy to align on…"),
  p("soft-3", "soften", "I see it a bit differently.", "Lo veo un poco distinto.", "Opinión distinta", "I have a slightly different take."),
  p("soft-4", "soften", "Could we consider…?", "¿Podríamos considerar…?", "Proponer alternativa", "What if we considered…?"),
  p("soft-5", "soften", "My concern is…", "Mi preocupación es…", "Nombrar riesgo", "The risk I see is…"),
  p("soft-6", "soften", "I want to make sure we don’t…", "Quiero asegurar que no…", "Prevenir error", "Let’s make sure we don’t…"),
  p("soft-7", "soften", "Help me understand…", "Ayúdame a entender…", "Pedir detalle", "Can you help me understand…?"),
  p("soft-8", "soften", "I might be missing something…", "Puede que me falte algo…", "Humildad + pregunta", "I may be missing context…"),
  p("soft-9", "soften", "Let’s park that for a minute.", "Aparquemos eso un minuto.", "Priorizar agenda", "Can we park that briefly?"),
  p("soft-10", "soften", "I’m open to either option.", "Estoy abierto a cualquiera.", "Flexibilidad", "Either option works for me."),
  p("soft-11", "soften", "What would make this a no-go?", "¿Qué haría que esto no sirva?", "Criterio de rechazo", "What’s a deal-breaker here?"),
  p("soft-12", "soften", "I hear you — and also…", "Te escucho — y también…", "Both/and", "I hear that — also…"),

  // standup
  p("su-1", "standup", "Yesterday I shipped…", "Ayer entregué…", "Status done", "Yesterday I completed…"),
  p("su-2", "standup", "Today I’m focusing on…", "Hoy me centro en…", "Status plan", "Today’s focus is…"),
  p("su-3", "standup", "Blocked on…", "Bloqueado por…", "Status bloqueo", "I’m blocked by…"),
  p("su-4", "standup", "Unblocked by…", "Desbloqueado por…", "Status desbloqueo", "I got unblocked when…"),
  p("su-5", "standup", "ETA is…", "El ETA es…", "Dar plazo", "My ETA is…"),
  p("su-6", "standup", "No blockers.", "Sin bloqueos.", "Status limpio", "Nothing blocking me."),
  p("su-7", "standup", "I need a decision on…", "Necesito una decisión sobre…", "Pedir decisión", "I need a call on…"),
  p("su-8", "standup", "I’ll sync with… after this.", "Sincronizo con… después.", "Coordinación", "I’ll sync with… right after."),
  p("su-9", "standup", "Risk: if X slips, Y slips.", "Riesgo: si X se atrasa, Y también.", "Dependencias", "If X slips, Y slips."),
  p("su-10", "standup", "I can take that action item.", "Puedo tomar ese action item.", "Comprometerse", "I’ll own that."),
  p("su-11", "standup", "Still in progress — ~60%.", "Sigue en progreso — ~60%.", "Progreso parcial", "In progress, about 60%."),
  p("su-12", "standup", "Waiting on review.", "Esperando review.", "PR pending", "Blocked on review."),

  // design
  p("des-1", "design", "Trade-off here is…", "El trade-off aquí es…", "Nombrar conflicto", "The trade-off is…"),
  p("des-2", "design", "I’d rather optimize for…", "Preferiría optimizar por…", "Elegir eje", "I’d optimize for…"),
  p("des-3", "design", "Failure mode if we do this…", "Modo de fallo si hacemos esto…", "Riesgo técnico", "The failure mode is…"),
  p("des-4", "design", "This keeps the blast radius small.", "Esto mantiene el radio de impacto pequeño.", "Contención", "It limits the blast radius."),
  p("des-5", "design", "I’d start with a thin slice.", "Empezaría con un corte fino.", "MVP técnico", "Ship a thin vertical slice first."),
  p("des-6", "design", "We should measure X before scaling.", "Deberíamos medir X antes de escalar.", "Evals/métricas", "Measure X before we scale."),
  p("des-7", "design", "Local-first vs cloud-only…", "Local-first vs solo cloud…", "Trade-off IA", "Privacy/cost vs managed cloud."),
  p("des-8", "design", "HITL vs full-auto…", "HITL vs full-auto…", "Trade-off commerce", "Human approval vs full automation."),
  p("des-9", "design", "What’s the rollback plan?", "¿Cuál es el plan de rollback?", "Operación segura", "How do we roll back?"),
  p("des-10", "design", "This introduces a SPOF unless…", "Esto mete un SPOF a menos que…", "HA", "Unless we add redundancy, this is a SPOF."),
  p("des-11", "design", "Schema change needs a migration path.", "El cambio de schema necesita migración.", "Datos", "We need a migration path."),
  p("des-12", "design", "I’d keep the interface stable.", "Mantendría la interfaz estable.", "Contratos", "Keep the API contract stable."),

  // client
  p("cli-1", "client", "Here’s the impact…", "Este es el impacto…", "Explicar negocio", "The business impact is…"),
  p("cli-2", "client", "Two options with costs…", "Dos opciones con costos…", "Decisión cliente", "Two options and their costs…"),
  p("cli-3", "client", "Out of scope for this phase…", "Fuera de alcance en esta fase…", "Acotar", "That’s out of scope for this phase."),
  p("cli-4", "client", "Success metric for the pilot…", "Métrica de éxito del piloto…", "Piloto", "The pilot success metric is…"),
  p("cli-5", "client", "I won’t invent a timeline.", "No inventaré un plazo.", "Honestidad", "I can’t commit a date without scope."),
  p("cli-6", "client", "What must work next week?", "¿Qué debe funcionar la próxima semana?", "MVP cliente", "What’s the must-have for next week?"),
  p("cli-7", "client", "We can phase this.", "Podemos hacerlo por fases.", "Migración", "We can deliver this in phases."),
  p("cli-8", "client", "Risk if we skip HITL…", "Riesgo si saltamos HITL…", "Commerce", "Skipping HITL risks margin errors."),
  p("cli-9", "client", "I’ll send a written summary.", "Enviaré un resumen por escrito.", "Follow-up", "I’ll email a short summary."),
  p("cli-10", "client", "Decision needed from your side…", "Necesitamos una decisión de su lado…", "Ownership cliente", "We need a decision from your side on…"),
  p("cli-11", "client", "Assumptions I’m making…", "Supuestos que estoy haciendo…", "Transparencia", "Here are my assumptions…"),
  p("cli-12", "client", "If the goal is speed, we cut…", "Si el objetivo es velocidad, cortamos…", "Trade-off explícito", "If speed is the goal, we cut…"),
  p("cli-13", "client", "I recommend a 15-minute technical call.", "Recomiendo una llamada técnica de 15 minutos.", "Engagement", "Let’s do a 15-min technical call."),
  p("cli-14", "client", "No fixed public pricing — scope first.", "Sin precios fijos públicos — primero alcance.", "Comercial honesto", "I don’t publish fixed prices; we scope first."),

  // defer
  p("def-1", "defer", "I don’t want to guess — I’ll confirm and follow up.", "No quiero adivinar — confirmo y te respondo.", "No inventar", "I’ll verify and get back to you."),
  p("def-2", "defer", "I don’t have that number handy.", "No tengo ese número a mano.", "Cifras", "I don’t have that figure at hand."),
  p("def-3", "defer", "Let me check the logs and circle back.", "Reviso los logs y vuelvo.", "Incidente", "I’ll check logs and circle back."),
  p("def-4", "defer", "That’s outside what I can commit to live.", "Eso no lo puedo comprometer en vivo.", "Límites", "I can’t commit to that live."),
  p("def-5", "defer", "I’ll validate with the corpus/docs.", "Lo valido contra el corpus/docs.", "Grounding", "I’ll validate against the docs."),
  p("def-6", "defer", "Parked — follow-up by EOD.", "Aparcado — follow-up para EOD.", "Cerrar loop", "Follow-up by end of day."),
  p("def-7", "defer", "I need one more data point.", "Necesito un dato más.", "Descubrimiento", "I need one more input."),
  p("def-8", "defer", "Happy to answer after I verify.", "Respondo con gusto cuando verifique.", "Profesional", "I’ll answer once I’ve verified."),

  // interview_star
  p("star-1", "interview_star", "The situation was…", "La situación era…", "STAR S", "Context first:…"),
  p("star-2", "interview_star", "What I owned was…", "Lo que me tocaba era…", "STAR T", "My ownership was…"),
  p("star-3", "interview_star", "The action I took…", "La acción que tomé…", "STAR A", "What I did was…"),
  p("star-4", "interview_star", "The outcome was…", "El resultado fue…", "STAR R", "The result was…"),
  p("star-5", "interview_star", "A concrete trade-off was…", "Un trade-off concreto fue…", "Seniority", "The key trade-off was…"),
  p("star-6", "interview_star", "What I’d do differently…", "Lo que haría distinto…", "Aprendizaje", "If I did it again…"),
  p("star-7", "interview_star", "Evidence I can point to…", "Evidencia a la que puedo apuntar…", "Prueba", "You can see this in…"),
  p("star-8", "interview_star", "I measured success by…", "Medí el éxito con…", "Métrica", "Success was measured by…"),
  p("star-9", "interview_star", "Stakeholders were…", "Los stakeholders eran…", "Contexto org", "The stakeholders were…"),
  p("star-10", "interview_star", "The constraint was time/cost/risk…", "La restricción era tiempo/costo/riesgo…", "Constraints", "We were constrained by…"),
  p("star-11", "interview_star", "I partnered with…", "Colaboré con…", "Colab", "I partnered with…"),
  p("star-12", "interview_star", "Production impact was…", "El impacto en producción fue…", "Prod", "In production, the impact was…"),

  // close
  p("clo-1", "close", "Action item for me…", "Action item para mí…", "Cierre", "My action item is…"),
  p("clo-2", "close", "I’ll send a summary.", "Enviaré un resumen.", "Follow-up", "I’ll send notes after."),
  p("clo-3", "close", "Next step is…", "El siguiente paso es…", "Avanzar", "The next step is…"),
  p("clo-4", "close", "Owners: I’ll take X, you take Y.", "Owners: yo X, tú Y.", "Claridad", "I’ll own X; you own Y."),
  p("clo-5", "close", "Any objections before we proceed?", "¿Objeciones antes de seguir?", "Consenso", "Any objections?"),
  p("clo-6", "close", "Let’s reconvene on…", "Reunámonos de nuevo el…", "Agenda", "Let’s reconvene on…"),
  p("clo-7", "close", "Thanks everyone — clear next steps.", "Gracias — siguientes pasos claros.", "Cerrar call", "Thanks — clear next steps."),
  p("clo-8", "close", "I’ll confirm in writing.", "Confirmo por escrito.", "Compromiso", "I’ll confirm in writing."),
  p("clo-9", "close", "Decision recorded:…", "Decisión registrada:…", "Acta", "Recording the decision:…"),
  p("clo-10", "close", "We’re aligned on the pilot scope.", "Estamos alineados en el alcance del piloto.", "Acuerdo", "Aligned on pilot scope."),
  p("clo-11", "close", "I’ll follow up with options A/B.", "Hago follow-up con opciones A/B.", "Propuesta", "I’ll follow up with A/B options."),
  p("clo-12", "close", "Parking lot items:…", "Temas aparcados:…", "Backlog reunión", "Parking lot:…"),

  // extra connectors / meeting glue
  p("x-1", "connectors", "To put numbers on it…", "Para poner números…", "Cuantificar", "Numerically speaking…"),
  p("x-2", "connectors", "From an ops perspective…", "Desde ops…", "Ángulo ops", "Operationally,…"),
  p("x-3", "connectors", "From a product perspective…", "Desde producto…", "Ángulo producto", "Product-wise,…"),
  p("x-4", "soften", "Correct me if I’m wrong…", "Corrígeme si me equivoco…", "Hipótesis", "If I’m wrong, correct me…"),
  p("x-5", "client", "We protect margin with HITL.", "Protegemos margen con HITL.", "Commerce", "HITL protects margin."),
  p("x-6", "design", "Grounding beats clever wording.", "El grounding gana al wording ingenioso.", "Agentes", "Grounding over clever prose."),
  p("x-7", "interview_star", "Ownership means I design and operate…", "Ownership significa que diseño y opero…", "Seniority", "I design and operate…"),
  p("x-8", "standup", "Dependency on…", "Dependencia de…", "Deps", "Depends on…"),
  p("x-9", "defer", "I’ll avoid hallucinating an answer.", "Evitaré alucinar una respuesta.", "IA", "I won’t hallucinate an answer."),
  p("x-10", "close", "Clear owners, clear dates.", "Owners claros, fechas claras.", "Cierre fuerte", "Owners and dates are clear."),
  p("x-11", "open", "Agenda check: still on track?", "Chequeo de agenda: ¿seguimos en ruta?", "Facilitar", "Still on agenda?"),
  p("x-12", "client", "I won’t oversell autonomy.", "No sobrevenderé autonomía.", "Honestidad IA", "I won’t oversell autonomy."),
  p("x-13", "design", "Start with one agent + curated RAG.", "Empezar con un agente + RAG curado.", "Agentes", "One agent + curated RAG first."),
  p("x-14", "soften", "Let’s pressure-test that assumption.", "Pongamos a prueba ese supuesto.", "Rigor", "Let’s pressure-test that."),
  p("x-15", "interview_star", "The hard part was coordination cost…", "Lo difícil fue el costo de coordinación…", "Multi-agente", "Coordination cost was the hard part."),
  p("x-16", "standup", "Shipped behind a feature flag.", "Entregado detrás de feature flag.", "Seguridad", "Shipped behind a flag."),
  p("x-17", "client", "Pilot for 30–90 days with a success criterion.", "Piloto 30–90 días con criterio de éxito.", "Engagement", "30–90 day pilot with a success criterion."),
  p("x-18", "connectors", "Net-net…", "En resumen neto…", "Resumen ejecutivo", "Bottom line…"),
  p("x-19", "close", "I’ll mirror this in the ticket.", "Lo reflejo en el ticket.", "Tracking", "I’ll update the ticket."),
  p("x-20", "defer", "Unknown until we instrument it.", "Desconocido hasta instrumentar.", "Incidente", "Unknown until we instrument."),
];

export function phrasesBySituation(situation?: string): PracticePhrase[] {
  if (!situation) return PHRASES;
  return PHRASES.filter((p) => p.situation === situation);
}

export function getPhrase(id: string): PracticePhrase | undefined {
  return PHRASES.find((p) => p.id === id);
}
