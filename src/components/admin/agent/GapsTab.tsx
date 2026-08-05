"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Save, X } from "lucide-react";
import { Panel, Empty, Tag, fmtDateTime } from "../ui";
import type { Gap } from "./types";

const SOURCE_LABEL: Record<string, string> = {
  playground: "Playground",
  eval: "Evaluación",
  chat: "Chat real",
};

/**
 * Cola priorizada de lo que el corpus no sabe responder. Responder aquí hace
 * tres cosas de golpe: indexa la respuesta, la deja como ejemplo de estilo y
 * cierra el hueco.
 */
export function GapsTab({ notify }: { notify: (msg: string) => void }) {
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState("abierto");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [answering, setAnswering] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");

  async function load(next = status) {
    setLoading(true);
    const res = await fetch(`/api/admin/agent/gaps?status=${next}`);
    if (res.ok) {
      const data = await res.json();
      setGaps(data.gaps);
      setCounts(data.counts);
    }
    setLoading(false);
  }

  useEffect(() => {
    load(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function mine() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/gaps", { method: "POST" });
      const data = await res.json();
      notify(
        data.found
          ? `${data.found} preguntas de visitantes reales sin cobertura en el corpus.`
          : "Ningún hueco nuevo en los chats recientes.",
      );
      await load();
    } catch {
      notify("No se pudo minar los chats.");
    } finally {
      setBusy(false);
    }
  }

  async function resolve(id: string) {
    if (answer.trim().length < 20) {
      notify("Escribe una respuesta un poco más completa.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/agent/gaps/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "resolve", answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      notify(
        `Respondido e indexado (${data.chunks} chunks). También queda como ejemplo para el dataset.`,
      );
      setAnswering(null);
      setAnswer("");
      await load();
    } catch {
      notify("No se pudo guardar la respuesta.");
    } finally {
      setBusy(false);
    }
  }

  async function dismiss(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/agent/gaps/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "dismiss" }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      title="Huecos de conocimiento"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field w-auto py-1.5 text-xs"
          >
            <option value="abierto">Abiertos ({counts.abierto ?? 0})</option>
            <option value="resuelto">Resueltos ({counts.resuelto ?? 0})</option>
            <option value="descartado">
              Descartados ({counts.descartado ?? 0})
            </option>
            <option value="todos">Todos</option>
          </select>
          <button
            onClick={mine}
            disabled={busy}
            className="btn-secondary px-3 py-1.5 text-[11px]"
          >
            {busy ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Search className="h-3 w-3" />
            )}
            Minar chats reales
          </button>
        </div>
      }
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
      ) : gaps.length === 0 ? (
        <Empty>
          Nada pendiente aquí. Corre una suite o mina los chats para llenar la
          cola.
        </Empty>
      ) : (
        <div className="space-y-2">
          {gaps.map((g) => (
            <div
              key={g.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-zinc-200">{g.question}</p>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Tag tone={g.hits > 2 ? "amber" : "neutral"}>
                    {g.hits}×
                  </Tag>
                  <Tag>{SOURCE_LABEL[g.source] ?? g.source}</Tag>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-zinc-500">
                  mejor similitud {g.bestSimilarity.toFixed(2)} ·{" "}
                  {fmtDateTime(g.createdAt)}
                </span>
                {g.status === "abierto" && (
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAnswering(answering === g.id ? null : g.id);
                        setAnswer("");
                      }}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Responder
                    </button>
                    <button
                      onClick={() => dismiss(g.id)}
                      disabled={busy}
                      className="text-zinc-500 hover:text-red-400"
                      title="Descartar"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {g.answer && (
                <p className="mt-2 whitespace-pre-wrap border-t border-zinc-800 pt-2 text-[11px] text-zinc-400">
                  {g.answer}
                </p>
              )}

              {answering === g.id && (
                <div className="mt-3 border-t border-zinc-800 pt-3">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Cómo debería responder el agente, con tus palabras y tus datos reales..."
                    rows={6}
                    className="input-field resize-y py-2 text-xs"
                  />
                  <button
                    onClick={() => resolve(g.id)}
                    disabled={busy}
                    className="btn-primary mt-2 px-3 py-1.5 text-[11px]"
                  >
                    {busy ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3" />
                    )}
                    Guardar e indexar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
