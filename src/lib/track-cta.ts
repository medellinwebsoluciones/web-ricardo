/**
 * Registro ligero de clics en CTAs de conversión.
 * Reutiliza /api/track (evento "engagement") con un path sintético /_cta/<name>
 * para no requerir cambios de esquema. Best-effort, nunca bloquea la navegación.
 */
export function trackCta(name: string): void {
  if (typeof window === "undefined") return;
  try {
    const path = `/_cta/${name}`.slice(0, 300);
    const payload = JSON.stringify({
      type: "engagement",
      path,
      locale: document.documentElement.lang || null,
      referrer: window.location.pathname,
      scrollPct: 100,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* no-op */
  }
}
