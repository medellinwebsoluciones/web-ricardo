import { NextRequest } from "next/server";
import { getAvailability } from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return Response.json({ error: "missing_date", slots: [] }, { status: 400 });
  }
  try {
    const slots = await getAvailability(date);
    return Response.json({
      slots: slots.map((s) => ({ label: s.label, startIso: s.startIso })),
    });
  } catch (err) {
    console.error("availability error:", err);
    return Response.json({ error: "server_error", slots: [] }, { status: 500 });
  }
}
