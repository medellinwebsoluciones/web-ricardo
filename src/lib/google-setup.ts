import { randomBytes, timingSafeEqual } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/** Estados OAuth de un solo uso (arranque → callback). */
const pendingStates = new Map<string, { exp: number }>();
const STATE_TTL_MS = 15 * 60 * 1000;

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Sesión admin o token de setup dedicado (nunca NEXTAUTH_SECRET). */
export async function denyIfNotGoogleSetup(
  req: Request,
): Promise<Response | null> {
  const session = await getServerSession(authOptions);
  if (session) return null;

  const setup = (process.env.GOOGLE_SETUP_TOKEN || "").trim();
  if (!setup) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const key = (url.searchParams.get("key") || "").trim();
  const header = (req.headers.get("x-google-setup-token") || "").trim();
  if ((key && safeEqual(key, setup)) || (header && safeEqual(header, setup))) {
    return null;
  }
  return new Response("Unauthorized", { status: 401 });
}

export function createOAuthState(): string {
  const state = randomBytes(24).toString("hex");
  pendingStates.set(state, { exp: Date.now() + STATE_TTL_MS });
  return state;
}

export function consumeOAuthState(state: string | null): boolean {
  if (!state) return false;
  const entry = pendingStates.get(state);
  pendingStates.delete(state);
  if (!entry) return false;
  if (Date.now() > entry.exp) return false;
  return true;
}

// Limpieza ocasional
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of pendingStates) {
      if (now > v.exp) pendingStates.delete(k);
    }
  }, 5 * 60 * 1000).unref?.();
}
