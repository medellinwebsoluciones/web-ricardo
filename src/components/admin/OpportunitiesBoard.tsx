"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Loader2,
  Trash2,
  ExternalLink,
  Download,
  Target,
  Sparkles,
  X,
} from "lucide-react";
import {
  PageHeader,
  Panel,
  Empty,
  Tag,
  Stat,
  fmtDay,
  STAGE_TONE,
  TEMPERATURE_TONE,
} from "./ui";

export type OpportunityAsset = {
  id: string;
  kind: string;
  title: string;
  createdAt: string;
};

export type OpportunityEvent = {
  id: string;
  type: string;
  note: string | null;
  at: string;
};

export type OpportunityRow = {
  id: string;
  company: string;
  role: string;
  type: string;
  location: string | null;
  remote: boolean;
  url: string | null;
  salaryRange: string | null;
  stage: string;
  priority: string;
  matchScore: number | null;
  matchGaps: string | null;
  jobDescription: string | null;
  nextAction: string | null;
  nextActionAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  events: OpportunityEvent[];
  assets: OpportunityAsset[];
};

const STAGES = ["guardada", "aplicada", "entrevista", "oferta", "cerrada"];
const TYPES = ["fijo-remoto", "consultoria", "freelance"];
const PRIORITIES = ["alta", "media", "baja"];

export function OpportunitiesBoard({
  initial,
}: {
  initial: OpportunityRow[];
}) {
  const [opps, setOpps] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [note, setNote] = useState("");
  const [form, setForm] = useState({
    company: "",
    role: "",
    type: "fijo-remoto",
    location: "",
    url: "",
    salaryRange: "",
    priority: "media",
    jobDescription: "",
  });

  const filtered = useMemo(
    () => (typeFilter ? opps.filter((o) => o.type === typeFilter) : opps),
    [opps, typeFilter],
  );

  const selected = opps.find((o) => o.id === selectedId) || null;

  const stats = useMemo(
    () => ({
      total: opps.length,
      active: opps.filter((o) =>
        ["aplicada", "entrevista", "oferta"].includes(o.stage),
      ).length,
      interviews: opps.filter((o) => o.stage === "entrevista").length,
      offers: opps.filter((o) => o.stage === "oferta").length,
    }),
    [opps],
  );

  function replace(updated: OpportunityRow) {
    setOpps((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  async function create() {
    if (!form.company.trim() || !form.role.trim()) {
      setMessage("Empresa y puesto son obligatorios.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/opportunities", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setOpps((prev) => [
        { ...data.opportunity, events: data.opportunity.events ?? [], assets: [] },
        ...prev,
      ]);
      setForm({
        company: "",
        role: "",
        type: "fijo-remoto",
        location: "",
        url: "",
        salaryRange: "",
        priority: "media",
        jobDescription: "",
      });
      setShowForm(false);
      setMessage("Oportunidad creada.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al crear");
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, payload: Record<string, unknown>) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      replace(data.opportunity);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Borrar esta oportunidad?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("error");
      setOpps((prev) => prev.filter((o) => o.id !== id));
      setSelectedId(null);
    } catch {
      setMessage("No se pudo borrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Oportunidades"
        subtitle="Empleo fijo remoto, consultoría y freelance en un solo tablero"
        actions={
          <>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field w-auto py-2 text-xs"
            >
              <option value="">Todos los tipos</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <a
              href="/api/admin/export?type=opportunities"
              className="btn-secondary px-3 py-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </a>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="btn-primary px-3 py-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Nueva
            </button>
          </>
        }
      />

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={Target} label="Total" value={stats.total} />
          <Stat label="Activas" value={stats.active} />
          <Stat label="En entrevista" value={stats.interviews} />
          <Stat label="Con oferta" value={stats.offers} />
        </div>

        {message && (
          <p className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200">
            {message}
          </p>
        )}

        {showForm && (
          <Panel
            title="Nueva oportunidad"
            actions={
              <button
                onClick={() => setShowForm(false)}
                className="text-zinc-500 hover:text-zinc-200"
                aria-label="Cerrar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            }
          >
            <div className="grid gap-3 lg:grid-cols-2">
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Empresa"
                className="input-field py-2 text-xs"
              />
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Puesto / rol"
                className="input-field py-2 text-xs"
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field py-2 text-xs"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="input-field py-2 text-xs"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    prioridad {p}
                  </option>
                ))}
              </select>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ubicación (ej. Madrid / remoto)"
                className="input-field py-2 text-xs"
              />
              <input
                value={form.salaryRange}
                onChange={(e) =>
                  setForm({ ...form, salaryRange: e.target.value })
                }
                placeholder="Rango salarial / tarifa"
                className="input-field py-2 text-xs"
              />
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="URL de la oferta"
                className="input-field py-2 text-xs lg:col-span-2"
              />
              <textarea
                value={form.jobDescription}
                onChange={(e) =>
                  setForm({ ...form, jobDescription: e.target.value })
                }
                placeholder="Pega aquí la descripción de la oferta (sirve para el match y el generador)"
                rows={5}
                className="input-field resize-y py-2 text-xs lg:col-span-2"
              />
            </div>
            <button
              onClick={create}
              disabled={busy}
              className="btn-primary mt-3 px-4 py-2 text-xs"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Guardar
            </button>
          </Panel>
        )}

        {/* Tablero por etapa */}
        <div className="grid gap-3 lg:grid-cols-5">
          {STAGES.map((stage) => {
            const list = filtered.filter((o) => o.stage === stage);
            return (
              <div key={stage} className="min-w-0">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                    {stage}
                  </span>
                  <span className="text-[11px] text-zinc-600">{list.length}</span>
                </div>
                <div className="space-y-2">
                  {list.length === 0 && (
                    <div className="rounded-lg border border-dashed border-zinc-800 px-2 py-4 text-center text-[11px] text-zinc-600">
                      vacío
                    </div>
                  )}
                  {list.map((o) => {
                    const late =
                      o.nextActionAt && new Date(o.nextActionAt) < new Date();
                    return (
                      <button
                        key={o.id}
                        onClick={() => setSelectedId(o.id)}
                        className={`block w-full rounded-lg border p-2.5 text-left transition-colors ${
                          selectedId === o.id
                            ? "border-emerald-500/40 bg-emerald-500/5"
                            : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                        }`}
                      >
                        <p className="truncate text-xs font-medium text-zinc-100">
                          {o.role}
                        </p>
                        <p className="truncate text-[11px] text-zinc-500">
                          {o.company}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          <Tag tone={TEMPERATURE_TONE[o.priority] || "neutral"}>
                            {o.priority}
                          </Tag>
                          {o.matchScore !== null && (
                            <Tag
                              tone={
                                o.matchScore >= 70
                                  ? "emerald"
                                  : o.matchScore >= 45
                                    ? "amber"
                                    : "neutral"
                              }
                            >
                              {o.matchScore}%
                            </Tag>
                          )}
                          {late && <Tag tone="red">vencida</Tag>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selected && (
          <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
            <Panel
              title={`${selected.role} · ${selected.company}`}
              actions={
                <div className="flex items-center gap-2">
                  {busy && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
                  )}
                  {selected.url && (
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-emerald-400"
                      title="Abrir oferta"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => remove(selected.id)}
                    className="text-zinc-500 hover:text-red-400"
                    aria-label="Borrar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-zinc-500 hover:text-zinc-200"
                    aria-label="Cerrar"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag tone={STAGE_TONE[selected.stage] || "neutral"}>
                    {selected.stage}
                  </Tag>
                  <Tag>{selected.type}</Tag>
                  {selected.remote && <Tag tone="sky">remoto</Tag>}
                  {selected.location && <Tag>{selected.location}</Tag>}
                  {selected.salaryRange && <Tag>{selected.salaryRange}</Tag>}
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                      Etapa
                    </span>
                    <select
                      value={selected.stage}
                      onChange={(e) =>
                        patch(selected.id, { stage: e.target.value })
                      }
                      className="input-field mt-1 py-2 text-xs"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                      Siguiente acción
                    </span>
                    <input
                      defaultValue={selected.nextAction || ""}
                      onBlur={(e) =>
                        e.target.value !== (selected.nextAction || "") &&
                        patch(selected.id, { nextAction: e.target.value })
                      }
                      placeholder="Enviar CV adaptado"
                      className="input-field mt-1 py-2 text-xs"
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
                        patch(selected.id, {
                          nextActionAt: e.target.value || null,
                        })
                      }
                      className="input-field mt-1 py-2 text-xs"
                    />
                  </label>
                </div>

                {selected.matchScore !== null && (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="text-xs font-medium text-emerald-200">
                      Match {selected.matchScore}% con tu corpus
                    </p>
                    {selected.matchGaps && (
                      <p className="mt-1 whitespace-pre-wrap text-[11px] text-emerald-100/80">
                        {selected.matchGaps}
                      </p>
                    )}
                  </div>
                )}

                {selected.jobDescription && (
                  <details className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                    <summary className="cursor-pointer text-xs text-zinc-300">
                      Descripción de la oferta
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap text-[11px] text-zinc-400">
                      {selected.jobDescription}
                    </p>
                  </details>
                )}

                <div>
                  <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Añadir nota al historial
                  </span>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && note.trim()) {
                          patch(selected.id, { note });
                          setNote("");
                        }
                      }}
                      placeholder="Llamada con el recruiter..."
                      className="input-field py-2 text-xs"
                    />
                    <button
                      onClick={() => {
                        if (note.trim()) {
                          patch(selected.id, { note });
                          setNote("");
                        }
                      }}
                      disabled={busy || !note.trim()}
                      className="btn-secondary shrink-0 px-3 py-2 text-xs"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                <Link
                  href={`/admin/generador?opportunityId=${selected.id}`}
                  className="btn-secondary w-full py-2 text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Generar CV / carta /
                  propuesta
                </Link>
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel title="Historial">
                {selected.events.length === 0 ? (
                  <Empty>Sin eventos.</Empty>
                ) : (
                  <div className="space-y-2">
                    {selected.events.map((e) => (
                      <div
                        key={e.id}
                        className="border-b border-zinc-800/60 pb-2 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Tag>{e.type}</Tag>
                          <span className="text-[10px] text-zinc-500">
                            {fmtDay(e.at)}
                          </span>
                        </div>
                        {e.note && (
                          <p className="mt-1 text-xs text-zinc-400">{e.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="Material generado">
                {selected.assets.length === 0 ? (
                  <Empty>Aún no has generado material.</Empty>
                ) : (
                  <div className="space-y-2">
                    {selected.assets.map((a) => (
                      <Link
                        key={a.id}
                        href={`/admin/generador?assetId=${a.id}`}
                        className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2 text-xs last:border-0 last:pb-0"
                      >
                        <span className="truncate text-zinc-300">{a.title}</span>
                        <Tag tone="violet">{a.kind}</Tag>
                      </Link>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
