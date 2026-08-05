"use client";

import { useEffect, useState } from "react";
import { Loader2, Download, Sparkles, Check, X, Trash2 } from "lucide-react";
import { Panel, Empty, Tag, Stat, fmtDateTime } from "../ui";
import type { TrainingExample, TrainingStats } from "./types";

/**
 * Dataset de fine-tuning. El gate de ejemplos no es burocracia: por debajo de
 * ese volumen el fine-tuning rinde peor que meter los mismos ejemplos en el
 * prompt, así que lanzar el job antes es tirar tiempo y dinero.
 */
export function FinetuneTab({ notify }: { notify: (msg: string) => void }) {
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [examples, setExamples] = useState<TrainingExample[]>([]);
  const [filter, setFilter] = useState<"all" | "true" | "false">("all");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load(next = filter) {
    setLoading(true);
    const qs = next === "all" ? "" : `?approved=${next}`;
    const res = await fetch(`/api/admin/agent/finetune${qs}`);
    if (res.ok) {
      const data = await res.json();
      setStats(data.stats);
      setExamples(data.examples);
    }
    setLoading(false);
  }

  useEffect(() => {
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function harvest() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune", { method: "POST" });
      const data = await res.json();
      notify(
        `Recolectados: ${data.fromEvals} de evaluaciones con nota alta y ${data.fromSimulations} turnos de role-plays ganados (estos últimos hay que aprobarlos a mano).`,
      );
      await load();
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
      await load();
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
      await load();
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
            ? `Hacen falta ${data.required} ejemplos aprobados y hay ${data.count}. Produce más desde el simulador y las evaluaciones.`
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
      notify(
        "JSONL descargado. Lánzalo con: npm run agent:finetune (o --dry-run para revisarlo antes).",
      );
      await load();
    } finally {
      setBusy(false);
    }
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
          label="Última exportación"
          value={stats?.lastExportAt ? fmtDateTime(stats.lastExportAt) : "—"}
        />
      </div>

      <Panel
        title="Dataset"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="input-field w-auto py-1.5 text-xs"
            >
              <option value="all">Todos</option>
              <option value="true">Aprobados</option>
              <option value="false">Por revisar</option>
            </select>
            <button
              onClick={harvest}
              disabled={busy}
              className="btn-secondary px-3 py-1.5 text-[11px]"
            >
              <Sparkles className="h-3 w-3" /> Recolectar
            </button>
            <button
              onClick={exportJsonl}
              disabled={busy || !stats?.ready}
              className="btn-primary px-3 py-1.5 text-[11px]"
            >
              <Download className="h-3 w-3" /> Exportar JSONL
            </button>
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>
              {stats?.approved ?? 0} de {stats?.minExamples ?? 80} ejemplos
              aprobados
            </span>
            <span>
              {Object.entries(stats?.bySource ?? {})
                .map(([k, v]) => `${k}: ${v}`)
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
          <p className="mt-2 text-[11px] text-zinc-500">
            El fine-tuning enseña estilo y tono, no hechos: los datos siguen
            viniendo del RAG. Por eso los ejemplos se guardan sin el contexto
            recuperado.
          </p>
        </div>

        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
        ) : examples.length === 0 ? (
          <Empty>
            Sin ejemplos todavía. Recolecta desde evaluaciones y role-plays, o
            responde huecos en la pestaña anterior.
          </Empty>
        ) : (
          <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
            {examples.map((e) => (
              <div
                key={e.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-zinc-200">
                    {e.question}
                  </p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Tag tone={e.approved ? "emerald" : "amber"}>
                      {e.approved ? "aprobado" : "por revisar"}
                    </Tag>
                    <Tag>{e.source}</Tag>
                  </div>
                </div>
                <p className="mt-1.5 line-clamp-4 whitespace-pre-wrap text-[11px] text-zinc-400">
                  {e.answer}
                </p>
                <div className="mt-2 flex items-center gap-2">
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
                    onClick={() => remove(e.id)}
                    disabled={busy}
                    className="ml-auto text-zinc-500 hover:text-red-400"
                    title="Borrar ejemplo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
