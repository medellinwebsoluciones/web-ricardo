import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Guard compartido por todas las rutas /api/admin/*.
 * Devuelve null si hay sesión válida, o la Response 401 si no.
 */
export async function denyIfNotAdmin(): Promise<Response | null> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Sesión de admin O token de ingestión (`JOB_INGEST_TOKEN` / header
 * `x-ingest-token`). Sirve para la extensión Chrome y el bookmarklet
 * sin exigir cookies cross-origin desde LinkedIn.
 */
export async function denyIfNotAdminOrIngestToken(
  req: Request,
): Promise<Response | null> {
  const token = (process.env.JOB_INGEST_TOKEN || "").trim();
  const header = (req.headers.get("x-ingest-token") || "").trim();
  if (token && header && header === token) return null;
  return denyIfNotAdmin();
}
