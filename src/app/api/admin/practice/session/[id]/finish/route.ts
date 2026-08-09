import { denyIfNotAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { finishSessionVerdict } from "@/lib/practice";
import { createId } from "@/lib/practice/ids";
import { isLlmConfigured } from "@/lib/llm/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await ctx.params;
  const session = await prisma.practiceSession.findUnique({
    where: { id },
    include: {
      turns: { orderBy: { idx: "asc" } },
      scores: true,
    },
  });
  if (!session) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const avg =
    session.scoreAvg ??
    (session.scores.length
      ? session.scores.reduce((a, s) => a + s.score, 0) / session.scores.length
      : 0);

  let verdict = `Average score ${Math.round(avg * 10) / 10}/100`;
  let diagnosis =
    "Review connectors, STAR structure, and avoid inventing metrics.";

  if (isLlmConfigured("judge") && session.turns.length > 0) {
    const transcript = session.turns
      .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
      .join("\n");
    const out = await finishSessionVerdict({
      locale: session.locale === "es" ? "es" : "en",
      mode: session.mode,
      transcript,
      avgScore: avg,
    });
    verdict = out.verdict;
    diagnosis = out.diagnosis;
  }

  const updated = await prisma.practiceSession.update({
    where: { id },
    data: {
      status: "done",
      finishedAt: new Date(),
      scoreAvg: Math.round(avg * 10) / 10,
      verdict,
      diagnosis,
    },
  });

  const profile = await prisma.practiceProfile.findFirst();
  if (profile) {
    await prisma.practiceProfile.update({
      where: { id: profile.id },
      data: {
        lastPracticeAt: new Date(),
        streakDays: profile.streakDays + 1,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.practiceProfile.create({
      data: {
        id: createId(),
        lastPracticeAt: new Date(),
        streakDays: 1,
        updatedAt: new Date(),
      },
    });
  }

  return Response.json({
    id: updated.id,
    scoreAvg: updated.scoreAvg,
    verdict: updated.verdict,
    diagnosis: updated.diagnosis,
  });
}
