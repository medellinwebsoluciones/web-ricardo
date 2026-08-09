import { denyIfNotAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { coachFreeform } from "@/lib/practice";
import { createId } from "@/lib/practice/ids";
import { isLlmConfigured } from "@/lib/llm/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  if (!isLlmConfigured("judge")) {
    return Response.json({ error: "llm_not_configured" }, { status: 503 });
  }

  const body = (await req.json()) as {
    sessionId?: string;
    text?: string;
    locale?: string;
    situation?: string;
  };

  const text = (body.text || "").trim();
  if (text.length < 8 || text.length > 5000) {
    return Response.json({ error: "invalid_text" }, { status: 400 });
  }

  const locale = body.locale === "es" ? "es" : "en";
  const result = await coachFreeform({
    locale,
    text,
    situation: body.situation,
  });

  let sessionId = body.sessionId;
  if (!sessionId) {
    const session = await prisma.practiceSession.create({
      data: {
        id: createId(),
        mode: "coach",
        locale,
        scenarioSlug: body.situation || null,
        status: "done",
        scoreAvg: result.score,
        finishedAt: new Date(),
      },
    });
    sessionId = session.id;
  }

  await prisma.practiceTurn.create({
    data: {
      id: createId(),
      sessionId,
      idx: 0,
      role: "user",
      content: text,
    },
  });
  await prisma.practiceTurn.create({
    data: {
      id: createId(),
      sessionId,
      idx: 1,
      role: "assistant",
      content: result.nativeRewrite,
      feedback: result,
    },
  });
  await prisma.practiceScore.create({
    data: {
      id: createId(),
      sessionId,
      scores: result.scores,
      score: result.score,
    },
  });

  return Response.json({ sessionId, ...result });
}
