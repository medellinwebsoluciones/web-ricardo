import { denyIfNotAdmin } from "@/lib/admin-auth";
import { ACRONYMS } from "@/lib/practice";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const domain = url.searchParams.get("domain") || undefined;
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();

  let items = ACRONYMS;
  if (domain) items = items.filter((a) => a.domain === domain);
  if (q) {
    items = items.filter(
      (a) =>
        a.acronym.toLowerCase().includes(q) ||
        a.expansionEn.toLowerCase().includes(q) ||
        a.expansionEs.toLowerCase().includes(q),
    );
  }

  return Response.json({ count: items.length, items });
}
