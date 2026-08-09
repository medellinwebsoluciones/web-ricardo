import { clientFor } from "@/lib/llm/client";
import { logUsage } from "@/lib/usage";
import { PROFILE_BRIEF } from "./profile-brief";
import { phrasesBySituation } from "./phrases-data";

export async function generateInterviewerTurn(params: {
  locale: "en" | "es";
  panelName: string;
  panelDescription: string;
  difficulty: string;
  history: { role: "user" | "assistant"; content: string }[];
  nextQuestion?: string;
  mustCover?: string[];
  opportunityContext?: string;
}): Promise<string> {
  const { client, model, provider, tier } = clientFor("chat");
  const connectors = phrasesBySituation("interview_star")
    .slice(0, 6)
    .map((p) => p.en)
    .join("; ");

  const system = `You are a realistic technical interviewer for ${params.panelName}.
${params.panelDescription}
Difficulty: ${params.difficulty}.
Speak in ${params.locale === "en" ? "professional English" : "professional Spanish"}.
You interview Ricardo Zuluaga (candidate). Be probing but fair. One question or short follow-up per turn. No markdown lists. No emojis.
If a BANK_QUESTION is provided, ask it (adapt slightly) then listen.
Candidate profile (for your expectations, do not recite):
${PROFILE_BRIEF}
Useful STAR bridges you may expect: ${connectors}`;

  const bank = params.nextQuestion
    ? `BANK_QUESTION: ${params.nextQuestion}\nMUST_COVER (evaluate silently): ${(params.mustCover || []).join("; ")}`
    : "Ask a sharp follow-up based on the last answer.";

  const opp = params.opportunityContext
    ? `JOB_CONTEXT:\n${params.opportunityContext.slice(0, 2500)}`
    : "";

  const messages = [
    { role: "system" as const, content: system },
    ...params.history.map((h) => ({
      role: h.role,
      content: h.content,
    })),
    {
      role: "user" as const,
      content: `${bank}\n${opp}\nProduce only the interviewer utterance.`,
    },
  ];

  const res = await client.chat.completions.create({
    model,
    temperature: 0.6,
    messages,
  });

  await logUsage({
    channel: "practice",
    model,
    provider,
    tier,
    promptTokens: res.usage?.prompt_tokens,
    completionTokens: res.usage?.completion_tokens,
  });

  return (res.choices[0]?.message?.content || "").trim();
}

export async function generateMeetingTurn(params: {
  locale: "en" | "es";
  scenarioTitle: string;
  brief: string;
  history: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const { client, model, provider, tier } = clientFor("chat");
  const helpful = phrasesBySituation("standup")
    .concat(phrasesBySituation("soften"))
    .slice(0, 10)
    .map((p) => p.en)
    .join("; ");

  const system = `Role-play a workplace meeting: ${params.scenarioTitle}.
Brief for YOUR character:
${params.brief}
Language: ${params.locale === "en" ? "natural professional English" : "professional Spanish"}.
Ricardo is the other participant. Keep turns short (2–5 sentences). Challenge vagueness. No markdown. No emojis.
Phrases you might expect from a strong peer: ${helpful}`;

  const res = await client.chat.completions.create({
    model,
    temperature: 0.7,
    messages: [
      { role: "system", content: system },
      ...params.history.map((h) => ({ role: h.role, content: h.content })),
      {
        role: "user",
        content:
          "Continue the meeting with your next utterance only. If starting, open the meeting.",
      },
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

  return (res.choices[0]?.message?.content || "").trim();
}

export async function finishSessionVerdict(params: {
  locale: "en" | "es";
  mode: string;
  transcript: string;
  avgScore: number;
}): Promise<{ verdict: string; diagnosis: string }> {
  const { client, model, provider, tier } = clientFor("judge");
  const res = await client.chat.completions.create({
    model,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You close a practice session for interview/English coaching. Return JSON {"verdict":"one sentence","diagnosis":"3-5 concrete improvement bullets as one string with newlines"}. Language: ${params.locale === "en" ? "English" : "Spanish"}.`,
      },
      {
        role: "user",
        content: `MODE: ${params.mode}\nAVG_SCORE: ${params.avgScore}\nTRANSCRIPT:\n${params.transcript.slice(0, 6000)}`,
      },
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

  try {
    const parsed = JSON.parse(res.choices[0]?.message?.content || "{}") as {
      verdict?: string;
      diagnosis?: string;
    };
    return {
      verdict: parsed.verdict || `Session average ${params.avgScore}/100`,
      diagnosis: parsed.diagnosis || "Keep practicing connectors and grounded STAR answers.",
    };
  } catch {
    return {
      verdict: `Session average ${params.avgScore}/100`,
      diagnosis: "Keep practicing connectors and grounded STAR answers.",
    };
  }
}
