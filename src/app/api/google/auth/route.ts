import { NextRequest } from "next/server";
import { getOAuthClient } from "@/lib/google-calendar";
import { createOAuthState, denyIfNotGoogleSetup } from "@/lib/google-setup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Inicia OAuth: sesión admin o ?key=$GOOGLE_SETUP_TOKEN. */
export async function GET(req: NextRequest) {
  const denied = await denyIfNotGoogleSetup(req);
  if (denied) return denied;

  const client = getOAuthClient();
  const state = createOAuthState();
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    state,
    scope: [
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
  });
  return Response.redirect(url);
}
