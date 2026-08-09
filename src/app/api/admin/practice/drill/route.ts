import { denyIfNotAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getDrill, nextDrill } from "@/lib/practice";
import { createId } from "@/lib/practice/ids";
import { recordMastery } from "@/lib/practice/mastery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const exclude = (url.searchParams.get("exclude") || "")
    .split(",")
    .filter(Boolean);
  const item = nextDrill(exclude);
  return Response.json({
    id: item.id,
    pack: item.pack,
    promptEn: item.promptEn,
    promptEs: item.promptEs,
    options: item.options,
    tags: item.tags,
  });
}

export async function POST(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const body = (await req.json()) as {
    sessionId?: string;
    questionId?: string;
    chosenIndex?: number;
  };

  const item = getDrill(body.questionId || "");
  if (!item || typeof body.chosenIndex !== "number") {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const correct = body.chosenIndex === item.correctIndex;
  const chosenOption = item.options[body.chosenIndex] || "";
  const correctOption = item.options[item.correctIndex]!;

  if (body.sessionId) {
    await prisma.practiceDrillResult.create({
      data: {
        id: createId(),
        sessionId: body.sessionId,
        questionId: item.id,
        question: item.promptEn,
        chosenOption,
        correctOption,
        correct,
        explanation: item.explanationEn,
        tags: item.tags,
      },
    });
  }

  for (const tag of item.tags.slice(0, 3)) {
    await recordMastery({
      kind: tag === "star" || tag === "interview" ? "phrase" : "term",
      itemId: tag,
      correct,
      score: correct ? 100 : 0,
    });
  }

  return Response.json({
    correct,
    correctIndex: item.correctIndex,
    explanationEn: item.explanationEn,
    explanationEs: item.explanationEs,
    correctOption,
  });
}
