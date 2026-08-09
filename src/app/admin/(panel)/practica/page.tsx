import { prisma } from "@/lib/prisma";
import { PracticeCoach } from "@/components/admin/PracticeCoach";

export const dynamic = "force-dynamic";

export default async function PracticaPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; opportunityId?: string }>;
}) {
  const { mode, opportunityId } = await searchParams;

  const opportunities = await prisma.opportunity.findMany({
    orderBy: { updatedAt: "desc" },
    take: 80,
    select: {
      id: true,
      company: true,
      role: true,
      stage: true,
    },
  });

  return (
    <PracticeCoach
      opportunities={opportunities}
      initialMode={mode}
      initialOpportunityId={opportunityId}
    />
  );
}
