import { denyIfNotAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  interviewPanels,
  MEETING_SCENARIOS,
  questionsForPanel,
  generateInterviewerTurn,
  generateMeetingTurn,
  getMeetingScenario,
} from "@/lib/practice";
import { isLlmConfigured } from "@/lib/llm/client";
import { createId } from "@/lib/practice/ids";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const sessions = await prisma.practiceSession.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      mode: true,
      locale: true,
      scenarioSlug: true,
      status: true,
      scoreAvg: true,
      verdict: true,
      createdAt: true,
      finishedAt: true,
      opportunityId: true,
    },
  });

  return Response.json({
    panels: interviewPanels(),
    meetings: MEETING_SCENARIOS,
    sessions: sessions.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      finishedAt: s.finishedAt?.toISOString() ?? null,
    })),
  });
}

export async function POST(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = (await req.json()) as {
    mode?: string;
    locale?: string;
    scenarioSlug?: string;
    difficulty?: string;
    opportunityId?: string;
  };

  const mode = body.mode || "interview";
  const locale = body.locale === "es" ? "es" : "en";
  const difficulty = body.difficulty || "media";
  const scenarioSlug = body.scenarioSlug || "";

  if (!["interview", "meeting", "drill", "coach", "glossary"].includes(mode)) {
    return Response.json({ error: "invalid_mode" }, { status: 400 });
  }

  let opportunityContext: string | undefined;
  if (body.opportunityId) {
    const opp = await prisma.opportunity.findUnique({
      where: { id: body.opportunityId },
    });
    if (opp) {
      opportunityContext = [
        `Company: ${opp.company}`,
        `Role: ${opp.role}`,
        opp.jobDescription ? `JD:\n${opp.jobDescription}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }
  }

  const session = await prisma.practiceSession.create({
    data: {
      id: createId(),
      mode,
      locale,
      scenarioSlug: scenarioSlug || null,
      difficulty,
      opportunityId: body.opportunityId || null,
      status: "active",
    },
  });

  let opening: string | null = null;
  let bankMeta: {
    questionId?: string;
    mustCover?: string[];
    redFlags?: string[];
  } = {};

  if (mode === "interview" || mode === "meeting") {
    if (!isLlmConfigured("chat")) {
      return Response.json({ error: "llm_not_configured" }, { status: 503 });
    }
  }

  if (mode === "interview") {
    const panel =
      interviewPanels().find((p) => p.id === scenarioSlug) ||
      interviewPanels()[0]!;
    const qs = questionsForPanel(
      panel.id,
      locale,
      difficulty as "baja" | "media" | "alta",
      8,
    );
    const q = qs[0];
    opening = await generateInterviewerTurn({
      locale,
      panelName: panel.name,
      panelDescription: panel.description,
      difficulty,
      history: [],
      nextQuestion: q?.text,
      mustCover: q?.mustCover,
      opportunityContext,
    });
    bankMeta = {
      questionId: q?.id,
      mustCover: q?.mustCover,
      redFlags: q?.redFlags,
    };
  } else if (mode === "meeting") {
    const scenario =
      getMeetingScenario(scenarioSlug) || MEETING_SCENARIOS[0]!;
    opening = await generateMeetingTurn({
      locale,
      scenarioTitle: locale === "en" ? scenario.titleEn : scenario.titleEs,
      brief: scenario.brief,
      history: [],
    });
  } else if (mode === "coach") {
    opening =
      locale === "en"
        ? "Paste what you would say in an interview, meeting or client call. I’ll correct it and suggest native phrasing plus connectors."
        : "Pega lo que dirías en entrevista, reunión o cliente. Lo corrijo y sugiero versión nativa más conectores.";
  }

  if (opening) {
    await prisma.practiceTurn.create({
      data: {
        id: createId(),
        sessionId: session.id,
        idx: 0,
        role: "assistant",
        content: opening,
        feedback: bankMeta,
      },
    });
  }

  return Response.json({
    sessionId: session.id,
    mode,
    locale,
    scenarioSlug: session.scenarioSlug,
    opening,
    bankMeta,
  });
}
