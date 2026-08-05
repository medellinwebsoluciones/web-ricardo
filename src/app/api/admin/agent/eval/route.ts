import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { listSuites, syncSuitesFromBank } from "@/lib/eval-suites";
import { DIMENSIONS } from "@/lib/agent-eval";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  // La primera visita proyecta el banco a la base: así el panel nunca aparece
  // vacío por no haber corrido un script a mano.
  const existing = await prisma.evalSuite.count();
  if (existing === 0) await syncSuitesFromBank();

  const [suites, promptVersions] = await Promise.all([
    listSuites(),
    prisma.agentPromptVersion.findMany({
      orderBy: { version: "desc" },
      select: { id: true, version: true, name: true, isActive: true },
    }),
  ]);

  return Response.json({ suites, promptVersions, dimensions: DIMENSIONS });
}

/** Re-sincroniza las suites tras editar el banco en código. */
export async function POST() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const result = await syncSuitesFromBank();
  return Response.json({ ...result, suites: await listSuites() });
}
