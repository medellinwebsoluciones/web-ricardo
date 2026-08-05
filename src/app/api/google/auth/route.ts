import { NextRequest } from "next/server";
import { getOAuthClient } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Protegido con una clave de setup para evitar que terceros inicien el flujo.
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.NEXTAUTH_SECRET || key !== process.env.NEXTAUTH_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const client = getOAuthClient();
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
  });
  return Response.redirect(url);
}
