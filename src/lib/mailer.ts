import nodemailer from "nodemailer";
import { site } from "./site";

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD,
  );
}

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

const FROM = process.env.SMTP_FROM || `Ricardo Zuluaga <${site.email}>`;

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string;
}): Promise<boolean> {
  if (!isMailConfigured()) {
    console.warn("SMTP no configurado; email omitido:", opts.subject);
    return false;
  }
  try {
    await getTransport().sendMail({
      from: FROM,
      to: opts.to,
      cc: opts.cc,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    });
    return true;
  } catch (err) {
    console.error("Error enviando email:", err);
    return false;
  }
}

export function bookingConfirmationHtml(params: {
  name: string;
  whenHuman: string;
  meetLink: string | null;
  locale: string;
  topic?: string;
}): string {
  const en = params.locale === "en";
  const join = params.meetLink
    ? `<p style="margin:24px 0"><a href="${params.meetLink}" style="background:#10b981;color:#09090b;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">${en ? "Join Google Meet" : "Unirse a Google Meet"}</a></p>`
    : "";
  return `
  <div style="font-family:Inter,Arial,sans-serif;background:#09090b;color:#e4e4e7;padding:32px;border-radius:12px;max-width:520px;margin:auto">
    <h2 style="color:#fff;margin:0 0 8px">${en ? "You're booked — your technical call is confirmed" : "Quedaste agendado — tu llamada técnica está confirmada"}</h2>
    <p style="color:#a1a1aa">${en ? "Hi" : "Hola"} ${params.name},</p>
    <p style="color:#a1a1aa">${en ? "Your 15-minute technical call with Ricardo Zuluaga — no salesperson, no script — is set for:" : "Tu llamada técnica de 15 minutos con Ricardo Zuluaga —sin vendedor, sin script— quedó agendada para:"}</p>
    <p style="color:#fff;font-size:18px;font-weight:600">${params.whenHuman}</p>
    ${params.topic ? `<p style="color:#a1a1aa">${en ? "Topic" : "Tema"}: ${params.topic}</p>` : ""}
    ${join}
    <p style="color:#a1a1aa">${en ? "Come with your architecture or AI automation challenge in mind — we'll get straight into it." : "Llega con tu reto de arquitectura o automatización con IA en mente — entramos directo al tema."}</p>
    <p style="color:#71717a;font-size:12px;margin-top:24px">${en ? "Need to reschedule? Just reply to this email." : "¿Necesitas reprogramar? Solo responde este correo."} · Medellín Web Soluciones · ${site.email}</p>
  </div>`;
}

/**
 * Cita registrada sin enlace de Meet (Google no configurado o caído):
 * confirmamos la recepción sin prometer un enlace que todavía no existe.
 */
export function bookingRequestHtml(params: {
  name: string;
  whenHuman: string;
  locale: string;
  topic?: string;
}): string {
  const en = params.locale === "en";
  return `
  <div style="font-family:Inter,Arial,sans-serif;background:#09090b;color:#e4e4e7;padding:32px;border-radius:12px;max-width:520px;margin:auto">
    <h2 style="color:#fff;margin:0 0 8px">${en ? "Request received — Ricardo will send you the invite" : "Solicitud recibida — Ricardo te enviará la invitación"}</h2>
    <p style="color:#a1a1aa">${en ? "Hi" : "Hola"} ${params.name},</p>
    <p style="color:#a1a1aa">${en ? "Your 15-minute technical call request is registered for:" : "Tu solicitud de llamada técnica de 15 minutos quedó registrada para:"}</p>
    <p style="color:#fff;font-size:18px;font-weight:600">${params.whenHuman}</p>
    ${params.topic ? `<p style="color:#a1a1aa">${en ? "Topic" : "Tema"}: ${params.topic}</p>` : ""}
    <p style="color:#a1a1aa">${en ? "Ricardo will confirm the slot and send you the meeting link by email shortly. If that time no longer works, just reply to this message." : "Ricardo confirmará el horario y te enviará el enlace de la reunión por correo en breve. Si ese horario ya no te sirve, responde este mensaje."}</p>
    <p style="color:#71717a;font-size:12px;margin-top:24px">Medellín Web Soluciones · ${site.email}</p>
  </div>`;
}

export function contactNotificationHtml(params: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;padding:16px">
    <h3>Nuevo mensaje de contacto — responde directo a este correo</h3>
    <p><strong>Nombre:</strong> ${params.name}</p>
    <p><strong>Email:</strong> ${params.email}</p>
    ${params.phone ? `<p><strong>Teléfono:</strong> ${params.phone}</p>` : ""}
    <p><strong>Mensaje:</strong></p>
    <p style="white-space:pre-wrap">${params.message}</p>
  </div>`;
}
