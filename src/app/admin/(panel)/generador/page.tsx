import { prisma } from "@/lib/prisma";
import { Generator, type AssetRow } from "@/components/admin/Generator";

export const dynamic = "force-dynamic";

export default async function GeneradorPage({
  searchParams,
}: {
  searchParams: Promise<{ opportunityId?: string; assetId?: string }>;
}) {
  const { opportunityId, assetId } = await searchParams;

  const [opportunities, assets] = await Promise.all([
    prisma.opportunity.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: {
        id: true,
        company: true,
        role: true,
        type: true,
        jobDescription: true,
        matchScore: true,
      },
    }),
    prisma.generatedAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const rows: AssetRow[] = assets.map((a) => ({
    id: a.id,
    opportunityId: a.opportunityId,
    kind: a.kind,
    locale: a.locale,
    title: a.title,
    content: a.content,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <Generator
      opportunities={opportunities}
      assets={rows}
      preselectedOpportunityId={opportunityId}
      preselectedAssetId={assetId}
      openaiConfigured={Boolean(process.env.OPENAI_API_KEY)}
    />
  );
}
