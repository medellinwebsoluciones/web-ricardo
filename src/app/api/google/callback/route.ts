import { NextRequest } from "next/server";
import { getOAuthClient } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    const refresh = tokens.refresh_token;

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Google conectado</title>
    <style>body{font-family:Inter,Arial,sans-serif;background:#09090b;color:#e4e4e7;padding:40px;max-width:640px;margin:auto}code{background:#18181b;padding:12px;display:block;border-radius:8px;word-break:break-all;color:#34d399;margin-top:8px}</style>
    </head><body>
    <h2>Google Calendar conectado</h2>
    ${
      refresh
        ? `<p>Copia este <strong>GOOGLE_REFRESH_TOKEN</strong> en tu archivo <code style="display:inline">.env</code> y reinicia la app:</p><code>${refresh}</code>`
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
