export const site = {
  name: "Ricardo Zuluaga",
  firm: "Medellín Web Soluciones",
  role: "Senior Software Architect / Solutions Architect",
  /** Prefer domain email via CONTACT_EMAIL / NEXT_PUBLIC_CONTACT_EMAIL for recruiter trust. */
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "ricki5789@gmail.com",
  linkedin:
    "https://www.linkedin.com/in/ricardo-luis-zuluaga-salazar-974276103/",
  /**
   * Número de WhatsApp en formato internacional solo dígitos (ej. "573001234567").
   * Override con NEXT_PUBLIC_WHATSAPP_PHONE; por defecto usa el número de Ricardo (CO +57).
   */
  whatsapp: (
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "573053554636"
  ).replace(/[^\d]/g, ""),
  timezone: process.env.BOOKING_TIMEZONE || "America/Bogota",
  displayTimezone: "Europe/Madrid",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
} as const;

/** Enlace wa.me con mensaje pre-cargado. Vacío si no hay número configurado. */
export function whatsappLink(locale: string, text?: string): string {
  if (!site.whatsapp) return "";
  const msg =
    text ??
    (locale === "en"
      ? "Hi Ricardo, I saw your portfolio and I'd like to talk about a project/role."
      : "Hola Ricardo, vi tu portafolio y me gustaría hablar sobre un proyecto/rol.");
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
}

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
