import { google } from "googleapis";
import { site } from "./site";

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN,
  );
}

export function getOAuthClient() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI ||
      `${site.url}/api/google/callback`,
  );
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }
  return client;
}

function getCalendar() {
  return google.calendar({ version: "v3", auth: getOAuthClient() });
}

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

export type BusyInterval = { start: string; end: string };

/**
 * Devuelve los intervalos ocupados del calendario entre dos fechas (ISO UTC).
 */
export async function getBusyIntervals(
  timeMinIso: string,
  timeMaxIso: string,
): Promise<BusyInterval[]> {
  if (!isGoogleConfigured()) return [];
  const calendar = getCalendar();
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMinIso,
      timeMax: timeMaxIso,
      timeZone: site.timezone,
      items: [{ id: CALENDAR_ID }],
    },
  });
  const busy = res.data.calendars?.[CALENDAR_ID]?.busy ?? [];
  return busy
    .filter((b): b is { start: string; end: string } =>
      Boolean(b.start && b.end),
    )
    .map((b) => ({ start: b.start, end: b.end }));
}

export type CreatedMeetEvent = {
  eventId: string;
  meetLink: string | null;
  htmlLink: string | null;
};

/**
 * Crea un evento en Google Calendar con enlace de Google Meet (conferenceData).
 */
export async function createMeetEvent(params: {
  summary: string;
  description: string;
  startIso: string;
  endIso: string;
  attendeeEmail: string;
  attendeeName?: string;
}): Promise<CreatedMeetEvent> {
  if (!isGoogleConfigured()) {
    throw new Error("google_not_configured");
  }
  const calendar = getCalendar();

  const res = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: { dateTime: params.startIso, timeZone: site.timezone },
      end: { dateTime: params.endIso, timeZone: site.timezone },
      attendees: [
        { email: params.attendeeEmail, displayName: params.attendeeName },
        { email: site.email, organizer: true, responseStatus: "accepted" },
      ],
      conferenceData: {
        createRequest: {
          requestId: `rz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    },
  });

  const event = res.data;
  const meetLink =
    event.hangoutLink ||
    event.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video",
    )?.uri ||
    null;

  return {
    eventId: event.id || "",
    meetLink,
    htmlLink: event.htmlLink || null,
  };
}

/**
 * Cancela el evento en Google Calendar (notifica a los asistentes).
 */
export async function cancelMeetEvent(eventId: string): Promise<void> {
  if (!isGoogleConfigured()) throw new Error("google_not_configured");
  const calendar = getCalendar();
  await calendar.events.delete({
    calendarId: CALENDAR_ID,
    eventId,
    sendUpdates: "all",
  });
}

/**
 * Mueve el evento a una nueva franja, conservando el enlace de Meet.
 */
export async function rescheduleMeetEvent(
  eventId: string,
  startIso: string,
  endIso: string,
): Promise<void> {
  if (!isGoogleConfigured()) throw new Error("google_not_configured");
  const calendar = getCalendar();
  await calendar.events.patch({
    calendarId: CALENDAR_ID,
    eventId,
    sendUpdates: "all",
    requestBody: {
      start: { dateTime: startIso, timeZone: site.timezone },
      end: { dateTime: endIso, timeZone: site.timezone },
    },
  });
}
