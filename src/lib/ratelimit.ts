/**
 * Rate limiter en memoria (por instancia). Suficiente para un VPS de una sola
 * instancia. Para multi-instancia, migrar a Redis.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

/**
 * IP del cliente detrás de Nginx (X-Real-IP) o el último hop de X-Forwarded-For.
 * Preferimos X-Real-IP porque el ejemplo de nginx lo fija a $remote_addr y no
 * se puede spoofear desde el cliente si el proxy limpia headers entrantes.
 */
export function getClientIp(req: Request | { headers: Headers | Record<string, string | string[] | undefined> }): string {
  const headers = req.headers;
  const get = (name: string): string | null => {
    if (typeof (headers as Headers).get === "function") {
      return (headers as Headers).get(name);
    }
    const raw = (headers as Record<string, string | string[] | undefined>)[name]
      ?? (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()];
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw ?? null;
  };

  const realIp = get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const fwd = get("x-forwarded-for");
  if (fwd) {
    const parts = fwd.split(",").map((p) => p.trim()).filter(Boolean);
    // Último hop = proxy más cercano (el que Nginx añadió).
    if (parts.length > 0) return parts[parts.length - 1]!;
  }

  return "unknown";
}

// Limpieza periódica para evitar fugas de memoria.
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, bucket] of buckets.entries()) {
        if (now > bucket.resetAt) buckets.delete(key);
      }
    },
    5 * 60 * 1000,
  ).unref?.();
}
