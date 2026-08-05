import { clientFor, isLlmConfigured } from "./llm/client";
import { logUsage } from "./usage";

/**
 * Triaje de ofertas de empleo contra el perfil real de Ricardo.
 *
 * Objetivo: pegar el texto de una oferta (de LinkedIn u otra fuente) y recibir
 * un veredicto — aplicar / valorar / descartar — con el motivo, sin scrapear
 * nada y sin depender de OpenAI. La capa heurística funciona offline; la de IA
 * solo afina el resumen cuando hay clave configurada.
 *
 * El stack de referencia sale del CV (docs/cv/cv-data.json): se mantiene aquí
 * como constantes para que el triaje no dependa de la base ni del corpus.
 */

export type Verdict = "aplicar" | "valorar" | "descartar";

export type SkillHit = { label: string };

export type JobScore = {
  score: number;
  verdict: Verdict;
  priority: "alta" | "media" | "baja";
  matched: string[];
  missing: string[];
  redFlags: string[];
  remote: boolean | null;
  senior: boolean | null;
  summary: string;
  /** Texto compacto listo para guardar en Opportunity.matchGaps. */
  matchGaps: string;
  usedLlm: boolean;
};

type Skill = { label: string; re: RegExp };

/** Núcleo del perfil: lo que de verdad diferencia a Ricardo. Peso alto. */
const CORE: Skill[] = [
  { label: "Python", re: /\bpython\b/i },
  { label: "FastAPI", re: /\bfast\s?api\b/i },
  { label: "React", re: /\breact(\.?js)?\b/i },
  { label: "Next.js", re: /\bnext\.?\s?js\b/i },
  { label: "TypeScript", re: /\btype\s?script\b/i },
  { label: "Node.js", re: /\bnode(\.?js)?\b/i },
  { label: "Django", re: /\bdjango\b/i },
  { label: "SQL", re: /\bsql\b|postgre|mysql|sql\s?server/i },
  { label: "Docker", re: /\bdocker\b|contenedor|container/i },
  { label: "AWS / Cloud", re: /\baws\b|amazon web services|cloud\b/i },
  {
    label: "IA / LLM / RAG",
    re: /\b(ia|a\.?i\.?|llm|rag|gen\s?ai|inteligencia artificial|agentes?|agentic|openai|langchain|crewai|mcp)\b/i,
  },
  { label: "APIs REST", re: /\brest\b|\bapis?\b|endpoints?/i },
  {
    label: "Eventos / colas / microservicios",
    re: /microservici|event[-\s]?driven|basad[ao]s? en eventos|colas?|queue|kafka|rabbit|sqs|jobs? as[ií]ncron/i,
  },
  { label: "CI/CD", re: /ci\/?cd|integraci[oó]n continua|github actions|gitlab ci/i },
  { label: "Testing", re: /\btest(ing|s)?\b|pytest|jest|tdd/i },
];

/** Extras que suman pero no definen. Peso bajo. */
const NICE: Skill[] = [
  { label: "SSR / rendering híbrido", re: /\bssr\b|server[-\s]?side rendering|rendering h[íi]brido|hidrataci/i },
  { label: "Tailwind", re: /\btailwind\b/i },
  { label: "Redis", re: /\bredis\b/i },
  { label: "Prisma / ORM", re: /\bprisma\b|sqlalchemy|orm\b/i },
  { label: "Design system", re: /design system|librer[íi]a de componentes|storybook/i },
  { label: "Observabilidad", re: /observabilidad|observability|grafana|prometheus|opentelemetry|langfuse/i },
  { label: "ERP / enterprise", re: /\berp\b|\bsap\b|enterprise|corporativ/i },
  { label: "WooCommerce / e-commerce", re: /woocommerce|e-?commerce|shopify|magento/i },
  { label: "WebSockets / SSE", re: /websockets?|\bsse\b|server[-\s]?sent/i },
  { label: "Cursor / Claude", re: /\bcursor\b|\bclaude\b|copilot/i },
  { label: "ADR / documentación", re: /\badr\b|architecture decision|documentar arquitectura/i },
];

/** Tecnologías que la oferta puede exigir y que no son el core de Ricardo. */
const FOREIGN: Skill[] = [
  { label: "Java", re: /\bjava\b(?!script)/i },
  { label: "Spring", re: /\bspring\b/i },
  { label: "Angular", re: /\bangular\b/i },
  { label: "Vue", re: /\bvue(\.?js)?\b/i },
  { label: "Go", re: /\bgolang\b/i },
  { label: "Rust", re: /\brust\b/i },
  { label: "Kubernetes", re: /\bkubernetes\b|\bk8s\b/i },
  { label: "Ruby / Rails", re: /\bruby\b|\brails\b/i },
  { label: "Scala", re: /\bscala\b/i },
  { label: "Salesforce", re: /\bsalesforce\b/i },
  { label: "SAP ABAP", re: /\babap\b/i },
];

type Flag = { label: string; re: RegExp; penalty: number; cap?: number };

/** Señales que restan o pueden ser dealbreaker para un candidato en Colombia. */
const RED_FLAGS: Flag[] = [
  {
    label: "Puede exigir residencia/permiso en la UE o España",
    re: /residir en (espa|la ue|europa)|permiso de trabajo|autorizaci[oó]n de trabajo|imprescindible residencia|eu residents?|only eu|derecho a trabajar en (la )?(ue|espa)/i,
    penalty: 20,
    cap: 45,
  },
  {
    label: "No es 100% remoto (presencial o híbrido)",
    // "híbrido" solo cuando habla de modalidad de trabajo, no de "rendering híbrido".
    re: /presencial|on[-\s]?site|in[-\s]?office|acudir a (la )?oficina|d[íi]as? en (la )?oficina|(modelo|trabajo|jornada|formato|modalidad)\s+h[íi]brid|hybrid work/i,
    penalty: 12,
  },
  {
    label: "Perfil por debajo de senior (junior / mid)",
    re: /\bjunior\b|\bbecari|\btrainee\b|\bpr[aá]cticas\b|\b[123]\s*(-|a|to|–)\s*[234]?\s*a[ñn]os/i,
    penalty: 14,
  },
  {
    label: "Requiere otro idioma fuerte (alemán/francés)",
    re: /nivel alto de (alem[aá]n|franc[eé]s)|(alem[aá]n|franc[eé]s) (fluido|nativo|c1|c2)/i,
    penalty: 8,
  },
];

const REMOTE_RE =
  /100%\s*remoto|full\s*remote|teletrabajo|totalmente remoto|\bremoto\b|\bremote\b/i;
const SENIOR_RE =
  /\bsenior\b|\blead\b|\bprincipal\b|arquitect|(?:\b(?:8|9|10|11|12|15|\+?\s?10)\b\s*a[ñn]os)|10\+/i;

function detect(text: string, skills: Skill[]): string[] {
  return skills.filter((s) => s.re.test(text)).map((s) => s.label);
}

export function scoreJobHeuristic(text: string): JobScore {
  const t = text.slice(0, 20000);

  const matched = detect(t, CORE);
  const nice = detect(t, NICE);
  const missing = detect(t, FOREIGN);
  const remote = REMOTE_RE.test(t) ? true : /presencial|on[-\s]?site/i.test(t) ? false : null;
  const senior = SENIOR_RE.test(t) ? true : null;

  const flags = RED_FLAGS.filter((f) => f.re.test(t));

  let score = 45;
  score += Math.min(matched.length, 8) * 6; // hasta +48
  score += Math.min(nice.length, 6) * 2; // hasta +12
  score -= missing.length * 7;
  for (const f of flags) score -= f.penalty;
  if (remote === true) score += 6;
  if (remote === false) score -= 4;
  if (senior === true) score += 6;

  // Un dealbreaker (residencia UE) topa la nota aunque el stack encaje.
  const cap = flags.reduce(
    (min, f) => (f.cap !== undefined ? Math.min(min, f.cap) : min),
    100,
  );
  score = Math.max(0, Math.min(cap, Math.round(score)));

  const verdict: Verdict =
    score >= 68 ? "aplicar" : score >= 48 ? "valorar" : "descartar";
  const priority = verdict === "aplicar" ? "alta" : verdict === "valorar" ? "media" : "baja";

  const summary = buildSummary({ verdict, matched, missing, flags: flags.map((f) => f.label), remote, senior });

  return {
    score,
    verdict,
    priority,
    matched,
    missing,
    redFlags: flags.map((f) => f.label),
    remote,
    senior,
    summary,
    matchGaps: buildMatchGaps({ verdict, score, matched, nice, missing, flags: flags.map((f) => f.label) }),
    usedLlm: false,
  };
}

function buildSummary(p: {
  verdict: Verdict;
  matched: string[];
  missing: string[];
  flags: string[];
  remote: boolean | null;
  senior: boolean | null;
}): string {
  const head =
    p.verdict === "aplicar"
      ? "Encaje alto: aplica."
      : p.verdict === "valorar"
        ? "Encaje parcial: valóralo antes de invertir tiempo."
        : "Encaje bajo: probablemente no compensa.";
  const bits: string[] = [];
  if (p.matched.length) bits.push(`Coincide en ${p.matched.slice(0, 6).join(", ")}`);
  if (p.missing.length) bits.push(`fuera de tu core: ${p.missing.join(", ")}`);
  if (p.flags.length) bits.push(`ojo con: ${p.flags.join("; ")}`);
  return `${head} ${bits.join(". ")}.`.trim();
}

function buildMatchGaps(p: {
  verdict: Verdict;
  score: number;
  matched: string[];
  nice: string[];
  missing: string[];
  flags: string[];
}): string {
  return [
    `Veredicto: ${p.verdict.toUpperCase()} (${p.score}%)`,
    p.matched.length ? `Coincide: ${p.matched.join(", ")}` : null,
    p.nice.length ? `Extras: ${p.nice.join(", ")}` : null,
    p.missing.length ? `A validar / fuera del core: ${p.missing.join(", ")}` : null,
    p.flags.length ? `Alertas: ${p.flags.join("; ")}` : null,
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 4000);
}

const PROFILE_LINE =
  "Ricardo Zuluaga: full stack senior 10+ años. Core: Python/FastAPI/Django, TypeScript/React/Next.js, PostgreSQL/MySQL/SQL Server, AWS + Docker, e IA aplicada (RAG, agentes CrewAI/LangChain, OpenAI, pgvector). Integraciones enterprise (SAP, GPS, WooCommerce, pagos). Basado en Medellín (Colombia), remoto con solape horario con España, abierto a relocation si el rol lo exige.";

/**
 * Afina el veredicto heurístico con una llamada barata al modelo analista.
 * No sustituye la heurística: añade un resumen con matices que un patrón no ve
 * (por ejemplo, si la oferta es de una consultora que oculta al cliente final).
 */
async function refineWithLlm(text: string, base: JobScore): Promise<JobScore> {
  try {
    const { client, model, provider, tier } = clientFor("analyst");
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      max_tokens: 350,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Evalúas el encaje de una oferta de empleo con este perfil y devuelves SOLO JSON.

${PROFILE_LINE}

Ya hay un pre-análisis heurístico: veredicto ${base.verdict}, ${base.score}%. Ajústalo solo si el texto lo justifica.

Devuelve: {"summary":"2 frases directas con la recomendación","talkingPoints":["argumento de encaje concreto","..."],"watchOuts":["riesgo o pregunta a hacer en la primera llamada","..."]}`,
        },
        { role: "user", content: `OFERTA:\n${text.slice(0, 6000)}` },
      ],
    });

    if (completion.usage) {
      await logUsage({
        channel: "analyst",
        model,
        provider,
        tier,
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
      });
    }

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}") as {
      summary?: unknown;
      talkingPoints?: unknown;
      watchOuts?: unknown;
    };

    const talking = Array.isArray(parsed.talkingPoints)
      ? parsed.talkingPoints.filter((x): x is string => typeof x === "string").slice(0, 5)
      : [];
    const watch = Array.isArray(parsed.watchOuts)
      ? parsed.watchOuts.filter((x): x is string => typeof x === "string").slice(0, 5)
      : [];

    const summary =
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : base.summary;

    const matchGaps = [
      base.matchGaps,
      talking.length ? `Argumentos: ${talking.join("; ")}` : null,
      watch.length ? `Preguntar en la llamada: ${watch.join("; ")}` : null,
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 4000);

    return { ...base, summary, matchGaps, usedLlm: true };
  } catch (err) {
    console.error("Refinar oferta con IA:", err);
    return base;
  }
}

export async function scoreJob(
  text: string,
  opts: { useLlm?: boolean } = {},
): Promise<JobScore> {
  const base = scoreJobHeuristic(text);
  if (opts.useLlm && isLlmConfigured("analyst")) {
    return refineWithLlm(text, base);
  }
  return base;
}
