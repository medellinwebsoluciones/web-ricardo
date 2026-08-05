import { prisma } from "./prisma";
import { AUDITOR_PANELS, INTERVIEW_QUESTIONS } from "./interview-bank";

/**
 * El banco de preguntas vive en código (versionado, revisable) y se proyecta a
 * la base como suites para poder guardar resultados históricos contra cada
 * caso. `externalId` es el puente entre ambos: editar una pregunta en el código
 * actualiza el caso sin perder las corridas anteriores.
 */
export async function syncSuitesFromBank(): Promise<{
  suites: number;
  cases: number;
}> {
  let cases = 0;

  for (const panel of AUDITOR_PANELS) {
    const suite = await prisma.evalSuite.upsert({
      where: { slug: panel.id },
      update: { name: panel.name, description: panel.description },
      create: {
        slug: panel.id,
        name: panel.name,
        description: panel.description,
      },
    });

    for (const q of INTERVIEW_QUESTIONS.filter((x) => x.panel === panel.id)) {
      await prisma.evalCase.upsert({
        where: {
          suiteId_externalId: { suiteId: suite.id, externalId: q.id },
        },
        update: {
          question: q.es,
          audience: q.audience,
          difficulty: q.difficulty,
          mustCover: q.mustCover,
          redFlags: q.redFlags,
        },
        create: {
          suiteId: suite.id,
          externalId: q.id,
          question: q.es,
          locale: "es",
          audience: q.audience,
          difficulty: q.difficulty,
          mustCover: q.mustCover,
          redFlags: q.redFlags,
        },
      });
      cases++;
    }
  }

  return { suites: AUDITOR_PANELS.length, cases };
}

export async function listSuites() {
  const suites = await prisma.evalSuite.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { cases: true } },
      runs: {
        where: { status: "done" },
        orderBy: { startedAt: "desc" },
        take: 1,
        select: { id: true, avgScore: true, startedAt: true },
      },
    },
  });

  return suites.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    description: s.description,
    cases: s._count.cases,
    lastRun: s.runs[0]
      ? {
          id: s.runs[0].id,
          avgScore: s.runs[0].avgScore,
          startedAt: s.runs[0].startedAt.toISOString(),
        }
      : null,
  }));
}
