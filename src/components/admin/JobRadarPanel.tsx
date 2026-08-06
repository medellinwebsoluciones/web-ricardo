"use client";

import { useEffect, useState } from "react";
import { Loader2, Radar, Bookmark, Mail, X } from "lucide-react";
import { Panel, Empty, Tag } from "./ui";

type RadarPreview = {
  source: string;
  company: string;
  role: string;
  url: string;
  location: string | null;
  tags: string[];
};

type ScanSummary = {
  fetched: number;
  scored: number;
  saved: number;
  skipped: number;
};

export function JobRadarPanel({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<RadarPreview[]>([]);
  const [summary, setSummary] = useState<ScanSummary | null>(null);
  const [message, setMessage] = useState("");
  const [bookmarklet, setBookmarklet] = useState("");
  const [minScore, setMinScore] = useState(48);
  const [emailText, setEmailText] = useState("");

  useEffect(() => {
    if (!open) return;
    void loadBookmarklet();
  }, [open]);

  async function loadBookmarklet() {
    try {
      const res = await fetch("/api/admin/opportunities/bookmarklet");
      const data = await res.json();
      if (res.ok) setBookmarklet(data.bookmarklet || "");
    } catch {
      /* ignore */
    }
  }

  async function previewRadar() {
    setBusy(true);
    setMessage("");
    setSummary(null);
    try {
      const res = await fetch("/api/admin/opportunities/radar?limit=15");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setPreview(data.hits || []);
      setMessage(`${(data.hits || []).length} ofertas filtradas por tu perfil.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al previsualizar");
    } finally {
      setBusy(false);
    }
  }

  async function runScan() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/opportunities/radar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ limit: 20, minScore }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setSummary({
        fetched: data.fetched,
        scored: data.scored,
        saved: data.saved,
        skipped: data.skipped,
      });
      setMessage(
        `Radar: ${data.saved} guardadas, ${data.skipped} descartadas (umbral ${minScore}%).`,
      );
      if (data.saved > 0) onSaved();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al escanear");
    } finally {
      setBusy(false);
    }
  }

  async function ingestEmail() {
    if (emailText.trim().length < 40) {
      setMessage("Pega el texto de la alerta de LinkedIn / email.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/opportunities/ingest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "email",
          jobDescription: emailText,
          saveAll: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setMessage(
        data.saved
          ? `Guardada: ${data.score.verdict} (${data.score.score}%)`
          : `No guardada: ${data.reason}`,
      );
      setEmailText("");
      if (data.saved) onSaved();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al importar email");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <Panel
      title="Radar de ofertas"
      actions={
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-200"
          aria-label="Cerrar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs text-zinc-400">
            Escanea RemoteOK, Remotive y Arbeitnow (APIs públicas). LinkedIn no
            se scrapea: usa el bookmarklet o la extensión en la oferta abierta.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-zinc-400">
              Umbral{" "}
              <input
                type="number"
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value) || 0)}
                className="input-field ml-1 w-16 py-1 text-xs"
              />
            </label>
            <button
              onClick={previewRadar}
              disabled={busy}
              className="btn-secondary px-3 py-2 text-xs"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Radar className="h-3.5 w-3.5" />
              )}
              Previsualizar
            </button>
            <button
              onClick={runScan}
              disabled={busy}
              className="btn-primary px-3 py-2 text-xs"
            >
              Escanear y guardar
            </button>
          </div>

          {summary && (
            <div className="flex flex-wrap gap-1.5">
              <Tag>fetched {summary.fetched}</Tag>
              <Tag tone="emerald">saved {summary.saved}</Tag>
              <Tag tone="amber">skipped {summary.skipped}</Tag>
            </div>
          )}

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {preview.length === 0 ? (
              <Empty>Pulsa Previsualizar para ver candidatas.</Empty>
            ) : (
              preview.map((h) => (
                <a
                  key={`${h.source}-${h.url}`}
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5 hover:border-zinc-700"
                >
                  <p className="truncate text-xs font-medium text-zinc-100">
                    {h.role}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {h.company} · {h.source}
                    {h.location ? ` · ${h.location}` : ""}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {h.tags.slice(0, 5).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-200">
              <Bookmark className="h-3.5 w-3.5 text-emerald-400" />
              Bookmarklet LinkedIn
            </div>
            <p className="mb-2 text-[11px] text-zinc-500">
              En LinkedIn abre una oferta → haz clic en el favorito. Se abre este
              panel con el texto listo (hace falta sesión admin en el navegador).
            </p>
            {bookmarklet ? (
              <a
                href={bookmarklet}
                onClick={(e) => e.preventDefault()}
                draggable
                className="btn-secondary inline-flex px-3 py-2 text-xs"
                title="Arrastra a favoritos"
              >
                ★ Enviar a Oportunidades
              </a>
            ) : (
              <p className="text-[11px] text-zinc-600">Cargando bookmarklet…</p>
            )}
            <p className="mt-2 text-[11px] text-zinc-600">
              Extensión Chrome: carga la carpeta{" "}
              <code className="text-zinc-400">extensions/linkedin-job-ingest</code>{" "}
              en chrome://extensions (modo desarrollador).
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-200">
              <Mail className="h-3.5 w-3.5 text-sky-400" />
              Alerta de email
            </div>
            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              rows={6}
              placeholder="Pega aquí el cuerpo de una alerta de LinkedIn Jobs o un email de oferta…"
              className="input-field resize-y py-2 text-xs"
            />
            <button
              onClick={ingestEmail}
              disabled={busy}
              className="btn-secondary mt-2 px-3 py-2 text-xs"
            >
              Importar alerta
            </button>
          </div>
        </div>
      </div>

      {message && (
        <p className="mt-3 rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200">
          {message}
        </p>
      )}
    </Panel>
  );
}
