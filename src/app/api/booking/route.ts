import { NextRequest } from "next/server";
import { z } from "zod";
import { format, toZonedTime } from "date-fns-tz";
import { enUS, es } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { getAvailability } from "@/lib/booking";
import {
  createMeetEvent,
  isGoogleConfigured,
  type CreatedMeetEvent,
} from "@/lib/google-calendar";
import {
  sendMail,
  bookingConfirmationHtml,
  bookingRequestHtml,
} from "@/lib/mailer";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  topic: z.string().max(500).optional().or(z.literal("")),
  startIso: z.string().datetime(),
  locale: z.enum(["es", "en"]).default("es"),
  website: z.string().optional(), // honeypot
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`booking:${ip}`, 6, 10 * 60 * 1000);
  if (!limit.ok) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot anti-spam
  if (data.website && data.website.trim() !== "") {
    return Response.json({ ok: true }); // fingir exito para bots
  }

  // Validar que el slot sigue disponible
  const dateStr = data.startIso.slice(0, 10);
  const zonedDate = format(
    toZonedTime(new Date(data.startIso), site.timezone),
    "yyyy-MM-dd",
    { timeZone: site.timezone },
  );
  const slots = await getAvailability(zonedDate || dateStr);
  const slot = slots.find((s) => s.startIso === data.startIso);
  if (!slot) {
    return Response.json({ error: "slot_taken" }, { status: 409 });
  }

  const en = data.locale === "en";
  const summary = en
    ? `Technical call · ${data.name} × Ricardo Zuluaga`
    : `Llamada técnica · ${data.name} × Ricardo Zuluaga`;
  const description = [
    en ? "15-min technical consulting call." : "Llamada técnica de consultoría (15 min).",
    data.topic ? `${en ? "Topic" : "Tema"}: ${data.topic}` : "",
    `${en ? "Booked from" : "Agendado desde"}: ${site.url}`,
  ]
    .filter(Boolean)
    .join("\n");

  const whenHuman = format(
    toZonedTime(new Date(slot.startIso), site.timezone),
    "PPPP p '(GMT-5)'",
    { timeZone: site.timezone, locale: en ? enUS : es },
  );

  // El Meet es un extra, no un requisito: si Google no está configurado o
  // falla, la cita se guarda igual como "pending" y Ricardo envía la
  // invitación a mano. Perder el lead nunca es una opción aceptable.
  let meet: CreatedMeetEvent | null = null;
  if (isGoogleConfigured()) {
    try {
      meet = await createMeetEvent({
        summary,
        description,
        startIso: slot.startIso,
        endIso: slot.endIso,
        attendeeEmail: data.email,
        attendeeName: data.name,
      });
    } catch (err) {
      console.error("createMeetEvent error:", err);
    }
  } else {
    console.warn("Google Calendar no configurado; cita guardada como pending");
  }

  const confirmed = Boolean(meet);

  let appointment;
  try {
    appointment = await prisma.appointment.create({
      data: {
        name: data.name,
        email: data.email,
        topic: data.topic || null,
        scheduledAt: new Date(slot.startIso),
        durationMin: 15,
        timezone: site.timezone,
        locale: data.locale,
        status: confirmed ? "confirmed" : "pending",
        googleEventId: meet?.eventId || null,
        meetLink: meet?.meetLink ?? null,
      },
    });
  } catch (err) {
    console.error("appointment create error:", err);
    return Response.json({ error: "storage_error" }, { status: 500 });
  }

  // Registrar lead (nunca debe tumbar la cita ya guardada)
  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        message: confirmed
          ? data.topic || null
          : [
              data.topic,
              `Cita solicitada para ${whenHuman}: falta enviar la invitación de Meet manualmente.`,
            ]
              .filter(Boolean)
              .join("\n\n"),
        source: "booking",
        locale: data.locale,
      },
    });
  } catch (err) {
    console.error("lead create error:", err);
  }

  // Email al visitante (con copia a Ricardo). Si SMTP no está configurado
  // sendMail solo avisa por log y devuelve false.
  await sendMail({
    to: data.email,
    cc: site.email,
    subject: confirmed
      ? en
        ? "Your technical call with Ricardo Zuluaga is confirmed"
        : "Tu llamada técnica con Ricardo Zuluaga está confirmada"
      : en
        ? "We received your technical call request"
        : "Recibimos tu solicitud de llamada técnica",
    html: confirmed
      ? bookingConfirmationHtml({
          name: data.name,
          whenHuman,
          meetLink: meet?.meetLink ?? null,
          locale: data.locale,
          topic: data.topic || undefined,
        })
      : bookingRequestHtml({
          name: data.name,
          whenHuman,
          locale: data.locale,
          topic: data.topic || undefined,
        }),
    replyTo: data.email,
  });

  return Response.json({
    ok: true,
    id: appointment.id,
    status: appointment.status,
    pending: !confirmed,
    meetLink: meet?.meetLink ?? null,
    whenHuman,
  });
}
