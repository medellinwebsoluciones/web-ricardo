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
