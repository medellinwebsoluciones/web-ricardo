import type OpenAI from "openai";
import { format, toZonedTime } from "date-fns-tz";
import { enUS, es } from "date-fns/locale";
import { prisma } from "./prisma";
import { getAvailability, SLOT_TEMPLATE } from "./booking";
import { searchChunks, formatRagContext } from "./rag";
import type { TurnAnalysis } from "./conversation-analyst";
import {
  createMeetEvent,
  isGoogleConfigured,
  type CreatedMeetEvent,
} from "./google-calendar";
import {
  sendMail,
  bookingConfirmationHtml,
  bookingRequestHtml,
} from "./mailer";
import { site } from "./site";

export const CONTACT_INTENTS = [
  "empleo",
  "proyecto",
  "consulta",
  "otro",
] as const;
export type ContactIntent = (typeof CONTACT_INTENTS)[number];

/**
 * Herramientas del agente público: conocimiento, lead completo y agenda real.
 */

export const AGENT_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "buscar_conocimiento",
      description:
        "Busca en la base de conocimiento de Ricardo. Úsala cuando el contexto que ya tienes no cubra lo que te preguntan, antes de decir que no lo sabes.",
      parameters: {
        type: "object",
        properties: {
          consulta: {
            type: "string",
            description:
              "Qué buscar, con las palabras del corpus, no las del visitante.",
          },
        },
        required: ["consulta"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "capturar_contacto",
      description:
        "Registra al visitante para que Ricardo pueda contactarle. REQUIERE nombre, email, teléfono e intención. No la llames con datos incompletos: pide lo que falte primero.",
      parameters: {
        type: "object",
        properties: {
          nombre: { type: "string", description: "Nombre completo." },
          email: { type: "string", description: "Email del visitante." },
          telefono: {
            type: "string",
            description: "Teléfono con indicativo si es posible.",
          },
          intencion: {
            type: "string",
            enum: [...CONTACT_INTENTS],
            description:
              "empleo | proyecto | consulta | otro — calificación del contacto.",
          },
          empresa: { type: "string" },
          cargo: { type: "string" },
          necesidad: {
            type: "string",
            description: "En una frase, qué necesita, con sus palabras.",
          },
        },
        required: ["nombre", "email", "telefono", "intencion"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "proponer_agenda",
      description:
        "Devuelve huecos reales variados (mañana y tarde) para la llamada técnica de 15 minutos. Úsala cuando quieran agendar.",
      parameters: {
        type: "object",
        properties: {
          motivo: {
            type: "string",
            description: "Qué quiere resolver en la llamada.",
          },
          preferencia: {
            type: "string",
            enum: ["manana", "tarde", "cualquiera"],
            description: "Preferencia horaria del visitante.",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "confirmar_cita",
      description:
        "Confirma y guarda una cita real en un hueco concreto. REQUIERE nombre, email, teléfono, fecha (YYYY-MM-DD), hora (HH:MM en Colombia del template) y motivo. Solo tras haber propuesto huecos y que el visitante elija uno.",
      parameters: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          email: { type: "string" },
          telefono: { type: "string" },
          fecha: {
            type: "string",
            description: "Fecha YYYY-MM-DD del hueco elegido.",
          },
          hora: {
            type: "string",
            description: "Hora de inicio Colombia HH:MM (ej. 15:00).",
          },
          motivo: { type: "string" },
          intencion: {
            type: "string",
            enum: [...CONTACT_INTENTS],
          },
        },
        required: ["nombre", "email", "telefono", "fecha", "hora", "motivo"],
        additionalProperties: false,
      },
    },
  },
];

export type ToolContext = {
  locale: string;
  sessionId?: string;
  analysis: TurnAnalysis;
  onRetrieval?: (chunks: Awaited<ReturnType<typeof searchChunks>>) => void;
};

function isContactIntent(v: unknown): v is ContactIntent {
  return (
    typeof v === "string" &&
    (CONTACT_INTENTS as readonly string[]).includes(v)
  );
}

function normalizePhone(raw: string): string | null {
  const t = raw.trim();
  if (t.length < 7) return null;
  const digits = t.replace(/\D/g, "");
  if (digits.length < 7) return null;
  return t.slice(0, 40);
}

async function toolBuscarConocimiento(
  args: { consulta?: string },
  ctx: ToolContext,
): Promise<string> {
  const consulta = (args.consulta || "").trim();
  if (!consulta) return "Consulta vacía.";

  const chunks = await searchChunks(consulta, {
    k: 4,
    publicOnly: true,
    lang: ctx.locale,
    multiQuery: false,
  });
  ctx.onRetrieval?.(chunks);

  if (!chunks.length) {
    return "Sin resultados en el corpus. No inventes: dilo y ofrece la llamada técnica.";
  }
  return formatRagContext(chunks);
}

async function toolCapturarContacto(
  args: {
    email?: string;
    nombre?: string;
    telefono?: string;
    intencion?: string;
    empresa?: string;
    cargo?: string;
    necesidad?: string;
  },
  ctx: ToolContext,
): Promise<string> {
  const facts = ctx.analysis.extracted;
  const nombre = (args.nombre || facts.name || "").trim();
  const email = (args.email || "").trim().toLowerCase();
  const telefono = normalizePhone(args.telefono || facts.phone || "");
  const intencion = isContactIntent(args.intencion)
    ? args.intencion
    : isContactIntent(facts.intent)
      ? facts.intent
      : null;

  const missing: string[] = [];
  if (nombre.length < 2) missing.push("nombre");
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) missing.push("email válido");
  if (!telefono) missing.push("teléfono");
  if (!intencion) missing.push("intención (empleo, proyecto, consulta u otro)");
  if (missing.length) {
    return `Faltan datos imprescindibles: ${missing.join(", ")}. Pídeselos en un solo mensaje, con naturalidad, antes de volver a llamar esta herramienta.`;
  }

  const company = (args.empresa || facts.company || "").trim() || null;
  const role = (args.cargo || facts.role || "").trim() || null;
  const need = (args.necesidad || facts.need || "").trim() || null;

  const tags = [
    `audiencia:${ctx.analysis.audience}`,
    `intent:${intencion}`,
  ];
  if (ctx.analysis.urgency === "alta") tags.push("urgente");

  const summary = [
    `Intención: ${intencion}`,
    need && `Necesidad: ${need}`,
    ctx.analysis.objections.length &&
      `Objeciones: ${ctx.analysis.objections.join("; ")}`,
    facts.timeline && `Plazo: ${facts.timeline}`,
    facts.budgetSignal && `Presupuesto: ${facts.budgetSignal}`,
  ]
    .filter(Boolean)
    .join(". ");

  try {
    const existing = await prisma.lead.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    const lead = existing
      ? await prisma.lead.update({
          where: { id: existing.id },
          data: {
            name: nombre,
            phone: telefono,
            company: company ?? existing.company,
            role: role ?? existing.role,
            message: need ?? existing.message,
            aiSummary: summary || existing.aiSummary,
            tags: [...new Set([...existing.tags, ...tags])],
          },
        })
      : await prisma.lead.create({
          data: {
            name: nombre,
            email,
            phone: telefono,
            company,
            role,
            message: need,
            aiSummary: summary || null,
            source: "chat",
            locale: ctx.locale,
            temperature:
              ctx.analysis.urgency === "alta"
                ? "alta"
                : ctx.analysis.urgency === "media"
                  ? "media"
                  : "baja",
            tags,
          },
        });

    if (ctx.sessionId) {
      await prisma.chatSession.update({
        where: { id: ctx.sessionId },
        data: { leadId: lead.id },
      });
    }

    return `Contacto guardado (${email}, tel. ${telefono}, intent:${intencion}). Confirma al visitante que Ricardo le escribe, en una frase, sin repetir todos sus datos.`;
  } catch (err) {
    console.error("capturar_contacto:", err);
    return "No se pudo guardar. Ofrece el email de contacto del sitio como alternativa.";
  }
}

function isMorning(label: string): boolean {
  const m = label.match(/^(\d{2}):/);
  if (!m) return true;
  return Number(m[1]) < 12;
}

async function toolProponerAgenda(args: {
  motivo?: string;
  preferencia?: string;
}): Promise<string> {
  const pref = args.preferencia || "cualquiera";
  const picks: { dateStr: string; label: string; startIso: string }[] = [];
  const today = new Date();
  // Rotar el día de arranque para no repetir siempre el mismo patrón.
  const dayOffset = (today.getUTCDate() % 3) + 1;

  for (let i = dayOffset; i <= dayOffset + 12 && picks.length < 6; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    if (day.getDay() === 0) continue;
    const dateStr = format(toZonedTime(day, site.timezone), "yyyy-MM-dd", {
      timeZone: site.timezone,
    });
    try {
      const available = await getAvailability(dateStr);
      if (!available.length) continue;

      const morning = available.filter((s) => isMorning(s.label));
      const afternoon = available.filter((s) => !isMorning(s.label));

      const choose = (list: typeof available, n: number) => {
        if (!list.length) return;
        const start = (dateStr.charCodeAt(8) + picks.length) % list.length;
        for (let k = 0; k < n && k < list.length; k++) {
          const slot = list[(start + k) % list.length]!;
          if (picks.some((p) => p.startIso === slot.startIso)) continue;
          picks.push({
            dateStr,
            label: slot.label,
            startIso: slot.startIso,
          });
        }
      };

      if (pref === "manana") {
        choose(morning, 1);
      } else if (pref === "tarde") {
        choose(afternoon.length ? afternoon : morning, 1);
      } else {
        choose(morning, 1);
        choose(afternoon, 1);
      }
    } catch {
      // continue
    }
  }

  if (!picks.length) {
    return "No hay disponibilidad publicada ahora mismo. Invita a usar el panel de agenda del sitio o deja nombre, email y teléfono para coordinar a mano.";
  }

  const lines = picks.map(
    (p) =>
      `${p.dateStr} — ${p.label} (startIso=${p.startIso}; hora CO=${p.label.slice(0, 5)})`,
  );
  const motivo = args.motivo?.trim()
    ? `\nMotivo anotado: ${args.motivo.trim()}`
    : "";

  return `Huecos disponibles (zona Colombia · España). Ofrece 2–3 variados (mezcla mañana/tarde si puedes), no la lista entera.${motivo}\n${lines.join(
    "\n",
  )}\n\nCuando el visitante elija uno y ya tengas nombre+email+teléfono, llama confirmar_cita con fecha YYYY-MM-DD y hora HH:MM de Colombia.`;
}

async function toolConfirmarCita(
  args: {
    nombre?: string;
    email?: string;
    telefono?: string;
    fecha?: string;
    hora?: string;
    motivo?: string;
    intencion?: string;
  },
  ctx: ToolContext,
): Promise<string> {
  const nombre = (args.nombre || "").trim();
  const email = (args.email || "").trim().toLowerCase();
  const telefono = normalizePhone(args.telefono || "");
  const fecha = (args.fecha || "").trim();
  const hora = (args.hora || "").trim().slice(0, 5);
  const motivo = (args.motivo || "").trim();
  const intencion = isContactIntent(args.intencion) ? args.intencion : "consulta";

  const missing: string[] = [];
  if (nombre.length < 2) missing.push("nombre");
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) missing.push("email");
  if (!telefono) missing.push("teléfono");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) missing.push("fecha YYYY-MM-DD");
  if (!/^\d{2}:\d{2}$/.test(hora)) missing.push("hora HH:MM");
  if (motivo.length < 2) missing.push("motivo");
  if (missing.length) {
    return `No se puede confirmar: falta ${missing.join(", ")}. Pídelo y reintenta.`;
  }

  if (!SLOT_TEMPLATE.some((s) => s.start === hora)) {
    return `Hora ${hora} no está en la plantilla de citas. Usa una hora de los huecos propuestos.`;
  }

  const available = await getAvailability(fecha);
  const slot = available.find((s) => s.label.startsWith(hora));
  if (!slot) {
    return `Ese hueco (${fecha} ${hora} CO) ya no está libre. Llama proponer_agenda otra vez y ofrece alternativas.`;
  }

  const locale = ctx.locale === "en" ? "en" : "es";
  const en = locale === "en";
  const summary = en
    ? `Technical call · ${nombre} × Ricardo Zuluaga`
    : `Llamada técnica · ${nombre} × Ricardo Zuluaga`;
  const description = [
    en
      ? "15-min technical consulting call (from chat)."
      : "Llamada técnica de consultoría (15 min, desde el chat).",
    `Tema: ${motivo}`,
    `Tel: ${telefono}`,
    `Agendado desde: ${site.url}`,
  ].join("\n");

  const whenHuman = format(
    toZonedTime(new Date(slot.startIso), site.timezone),
    "PPPP p '(GMT-5)'",
    { timeZone: site.timezone, locale: en ? enUS : es },
  );

  let meet: CreatedMeetEvent | null = null;
  if (isGoogleConfigured()) {
    try {
      meet = await createMeetEvent({
        summary,
        description,
        startIso: slot.startIso,
        endIso: slot.endIso,
        attendeeEmail: email,
        attendeeName: nombre,
      });
    } catch (err) {
      console.error("confirmar_cita meet:", err);
    }
  }

  const confirmed = Boolean(meet);

  try {
    await prisma.appointment.create({
      data: {
        name: nombre,
        email,
        topic: motivo,
        scheduledAt: new Date(slot.startIso),
        durationMin: 15,
        timezone: site.timezone,
        locale,
        status: confirmed ? "confirmed" : "pending",
        googleEventId: meet?.eventId || null,
        meetLink: meet?.meetLink ?? null,
      },
    });
  } catch (err) {
    console.error("confirmar_cita appointment:", err);
    return "No se pudo guardar la cita. Ofrece el panel de agenda del sitio.";
  }

  const tags = [`intent:${intencion}`, "via:chat_confirm"];
  try {
    const existing = await prisma.lead.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
    if (existing) {
      await prisma.lead.update({
        where: { id: existing.id },
        data: {
          name: nombre,
          phone: telefono,
          message: motivo,
          source: existing.source === "chat" ? "chat" : "booking",
          aiSummary: `Cita ${fecha} ${hora} CO. ${motivo}`,
          tags: [...new Set([...existing.tags, ...tags])],
        },
      });
      if (ctx.sessionId) {
        await prisma.chatSession.update({
          where: { id: ctx.sessionId },
          data: { leadId: existing.id },
        });
      }
    } else {
      const lead = await prisma.lead.create({
        data: {
          name: nombre,
          email,
          phone: telefono,
          message: motivo,
          source: "booking",
          locale,
          aiSummary: `Cita ${fecha} ${hora} CO. ${motivo}`,
          tags,
        },
      });
      if (ctx.sessionId) {
        await prisma.chatSession.update({
          where: { id: ctx.sessionId },
          data: { leadId: lead.id },
        });
      }
    }
  } catch (err) {
    console.error("confirmar_cita lead:", err);
  }

  await sendMail({
    to: email,
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
          name: nombre,
          whenHuman,
          meetLink: meet?.meetLink ?? null,
          locale,
          topic: motivo,
        })
      : bookingRequestHtml({
          name: nombre,
          whenHuman,
          locale,
          topic: motivo,
        }),
    replyTo: email,
  });

  if (confirmed && meet?.meetLink) {
    return `Cita confirmada: ${whenHuman}. Meet: ${meet.meetLink}. Confírmalo al visitante en una frase e incluye el enlace.`;
  }
  return `Cita registrada como pendiente: ${whenHuman}. Ricardo enviará la invitación de Meet a mano. Confírmalo al visitante sin inventar un enlace.`;
}

export async function runAgentTool(
  name: string,
  rawArgs: string,
  ctx: ToolContext,
): Promise<string> {
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(rawArgs || "{}");
  } catch {
    return "Argumentos ilegibles.";
  }

  switch (name) {
    case "buscar_conocimiento":
      return toolBuscarConocimiento(args as { consulta?: string }, ctx);
    case "capturar_contacto":
      return toolCapturarContacto(args, ctx);
    case "proponer_agenda":
      return toolProponerAgenda(
        args as { motivo?: string; preferencia?: string },
      );
    case "confirmar_cita":
      return toolConfirmarCita(args, ctx);
    default:
      return `Herramienta desconocida: ${name}`;
  }
}
