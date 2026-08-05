import type React from "react";

/**
 * Zona fija para todas las fechas del panel. Sin esto el servidor (UTC en el
 * contenedor) y el navegador (Bogotá) renderizan días distintos y React
 * rompe la hidratación.
 */
export const ADMIN_TZ = "America/Bogota";

/** Clave de día YYYY-MM-DD en la zona del panel. */
export function dayKey(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-CA", { timeZone: ADMIN_TZ });
}

export function fmtDay(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    timeZone: ADMIN_TZ,
  });
}

export function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: ADMIN_TZ,
  });
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-800 px-6 py-5">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon?: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-emerald-400" />}
      </div>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}

export function Panel({
  title,
  actions,
  children,
  className = "",
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const TONES = {
  neutral: "border-zinc-700 text-zinc-300",
  emerald: "border-emerald-500/40 text-emerald-300",
  amber: "border-amber-500/40 text-amber-300",
  red: "border-red-500/40 text-red-300",
  sky: "border-sky-500/40 text-sky-300",
  violet: "border-violet-500/40 text-violet-300",
} as const;

export type Tone = keyof typeof TONES;

export function Tag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-zinc-800 px-4 py-8 text-center text-sm text-zinc-500">
      {children}
    </p>
  );
}

export const LEAD_STATUS_TONE: Record<string, Tone> = {
  nuevo: "sky",
  contactado: "violet",
  calificado: "amber",
  propuesta: "amber",
  ganado: "emerald",
  perdido: "red",
};

export const TEMPERATURE_TONE: Record<string, Tone> = {
  alta: "emerald",
  media: "amber",
  baja: "neutral",
};

export const STAGE_TONE: Record<string, Tone> = {
  guardada: "neutral",
  aplicada: "sky",
  entrevista: "violet",
  oferta: "emerald",
  cerrada: "red",
};
