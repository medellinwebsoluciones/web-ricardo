"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Loader2,
  Search,
  Sparkles,
  Thermometer,
  X,
  Trash2,
} from "lucide-react";
import {
  PageHeader,
  Panel,
  Empty,
  Tag,
  Stat,
  fmtDay,
  LEAD_STATUS_TONE,
  TEMPERATURE_TONE,
} from "./ui";

export type LeadNote = { id: string; body: string; createdAt: string };

const SOURCE_LABEL: Record<string, string> = {
  chat: "Chat",
  contact: "Formulario",
  booking: "Agenda",
};

function sourceLabel(source: string): string {
  return SOURCE_LABEL[source] || source;
}

function intentFromTags(tags: string[]): string | null {
  const t = tags.find((x) => x.startsWith("intent:"));
  return t ? t.slice("intent:".length) : null;
}

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  phone: string | null;
  message: string | null;
  source: string;
  locale: string;
  status: string;
  temperature: string;
  value: number | null;
  nextAction: string | null;
  nextActionAt: string | null;
  lastContactedAt: string | null;
  aiSummary: string | null;
  tags: string[];
  createdAt: string;
  notes: LeadNote[];
};

const STATUSES = [
  "nuevo",
  "contactado",
  "calificado",
  "propuesta",
  "ganado",
  "perdido",
];
const TEMPERATURES = ["alta", "media", "baja"];

export function LeadsBoard({ initialLeads }: { initialLeads: LeadRow[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [temperature, setTemperature] = useState("");
  const [source, setSource] = useState("");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const sources = useMemo(
    () => Array.from(new Set(initialLeads.map((l) => l.source))).sort(),
    [initialLeads],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (status && l.status !== status) return false;
      if (temperature && l.temperature !== temperature) return false;
      if (source && l.source !== source) return false;
      if (needle) {
        const hay = [l.name, l.email, l.company, l.role, l.message]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [leads, status, temperature, source, q]);

  const selected = leads.find((l) => l.id === selectedId) || null;

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {};
    for (const l of leads) byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    const hot = leads.filter((l) => l.temperature === "alta").length;
    const pipelineValue = leads
      .filter((l) => !["ganado", "perdido"].includes(l.status))
      .reduce((sum, l) => sum + (l.value || 0), 0);
    return { byStatus, hot, pipelineValue };
  }, [leads]);

  function replaceLead(updated: LeadRow) {
    setLeads((prev) =>
      prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l)),
    );
  }

  async function patchLead(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      const current = leads.find((l) => l.id === id);
      replaceLead({ ...(current as LeadRow), ...data.lead, notes: current?.notes ?? [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setBusy(false);
    }
  }

  async function addNote(id: string) {
    const text = note.trim();
    if (!text) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}/notes`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, notes: [data.note, ...l.notes] } : l,
        ),
      );
      setNote("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al añadir nota");
    } finally {
      setBusy(false);
    }
  }

  async function profileLead(id: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}/profile`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error === "openai_not_configured"
            ? "Falta OPENAI_API_KEY"
            : data.error || "error",
        );
      }
      const current = leads.find((l) => l.id === id);
      replaceLead({ ...(current as LeadRow), ...data.lead, notes: current?.notes ?? [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al perfilar");
    } finally {
      setBusy(false);
    }
  }

  async function removeLead(id: string) {
    if (!confirm("¿Borrar este lead?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("error");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setSelectedId(null);
    } catch {
      setError("No se pudo borrar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle={`${filtered.length} de ${leads.length} leads`}
        actions={
          <a
            href="/api/admin/export?type=leads"
            className="btn-secondary px-3 py-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" /> Exportar CSV
          </a>
        }
      />

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Total" value={leads.length} />
          <Stat label="Nuevos" value={counts.byStatus["nuevo"] || 0} />
          <Stat icon={Thermometer} label="Temperatura alta" value={counts.hot} />
          <Stat
            label="Pipeline"
            value={`$${counts.pipelineValue.toLocaleString("es-CO")}`}
            sub="Valor abierto"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar nombre, email, empresa..."
              className="input-field w-64 py-2 pl-9 text-xs"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field w-auto py-2 text-xs"
          >
            <option value="">Todos los estados</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="input-field w-auto py-2 text-xs"
          >
            <option value="">Toda temperatura</option>
            {TEMPERATURES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="input-field w-auto py-2 text-xs"
          >
            <option value="">Todas las fuentes</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {sourceLabel(s)}
              </option>
            ))}
          </select>
          {(status || temperature || source || q) && (
            <button
              onClick={() => {
                setStatus("");
                setTemperature("");
                setSource("");
                setQ("");
              }}
              className="text-xs text-zinc-400 hover:text-zinc-100"
            >
              Limpiar
            </button>
          )}
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          {/* Tabla */}
          <div className="card overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-5">
                <Empty>Sin leads que coincidan con el filtro.</Empty>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-zinc-800 text-[11px] uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Lead</th>
                      <th className="px-4 py-2.5 font-medium">Estado</th>
                      <th className="px-4 py-2.5 font-medium">Temp.</th>
                      <th className="px-4 py-2.5 font-medium">Fuente</th>
                      <th className="px-4 py-2.5 font-medium">Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((l) => (
                      <tr
                        key={l.id}
                        onClick={() => setSelectedId(l.id)}
                        className={`cursor-pointer border-b border-zinc-800/50 transition-colors last:border-0 hover:bg-zinc-900/60 ${
                          selectedId === l.id ? "bg-zinc-900/80" : ""
                        }`}
                      >
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-zinc-100">{l.name}</p>
                          <p className="text-xs text-zinc-500">
                            {l.company ? `${l.company} · ` : ""}
                            {l.email}
                            {l.phone ? ` · ${l.phone}` : ""}
                          </p>
                          {intentFromTags(l.tags) && (
                            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-emerald-500/80">
                              intent:{intentFromTags(l.tags)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <Tag tone={LEAD_STATUS_TONE[l.status] || "neutral"}>
                            {l.status}
                          </Tag>
                        </td>
                        <td className="px-4 py-2.5">
                          <Tag tone={TEMPERATURE_TONE[l.temperature] || "neutral"}>
                            {l.temperature}
                          </Tag>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-zinc-400">
                          {sourceLabel(l.source)}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-zinc-500">
                          {fmtDay(l.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Ficha */}
          <div>
            {!selected ? (
              <Panel title="Ficha">
                <Empty>Selecciona un lead para ver su ficha.</Empty>
              </Panel>
            ) : (
              <Panel
                title={selected.name}
                actions={
                  <div className="flex items-center gap-2">
                    {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />}
                    <button
                      onClick={() => removeLead(selected.id)}
                      className="text-zinc-500 hover:text-red-400"
                      aria-label="Borrar lead"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-zinc-500 hover:text-zinc-200"
                      aria-label="Cerrar ficha"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="space-y-1 text-xs text-zinc-400">
                    <p>{selected.email}</p>
                    {selected.company && <p>{selected.company}</p>}
                    {selected.role && <p>{selected.role}</p>}
                    {selected.phone && <p>{selected.phone}</p>}
                    <p className="text-zinc-500">
                      {sourceLabel(selected.source)} · {selected.locale} ·{" "}
                      {fmtDay(selected.createdAt)}
                      {intentFromTags(selected.tags)
                        ? ` · intent:${intentFromTags(selected.tags)}`
                        : ""}
                    </p>
                  </div>

                  {selected.message && (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-300">
                      {selected.message}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                        Estado
                      </span>
                      <select
                        value={selected.status}
                        onChange={(e) =>
                          patchLead(selected.id, { status: e.target.value })
                        }
                        className="input-field mt-1 py-2 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                        Temperatura
                      </span>
                      <select
                        value={selected.temperature}
                        onChange={(e) =>
                          patchLead(selected.id, { temperature: e.target.value })
                        }
                        className="input-field mt-1 py-2 text-xs"
                      >
                        {TEMPERATURES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                        Siguiente acción
                      </span>
                      <input
                        defaultValue={selected.nextAction || ""}
                        onBlur={(e) =>
                          e.target.value !== (selected.nextAction || "") &&
                          patchLead(selected.id, { nextAction: e.target.value })
                        }
                        className="input-field mt-1 py-2 text-xs"
                        placeholder="Enviar propuesta"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                        Fecha
                      </span>
                      <input
                        type="date"
                        defaultValue={selected.nextActionAt?.slice(0, 10) || ""}
                        onChange={(e) =>
                          patchLead(selected.id, {
                            nextActionAt: e.target.value || null,
                          })
                        }
                        className="input-field mt-1 py-2 text-xs"
                      />
                    </label>
                  </div>

                  <button
                    onClick={() => profileLead(selected.id)}
                    disabled={busy}
                    className="btn-secondary w-full py-2 text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Perfilar con IA
                  </button>

                  {selected.aiSummary && (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-100/90">
                      {selected.aiSummary}
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                      Notas
                    </span>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && addNote(selected.id)
                        }
                        placeholder="Añadir nota..."
                        className="input-field py-2 text-xs"
                      />
                      <button
                        onClick={() => addNote(selected.id)}
                        disabled={busy || !note.trim()}
                        className="btn-secondary shrink-0 px-3 py-2 text-xs"
                      >
                        Añadir
                      </button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {selected.notes.length === 0 && (
                        <p className="text-xs text-zinc-500">Sin notas.</p>
                      )}
                      {selected.notes.map((n) => (
                        <div
                          key={n.id}
                          className="border-b border-zinc-800/60 pb-2 last:border-0 last:pb-0"
                        >
                          <p className="text-xs text-zinc-300">{n.body}</p>
                          <p className="mt-0.5 text-[10px] text-zinc-500">
                            {fmtDay(n.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
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
