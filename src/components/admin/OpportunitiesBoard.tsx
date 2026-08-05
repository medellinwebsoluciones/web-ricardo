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

export type JobScoreResult = {
  score: number;
  verdict: "aplicar" | "valorar" | "descartar";
  priority: "alta" | "media" | "baja";
  matched: string[];
  missing: string[];
  redFlags: string[];
  remote: boolean | null;
  senior: boolean | null;
  summary: string;
  usedLlm: boolean;
};

const STAGES = ["guardada", "aplicada", "entrevista", "oferta", "cerrada"];
const TYPES = ["fijo-remoto", "consultoria", "freelance"];
const PRIORITIES = ["alta", "media", "baja"];

const VERDICT_TONE: Record<JobScoreResult["verdict"], "emerald" | "amber" | "red"> = {
  aplicar: "emerald",
  valorar: "amber",
  descartar: "red",
};

const VERDICT_LABEL: Record<JobScoreResult["verdict"], string> = {
  aplicar: "Aplicar",
  valorar: "Valorar",
  descartar: "Descartar",
};

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

  // --- Analizador de ofertas (triaje) ---
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scoreResult, setScoreResult] = useState<JobScoreResult | null>(null);
  const [analyzer, setAnalyzer] = useState({
    jobDescription: "",
    company: "",
    role: "",
    url: "",
    useLlm: false,
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

  async function analyze() {
    if (analyzer.jobDescription.trim().length < 40) {
      setMessage("Pega el texto de la oferta (al menos unas líneas).");
      return;
    }
    setAnalyzing(true);
    setMessage("");
    setScoreResult(null);
    try {
      const res = await fetch("/api/admin/opportunities/score", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jobDescription: analyzer.jobDescription,
          useLlm: analyzer.useLlm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setScoreResult(data.score);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al analizar");
    } finally {
      setAnalyzing(false);
    }
  }

  async function saveAnalyzed() {
    setAnalyzing(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/opportunities/score", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jobDescription: analyzer.jobDescription,
          company: analyzer.company,
          role: analyzer.role,
          url: analyzer.url,
          useLlm: analyzer.useLlm,
          save: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setOpps((prev) => [
        { ...data.opportunity, events: data.opportunity.events ?? [], assets: [] },
        ...prev,
      ]);
      setMessage(
        `Guardada en el tablero con veredicto ${data.score.verdict.toUpperCase()} (${data.score.score}%).`,
      );
      setScoreResult(null);
      setAnalyzer({ jobDescription: "", company: "", role: "", url: "", useLlm: analyzer.useLlm });
      setShowAnalyzer(false);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setAnalyzing(false);
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
              onClick={() => {
                setShowAnalyzer((v) => !v);
                setShowForm(false);
              }}
              className="btn-secondary px-3 py-2 text-xs"
            >
              <Target className="h-3.5 w-3.5" /> Analizar oferta
            </button>
            <button
              onClick={() => {
                setShowForm((v) => !v);
                setShowAnalyzer(false);
              }}
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

        {showAnalyzer && (
          <Panel
            title="Analizar oferta (triaje)"
            actions={
              <button
                onClick={() => setShowAnalyzer(false)}
                className="text-zinc-500 hover:text-zinc-200"
                aria-label="Cerrar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            }
          >
            <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
              <div className="space-y-3">
                <textarea
                  value={analyzer.jobDescription}
                  onChange={(e) =>
                    setAnalyzer({ ...analyzer, jobDescription: e.target.value })
                  }
                  placeholder="Pega aquí el texto completo de la oferta de LinkedIn (funciones y requisitos)..."
                  rows={10}
                  className="input-field resize-y py-2 text-xs"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={analyze}
                    disabled={analyzing || analyzer.jobDescription.trim().length < 40}
                    className="btn-primary px-4 py-2 text-xs"
                  >
                    {analyzing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Target className="h-3.5 w-3.5" />
                    )}
                    Analizar
                  </button>
                  <label className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <input
                      type="checkbox"
                      checked={analyzer.useLlm}
                      onChange={(e) =>
                        setAnalyzer({ ...analyzer, useLlm: e.target.checked })
                      }
                    />
                    Afinar con IA (opcional)
                  </label>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    value={analyzer.company}
                    onChange={(e) =>
                      setAnalyzer({ ...analyzer, company: e.target.value })
                    }
                    placeholder="Empresa (para guardar)"
                    className="input-field py-2 text-xs"
                  />
                  <input
                    value={analyzer.role}
                    onChange={(e) =>
                      setAnalyzer({ ...analyzer, role: e.target.value })
                    }
                    placeholder="Puesto (para guardar)"
                    className="input-field py-2 text-xs"
                  />
                  <input
                    value={analyzer.url}
                    onChange={(e) =>
                      setAnalyzer({ ...analyzer, url: e.target.value })
                    }
                    placeholder="URL (opcional)"
                    className="input-field py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                {!scoreResult ? (
                  <Empty>
                    Pega una oferta y pulsa Analizar. Funciona sin conexión a IA:
                    el veredicto sale de tu stack real.
                  </Empty>
                ) : (
                  <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                    <div className="flex items-center gap-2">
                      <Tag tone={VERDICT_TONE[scoreResult.verdict]}>
                        {VERDICT_LABEL[scoreResult.verdict]}
                      </Tag>
                      <span className="text-2xl font-semibold text-white">
                        {scoreResult.score}%
                      </span>
                      {scoreResult.usedLlm && <Tag tone="violet">IA</Tag>}
                    </div>
                    <p className="text-xs text-zinc-300">{scoreResult.summary}</p>

                    {scoreResult.matched.length > 0 && (
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                          Coincide en
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {scoreResult.matched.map((m) => (
                            <Tag key={m} tone="emerald">
                              {m}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}

                    {scoreResult.missing.length > 0 && (
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                          Fuera de tu core
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {scoreResult.missing.map((m) => (
                            <Tag key={m} tone="amber">
                              {m}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}

                    {scoreResult.redFlags.length > 0 && (
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                          Alertas
                        </p>
                        <ul className="mt-1 space-y-1">
                          {scoreResult.redFlags.map((f) => (
                            <li key={f} className="text-[11px] text-red-300">
                              — {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={saveAnalyzed}
                      disabled={analyzing}
                      className="btn-secondary w-full py-2 text-xs"
                    >
                      {analyzing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      Guardar en el tablero
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Panel>
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
