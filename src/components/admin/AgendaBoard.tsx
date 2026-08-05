"use client";

import { useMemo, useState } from "react";
import {
  Video,
  Download,
  Loader2,
  CalendarClock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PageHeader,
  Panel,
  Empty,
  Tag,
  Stat,
  ADMIN_TZ,
  dayKey,
  fmtDateTime,
  type Tone,
} from "./ui";

export type AppointmentRow = {
  id: string;
  name: string;
  email: string;
  topic: string | null;
  scheduledAt: string;
  durationMin: number;
  timezone: string;
  locale: string;
  status: string;
  meetLink: string | null;
  googleEventId: string | null;
  createdAt: string;
};

const STATUS_TONE: Record<string, Tone> = {
  confirmed: "emerald",
  cancelled: "red",
  completed: "neutral",
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ADMIN_TZ,
  });
}

function fmtEs(iso: string) {
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });
}

/**
 * El calendario trabaja con claves YYYY-MM-DD en la zona del panel, no con
 * objetos Date locales: así la rejilla es idéntica en servidor y navegador.
 */
function shiftDayKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

function weekStartKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  const weekday = (utc.getUTCDay() + 6) % 7; // lunes = 0
  return shiftDayKey(key, -weekday);
}

function labelForKey(key: string, opts: Intl.DateTimeFormatOptions): string {
  return new Date(`${key}T12:00:00Z`).toLocaleDateString("es-CO", {
    ...opts,
    timeZone: "UTC",
  });
}

export function AgendaBoard({
  initial,
  googleConfigured,
}: {
  initial: AppointmentRow[];
  googleConfigured: boolean;
}) {
  const [appts, setAppts] = useState(initial);
  const [weekStart, setWeekStart] = useState(() =>
    weekStartKey(dayKey(new Date())),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [newDate, setNewDate] = useState("");

  const selected = appts.find((a) => a.id === selectedId) || null;

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => shiftDayKey(weekStart, i)),
    [weekStart],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, AppointmentRow[]>();
    for (const a of appts) {
      const key = dayKey(a.scheduledAt);
      const list = map.get(key) || [];
      list.push(a);
      map.set(key, list);
    }
    for (const list of map.values()) {
      list.sort((x, y) => x.scheduledAt.localeCompare(y.scheduledAt));
    }
    return map;
  }, [appts]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return appts
      .filter(
        (a) => a.status === "confirmed" && new Date(a.scheduledAt).getTime() >= now,
      )
      .sort((x, y) => x.scheduledAt.localeCompare(y.scheduledAt));
  }, [appts]);

  const stats = useMemo(
    () => ({
      total: appts.length,
      confirmed: appts.filter((a) => a.status === "confirmed").length,
      cancelled: appts.filter((a) => a.status === "cancelled").length,
      completed: appts.filter((a) => a.status === "completed").length,
    }),
    [appts],
  );

  async function act(id: string, payload: Record<string, unknown>) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setAppts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data.appointment } : a)),
      );
      if (data.googleWarning) {
        setMessage(`Guardado, pero Google avisó: ${data.googleWarning}`);
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Agenda de Meets"
        subtitle={
          googleConfigured
            ? "Sincronizada con Google Calendar"
            : "Google Calendar no configurado: los cambios solo afectan la base local"
        }
        actions={
          <a
            href="/api/admin/export?type=appointments"
            className="btn-secondary px-3 py-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" /> Exportar CSV
          </a>
        }
      />

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={CalendarClock} label="Total citas" value={stats.total} />
          <Stat label="Confirmadas" value={stats.confirmed} />
          <Stat label="Completadas" value={stats.completed} />
          <Stat label="Canceladas" value={stats.cancelled} />
        </div>

        {message && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            {message}
          </p>
        )}

        {/* Vista semana */}
        <Panel
          title={`Semana del ${labelForKey(weekStart, { day: "2-digit", month: "long" })}`}
          actions={
            <div className="flex items-center gap-1">
              <button
                onClick={() => setWeekStart(shiftDayKey(weekStart, -7))}
                className="rounded border border-zinc-800 p-1 text-zinc-400 hover:text-white"
                aria-label="Semana anterior"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setWeekStart(weekStartKey(dayKey(new Date())))}
                className="rounded border border-zinc-800 px-2 py-1 text-[11px] text-zinc-400 hover:text-white"
              >
                Hoy
              </button>
              <button
                onClick={() => setWeekStart(shiftDayKey(weekStart, 7))}
                className="rounded border border-zinc-800 p-1 text-zinc-400 hover:text-white"
                aria-label="Semana siguiente"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weekDays.map((key) => {
              const list = byDay.get(key) || [];
              const isToday = key === dayKey(new Date());
              return (
                <div
                  key={key}
                  className={`min-h-24 rounded-lg border p-2 ${
                    isToday
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900/30"
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    {labelForKey(key, { weekday: "short", day: "numeric" })}
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {list.length === 0 && (
                      <p className="text-[10px] text-zinc-600">—</p>
                    )}
                    {list.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelectedId(a.id)}
                        className={`block w-full truncate rounded px-1.5 py-1 text-left text-[11px] transition-colors ${
                          a.status === "cancelled"
                            ? "bg-zinc-800/50 text-zinc-500 line-through"
                            : "bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                        }`}
                      >
                        {fmtTime(a.scheduledAt)} {a.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <Panel title="Próximas citas confirmadas">
            <div className="space-y-3">
              {upcoming.length === 0 && <Empty>Sin citas próximas.</Empty>}
              {upcoming.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0"
                >
                  <button
                    onClick={() => setSelectedId(a.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-sm font-medium text-white">
                      {a.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">{a.email}</p>
                    <p className="text-xs text-zinc-500">
                      {fmtDateTime(a.scheduledAt)} · {fmtTime(a.scheduledAt)} CO /{" "}
                      {fmtEs(a.scheduledAt)} ES
                    </p>
                  </button>
                  {a.meetLink && (
                    <a
                      href={a.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary shrink-0 px-3 py-1.5 text-xs"
                    >
                      <Video className="h-3.5 w-3.5" /> Meet
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <div>
            {!selected ? (
              <Panel title="Detalle de cita">
                <Empty>Selecciona una cita del calendario.</Empty>
              </Panel>
            ) : (
              <Panel
                title={selected.name}
                actions={
                  <div className="flex items-center gap-2">
                    {busy && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
                    )}
                    <Tag tone={STATUS_TONE[selected.status] || "neutral"}>
                      {selected.status}
                    </Tag>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="space-y-1 text-xs text-zinc-400">
                    <p>{selected.email}</p>
                    {selected.topic && <p>Tema: {selected.topic}</p>}
                    <p>{fmtDateTime(selected.scheduledAt)}</p>
                    <p className="text-zinc-500">
                      {selected.durationMin} min · {selected.timezone} ·{" "}
                      {selected.locale}
                    </p>
                  </div>

                  {selected.meetLink && (
                    <a
                      href={selected.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full py-2 text-xs"
                    >
                      <Video className="h-3.5 w-3.5" /> Abrir Google Meet
                    </a>
                  )}

                  <div className="space-y-2">
                    <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                      Reprogramar
                    </span>
                    <input
                      type="datetime-local"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                    <button
                      onClick={() =>
                        newDate &&
                        act(selected.id, {
                          action: "reschedule",
                          startIso: new Date(newDate).toISOString(),
                        })
                      }
                      disabled={busy || !newDate}
                      className="btn-secondary w-full py-2 text-xs"
                    >
                      <CalendarClock className="h-3.5 w-3.5" /> Mover cita
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => act(selected.id, { action: "complete" })}
                      disabled={busy || selected.status === "completed"}
                      className="btn-secondary py-2 text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completada
                    </button>
                    <button
                      onClick={() =>
                        confirm("¿Cancelar la cita y avisar al invitado?") &&
                        act(selected.id, { action: "cancel" })
                      }
                      disabled={busy || selected.status === "cancelled"}
                      className="btn-secondary py-2 text-xs text-red-300 hover:border-red-500/40"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Cancelar
                    </button>
                  </div>
                </div>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
