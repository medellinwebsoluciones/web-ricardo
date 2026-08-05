import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import {
  cancelMeetEvent,
  rescheduleMeetEvent,
  isGoogleConfigured,
} from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH acepta:
 *  { action: "cancel" }                    -> cancela en Google + marca cancelled
 *  { action: "complete" }                  -> marca completed
 *  { action: "reschedule", startIso }      -> mueve el evento y la cita
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const action = body?.action;

  const appt = await prisma.appointment.findUnique({ where: { id } });
  if (!appt) return Response.json({ error: "not_found" }, { status: 404 });

  if (action === "complete") {
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: "completed" },
    });
    return Response.json({ appointment: updated });
  }

  if (action === "cancel") {
    let googleWarning: string | null = null;
    if (appt.googleEventId && isGoogleConfigured()) {
      try {
        await cancelMeetEvent(appt.googleEventId);
      } catch (err) {
        googleWarning =
          err instanceof Error ? err.message : "google_cancel_failed";
      }
    }
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: "cancelled" },
    });
    return Response.json({ appointment: updated, googleWarning });
  }

  if (action === "reschedule") {
    const startIso = String(body?.startIso || "");
    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) {
      return Response.json({ error: "invalid_date" }, { status: 400 });
    }
    const end = new Date(start.getTime() + appt.durationMin * 60 * 1000);

    let googleWarning: string | null = null;
    if (appt.googleEventId && isGoogleConfigured()) {
      try {
        await rescheduleMeetEvent(
          appt.googleEventId,
          start.toISOString(),
          end.toISOString(),
        );
      } catch (err) {
        googleWarning =
          err instanceof Error ? err.message : "google_reschedule_failed";
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      // Sin enlace de Meet la cita sigue pendiente de confirmar a mano.
      data: {
        scheduledAt: start,
        status: appt.meetLink ? "confirmed" : "pending",
      },
    });
    return Response.json({ appointment: updated, googleWarning });
  }

  return Response.json({ error: "unknown_action" }, { status: 400 });
}
