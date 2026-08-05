import { prisma } from "@/lib/prisma";
import { isGoogleConfigured } from "@/lib/google-calendar";
import {
  AgendaBoard,
  type AppointmentRow,
} from "@/components/admin/AgendaBoard";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const appts = await prisma.appointment.findMany({
    orderBy: { scheduledAt: "desc" },
    take: 300,
  });

  const rows: AppointmentRow[] = appts.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    topic: a.topic,
    scheduledAt: a.scheduledAt.toISOString(),
    durationMin: a.durationMin,
    timezone: a.timezone,
    locale: a.locale,
    status: a.status,
    meetLink: a.meetLink,
    googleEventId: a.googleEventId,
    createdAt: a.createdAt.toISOString(),
  }));

  return <AgendaBoard initial={rows} googleConfigured={isGoogleConfigured()} />;
}
