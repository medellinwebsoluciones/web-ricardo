import { denyIfNotAdmin } from "@/lib/admin-auth";
import {
  ACRONYMS,
  GLOSSARY_TERMS,
  PHRASES,
  WORKPLACE_SCRIPTS,
  getAcronym,
  getPhrase,
  getScript,
  getTerm,
} from "@/lib/practice";
import { recordMastery } from "@/lib/practice/mastery";
import type { StudyKind } from "@/lib/practice/types";

export const dynamic = "force-dynamic";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export async function GET(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const kind = (url.searchParams.get("kind") || "term") as StudyKind;

  if (kind === "term") {
    const term = GLOSSARY_TERMS[Math.floor(Math.random() * GLOSSARY_TERMS.length)]!;
    const distractors = shuffle(
      GLOSSARY_TERMS.filter((t) => t.id !== term.id).map((t) => t.definitionEn),
    ).slice(0, 3);
    const options = shuffle([term.definitionEn, ...distractors]);
    return Response.json({
      kind,
      itemId: term.id,
      prompt: `What does “${term.en}” mean?`,
      promptEs: `¿Qué significa “${term.es}”?`,
      options,
      reveal: {
        correct: term.definitionEn,
        interviewLineEn: term.interviewLineEn,
        sourceSlug: term.sourceSlug,
      },
    });
  }

  if (kind === "acronym") {
    const item = ACRONYMS[Math.floor(Math.random() * ACRONYMS.length)]!;
    const distractors = shuffle(
      ACRONYMS.filter((a) => a.id !== item.id).map((a) => a.expansionEn),
    ).slice(0, 3);
    const options = shuffle([item.expansionEn, ...distractors]);
    return Response.json({
      kind,
      itemId: item.id,
      prompt: `Expand: ${item.acronym}`,
      promptEs: `Expande: ${item.acronym}`,
      options,
      reveal: {
        correct: item.expansionEn,
        meetingLineEn: item.meetingLineEn,
        definitionEn: item.definitionEn,
      },
    });
  }

  if (kind === "phrase") {
    const item = PHRASES[Math.floor(Math.random() * PHRASES.length)]!;
    const distractors = shuffle(
      PHRASES.filter((p) => p.id !== item.id).map((p) => p.en),
    ).slice(0, 3);
    const options = shuffle([item.en, ...distractors]);
    return Response.json({
      kind,
      itemId: item.id,
      prompt: `Best phrase when: ${item.whenToUse}`,
      promptEs: `Mejor frase cuando: ${item.whenToUse}`,
      options,
      reveal: {
        correct: item.en,
        es: item.es,
        variant: item.variant,
        situation: item.situation,
      },
    });
  }

  const script =
    WORKPLACE_SCRIPTS[Math.floor(Math.random() * WORKPLACE_SCRIPTS.length)]!;
  const distractors = shuffle(
    WORKPLACE_SCRIPTS.filter((s) => s.id !== script.id).map((s) =>
      s.modelEn.slice(0, 160),
    ),
  ).slice(0, 3);
  const correct = script.modelEn.slice(0, 160) + "…";
  const options = shuffle([correct, ...distractors.map((d) => d + "…")]);
  return Response.json({
    kind: "script",
    itemId: script.id,
    prompt: `Best response for: ${script.titleEn}`,
    promptEs: `Mejor respuesta para: ${script.titleEs}`,
    context: script.contextEs,
    options,
    reveal: {
      correct,
      modelEn: script.modelEn,
      modelEs: script.modelEs,
    },
  });
}

export async function POST(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = (await req.json()) as {
    kind?: StudyKind;
    itemId?: string;
    chosen?: string;
  };

  const kind = body.kind;
  const itemId = body.itemId;
  if (!kind || !itemId || !body.chosen) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  let correctAnswer = "";
  let extra: Record<string, unknown> = {};

  if (kind === "term") {
    const t = getTerm(itemId);
    if (!t) return Response.json({ error: "not_found" }, { status: 404 });
    correctAnswer = t.definitionEn;
    extra = { interviewLineEn: t.interviewLineEn, sourceSlug: t.sourceSlug };
  } else if (kind === "acronym") {
    const a = getAcronym(itemId);
    if (!a) return Response.json({ error: "not_found" }, { status: 404 });
    correctAnswer = a.expansionEn;
    extra = { meetingLineEn: a.meetingLineEn };
  } else if (kind === "phrase") {
    const p = getPhrase(itemId);
    if (!p) return Response.json({ error: "not_found" }, { status: 404 });
    correctAnswer = p.en;
    extra = { es: p.es, variant: p.variant };
  } else {
    const s = getScript(itemId);
    if (!s) return Response.json({ error: "not_found" }, { status: 404 });
    correctAnswer = s.modelEn.slice(0, 160) + "…";
    extra = { modelEn: s.modelEn, modelEs: s.modelEs };
  }

  const correct =
    body.chosen === correctAnswer ||
    body.chosen.replace(/…$/, "") === correctAnswer.replace(/…$/, "");

  await recordMastery({ kind, itemId, correct, score: correct ? 100 : 0 });

  return Response.json({ correct, correctAnswer, ...extra });
}
