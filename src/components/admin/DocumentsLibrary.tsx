"use client";

import { useMemo, useRef, useState } from "react";
import {
  Upload,
  Download,
  Trash2,
  Loader2,
  Brain,
  FileText,
  CheckCircle2,
  Search,
} from "lucide-react";
import { PageHeader, Panel, Empty, Tag, Stat, fmtDay } from "./ui";

export type DocumentRow = {
  id: string;
  title: string;
  kind: string;
  lang: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  version: number;
  tags: string[];
  hasText: boolean;
  textChars: number;
  knowledgeEntryId: string | null;
  createdAt: string;
};

const KINDS = ["cv", "propuesta", "certificado", "caso", "otro"];

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsLibrary({
  initial,
  openaiConfigured,
}: {
  initial: DocumentRow[];
  openaiConfigured: boolean;
}) {
  const [docs, setDocs] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("cv");
  const [lang, setLang] = useState("es");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [filterKind, setFilterKind] = useState("");
  const [q, setQ] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return docs.filter((d) => {
      if (filterKind && d.kind !== filterKind) return false;
      if (needle) {
        return (
          d.title.toLowerCase().includes(needle) ||
          d.filename.toLowerCase().includes(needle) ||
          d.tags.join(" ").toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [docs, filterKind, q]);

  const stats = useMemo(
    () => ({
      total: docs.length,
      inRag: docs.filter((d) => d.knowledgeEntryId).length,
      withText: docs.filter((d) => d.hasText).length,
      size: docs.reduce((s, d) => s + d.sizeBytes, 0),
    }),
    [docs],
  );

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setMessage("Selecciona un archivo.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("kind", kind);
      fd.set("lang", lang);
      if (title.trim()) fd.set("title", title.trim());
      if (tags.trim()) fd.set("tags", tags.trim());

      const res = await fetch("/api/admin/documents", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          data.error === "file_too_large"
            ? "Archivo demasiado grande"
            : data.error === "mime_not_allowed"
              ? `Formato no permitido (${data.mimeType})`
              : data.error || "error";
        throw new Error(msg);
      }
      setDocs((prev) => [data.document, ...prev]);
      setTitle("");
      setTags("");
      if (fileRef.current) fileRef.current.value = "";
      setMessage(
        data.document.hasText
          ? `Subido. Texto extraído: ${data.document.textChars} caracteres.`
          : "Subido. Sin texto extraíble (puedes descargarlo igual).",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setBusy(false);
    }
  }

  async function sendToRag(id: string) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/documents/${id}/ingest`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          data.error === "openai_not_configured"
            ? "Falta OPENAI_API_KEY"
            : data.error === "no_text_to_ingest"
              ? "Este archivo no tiene texto extraíble"
              : data.error || "error";
        throw new Error(msg);
      }
      setDocs((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, knowledgeEntryId: data.entryId } : d,
        ),
      );
      setMessage(`Enviado al RAG: ${data.chunks} chunks indexados.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al indexar");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Borrar el documento y su archivo?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("error");
      setDocs((prev) => prev.filter((d) => d.id !== id));
      setMessage("Documento borrado.");
    } catch {
      setMessage("No se pudo borrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Documentos"
        subtitle="CV, propuestas, certificados y casos. Se guardan en el volumen del servidor y pueden alimentar el RAG."
      />

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={FileText} label="Documentos" value={stats.total} />
          <Stat icon={Brain} label="En el RAG" value={stats.inRag} />
          <Stat label="Con texto" value={stats.withText} />
          <Stat label="Espacio" value={fmtSize(stats.size)} />
        </div>

        {message && (
          <p className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200">
            {message}
          </p>
        )}

        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <Panel
            title="Biblioteca"
            actions={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar..."
                    className="input-field w-40 py-1.5 pl-7 text-xs"
                  />
                </div>
                <select
                  value={filterKind}
                  onChange={(e) => setFilterKind(e.target.value)}
                  className="input-field w-auto py-1.5 text-xs"
                >
                  <option value="">Todos</option>
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {filtered.length === 0 ? (
              <Empty>Sin documentos. Sube tu CV para empezar.</Empty>
            ) : (
              <div className="space-y-2">
                {filtered.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-100">
                          {d.title}
                          {d.version > 1 && (
                            <span className="ml-1.5 text-xs text-zinc-500">
                              v{d.version}
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {d.filename} · {fmtSize(d.sizeBytes)} ·{" "}
                          {fmtDay(d.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <a
                          href={`/api/admin/documents/${d.id}/download`}
                          className="text-zinc-500 hover:text-emerald-400"
                          title="Descargar"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => remove(d.id)}
                          disabled={busy}
                          className="text-zinc-500 hover:text-red-400"
                          title="Borrar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Tag>{d.kind}</Tag>
                      <Tag>{d.lang}</Tag>
                      {d.hasText ? (
                        <Tag tone="neutral">{d.textChars} chars</Tag>
                      ) : (
                        <Tag tone="amber">sin texto</Tag>
                      )}
                      {d.tags.map((t) => (
                        <Tag key={t} tone="sky">
                          {t}
                        </Tag>
                      ))}
                      {d.knowledgeEntryId ? (
                        <span className="ml-auto flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> en el RAG
                          <button
                            onClick={() => sendToRag(d.id)}
                            disabled={busy || !openaiConfigured}
                            className="ml-1.5 text-zinc-500 hover:text-emerald-300"
                            title="Reindexar"
                          >
                            actualizar
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => sendToRag(d.id)}
                          disabled={busy || !d.hasText || !openaiConfigured}
                          className="ml-auto flex items-center gap-1 text-[11px] text-emerald-400 hover:underline disabled:text-zinc-600 disabled:no-underline"
                        >
                          <Brain className="h-3 w-3" /> Enviar al RAG
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Subir documento">
            <div className="space-y-3">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md,.json,.png,.jpg,.jpeg"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-2 file:py-1 file:text-xs file:text-zinc-200"
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título (opcional, por defecto el nombre del archivo)"
                className="input-field py-2 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                  className="input-field py-2 text-xs"
                >
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="input-field py-2 text-xs"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags separados por coma"
                className="input-field py-2 text-xs"
              />
              <button
                onClick={upload}
                disabled={busy}
                className="btn-primary w-full py-2 text-xs"
              >
                {busy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Subir
              </button>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                PDF y DOCX se convierten a texto automáticamente para poder
                enviarlos al RAG. Las imágenes se guardan pero no se indexan.
                {!openaiConfigured && " Falta OPENAI_API_KEY para indexar."}
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
