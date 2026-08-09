import { denyIfNotAdmin } from "@/lib/admin-auth";
import { getPhrase, PHRASES, WORKPLACE_SCRIPTS } from "@/lib/practice";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const script = WORKPLACE_SCRIPTS.find((s) => s.id === id);
    if (!script) return Response.json({ error: "not_found" }, { status: 404 });
    const phrases = script.phraseIds
      .map((pid) => getPhrase(pid))
      .filter(Boolean);
    return Response.json({ script, phrases });
  }

  return Response.json({
    count: WORKPLACE_SCRIPTS.length,
    items: WORKPLACE_SCRIPTS.map((s) => ({
      id: s.id,
      situation: s.situation,
      titleEn: s.titleEn,
      titleEs: s.titleEs,
      contextEs: s.contextEs,
      sourceSlug: s.sourceSlug,
      phraseCount: s.phraseIds.length,
    })),
    phraseBankSize: PHRASES.length,
  });
}
