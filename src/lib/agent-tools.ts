import type OpenAI from "openai";
import { prisma } from "./prisma";
import { getAvailability } from "./booking";
import { searchChunks, formatRagContext } from "./rag";
import type { TurnAnalysis } from "./conversation-analyst";

/**
 * Herramientas que el agente puede invocar durante la conversación.
 *
 * Reemplazan el regex de email que creaba leads llamados "Chat visitor": ahora
 * el modelo decide cuándo tiene datos suficientes y los entrega estructurados,
 * así que el lead entra con nombre, empresa y necesidad reales.
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
            description: "Qué buscar, con las palabras del corpus, no las del visitante.",
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
        "Registra los datos del visitante para que Ricardo pueda contactarle. Llámala solo cuando el visitante haya dado su email de forma voluntaria.",
      parameters: {
        type: "object",
        properties: {
          email: { type: "string", description: "Email del visitante." },
          nombre: { type: "string", description: "Nombre si lo ha dicho." },
          empresa: { type: "string", description: "Empresa si la ha dicho." },
          cargo: { type: "string", description: "Cargo o rol si lo ha dicho." },
          necesidad: {
            type: "string",
            description: "En una frase, qué necesita, con sus palabras.",
          },
        },
        required: ["email"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "proponer_agenda",
      description:
        "Devuelve los próximos huecos reales para la llamada técnica de 15 minutos. Úsala cuando el visitante muestre interés en agendar, para dar horarios concretos en vez de mandarle a un formulario.",
      parameters: {
        type: "object",
        properties: {
          motivo: {
            type: "string",
            description: "Qué quiere resolver en la llamada.",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
];

export type ToolContext = {
  locale: string;
  sessionId?: string;
  analysis: TurnAnalysis;
  /** Acumula lo que se recupere para el trazo del turno. */
  onRetrieval?: (chunks: Awaited<ReturnType<typeof searchChunks>>) => void;
};

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
    // Ya venimos de una expansión en el turno: aquí el modelo ya eligió las
    // palabras, reformular otra vez solo añade latencia.
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
    empresa?: string;
    cargo?: string;
    necesidad?: string;
  },
  ctx: ToolContext,
): Promise<string> {
  const email = (args.email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
    return "Email inválido: pídeselo otra vez sin dar por hecho que lo tienes.";
  }

  const facts = ctx.analysis.extracted;
  const name = (args.nombre || facts.name || "").trim() || "Visitante del chat";
  const company = (args.empresa || facts.company || "").trim() || null;
  const role = (args.cargo || facts.role || "").trim() || null;
  const need = (args.necesidad || facts.need || "").trim() || null;

  const tags = [`audiencia:${ctx.analysis.audience}`];
  if (ctx.analysis.urgency === "alta") tags.push("urgente");

  // El resumen sale de la lectura del turno: cuando Ricardo abre el lead ya
  // sabe qué buscaba esta persona sin releer la conversación entera.
  const summary = [
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
            name: name !== "Visitante del chat" ? name : existing.name,
            company: company ?? existing.company,
            role: role ?? existing.role,
            message: need ?? existing.message,
            aiSummary: summary || existing.aiSummary,
            tags: [...new Set([...existing.tags, ...tags])],
          },
        })
      : await prisma.lead.create({
          data: {
            name,
            email,
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

    return `Contacto guardado (${email}). Confirma al visitante que Ricardo le escribe, en una frase, sin repetir sus datos.`;
  } catch (err) {
    console.error("capturar_contacto:", err);
    return "No se pudo guardar. Ofrece el email de contacto del sitio como alternativa.";
  }
}

async function toolProponerAgenda(): Promise<string> {
  const slots: string[] = [];
  const today = new Date();

  for (let i = 1; i <= 10 && slots.length < 5; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    const dateStr = day.toISOString().slice(0, 10);
    try {
      const available = await getAvailability(dateStr);
      for (const slot of available.slice(0, 2)) {
        if (slots.length >= 5) break;
        slots.push(`${dateStr} — ${slot.label}`);
      }
    } catch {
      // Sin Google Calendar configurado seguimos con lo que haya.
    }
  }

  if (!slots.length) {
    return "No hay disponibilidad publicada ahora mismo. Invita a usar el panel de agenda del sitio.";
  }
  return `Huecos disponibles (zona Colombia · España):\n${slots.join(
    "\n",
  )}\n\nOfrece dos o tres, no la lista entera, y dile que confirme en el panel de agenda del sitio.`;
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
      return toolBuscarConocimiento(args, ctx);
    case "capturar_contacto":
      return toolCapturarContacto(args, ctx);
    case "proponer_agenda":
      return toolProponerAgenda();
    default:
      return `Herramienta desconocida: ${name}`;
  }
}
