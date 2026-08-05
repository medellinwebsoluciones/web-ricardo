"use client";

import { useState } from "react";
import { Loader2, Send, AlertTriangle, Save } from "lucide-react";
import { Panel, Empty, Tag } from "../ui";
import { AUDITOR_PANELS, INTERVIEW_QUESTIONS } from "@/lib/interview-bank";
import type { TestResult } from "./types";

const AUDIENCE_OPTIONS = [
  { key: "", label: "Detectar automáticamente" },
  { key: "reclutador", label: "Reclutador / RRHH" },
  { key: "hiring_manager", label: "Hiring manager técnico" },
  { key: "cto", label: "CTO / arquitecto" },
  { key: "ceo", label: "CEO / negocio" },
  { key: "agencia", label: "Agencia WordPress" },
];

const STAGE_OPTIONS = [
  { key: "apertura", label: "Apertura" },
  { key: "descubrimiento", label: "Descubrimiento" },
  { key: "diagnostico", label: "Diagnóstico" },
  { key: "propuesta", label: "Propuesta" },
  { key: "cierre", label: "Cierre" },
];

export function PlaygroundTab({
  notify,
  onSeedCorpus,
}: {
  notify: (msg: string) => void;
  onSeedCorpus: (question: string, draft: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [audience, setAudience] = useState("");
  const [stage, setStage] = useState("diagnostico");
  const [panelId, setPanelId] = useState(AUDITOR_PANELS[0].id);
  const [result, setResult] = useState<TestResult | null>(null);
  const [correction, setCorrection] = useState("");
  const [busy, setBusy] = useState(false);

  const questions = INTERVIEW_QUESTIONS.filter((q) => q.panel === panelId);

  async function run(text: string) {
    const question = text.trim();
    if (!question) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/agent/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: question, audience, stage }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error === "openai_not_configured"
            ? "Falta OPENAI_API_KEY"
            : data.error || "error",
        );
      }
      setResult(data);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error al probar el agente");
    } finally {
      setBusy(false);
    }
  }

  async function saveCorrection() {
    if (!prompt.trim() || !correction.trim()) {
      notify("Escribe la pregunta y la respuesta correcta.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/corpus", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: `Respuesta: ${prompt.trim().slice(0, 120)}`,
          content: `Pregunta: ${prompt.trim()}\n\nRespuesta correcta de Ricardo:\n${correction.trim()}`,
          sourceType: "faq",
          trustTier: "canonical",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      notify(
        data.warning === "openai_not_configured"
          ? "Guardado, pero falta OPENAI_API_KEY para indexar."
          : `Entrenado: ${data.chunks} chunks añadidos al corpus.`,
      );
      setCorrection("");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error al entrenar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Panel title="Playground del agente">
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="text-[11px] uppercase tracking-wide text-zinc-500">
                Quién pregunta
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="input-field mt-1 py-2 text-xs"
              >
                {AUDIENCE_OPTIONS.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-zinc-500">
                Momento de la conversación
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="input-field mt-1 py-2 text-xs"
              >
                {STAGE_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              Banco de auditores
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {AUDITOR_PANELS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPanelId(p.id)}
                  className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                    panelId === p.id
                      ? "border-emerald-500/40 text-emerald-300"
                      : "border-zinc-800 text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div className="mt-2 max-h-44 space-y-1.5 overflow-y-auto pr-1">
              {questions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setPrompt(q.es);
                    setAudience(q.audience === "desconocido" ? "" : q.audience);
                    run(q.es);
                  }}
                  className="block w-full rounded-md border border-zinc-800 px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-white"
                >
                  {q.es}
                  <span className="ml-2 text-[10px] text-zinc-600">
                    {q.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="O escribe tu propia pregunta..."
            rows={3}
            className="input-field resize-y py-2 text-xs"
          />
          <button
            onClick={() => run(prompt)}
            disabled={busy || !prompt.trim()}
            className="btn-primary px-4 py-2 text-xs"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Probar
          </button>

          {result && (
            <div className="space-y-3">
              {result.gap && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <div>
                    <p>
                      Falta contexto en el corpus (mejor similitud{" "}
                      {result.bestSimilarity}). Ya está en la cola de huecos.
                    </p>
                    <button
                      onClick={() =>
                        onSeedCorpus(
                          prompt,
                          `Pregunta sin contexto suficiente: ${prompt}\n\nRespuesta correcta:\n`,
                        )
                      }
                      className="mt-1 underline hover:text-amber-100"
                    >
                      Crear entrada para esta pregunta
                    </button>
                  </div>
                </div>
              )}

              <div className="whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-200">
                {result.answer}
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                  ¿La respuesta no te representa? Corrígela y entrena
                </p>
                <textarea
                  value={correction}
                  onChange={(e) => setCorrection(e.target.value)}
                  placeholder="Escribe aquí cómo debería haber respondido..."
                  rows={5}
                  className="input-field mt-2 resize-y py-2 text-xs"
                />
                <button
                  onClick={saveCorrection}
                  disabled={busy || !correction.trim()}
                  className="btn-secondary mt-2 w-full py-2 text-xs"
                >
                  <Save className="h-3.5 w-3.5" /> Guardar como conocimiento
                </button>
              </div>
            </div>
          )}
        </div>
      </Panel>

      <div className="space-y-4">
        {result?.analysis && (
          <Panel title="Lectura del interlocutor">
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-1.5">
                <Tag tone="sky">{result.audience}</Tag>
                <Tag tone="violet">{result.stage}</Tag>
                <Tag>{result.analysis.intent}</Tag>
                <Tag>{result.analysis.sentiment}</Tag>
                <Tag
                  tone={result.analysis.urgency === "alta" ? "amber" : "neutral"}
                >
                  urgencia {result.analysis.urgency}
                </Tag>
              </div>
              {result.analysis.tactic && (
                <p className="text-zinc-400">{result.analysis.tactic}</p>
              )}
              {result.analysis.objections.length > 0 && (
                <p className="text-amber-200">
                  Objeciones: {result.analysis.objections.join("; ")}
                </p>
              )}
              {Object.keys(result.analysis.extracted).length > 0 && (
                <p className="text-zinc-500">
                  Datos captados:{" "}
                  {Object.entries(result.analysis.extracted)
                    .map(([k, v]) => `${k}=${v}`)
                    .join(", ")}
                </p>
              )}
            </div>
          </Panel>
        )}

        <Panel title="Fuentes recuperadas (RAG)">
          {!result ? (
            <Empty>Prueba una pregunta para ver qué contexto usa.</Empty>
          ) : result.sources.length === 0 ? (
            <Empty>No se recuperó ninguna fuente.</Empty>
          ) : (
            <div className="space-y-2">
              {result.sources.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-zinc-200">
                      {s.title}
                    </p>
                    <Tag
                      tone={
                        s.similarity > 0.5
                          ? "emerald"
                          : s.similarity > 0.35
                            ? "amber"
                            : "neutral"
                      }
                    >
                      {s.similarity}
                    </Tag>
                  </div>
                  <p className="mt-1 line-clamp-3 text-[11px] text-zinc-500">
                    {s.excerpt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
