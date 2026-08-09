import { NextRequest } from "next/server";
import { getOAuthClient } from "@/lib/google-calendar";
import { consumeOAuthState } from "@/lib/google-setup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }
  if (!consumeOAuthState(state)) {
    return new Response("Invalid or expired state", { status: 401 });
  }

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    const refresh = tokens.refresh_token;

    // Nunca reflejar el refresh token en HTML (historial, capturas, Referer).
    if (refresh) {
      console.info(
        "[google-oauth] GOOGLE_REFRESH_TOKEN recibido. Cópialo al .env del servidor y reinicia. Valor (una sola vez en logs):",
        refresh,
      );
    } else {
      console.warn(
        "[google-oauth] Sin refresh_token. Revoca el acceso en Google y reautoriza con prompt=consent.",
      );
    }

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Google conectado</title>
    <style>body{font-family:Inter,Arial,sans-serif;background:#09090b;color:#e4e4e7;padding:40px;max-width:640px;margin:auto}</style>
    </head><body>
    <h2>Google Calendar conectado</h2>
    ${
      refresh
        ? `<p>Autorización correcta. El <strong>GOOGLE_REFRESH_TOKEN</strong> se escribió solo en los logs del servidor (no se muestra aquí). Cópialo al <code>.env</code> y reinicia la app.</p>`
        : `<p style="color:#f87171">No se recibió refresh_token. Revoca el acceso en tu cuenta de Google y vuelve a autorizar (asegúrate de usar prompt=consent).</p>`
    }
    </body></html>`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Google callback error:", err);
    return new Response("Error exchanging code", { status: 500 });
  }
}
