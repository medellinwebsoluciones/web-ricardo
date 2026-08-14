export const site = {
  name: "Ricardo Zuluaga",
  firm: "Medellín Web Soluciones",
  role: "Senior Software Architect / Solutions Architect",
  /** Prefer domain email via CONTACT_EMAIL / NEXT_PUBLIC_CONTACT_EMAIL for recruiter trust. */
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "ricki5789@gmail.com",
  /** E.164 sin + para wa.me; display con espacios para humanos. */
  phoneE164: "573053554636",
  phoneDisplay: "+57 305 355 4636",
  linkedin:
    "https://www.linkedin.com/in/ricardo-luis-zuluaga-salazar-974276103/",
  timezone: process.env.BOOKING_TIMEZONE || "America/Bogota",
  displayTimezone: "Europe/Madrid",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
} as const;

/** CV público generado con `npm run cv:pdf` y sincronizado a public/cv. */
export function cvPath(locale: string): string {
  return `/cv/CV-Ricardo-Zuluaga-arquitecto-${locale === "en" ? "en" : "es"}.pdf`;
}

export function mailtoContact(locale: string): string {
  const subject =
    locale === "en"
      ? "Technical inquiry — Medellín Web Soluciones"
      : "Consulta técnica — Medellín Web Soluciones";
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}

/** WhatsApp directo — fricción mínima para convertir visita en contacto real. */
export function whatsappContact(locale: string): string {
  const text =
    locale === "en"
      ? "Hi Ricardo — I saw your portfolio and would like to talk about a senior / architecture role or a technical project."
      : "Hola Ricardo — vi tu portafolio y me gustaría hablar de un rol senior / arquitectura o de un proyecto técnico.";
  return `https://wa.me/${site.phoneE164}?text=${encodeURIComponent(text)}`;
}
