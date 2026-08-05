import { NextRequest } from "next/server";
import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import { searchChunks, formatRagContext } from "@/lib/rag";
import { buildSystemPrompt } from "@/lib/persona";
import { prisma } from "@/lib/prisma";
import { logUsage } from "@/lib/usage";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import { isLocale, defaultLocale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_CHARS = 1200;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

type IncomingMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`chat:${ip}`, 20, 5 * 60 * 1000);
  if (!limit.ok) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "not_configured" }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }

  let body: {
    message?: string;
    sessionId?: string;
    locale?: string;
    history?: IncomingMessage[];
  };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
    });
  }

  const message = (body.message || "").trim();
  const locale = isLocale(body.locale || "") ? body.locale! : defaultLocale;
  if (!message || message.length > MAX_MESSAGE_CHARS) {
    return new Response(JSON.stringify({ error: "invalid_message" }), {
      status: 400,
    });
  }

  const history = (body.history || []).slice(-8);

  // --- RAG retrieval ---
  let ragContext = "";
  try {
    const chunks = await searchChunks(message, { k: 5, publicOnly: true });
    ragContext = formatRagContext(chunks.filter((c) => c.similarity > 0.15));
  } catch (err) {
    console.error("RAG error:", err);
  }

  const systemPrompt = buildSystemPrompt(locale as "es" | "en", ragContext);

  // --- Session persistence ---
  let sessionId = body.sessionId;
  try {
    if (sessionId) {
      const existing = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      });
      if (!existing) sessionId = undefined;
    }
    if (!sessionId) {
      const created = await prisma.chatSession.create({
        data: { locale, visitorId: req.cookies.get("rz_vid")?.value ?? null },
      });
      sessionId = created.id;
    } else {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { lastSeenAt: new Date() },
      });
    }
    await prisma.chatMessage.create({
      data: { sessionId, role: "user", content: message },
    });

    // Detectar lead (email en el mensaje)
    const emailMatch = message.match(EMAIL_RE);
    if (emailMatch) {
      await prisma.lead.create({
        data: {
          name: "Chat visitor",
          email: emailMatch[0],
          message: message.slice(0, 500),
          source: "chat",
          locale,
        },
      });
    }
  } catch (err) {
    console.error("Session persist error:", err);
  }

  const openai = getOpenAI();
  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
  ];

  const encoder = new TextEncoder();
  let fullText = "";

  const stream = new ReadableStream({
    async start(controller) {
      // Enviar sessionId primero como linea de metadata JSON
      controller.enqueue(
        encoder.encode(
          `\u0000META${JSON.stringify({ sessionId })}\u0000`,
        ),
      );
      try {
        const completion = await openai.chat.completions.create({
          model: CHAT_MODEL,
          messages,
          temperature: 0.4,
          max_tokens: 600,
          stream: true,
          stream_options: { include_usage: true },
        });

        for await (const part of completion) {
          const delta = part.choices[0]?.delta?.content || "";
          if (delta) {
            fullText += delta;
            controller.enqueue(encoder.encode(delta));
          }
          if (part.usage) {
            await logUsage({
              channel: "chat",
              model: CHAT_MODEL,
              promptTokens: part.usage.prompt_tokens,
              completionTokens: part.usage.completion_tokens,
            });
          }
        }
      } catch (err) {
        console.error("OpenAI stream error:", err);
        controller.enqueue(encoder.encode(""));
      } finally {
        if (sessionId && fullText) {
          try {
            await prisma.chatMessage.create({
              data: { sessionId, role: "assistant", content: fullText },
            });
          } catch {
            /* noop */
          }
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-session-id": sessionId || "",
    },
  });
}
