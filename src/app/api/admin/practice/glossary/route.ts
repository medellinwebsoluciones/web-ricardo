import { denyIfNotAdmin } from "@/lib/admin-auth";
import { GLOSSARY_TERMS, termsByCategory } from "@/lib/practice";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const category = url.searchParams.get("category") || undefined;
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();

  let items = termsByCategory(category);
  if (q) {
    items = items.filter(
      (t) =>
        t.en.toLowerCase().includes(q) ||
        t.es.toLowerCase().includes(q) ||
        t.definitionEn.toLowerCase().includes(q) ||
        t.id.includes(q),
    );
  }

  return Response.json({
    count: items.length,
    items,
    categories: [
      "agents_rag",
      "architecture",
      "cloud_infra",
      "fullstack",
      "products",
    ],
  });
}
