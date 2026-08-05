import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Shell, type PendingCounts } from "@/components/admin/Shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Consola | Ricardo Zuluaga",
  robots: { index: false, follow: false },
};

async function getPending(): Promise<PendingCounts> {
  const now = new Date();
  try {
    const [leads, appointments, overdueLeads, overdueOpps, opportunities] =
      await Promise.all([
        prisma.lead.count({ where: { status: "nuevo" } }),
        prisma.appointment.count({
          where: { scheduledAt: { gte: now }, status: "confirmed" },
        }),
        prisma.lead.count({ where: { nextActionAt: { lt: now } } }),
        prisma.opportunity.count({ where: { nextActionAt: { lt: now } } }),
        prisma.opportunity.count({
          where: { stage: { in: ["aplicada", "entrevista", "oferta"] } },
        }),
      ]);
    return {
      leads,
      appointments,
      overdue: overdueLeads + overdueOpps,
      opportunities,
    };
  } catch {
    return { leads: 0, appointments: 0, overdue: 0, opportunities: 0 };
  }
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const pending = await getPending();

  return (
    <Shell email={session.user?.email || ""} pending={pending}>
      {children}
    </Shell>
  );
}
