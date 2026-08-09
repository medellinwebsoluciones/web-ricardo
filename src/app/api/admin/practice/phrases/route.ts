import { denyIfNotAdmin } from "@/lib/admin-auth";
import { PHRASES, phrasesBySituation } from "@/lib/practice";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const situation = url.searchParams.get("situation") || undefined;
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();

  let items = situation ? phrasesBySituation(situation) : PHRASES;
  if (q) {
    items = items.filter(
      (p) =>
        p.en.toLowerCase().includes(q) ||
        p.es.toLowerCase().includes(q) ||
        p.whenToUse.toLowerCase().includes(q),
    );
  }

  const situations = [
    "open",
    "connectors",
    "soften",
    "standup",
    "design",
    "client",
    "defer",
    "interview_star",
    "close",
  ];

  return Response.json({ count: items.length, items, situations });
}
