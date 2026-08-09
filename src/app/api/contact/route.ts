import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail, contactNotificationHtml } from "@/lib/mailer";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(40),
  message: z.string().min(5).max(2000),
  locale: z.enum(["es", "en"]).default("es"),
  website: z.string().optional(), // honeypot
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
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

  // Honeypot: si viene relleno, es bot -> fingir exito
  if (data.website && data.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone.trim(),
      message: data.message,
      source: "contact",
      locale: data.locale,
      tags: ["intent:consulta", "via:form"],
    },
  });

  await sendMail({
    to: process.env.CONTACT_EMAIL || site.email,
    subject: `Nuevo contacto: ${data.name}`,
    html: contactNotificationHtml({
      name: data.name,
      email: data.email,
      phone: data.phone.trim(),
      message: data.message,
    }),
    replyTo: data.email,
  });

  return Response.json({ ok: true });
}
