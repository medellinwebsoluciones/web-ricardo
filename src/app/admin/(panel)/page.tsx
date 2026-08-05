import { Suspense } from "react";
import { getMetrics } from "@/lib/metrics";
import { Overview } from "@/components/admin/Overview";

export const dynamic = "force-dynamic";

const ALLOWED_RANGES = [7, 14, 30, 90];

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days } = await searchParams;
  const parsed = Number(days);
  const range = ALLOWED_RANGES.includes(parsed) ? parsed : 14;
  const metrics = await getMetrics(range);

  return (
    <Suspense>
      <Overview metrics={metrics} />
    </Suspense>
  );
}
