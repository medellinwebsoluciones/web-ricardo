"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Play,
  RefreshCw,
  AlertTriangle,
  Save,
  ChevronDown,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Panel, Empty, Tag, fmtDateTime } from "../ui";
import { readNdjson, type EvalCaseResult, type EvalRunSummary, type Suite } from "./types";

const DIMENSION_LABEL: Record<string, string> = {
  grounding: "Grounding",
  especificidad: "Especificidad",
  naturalidad: "Naturalidad",
  empatia: "Empatía",
  rol: "Rol",
  comercial: "Comercial",
  concision: "Concisión",
};

function scoreTone(score: number) {
  if (score >= 85) return "emerald" as const;
  if (score >= 70) return "amber" as const;
  return "red" as const;
}

/**
 * Corre suites de auditores y muestra la evolución entre corridas. El gráfico
 * es el que responde a la pregunta de si el agente mejora o solo cambia.
 */
export function EvalsTab({
  notify,
  onSaveExample,
  onSavePreference,
}: {
  notify: (msg: string) => void;
  onSaveExample: (question: string, answer: string, audience: string) => void;
  onSavePreference?: (
    question: string,
    preferred: string,
    rejected: string,
    audience: string,
  ) => void;
}) {
  const [suites, setSuites] = useState<Suite[]>([]);
  const [suiteId, setSuiteId] = useState("");
  const [limit, setLimit] = useState(8);
  const [label, setLabel] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<EvalCaseResult[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [summary, setSummary] = useState<{
    avgScore: number;
    dimensionAvgs: Record<string, number>;
  } | null>(null);
  const [history, setHistory] = useState<EvalRunSummary[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function loadSuites() {
    const res = await fetch("/api/admin/agent/eval");
    if (!res.ok) return;
    const data = await res.json();
    setSuites(data.suites);
    if (!suiteId && data.suites[0]) setSuiteId(data.suites[0].id);
  }

  async function loadHistory(id: string) {
    if (!id) return;
    const res = await fetch(`/api/admin/agent/eval/history?suiteId=${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setHistory(data.runs);
  }

  useEffect(() => {
    loadSuites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadHistory(suiteId);
  }, [suiteId]);

  async function run() {
    if (!suiteId || running) return;
    setRunning(true);
    setResults([]);
    setSummary(null);
    setProgress(null);

    try {
      const res = await fetch("/api/admin/agent/eval/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ suiteId, limit, label }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "error");
      }

      await readNdjson(res, (event) => {
        if (event.type === "start") {
          setProgress({ done: 0, total: Number(event.total) });
        } else if (event.type === "case") {
          const c = event as unknown as EvalCaseResult;
          setResults((prev) => [...prev, c]);
          setProgress({ done: c.index, total: c.total });
        } else if (event.type === "case_error") {
          notify(`Fallo en un caso: ${String(event.error)}`);
        } else if (event.type === "done") {
          setSummary({
            avgScore: Number(event.avgScore),
            dimensionAvgs: event.dimensionAvgs as Record<string, number>,
          });
        }
      });

      await loadHistory(suiteId);
      await loadSuites();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error al correr la suite");
    } finally {
      setRunning(false);
    }
  }

  const chartData = history.map((r, i) => ({
    name: `#${i + 1}`,
    nota: r.avgScore ?? 0,
    grounding: r.dimensionAvgs?.grounding ?? 0,
    naturalidad: r.dimensionAvgs?.naturalidad ?? 0,
    chunks: r.corpusChunks,
    fecha: fmtDateTime(r.startedAt),
  }));

  return (
    <div className="space-y-4">
      <Panel
        title="Suites de auditores"
        actions={
          <button
            onClick={async () => {
              await fetch("/api/admin/agent/eval", { method: "POST" });
              await loadSuites();
              notify("Suites re-sincronizadas desde el banco de preguntas.");
            }}
            className="btn-secondary px-3 py-1.5 text-[11px]"
          >
            <RefreshCw className="h-3 w-3" /> Sincronizar banco
          </button>
        }
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="text-[11px] uppercase tracking-wide text-zinc-500">
              Panel
            </label>
            <select
              value={suiteId}
              onChange={(e) => setSuiteId(e.target.value)}
              className="input-field mt-1 py-2 text-xs"
            >
              {suites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.cases} preguntas)
                  {s.lastRun?.avgScore != null
                    ? ` — última: ${s.lastRun.avgScore}`
                    : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className="text-[11px] uppercase tracking-wide text-zinc-500">
              Casos
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="input-field mt-1 py-2 text-xs"
            />
          </div>
          <div className="min-w-[180px] flex-1">
            <label className="text-[11px] uppercase tracking-wide text-zinc-500">
              Etiqueta
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="ej. tras cargar casos de 2024"
              className="input-field mt-1 py-2 text-xs"
            />
          </div>
          <button
            onClick={run}
            disabled={running || !suiteId}
            className="btn-primary px-4 py-2 text-xs"
          >
            {running ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            Correr suite
          </button>
        </div>

        {progress && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>
                {progress.done} de {progress.total} casos
              </span>
              {summary && <span>Media: {summary.avgScore}</span>}
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{
                  width: `${(progress.done / Math.max(1, progress.total)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {summary && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {Object.entries(summary.dimensionAvgs).map(([dim, value]) => (
              <div
                key={dim}
                className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-2 text-center"
              >
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                  {DIMENSION_LABEL[dim] ?? dim}
                </p>
                <p className="mt-1 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Panel title="Resultados de la corrida">
          {results.length === 0 ? (
            <Empty>
              {running
                ? "Corriendo… los casos aparecen aquí en cuanto se juzgan."
                : "Corre una suite para ver las notas caso a caso."}
            </Empty>
          ) : (
            <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
              {results.map((r) => (
                <div
                  key={r.caseId}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
                >
                  <button
                    onClick={() =>
                      setExpanded(expanded === r.caseId ? null : r.caseId)
                    }
                    className="flex w-full items-start justify-between gap-3 text-left"
                  >
                    <p className="text-xs text-zinc-200">{r.question}</p>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {r.gap && (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      )}
                      <Tag tone={scoreTone(r.score)}>{r.score}</Tag>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${
                          expanded === r.caseId ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  {expanded === r.caseId && (
                    <div className="mt-3 space-y-3 border-t border-zinc-800 pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(r.scores).map(([dim, value]) => (
                          <Tag key={dim} tone={scoreTone(value)}>
                            {DIMENSION_LABEL[dim] ?? dim} {value}
                          </Tag>
                        ))}
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                          Respuesta
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-300">
                          {r.answer}
                        </p>
                      </div>
                      {r.diagnosis && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                            Diagnóstico del juez
                          </p>
                          <p className="mt-1 text-xs text-amber-200">
                            {r.diagnosis}
                          </p>
                        </div>
                      )}
                      {r.improved && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                            Respuesta mejorada sugerida
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-xs text-emerald-200">
                            {r.improved}
                          </p>
                          <button
                            onClick={() =>
                              onSaveExample(r.question, r.improved, r.audience)
                            }
                            className="btn-secondary mt-2 px-3 py-1.5 text-[11px]"
                          >
                            <Save className="h-3 w-3" /> Guardar al corpus
                          </button>
                          {onSavePreference && (
                            <button
                              onClick={() =>
                                onSavePreference(
                                  r.question,
                                  r.improved,
                                  r.answer,
                                  r.audience,
                                )
                              }
                              className="btn-secondary mt-2 ml-2 px-3 py-1.5 text-[11px]"
                            >
                              <Save className="h-3 w-3" /> Par preferencia SFT
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Evolución del panel">
          {chartData.length < 2 ? (
            <Empty>
              Hacen falta al menos dos corridas de este panel para ver la
              evolución.
            </Empty>
          ) : (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                    <YAxis domain={[0, 100]} stroke="#71717a" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        background: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.fecha ?? ""
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="nota"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="grounding"
                      stroke="#38bdf8"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="naturalidad"
                      stroke="#a78bfa"
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-1.5">
                {[...history].reverse().slice(0, 6).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-zinc-800 px-2.5 py-1.5 text-[11px]"
                  >
                    <span className="truncate text-zinc-400">
                      {r.label || fmtDateTime(r.startedAt)}
                      {r.promptVersion ? ` · persona v${r.promptVersion}` : ""}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <Tag>{r.corpusChunks} chunks</Tag>
                      <Tag tone={scoreTone(r.avgScore ?? 0)}>{r.avgScore}</Tag>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}
