import { fromZonedTime, toZonedTime, format } from "date-fns-tz";
import { prisma } from "./prisma";
import { getBusyIntervals } from "./google-calendar";
import { site } from "./site";

export const SLOT_TEMPLATE: { start: string; end: string }[] = [
  // Solape España: mañana CO ≈ tarde ES (CET/CEST)
  { start: "07:00", end: "07:30" },
  { start: "07:30", end: "08:00" },
  { start: "08:00", end: "08:30" },
  { start: "08:30", end: "09:00" },
  { start: "09:00", end: "09:30" },
  { start: "09:30", end: "10:00" },
  { start: "10:00", end: "10:30" },
  { start: "10:30", end: "11:00" },
  { start: "11:00", end: "11:30" },
  // Tarde Colombia (LatAm / tarde-noche ES)
  { start: "14:00", end: "14:30" },
  { start: "15:00", end: "15:30" },
  { start: "16:00", end: "16:30" },
];

export type AvailableSlot = {
  label: string; // "09:00 CO · 16:00 ES"
  startIso: string; // UTC ISO
  endIso: string; // UTC ISO
};

function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Calcula la disponibilidad real para una fecha (YYYY-MM-DD) en tz Bogota,
 * excluyendo pasado, citas ya agendadas y ocupacion de Google Calendar.
 */
export async function getAvailability(
  dateStr: string,
): Promise<AvailableSlot[]> {
  const tz = site.timezone;

  // Rechazar formato invalido
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return [];

  // Domingo no disponible
  const zonedNoon = toZonedTime(fromZonedTime(`${dateStr}T12:00:00`, tz), tz);
  if (zonedNoon.getDay() === 0) return [];

  const now = Date.now();

  // Ventana del dia en UTC
  const dayStart = fromZonedTime(`${dateStr}T00:00:00`, tz).getTime();
  const dayEnd = fromZonedTime(`${dateStr}T23:59:59`, tz).getTime();

  // Citas existentes (confirmadas)
  const appts = await prisma.appointment.findMany({
    where: {
      status: "confirmed",
      scheduledAt: {
        gte: new Date(dayStart),
        lte: new Date(dayEnd),
      },
    },
  });
  const apptIntervals = appts.map((a) => {
    const s = a.scheduledAt.getTime();
    return { start: s, end: s + a.durationMin * 60 * 1000 };
  });

  // Ocupacion Google Calendar
  let busy: { start: number; end: number }[] = [];
  try {
    const intervals = await getBusyIntervals(
      new Date(dayStart).toISOString(),
      new Date(dayEnd).toISOString(),
    );
    busy = intervals.map((b) => ({
      start: new Date(b.start).getTime(),
      end: new Date(b.end).getTime(),
    }));
  } catch {
    busy = [];
  }

  const taken = [...apptIntervals, ...busy];
  const slots: AvailableSlot[] = [];

  for (const slot of SLOT_TEMPLATE) {
    const startUtc = fromZonedTime(`${dateStr}T${slot.start}:00`, tz);
    const endUtc = fromZonedTime(`${dateStr}T${slot.end}:00`, tz);
    const startMs = startUtc.getTime();
    const endMs = endUtc.getTime();

    if (startMs < now + 60 * 60 * 1000) continue; // margen minimo 1h

    const conflict = taken.some((t) =>
      overlaps(startMs, endMs, t.start, t.end),
    );
    if (conflict) continue;

    slots.push({
      label: `${slot.start} CO · ${format(toZonedTime(startUtc, site.displayTimezone), "HH:mm", { timeZone: site.displayTimezone })} ES`,
      startIso: startUtc.toISOString(),
      endIso: endUtc.toISOString(),
    });
  }

  return slots;
}

export function formatSlotForHuman(iso: string, locale: string): string {
  const tz = site.timezone;
  const zoned = toZonedTime(new Date(iso), tz);
  return format(zoned, "PPP p", { timeZone: tz }) + (locale ? "" : "");
}
