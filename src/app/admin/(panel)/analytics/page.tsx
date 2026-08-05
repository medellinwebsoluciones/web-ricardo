import { Suspense } from "react";
import { getPageAnalytics } from "@/lib/metrics";
import { AnalyticsBoard } from "@/components/admin/AnalyticsBoard";

export const dynamic = "force-dynamic";

const ALLOWED_RANGES = [7, 14, 30, 90];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days } = await searchParams;
  const parsed = Number(days);
  const range = ALLOWED_RANGES.includes(parsed) ? parsed : 14;
  const data = await getPageAnalytics(range);

  return (
    <Suspense>
      <AnalyticsBoard data={data} />
    </Suspense>
  );
}
