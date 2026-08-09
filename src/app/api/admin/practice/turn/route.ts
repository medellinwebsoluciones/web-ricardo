import { denyIfNotAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  generateInterviewerTurn,
  generateMeetingTurn,
  getMeetingScenario,
  interviewPanels,
  judgePracticeAnswer,
  MEETING_SCENARIOS,
  questionsForPanel,
} from "@/lib/practice";
import { createId } from "@/lib/practice/ids";
import { isLlmConfigured } from "@/lib/llm/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  if (!isLlmConfigured("chat") || !isLlmConfigured("judge")) {
    return Response.json({ error: "llm_not_configured" }, { status: 503 });
  }

  const body = (await req.json()) as {
    sessionId?: string;
    message?: string;
  };

  const sessionId = body.sessionId?.trim();
  const message = (body.message || "").trim();
  if (!sessionId || message.length < 1 || message.length > 4000) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const session = await prisma.practiceSession.findUnique({
    where: { id: sessionId },
    include: { turns: { orderBy: { idx: "asc" } } },
  });
  if (!session || session.status !== "active") {
    return Response.json({ error: "session_not_found" }, { status: 404 });
  }

  const locale = session.locale === "es" ? "es" : "en";
  const lastAssistant = [...session.turns]
    .reverse()
    .find((t) => t.role === "assistant");
  const bankMeta = (lastAssistant?.feedback || {}) as {
    questionId?: string;
    mustCover?: string[];
    redFlags?: string[];
  };

  const prompt =
    lastAssistant?.content ||
    (session.mode === "meeting" ? "Continue the meeting" : "Interview question");

  const feedback = await judgePracticeAnswer({
    locale,
    mode: session.mode,
    prompt,
    answer: message,
    mustCover: bankMeta.mustCover,
    redFlags: bankMeta.redFlags,
  });

  const nextIdx = session.turns.length;
  await prisma.practiceTurn.create({
    data: {
      id: createId(),
      sessionId,
      idx: nextIdx,
      role: "user",
      content: message,
      feedback,
    },
  });

  await prisma.practiceScore.create({
    data: {
      id: createId(),
      sessionId,
      scores: feedback.scores,
      score: feedback.score,
    },
  });

  const history = [
    ...session.turns.map((t) => ({
      role: (t.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: t.content,
    })),
    { role: "user" as const, content: message },
  ].slice(-12);

  let reply = "";
  let nextBank: typeof bankMeta = {};

  if (session.mode === "interview") {
    const panel =
      interviewPanels().find((p) => p.id === session.scenarioSlug) ||
      interviewPanels()[0]!;
    const qs = questionsForPanel(
      panel.id,
      locale,
      (session.difficulty as "baja" | "media" | "alta") || undefined,
      10,
    );
    const used = new Set(
      session.turns
        .map((t) => (t.feedback as { questionId?: string } | null)?.questionId)
        .filter(Boolean),
    );
    const nextQ = qs.find((q) => !used.has(q.id)) || qs[Math.min(used.size, qs.length - 1)];
    let opportunityContext: string | undefined;
    if (session.opportunityId) {
      const opp = await prisma.opportunity.findUnique({
        where: { id: session.opportunityId },
      });
      if (opp) {
        opportunityContext = `${opp.company} — ${opp.role}\n${opp.jobDescription || ""}`;
      }
    }
    reply = await generateInterviewerTurn({
      locale,
      panelName: panel.name,
      panelDescription: panel.description,
      difficulty: session.difficulty || "media",
      history,
      nextQuestion: nextQ?.text,
      mustCover: nextQ?.mustCover,
      opportunityContext,
    });
    nextBank = {
      questionId: nextQ?.id,
      mustCover: nextQ?.mustCover,
      redFlags: nextQ?.redFlags,
    };
  } else if (session.mode === "meeting") {
    const scenario =
      getMeetingScenario(session.scenarioSlug || "") || MEETING_SCENARIOS[0]!;
    reply = await generateMeetingTurn({
      locale,
      scenarioTitle: locale === "en" ? scenario.titleEn : scenario.titleEs,
      brief: scenario.brief,
      history,
    });
  } else {
    reply = feedback.nativeRewrite;
  }

  await prisma.practiceTurn.create({
    data: {
      id: createId(),
      sessionId,
      idx: nextIdx + 1,
      role: "assistant",
      content: reply,
      feedback: nextBank,
    },
  });

  const scores = await prisma.practiceScore.findMany({
    where: { sessionId },
    select: { score: true },
  });
  const avg =
    scores.reduce((a, s) => a + s.score, 0) / Math.max(1, scores.length);
  await prisma.practiceSession.update({
    where: { id: sessionId },
    data: { scoreAvg: Math.round(avg * 10) / 10 },
  });

  return Response.json({
    reply,
    feedback,
    scoreAvg: Math.round(avg * 10) / 10,
  });
}
