"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Play, CheckCircle2, XCircle } from "lucide-react";
import { Panel, Empty, Tag, fmtDateTime } from "../ui";
import { readNdjson } from "./types";

type Persona = {
  slug: string;
  name: string;
  audience: string;
  difficulty: string;
  summary: string;
  goal: string;
};

type Turn = { role: "prospect" | "agent"; content: string };

type Verdict = {
  booked: boolean;
  score: number;
  verdict: string;
  failures: string[];
};

type PastRun = {
  id: string;
  personaName: string;
  status: string;
  booked: boolean | null;
  score: number | null;
  verdict: string | null;
  failures: string[];
  startedAt: string;
};

/**
 * Role-play adversario. Las suites miden respuestas sueltas; esto mide si el
 * agente sabe llevar una conversación entera hasta el siguiente paso.
 */
export function SimulatorTab({ notify }: { notify: (msg: string) => void }) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [runs, setRuns] = useState<PastRun[]>([]);
  const [slug, setSlug] = useState("");
  const [maxTurns, setMaxTurns] = useState(8);
  const [running, setRunning] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch("/api/admin/agent/simulate");
    if (!res.ok) return;
    const data = await res.json();
    setPersonas(data.personas);
    setRuns(data.runs);
    if (!slug && data.personas[0]) setSlug(data.personas[0].slug);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns.length]);

  async function run() {
    if (!slug || running) return;
    setRunning(true);
    setTurns([]);
    setVerdict(null);

    try {
      const res = await fetch("/api/admin/agent/simulate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ personaSlug: slug, maxTurns }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "error");
      }

      await readNdjson(res, (event) => {
        if (event.type === "turn") {
          setTurns((prev) => [
            ...prev,
            { role: event.role as "prospect" | "agent", content: String(event.content) },
          ]);
        } else if (event.type === "verdict") {
          setVerdict({
            booked: Boolean(event.booked),
            score: Number(event.score),
            verdict: String(event.verdict),
            failures: (event.failures as string[]) ?? [],
          });
        } else if (event.type === "error") {
          notify(`Simulación interrumpida: ${String(event.error)}`);
        }
      });

      await load();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error en la simulación");
    } finally {
      setRunning(false);
    }
  }

  const persona = personas.find((p) => p.slug === slug);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <Panel
        title="Role-play"
        actions={
          <button
            onClick={run}
            disabled={running || !slug}
            className="btn-primary px-3 py-1.5 text-[11px]"
          >
            {running ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            Iniciar
          </button>
        }
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[240px] flex-1">
              <label className="text-[11px] uppercase tracking-wide text-zinc-500">
                Personaje
              </label>
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="input-field mt-1 py-2 text-xs"
              >
                {personas.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} · dificultad {p.difficulty}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <label className="text-[11px] uppercase tracking-wide text-zinc-500">
                Turnos
              </label>
              <input
                type="number"
                min={3}
                max={12}
                value={maxTurns}
                onChange={(e) => setMaxTurns(Number(e.target.value))}
                className="input-field mt-1 py-2 text-xs"
              />
            </div>
          </div>

          {persona && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 text-xs text-zinc-400">
              <p>{persona.summary}</p>
              <p className="mt-1 text-zinc-500">Objetivo: {persona.goal}</p>
            </div>
          )}

          <div
            ref={scrollRef}
            className="max-h-[520px] space-y-2 overflow-y-auto pr-1"
          >
            {turns.length === 0 ? (
              <Empty>
                {running
                  ? "Arrancando la conversación…"
                  : "Elige un personaje y lanza la simulación."}
              </Empty>
            ) : (
              turns.map((t, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 text-xs ${
                    t.role === "prospect"
                      ? "border-zinc-800 bg-zinc-900/40 text-zinc-300"
                      : "border-emerald-500/20 bg-emerald-500/5 text-zinc-200"
                  }`}
                >
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-zinc-500">
                    {t.role === "prospect" ? persona?.name ?? "Prospecto" : "Agente"}
                  </p>
                  <p className="whitespace-pre-wrap">{t.content}</p>
                </div>
              ))
            )}
            {running && turns.length > 0 && (
              <div className="flex items-center gap-2 px-1 text-[11px] text-zinc-500">
                <Loader2 className="h-3 w-3 animate-spin" /> escribiendo…
              </div>
            )}
          </div>

          {verdict && (
            <div
              className={`rounded-lg border p-4 ${
                verdict.booked
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-red-500/30 bg-red-500/10"
              }`}
            >
              <div className="flex items-center gap-2">
                {verdict.booked ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <p className="text-sm font-medium text-white">
                  {verdict.booked
                    ? "Habría agendado la llamada"
                    : "No habría agendado"}
                </p>
                <Tag tone={verdict.booked ? "emerald" : "red"}>
                  {verdict.score}
                </Tag>
              </div>
              <p className="mt-2 text-xs text-zinc-300">{verdict.verdict}</p>
              {verdict.failures.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {verdict.failures.map((f, i) => (
                    <li key={i} className="text-[11px] text-zinc-400">
                      — {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Panel>

      <Panel title="Simulaciones anteriores">
        {runs.length === 0 ? (
          <Empty>Todavía no has corrido ninguna.</Empty>
        ) : (
          <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
            {runs.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-zinc-200">
                    {r.personaName}
                  </p>
                  {r.status === "done" ? (
                    <Tag tone={r.booked ? "emerald" : "red"}>
                      {r.booked ? "agendó" : "no agendó"} {r.score ?? ""}
                    </Tag>
                  ) : (
                    <Tag tone="amber">{r.status}</Tag>
                  )}
                </div>
                <p className="mt-1 text-[10px] text-zinc-500">
                  {fmtDateTime(r.startedAt)}
                </p>
                {r.verdict && (
                  <p className="mt-1.5 line-clamp-3 text-[11px] text-zinc-400">
                    {r.verdict}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
