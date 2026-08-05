import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getVisitorId(req: NextRequest, bodyId?: string): string | null {
  return req.cookies.get("rz_vid")?.value || bodyId || null;
}

export async function POST(req: NextRequest) {
  let body: {
    type?: "view" | "engagement";
    visitorId?: string;
    path?: string;
    locale?: string;
    referrer?: string;
    dwellMs?: number;
    scrollPct?: number;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const visitorId = getVisitorId(req, body.visitorId);
  if (!visitorId) return Response.json({ ok: false }, { status: 400 });

  const path = (body.path || "/").slice(0, 300);
  const utm = (v?: string | null) => (v ? String(v).slice(0, 120) : null);

  try {
    if (body.type === "view") {
      const existing = await prisma.visitSession.findUnique({
        where: { visitorId },
      });
      if (existing) {
        await prisma.visitSession.update({
          where: { visitorId },
          data: {
            pageViews: { increment: 1 },
            lastSeenAt: new Date(),
            // Solo rellena el UTM si la sesión aún no lo tenía (first touch).
            ...(existing.utmSource || !body.utmSource
              ? {}
              : {
                  utmSource: utm(body.utmSource),
                  utmMedium: utm(body.utmMedium),
                  utmCampaign: utm(body.utmCampaign),
                }),
          },
        });
      } else {
        await prisma.visitSession.create({
          data: {
            visitorId,
            landingPath: path,
            referrer: body.referrer?.slice(0, 300) || null,
            utmSource: utm(body.utmSource),
            utmMedium: utm(body.utmMedium),
            utmCampaign: utm(body.utmCampaign),
          },
        });
      }
    } else if (body.type === "engagement") {
      await prisma.pageHit.create({
        data: {
          visitorId,
          path,
          locale: body.locale?.slice(0, 5) || null,
          referrer: body.referrer?.slice(0, 300) || null,
          dwellMs: body.dwellMs ? Math.min(body.dwellMs, 3_600_000) : null,
          scrollPct: body.scrollPct
            ? Math.max(0, Math.min(100, Math.round(body.scrollPct)))
            : null,
        },
      });
    }
  } catch (err) {
    console.error("track error:", err);
  }

  return Response.json({ ok: true });
}
