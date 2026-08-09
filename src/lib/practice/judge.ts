import { clientFor } from "@/lib/llm/client";
import { logUsage } from "@/lib/usage";
import { PROFILE_BRIEF } from "./profile-brief";
import {
  PRACTICE_SCORE_DIMENSIONS,
  type PracticeScores,
  type TurnFeedback,
} from "./types";

const WEIGHTS: Record<keyof PracticeScores, number> = {
  fluency: 1.25,
  grammar: 1.25,
  vocabulary: 1.25,
  professionalism: 1,
  content: 1.5,
};

function clamp(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function weightedPracticeScore(scores: PracticeScores): number {
  let total = 0;
  let weight = 0;
  for (const d of PRACTICE_SCORE_DIMENSIONS) {
    total += scores[d] * WEIGHTS[d];
    weight += WEIGHTS[d];
  }
  return Math.round((total / weight) * 10) / 10;
}

const JUDGE_SYSTEM = `You are a strict English + interview coach for Ricardo Zuluaga (senior architect / AI automation).

Score 0–100:
- fluency: natural flow for meetings/interviews
- grammar: accuracy
- vocabulary: precise technical + professional English
- professionalism: tone for workplace/clients
- content: factual grounding vs PROFILE BRIEF and any mustCover; inventing numbers/SLAs/dates is near 0

Return ONLY JSON:
{
  "scores": {"fluency":0,"grammar":0,"vocabulary":0,"professionalism":0,"content":0},
  "diagnosis": "two concrete actionable sentences",
  "nativeRewrite": "improved answer in natural professional English (same facts, no inventions)",
  "tips": ["tip1","tip2"],
  "suggestedConnectors": ["phrase1","phrase2"],
  "glossaryHits": ["term ids or names used well"]
}

Be demanding: 70 acceptable, 85 good, 95 excellent.`;

export async function judgePracticeAnswer(params: {
  locale: "en" | "es";
  mode: string;
  prompt: string;
  answer: string;
  mustCover?: string[];
  redFlags?: string[];
  situationHints?: string;
}): Promise<TurnFeedback> {
  const { client, model, provider, tier } = clientFor("judge");
  const user = [
    `MODE: ${params.mode}`,
    `ANSWER_LOCALE_TARGET: ${params.locale}`,
    `PROMPT/QUESTION:\n${params.prompt}`,
    `CANDIDATE_ANSWER:\n${params.answer}`,
    params.mustCover?.length
      ? `MUST_COVER:\n- ${params.mustCover.join("\n- ")}`
      : "",
    params.redFlags?.length
      ? `RED_FLAGS:\n- ${params.redFlags.join("\n- ")}`
      : "",
    params.situationHints ? `HINTS:\n${params.situationHints}` : "",
    `PROFILE_BRIEF:\n${PROFILE_BRIEF}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const res = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: JUDGE_SYSTEM },
      { role: "user", content: user },
    ],
  });

  await logUsage({
    channel: "practice",
    model,
    provider,
    tier,
    promptTokens: res.usage?.prompt_tokens,
    completionTokens: res.usage?.completion_tokens,
  });

  const raw = res.choices[0]?.message?.content || "{}";
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    parsed = {};
  }

  const rawScores = (parsed.scores || {}) as Record<string, unknown>;
  const scores = {
    fluency: clamp(rawScores.fluency),
    grammar: clamp(rawScores.grammar),
    vocabulary: clamp(rawScores.vocabulary),
    professionalism: clamp(rawScores.professionalism),
    content: clamp(rawScores.content),
  } satisfies PracticeScores;

  return {
    scores,
    score: weightedPracticeScore(scores),
    diagnosis:
      typeof parsed.diagnosis === "string"
        ? parsed.diagnosis
        : "Could not parse diagnosis; rewrite for clarity and grounding.",
    nativeRewrite:
      typeof parsed.nativeRewrite === "string"
        ? parsed.nativeRewrite
        : params.answer,
    tips: Array.isArray(parsed.tips)
      ? parsed.tips.filter((t): t is string => typeof t === "string").slice(0, 4)
      : [],
    suggestedConnectors: Array.isArray(parsed.suggestedConnectors)
      ? parsed.suggestedConnectors
          .filter((t): t is string => typeof t === "string")
          .slice(0, 4)
      : [],
    glossaryHits: Array.isArray(parsed.glossaryHits)
      ? parsed.glossaryHits
          .filter((t): t is string => typeof t === "string")
          .slice(0, 6)
      : [],
  };
}

export async function coachFreeform(params: {
  locale: "en" | "es";
  text: string;
  situation?: string;
}): Promise<{
  diagnosis: string;
  nativeRewrite: string;
  errors: string[];
  suggestedConnectors: string[];
  glossaryNotes: string[];
  levelEstimate: string;
  scores: PracticeScores;
  score: number;
}> {
  const feedback = await judgePracticeAnswer({
    locale: params.locale,
    mode: "coach",
    prompt: `Freeform coach. Situation: ${params.situation || "general workplace/interview"}. Correct and upgrade the English; keep facts honest.`,
    answer: params.text,
    situationHints:
      "Also list concrete grammar/vocabulary errors in tips; estimate CEFR in diagnosis first sentence.",
  });

  return {
    diagnosis: feedback.diagnosis,
    nativeRewrite: feedback.nativeRewrite,
    errors: feedback.tips,
    suggestedConnectors: feedback.suggestedConnectors,
    glossaryNotes: feedback.glossaryHits,
    levelEstimate: feedback.diagnosis.split(/[.!]/)[0] || "B1–B2",
    scores: feedback.scores,
    score: feedback.score,
  };
}
