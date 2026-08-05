"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Loader2,
  Copy,
  Download,
  Gauge,
  FileText,
  Mail,
  Briefcase,
  Check,
} from "lucide-react";
import { PageHeader, Panel, Empty, Tag } from "./ui";

export type GeneratorOpportunity = {
  id: string;
  company: string;
  role: string;
  type: string;
  jobDescription: string | null;
  matchScore: number | null;
};

export type AssetRow = {
  id: string;
  opportunityId: string | null;
  kind: string;
  locale: string;
  title: string;
  content: string;
  createdAt: string;
};

type MatchResult = {
  score: number;
  strengths: string[];
  gaps: string[];
  talkingPoints: string[];
  summary: string;
  sourcesUsed: number;
};

const KINDS = [
  { id: "cv", label: "CV adaptado", icon: FileText },
  { id: "carta", label: "Carta", icon: Mail },
  { id: "propuesta", label: "Propuesta", icon: Briefcase },
] as const;

export function Generator({
  opportunities,
  assets: initialAssets,
  preselectedOpportunityId,
  preselectedAssetId,
  openaiConfigured,
}: {
  opportunities: GeneratorOpportunity[];
  assets: AssetRow[];
  preselectedOpportunityId?: string;
  preselectedAssetId?: string;
  openaiConfigured: boolean;
}) {
  const [assets, setAssets] = useState(initialAssets);
  const [opportunityId, setOpportunityId] = useState(
    preselectedOpportunityId || "",
  );
  const [jobDescription, setJobDescription] = useState("");
  const [locale, setLocale] = useState("es");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [activeAssetId, setActiveAssetId] = useState<string | null>(
    preselectedAssetId || null,
  );
  const [copied, setCopied] = useState(false);

  const selectedOpp = opportunities.find((o) => o.id === opportunityId) || null;

  useEffect(() => {
    if (selectedOpp?.jobDescription && !jobDescription) {
      setJobDescription(selectedOpp.jobDescription);
    }
    // Solo al cambiar de oportunidad
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunityId]);

  const activeAsset = useMemo(
    () => assets.find((a) => a.id === activeAssetId) || null,
    [assets, activeAssetId],
  );

  const relevantAssets = useMemo(
    () =>
      opportunityId
        ? assets.filter((a) => a.opportunityId === opportunityId)
        : assets,
    [assets, opportunityId],
  );

  async function generate(kind: string) {
    if (!jobDescription.trim() && !selectedOpp?.jobDescription) {
      setMessage("Pega la descripción de la oferta o elige una oportunidad con ella.");
      return;
    }
    setBusy(kind);
    setMessage("");
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          locale,
          opportunityId: opportunityId || null,
          jobDescription: jobDescription.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          data.error === "openai_not_configured"
            ? "Falta OPENAI_API_KEY"
            : data.error === "job_description_required"
              ? "Falta la descripción de la oferta"
              : data.error || "error";
        throw new Error(msg);
      }

      if (kind === "match") {
        setMatch(data);
        setMessage(
          `Match calculado con ${data.sourcesUsed} fragmentos del corpus.`,
        );
      } else {
        setAssets((prev) => [data.asset, ...prev]);
        setActiveAssetId(data.asset.id);
        setMessage(
          `${kind} generado usando ${data.sourcesUsed} fragmentos del corpus.`,
        );
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al generar");
    } finally {
      setBusy(null);
    }
  }

  async function copyActive() {
    if (!activeAsset) return;
    await navigator.clipboard.writeText(activeAsset.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadActive() {
    if (!activeAsset) return;
    const blob = new Blob([activeAsset.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeAsset.kind}-${activeAsset.id.slice(0, 6)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        title="Generador IA"
        subtitle={
          openaiConfigured
            ? "CV, carta y propuesta escritos con tu corpus real como fuente de verdad"
            : "Falta OPENAI_API_KEY: el generador no puede funcionar"
        }
      />

      <div className="space-y-5 p-6">
        {message && (
          <p className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200">
            {message}
          </p>
        )}

        <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            <Panel title="Oferta objetivo">
              <div className="space-y-3">
                <select
                  value={opportunityId}
                  onChange={(e) => setOpportunityId(e.target.value)}
                  className="input-field py-2 text-xs"
                >
                  <option value="">Sin vincular a oportunidad</option>
                  {opportunities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.role} · {o.company}
                    </option>
                  ))}
                </select>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Pega aquí la descripción de la oferta o el brief del cliente..."
                  rows={12}
                  className="input-field resize-y py-2 text-xs"
                />
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="input-field py-2 text-xs"
                >
                  <option value="es">Salida en español</option>
                  <option value="en">Output in English</option>
                </select>

                <button
                  onClick={() => generate("match")}
                  disabled={busy !== null || !openaiConfigured}
                  className="btn-secondary w-full py-2 text-xs"
                >
                  {busy === "match" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Gauge className="h-3.5 w-3.5" />
                  )}
                  Calcular match score
                </button>

                <div className="grid grid-cols-3 gap-2">
                  {KINDS.map((k) => (
                    <button
                      key={k.id}
                      onClick={() => generate(k.id)}
                      disabled={busy !== null || !openaiConfigured}
                      className="btn-primary flex-col gap-1 px-2 py-2.5 text-[11px]"
                    >
                      {busy === k.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <k.icon className="h-3.5 w-3.5" />
                      )}
                      {k.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-500">
                  El generador solo usa hechos de tu corpus. Lo que no puede
                  verificar lo deja como [marcador] para que lo completes.
                </p>
              </div>
            </Panel>

            {match && (
              <Panel
                title="Match con tu perfil"
                actions={
                  <Tag
                    tone={
                      match.score >= 70
                        ? "emerald"
                        : match.score >= 45
                          ? "amber"
                          : "red"
                    }
                  >
                    {match.score}%
                  </Tag>
                }
              >
                <div className="space-y-3 text-xs">
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-emerald-500/70"
                      style={{ width: `${match.score}%` }}
                    />
                  </div>
                  {match.summary && (
                    <p className="text-zinc-300">{match.summary}</p>
                  )}
                  {match.strengths.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-emerald-400">
                        Fortalezas
                      </p>
                      <ul className="mt-1 space-y-1 text-zinc-400">
                        {match.strengths.map((s, i) => (
                          <li key={i}>· {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {match.gaps.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-amber-400">
                        Huecos a cubrir en el corpus
                      </p>
                      <ul className="mt-1 space-y-1 text-zinc-400">
                        {match.gaps.map((g, i) => (
                          <li key={i}>· {g}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {match.talkingPoints.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-sky-400">
                        Argumentos para la entrevista
                      </p>
                      <ul className="mt-1 space-y-1 text-zinc-400">
                        {match.talkingPoints.map((t, i) => (
                          <li key={i}>· {t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Panel>
            )}

            <Panel title="Material guardado">
              {relevantAssets.length === 0 ? (
                <Empty>Aún no has generado nada.</Empty>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {relevantAssets.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setActiveAssetId(a.id)}
                      className={`flex w-full items-center justify-between gap-2 rounded-md border px-2.5 py-2 text-left text-xs transition-colors ${
                        activeAssetId === a.id
                          ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-200"
                          : "border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <span className="truncate">{a.title}</span>
                      <Tag tone="violet">{a.kind}</Tag>
                    </button>
                  ))}
                </div>
              )}
            </Panel>
          </div>

          <Panel
            title={activeAsset ? activeAsset.title : "Resultado"}
            actions={
              activeAsset && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyActive}
                    className="btn-secondary px-2.5 py-1.5 text-xs"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                  <button
                    onClick={downloadActive}
                    className="btn-secondary px-2.5 py-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" /> .md
                  </button>
                </div>
              )
            }
          >
            {!activeAsset ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-zinc-700" />
                  <p className="mt-2 text-sm text-zinc-500">
                    Elige un tipo de material para generarlo.
                  </p>
                </div>
              </div>
            ) : (
              <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 font-sans text-sm leading-relaxed text-zinc-200">
                {activeAsset.content}
              </pre>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
