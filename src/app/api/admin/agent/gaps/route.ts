import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { mineGapsFromChats } from "@/lib/knowledge-gaps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const status = req.nextUrl.searchParams.get("status") || "abierto";

  const [gaps, counts] = await Promise.all([
    prisma.knowledgeGap.findMany({
      where: status === "todos" ? {} : { status },
      // Lo que más veces preguntan es lo primero que hay que responder.
      orderBy: [{ hits: "desc" }, { createdAt: "desc" }],
      take: 200,
    }),
    prisma.knowledgeGap.groupBy({ by: ["status"], _count: true }),
  ]);

  return Response.json({
    gaps: gaps.map((g) => ({
      id: g.id,
      question: g.question,
      source: g.source,
      audience: g.audience,
      hits: g.hits,
      bestSimilarity: g.bestSimilarity,
      status: g.status,
      answer: g.answer,
      createdAt: g.createdAt.toISOString(),
    })),
    counts: Object.fromEntries(counts.map((c) => [c.status, c._count])),
  });
}

/** Barre los chats reales del sitio buscando preguntas que el corpus no cubrió. */
export async function POST() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const found = await mineGapsFromChats();
  return Response.json({ found });
}
