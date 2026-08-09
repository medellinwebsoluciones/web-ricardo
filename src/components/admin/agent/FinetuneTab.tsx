"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Download,
  Sparkles,
  Check,
  X,
  Trash2,
  BookOpen,
  UserCog,
  BarChart3,
  GraduationCap,
  Play,
  Upload,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Panel, Empty, Tag, Stat, fmtDateTime } from "../ui";
import type { FineTuneJob, TrainingExample, TrainingStats } from "./types";

type Step = "diagnostico" | "recolectar" | "curar" | "entrenar";

const STEPS: { id: Step; label: string }[] = [
  { id: "diagnostico", label: "1. Diagnóstico" },
  { id: "recolectar", label: "2. Recolectar" },
  { id: "curar", label: "3. Curar" },
  { id: "entrenar", label: "4. Entrenar" },
];

const SOURCE_LABEL: Record<string, string> = {
  correccion: "Hueco/corrección",
  eval: "Evaluación",
  simulacion: "Simulación",
  playground: "Playground",
  import: "Import",
  preferencia: "Preferencia",
  manual: "Manual",
};

/**
 * Hub de mejora del agente: separa hechos (RAG), instrucciones (Persona),
 * estilo (SFT) y medición (Evals), con wizard hasta lanzar el job OpenAI.
 */
export function FinetuneTab({
  notify,
  onNavigate,
}: {
  notify: (msg: string) => void;
  onNavigate?: (tab: string) => void;
}) {
  const [step, setStep] = useState<Step>("diagnostico");
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [examples, setExamples] = useState<TrainingExample[]>([]);
  const [jobs, setJobs] = useState<FineTuneJob[]>([]);
  const [filter, setFilter] = useState<"all" | "true" | "false">("false");
  const [sourceFilter, setSourceFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState("");
  const [editQuality, setEditQuality] = useState<number | "">("");
  const [manualQ, setManualQ] = useState("");
  const [manualA, setManualA] = useState("");
  const [manualApprove, setManualApprove] = useState(false);
  const [importText, setImportText] = useState("");
  const [importApprove, setImportApprove] = useState(false);
  const [baseModel, setBaseModel] = useState("gpt-4o-mini-2024-07-18");
  const [suffix, setSuffix] = useState("ricardo");

  async function loadExamples(next = filter, source = sourceFilter) {
    setLoading(true);
    const params = new URLSearchParams();
    if (next !== "all") params.set("approved", next);
    if (source) params.set("source", source);
    const qs = params.toString() ? `?${params}` : "";
    const res = await fetch(`/api/admin/agent/finetune${qs}`);
    if (res.ok) {
      const data = await res.json();
      setStats(data.stats);
      setExamples(data.examples);
    }
    setLoading(false);
  }

  async function loadJobs() {
    const res = await fetch("/api/admin/agent/finetune/jobs");
    if (res.ok) {
      const data = await res.json();
      setJobs(data.jobs || []);
      if (data.baseModelDefault) setBaseModel(data.baseModelDefault);
      if (data.stats) setStats(data.stats);
    }
  }

  useEffect(() => {
    loadExamples(filter, sourceFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sourceFilter]);

  useEffect(() => {
    if (step === "entrenar") loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function harvest(sources?: string[]) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "harvest",
          ...(sources ? { sources } : {}),
        }),
      });
      const data = await res.json();
      notify(
        `Recolectados: ${data.fromEvals ?? 0} evals altas, ${data.fromPreferences ?? 0} pares preferencia, ${data.fromSimulations ?? 0} turnos de sims ganadas (preferencia/sims requieren aprobación).`,
      );
      setStats(data.stats);
      await loadExamples();
    } catch {
      notify("No se pudo recolectar.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(id: string, approved: boolean) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, approved }),
      });
      const data = await res.json();
      setStats(data.stats);
      await loadExamples();
    } finally {
      setBusy(false);
    }
  }

  async function bulkApprove(approved: boolean) {
    if (selected.size === 0) {
      notify("Selecciona al menos un ejemplo.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "bulk_approve",
          ids: [...selected],
          approved,
        }),
      });
      const data = await res.json();
      setStats(data.stats);
      setSelected(new Set());
      await loadExamples();
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(id: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id,
          answer: editAnswer,
          quality: editQuality === "" ? null : editQuality,
        }),
      });
      const data = await res.json();
      setStats(data.stats);
      setEditingId(null);
      await loadExamples();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      await fetch("/api/admin/agent/finetune", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, delete: true }),
      });
      await loadExamples();
    } finally {
      setBusy(false);
    }
  }

  async function createManual() {
    if (manualQ.trim().length < 3 || manualA.trim().length < 20) {
      notify("Pregunta y respuesta un poco más completas.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "create",
          question: manualQ,
          answer: manualA,
          source: "manual",
          approved: manualApprove,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      notify("Ejemplo manual añadido.");
      setManualQ("");
      setManualA("");
      setStats(data.stats);
      await loadExamples();
    } catch {
      notify("No se pudo crear el ejemplo.");
    } finally {
      setBusy(false);
    }
  }

  async function doImport() {
    if (!importText.trim()) {
      notify("Pega JSONL o líneas {question, answer}.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "import",
          jsonl: importText,
          approve: importApprove,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      notify(`Importados ${data.imported}, omitidos ${data.skipped}.`);
      setImportText("");
      setStats(data.stats);
      await loadExamples();
    } catch {
      notify("No se pudo importar.");
    } finally {
      setBusy(false);
    }
  }

  async function exportJsonl() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune/export", {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        notify(
          data.error === "not_enough_examples"
            ? `Hacen falta ${data.required} ejemplos aprobados y hay ${data.count}.`
            : "No se pudo exportar.",
        );
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ricardo-finetune-${new Date().toISOString().slice(0, 10)}.jsonl`;
      a.click();
      URL.revokeObjectURL(url);
      notify("JSONL descargado.");
      await loadExamples();
    } finally {
      setBusy(false);
    }
  }

  async function launchJob(dryRun: boolean) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "launch",
          dryRun,
          baseModel,
          suffix,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        notify(
          data.error === "not_enough_examples"
            ? `Hacen falta ${data.required} aprobados (hay ${data.count}).`
            : data.error === "job_already_running"
              ? "Ya hay un job en curso."
              : data.error === "openai_not_configured"
                ? "Falta OPENAI_API_KEY."
                : "No se pudo lanzar el job.",
        );
        return;
      }
      if (data.dryRun) {
        notify(
          `Dry-run OK: ${data.count} ejemplos listos. JSONL temporal en servidor.`,
        );
      } else {
        notify(
          `Job lanzado: ${data.job.openaiJobId} (${data.job.status}).`,
        );
        await loadJobs();
      }
      if (data.stats) setStats(data.stats);
    } finally {
      setBusy(false);
    }
  }

  async function applyJob(jobId: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "apply", jobId }),
      });
      const data = await res.json();
      if (!res.ok) {
        notify(
          data.error === "model_not_ready"
            ? "El modelo aún no está listo."
            : "No se pudo aplicar a Persona.",
        );
        return;
      }
      notify(
        `Nueva versión de persona v${data.version} con modelo ${data.model}. Actívala tras correr evals.`,
      );
      await loadJobs();
      onNavigate?.("persona");
    } finally {
      setBusy(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const progress = stats
    ? Math.min(100, (stats.approved / stats.minExamples) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Aprobados" value={stats?.approved ?? 0} />
        <Stat label="Por revisar" value={stats?.pending ?? 0} />
        <Stat
          label="Mínimo para el job"
          value={stats?.minExamples ?? 80}
          sub={stats?.ready ? "Listo para lanzar" : "Sigue produciendo"}
        />
        <Stat
          label="Pares preferencia"
          value={stats?.withPreference ?? 0}
          sub="Rejected + preferred"
        />
      </div>

      <div className="flex flex-wrap gap-1 border-b border-zinc-800">
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-xs transition-colors ${
              step === s.id
                ? "border-emerald-500 text-emerald-300"
                : "border-transparent text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {step === "diagnostico" && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-400">
            Elige la palanca según el problema. Fine-tuning enseña{" "}
            <span className="text-zinc-200">estilo y tono</span>, no hechos.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <LeverCard
              icon={BookOpen}
              title="Falta conocimiento"
              body="Hechos, precios, proyectos. Cura el corpus o resuelve huecos."
              cta="Ir a Huecos"
              onClick={() => onNavigate?.("huecos")}
            />
            <LeverCard
              icon={UserCog}
              title="Malas reglas o tono forzado"
              body="Instrucciones de comportamiento: edita capas de Persona."
              cta="Ir a Persona"
              onClick={() => onNavigate?.("persona")}
            />
            <LeverCard
              icon={Sparkles}
              title="Mal tono o formato"
              body={`Dataset SFT: ${stats?.approved ?? 0}/${stats?.minExamples ?? 80} aprobados. Recolecta y cura ejemplos.`}
              cta="Ir a Recolectar"
              onClick={() => setStep("recolectar")}
            />
            <LeverCard
              icon={BarChart3}
              title="¿Mejoró o solo cambió?"
              body="Mide con suites y role-play antes de activar un modelo FT."
              cta="Ir a Evaluaciones"
              onClick={() => onNavigate?.("evaluaciones")}
            />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 text-[11px] text-zinc-500">
            Flujo recomendado: producir (evals/sims/playground) → recolectar →
            curar (≥80) → dry-run → lanzar job → aplicar a Persona → correr
            suites → activar.
          </div>
        </div>
      )}

      {step === "recolectar" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Fuentes automáticas">
            <div className="space-y-2">
              <HarvestBtn
                busy={busy}
                label="Todo (evals + preferencias + sims ganadas)"
                onClick={() => harvest()}
              />
              <HarvestBtn
                busy={busy}
                label="Solo evals con nota ≥ 90"
                onClick={() => harvest(["evals"])}
              />
              <HarvestBtn
                busy={busy}
                label="Pares preferencia (juez → improved)"
                onClick={() => harvest(["preferences"])}
              />
              <HarvestBtn
                busy={busy}
                label="Turnos de sims que agendaron"
                onClick={() => harvest(["simulations"])}
              />
              <p className="pt-2 text-[11px] text-zinc-500">
                Las sims también se pueden enviar una a una desde el Simulador.
                Playground y Huecos escriben al dataset al guardar.
              </p>
              <button
                type="button"
                onClick={() => onNavigate?.("simulador")}
                className="flex items-center gap-1.5 text-[11px] text-emerald-400 hover:underline"
              >
                <GraduationCap className="h-3 w-3" /> Abrir Simulador
              </button>
            </div>
          </Panel>

          <Panel title="Manual e import">
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-500">Pregunta</label>
                <textarea
                  value={manualQ}
                  onChange={(e) => setManualQ(e.target.value)}
                  rows={2}
                  className="input-field mt-1 resize-y py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500">
                  Respuesta gold
                </label>
                <textarea
                  value={manualA}
                  onChange={(e) => setManualA(e.target.value)}
                  rows={3}
                  className="input-field mt-1 resize-y py-2 text-xs"
                />
              </div>
              <label className="flex items-center gap-2 text-[11px] text-zinc-400">
                <input
                  type="checkbox"
                  checked={manualApprove}
                  onChange={(e) => setManualApprove(e.target.checked)}
                />
                Aprobar al crear
              </label>
              <button
                onClick={createManual}
                disabled={busy}
                className="btn-secondary px-3 py-1.5 text-[11px]"
              >
                <Plus className="h-3 w-3" /> Añadir ejemplo
              </button>

              <div className="border-t border-zinc-800 pt-3">
                <label className="text-[11px] text-zinc-500">
                  Importar JSONL (messages o question/answer)
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={4}
                  placeholder='{"messages":[...]} o {"question":"...","answer":"..."}'
                  className="input-field mt-1 resize-y py-2 font-mono text-[10px]"
                />
                <label className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400">
                  <input
                    type="checkbox"
                    checked={importApprove}
                    onChange={(e) => setImportApprove(e.target.checked)}
                  />
                  Aprobar importados
                </label>
                <button
                  onClick={doImport}
                  disabled={busy}
                  className="btn-secondary mt-2 px-3 py-1.5 text-[11px]"
                >
                  <Upload className="h-3 w-3" /> Importar
                </button>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {step === "curar" && (
        <Panel
          title="Dataset"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as typeof filter)
                }
                className="input-field w-auto py-1.5 text-xs"
              >
                <option value="all">Todos</option>
                <option value="true">Aprobados</option>
                <option value="false">Por revisar</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="input-field w-auto py-1.5 text-xs"
              >
                <option value="">Origen</option>
                {Object.entries(SOURCE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <button
                onClick={() => bulkApprove(true)}
                disabled={busy || selected.size === 0}
                className="btn-secondary px-3 py-1.5 text-[11px]"
              >
                <Check className="h-3 w-3" /> Aprobar ({selected.size})
              </button>
            </div>
          }
        >
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>
                {stats?.approved ?? 0} de {stats?.minExamples ?? 80} aprobados
              </span>
              <span>
                {Object.entries(stats?.bySource ?? {})
                  .map(([k, v]) => `${SOURCE_LABEL[k] || k}: ${v}`)
                  .join(" · ")}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full transition-all ${
                  stats?.ready ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
          ) : examples.length === 0 ? (
            <Empty>
              Sin ejemplos en este filtro. Recolecta o añade manualmente.
            </Empty>
          ) : (
            <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
              {examples.map((e) => (
                <div
                  key={e.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selected.has(e.id)}
                      onChange={() => toggleSelect(e.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-medium text-zinc-200">
                          {e.question}
                        </p>
                        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                          <Tag tone={e.approved ? "emerald" : "amber"}>
                            {e.approved ? "aprobado" : "por revisar"}
                          </Tag>
                          <Tag>{SOURCE_LABEL[e.source] || e.source}</Tag>
                          {e.quality != null && (
                            <Tag>{e.quality}/5</Tag>
                          )}
                        </div>
                      </div>

                      {editingId === e.id ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editAnswer}
                            onChange={(ev) => setEditAnswer(ev.target.value)}
                            rows={4}
                            className="input-field w-full resize-y py-2 text-xs"
                          />
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] text-zinc-500">
                              Calidad
                            </label>
                            <select
                              value={editQuality}
                              onChange={(ev) =>
                                setEditQuality(
                                  ev.target.value === ""
                                    ? ""
                                    : Number(ev.target.value),
                                )
                              }
                              className="input-field w-auto py-1 text-xs"
                            >
                              <option value="">—</option>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => saveEdit(e.id)}
                              disabled={busy}
                              className="btn-primary px-2 py-1 text-[11px]"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-[11px] text-zinc-500 hover:underline"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="mt-1.5 line-clamp-4 whitespace-pre-wrap text-[11px] text-zinc-400">
                            {e.answer}
                          </p>
                          {e.rejectedAnswer && (
                            <details className="mt-1.5">
                              <summary className="cursor-pointer text-[10px] text-amber-400/80">
                                Ver respuesta rechazada
                              </summary>
                              <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-[11px] text-zinc-500">
                                {e.rejectedAnswer}
                              </p>
                            </details>
                          )}
                        </>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => toggle(e.id, !e.approved)}
                          disabled={busy}
                          className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                        >
                          {e.approved ? (
                            <>
                              <X className="h-3 w-3" /> Quitar del dataset
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3" /> Aprobar
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(e.id);
                            setEditAnswer(e.answer);
                            setEditQuality(e.quality ?? "");
                          }}
                          className="text-[11px] text-zinc-400 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => remove(e.id)}
                          disabled={busy}
                          className="ml-auto text-zinc-500 hover:text-red-400"
                          title="Borrar ejemplo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {step === "entrenar" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Lanzar fine-tuning">
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>
                  {stats?.approved ?? 0} / {stats?.minExamples ?? 80}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full ${
                    stats?.ready ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-500">Modelo base</label>
                <input
                  value={baseModel}
                  onChange={(e) => setBaseModel(e.target.value)}
                  className="input-field mt-1 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500">Suffix</label>
                <input
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value.slice(0, 18))}
                  className="input-field mt-1 py-2 text-xs"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportJsonl}
                  disabled={busy || !stats?.ready}
                  className="btn-secondary px-3 py-1.5 text-[11px]"
                >
                  <Download className="h-3 w-3" /> Exportar JSONL
                </button>
                <button
                  onClick={() => launchJob(true)}
                  disabled={busy || !stats?.ready}
                  className="btn-secondary px-3 py-1.5 text-[11px]"
                >
                  Dry-run
                </button>
                <button
                  onClick={() => launchJob(false)}
                  disabled={busy || !stats?.ready}
                  className="btn-primary px-3 py-1.5 text-[11px]"
                >
                  <Play className="h-3 w-3" /> Lanzar job
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">
                Tras el job: aplica el modelo a una nueva versión de Persona y
                corre las suites antes de activarla.
              </p>
            </div>
          </Panel>

          <Panel
            title="Jobs"
            actions={
              <button
                onClick={() => loadJobs()}
                disabled={busy}
                className="btn-secondary px-2 py-1 text-[11px]"
              >
                <RefreshCw className="h-3 w-3" /> Sync
              </button>
            }
          >
            {jobs.length === 0 ? (
              <Empty>Ningún job todavía.</Empty>
            ) : (
              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {jobs.map((j) => (
                  <div
                    key={j.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-mono text-[11px] text-zinc-300">
                        {j.openaiJobId}
                      </p>
                      <Tag
                        tone={
                          j.status === "succeeded"
                            ? "emerald"
                            : j.status === "failed" || j.status === "cancelled"
                              ? "red"
                              : "amber"
                        }
                      >
                        {j.status}
                      </Tag>
                    </div>
                    <p className="mt-1 text-[10px] text-zinc-500">
                      {j.exampleCount} ejemplos · {fmtDateTime(j.createdAt)}
                    </p>
                    {j.fineTunedModel && (
                      <p className="mt-1 truncate font-mono text-[10px] text-emerald-300/90">
                        {j.fineTunedModel}
                      </p>
                    )}
                    {j.error && (
                      <p className="mt-1 text-[11px] text-red-300">{j.error}</p>
                    )}
                    {j.status === "succeeded" && j.fineTunedModel && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => applyJob(j.id)}
                          disabled={busy}
                          className="btn-secondary px-2 py-1 text-[11px]"
                        >
                          Aplicar a Persona
                        </button>
                        <button
                          onClick={() => onNavigate?.("evaluaciones")}
                          className="text-[11px] text-emerald-400 hover:underline"
                        >
                          Correr evals
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

function LeverCard({
  icon: Icon,
  title,
  body,
  cta,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-left transition-colors hover:border-emerald-500/30"
    >
      <div className="flex items-center gap-2 text-zinc-200">
        <Icon className="h-4 w-4 text-emerald-400" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-2 text-[11px] text-zinc-400">{body}</p>
      <p className="mt-3 text-[11px] text-emerald-400">{cta} →</p>
    </button>
  );
}

function HarvestBtn({
  label,
  busy,
  onClick,
}: {
  label: string;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="btn-secondary flex w-full items-center justify-start gap-2 px-3 py-2 text-[11px]"
    >
      {busy ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Sparkles className="h-3 w-3" />
      )}
      {label}
    </button>
  );
}
