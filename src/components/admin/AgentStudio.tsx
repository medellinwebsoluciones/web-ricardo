"use client";

import { useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Send,
  AlertTriangle,
  BookOpen,
  MessagesSquare,
  GraduationCap,
  Save,
  Search,
} from "lucide-react";
import { PageHeader, Panel, Empty, Tag, Stat } from "./ui";
import {
  INTERVIEW_QUESTIONS,
  INTERVIEW_CATEGORIES,
} from "@/lib/interview-bank";

export type CorpusCollection = {
  id: string;
  slug: string;
  name: string;
  isPublic: boolean;
};

export type CorpusEntry = {
  id: string;
  collectionId: string;
  title: string;
  sourceType: string;
  sourceRef: string | null;
  lang: string;
  trustTier: string;
  content: string;
  chunks: number;
  createdAt: string;
};

type Source = {
  id: string;
  title: string;
  sourceRef: string | null;
  similarity: number;
  excerpt: string;
};

type TestResult = {
  answer: string;
  sources: Source[];
  gap: boolean;
  bestSimilarity: number;
};

type Tab = "corpus" | "playground" | "simulador";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "corpus", label: "Corpus", icon: BookOpen },
  { id: "playground", label: "Playground", icon: MessagesSquare },
  { id: "simulador", label: "Simulador entrevista", icon: GraduationCap },
];

export function AgentStudio({
  collections,
  entries: initialEntries,
  totalChunks,
  openaiConfigured,
}: {
  collections: CorpusCollection[];
  entries: CorpusEntry[];
  totalChunks: number;
  openaiConfigured: boolean;
}) {
  const [tab, setTab] = useState<Tab>("corpus");
  const [entries, setEntries] = useState(initialEntries);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // --- Corpus ---
  const [q, setQ] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    lang: "es",
    collectionId: "",
  });

  // --- Playground / simulador ---
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [mode, setMode] = useState<"normal" | "entrevista">("normal");
  const [category, setCategory] = useState<string>(INTERVIEW_CATEGORIES[0]);
  const [correction, setCorrection] = useState("");

  const collectionName = useMemo(() => {
    const map = new Map(collections.map((c) => [c.id, c.name]));
    return (id: string) => map.get(id) || "—";
  }, [collections]);

  const filteredEntries = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (collectionFilter && e.collectionId !== collectionFilter) return false;
      if (needle) {
        return (
          e.title.toLowerCase().includes(needle) ||
          e.content.toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [entries, q, collectionFilter]);

  const unindexed = entries.filter((e) => e.chunks === 0).length;

  async function refreshCorpus() {
    const res = await fetch("/api/admin/corpus");
    if (res.ok) {
      const data = await res.json();
      setEntries(data.entries);
    }
  }

  async function saveEntry() {
    if (!form.title.trim() || !form.content.trim()) {
      setMessage("Título y contenido son obligatorios.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const url = editingId
        ? `/api/admin/corpus/${editingId}`
        : "/api/admin/corpus";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          lang: form.lang,
          ...(form.collectionId ? { collectionId: form.collectionId } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      if (data.warning === "openai_not_configured") {
        setMessage("Guardado, pero sin OPENAI_API_KEY no se generaron embeddings.");
      } else {
        setMessage(
          editingId
            ? "Entrada actualizada y reindexada."
            : `Entrada creada con ${data.chunks} chunks.`,
        );
      }
      setForm({ title: "", content: "", lang: "es", collectionId: "" });
      setEditingId(null);
      await refreshCorpus();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setBusy(false);
    }
  }

  async function reindex(id: string) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/corpus/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "reindex" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setMessage(`Reindexado: ${data.chunks} chunks.`);
      await refreshCorpus();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al reindexar");
    } finally {
      setBusy(false);
    }
  }

  async function removeEntry(id: string) {
    if (!confirm("¿Borrar esta entrada del corpus?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/corpus/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("error");
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setMessage("Entrada borrada.");
    } catch {
      setMessage("No se pudo borrar.");
    } finally {
      setBusy(false);
    }
  }

  async function runTest(text: string, testMode: "normal" | "entrevista") {
    const question = text.trim();
    if (!question) return;
    setBusy(true);
    setMessage("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/agent/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: question, mode: testMode }),
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
      setMessage(e instanceof Error ? e.message : "Error al probar el agente");
    } finally {
      setBusy(false);
    }
  }

  /** Guarda la respuesta corregida como conocimiento nuevo (bucle de entrenamiento). */
  async function saveCorrection() {
    if (!prompt.trim() || !correction.trim()) {
      setMessage("Escribe la pregunta y la respuesta correcta.");
      return;
    }
    setBusy(true);
    setMessage("");
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
      setMessage(
        data.warning === "openai_not_configured"
          ? "Guardado, pero falta OPENAI_API_KEY para indexar."
          : `Entrenado: ${data.chunks} chunks añadidos al corpus.`,
      );
      setCorrection("");
      await refreshCorpus();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al entrenar");
    } finally {
      setBusy(false);
    }
  }

  function seedFromGap() {
    setTab("corpus");
    setForm({
      title: prompt.slice(0, 120),
      content: `Pregunta sin contexto suficiente: ${prompt}\n\nRespuesta correcta:\n`,
      lang: "es",
      collectionId: "",
    });
    setEditingId(null);
  }

  const questions = INTERVIEW_QUESTIONS.filter((q) => q.category === category);

  return (
    <>
      <PageHeader
        title="Agente / RAG"
        subtitle={
          openaiConfigured
            ? "Entrena el corpus, prueba respuestas y simula entrevistas"
            : "Falta OPENAI_API_KEY: puedes editar el corpus pero no indexar ni probar"
        }
      />

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Entradas" value={entries.length} />
          <Stat label="Chunks indexados" value={totalChunks} />
          <Stat label="Colecciones" value={collections.length} />
          <Stat
            label="Sin indexar"
            value={unindexed}
            sub={unindexed > 0 ? "Requieren reindexado" : "Todo indexado"}
          />
        </div>

        <div className="flex flex-wrap gap-1 border-b border-zinc-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-xs transition-colors ${
                tab === t.id
                  ? "border-emerald-500 text-emerald-300"
                  : "border-transparent text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {message && (
          <p className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200">
            {message}
          </p>
        )}

        {tab === "corpus" && (
          <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
            <Panel
              title="Entradas del corpus"
              actions={
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Buscar..."
                      className="input-field w-44 py-1.5 pl-7 text-xs"
                    />
                  </div>
                  <select
                    value={collectionFilter}
                    onChange={(e) => setCollectionFilter(e.target.value)}
                    className="input-field w-auto py-1.5 text-xs"
                  >
                    <option value="">Todas</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              }
            >
              {filteredEntries.length === 0 ? (
                <Empty>Sin entradas. Añade conocimiento a la derecha.</Empty>
              ) : (
                <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
                  {filteredEntries.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-100">
                            {e.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                            {e.content.slice(0, 180)}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            onClick={() => reindex(e.id)}
                            disabled={busy}
                            className="text-zinc-500 hover:text-emerald-400"
                            title="Reindexar"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => removeEntry(e.id)}
                            disabled={busy}
                            className="text-zinc-500 hover:text-red-400"
                            title="Borrar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Tag tone={e.chunks > 0 ? "emerald" : "amber"}>
                          {e.chunks} chunks
                        </Tag>
                        <Tag>{e.lang}</Tag>
                        <Tag>{e.sourceType}</Tag>
                        <Tag>{collectionName(e.collectionId)}</Tag>
                        <button
                          onClick={() => {
                            setEditingId(e.id);
                            setForm({
                              title: e.title,
                              content: e.content,
                              lang: e.lang,
                              collectionId: e.collectionId,
                            });
                          }}
                          className="ml-auto text-[11px] text-emerald-400 hover:underline"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel
              title={editingId ? "Editar entrada" : "Añadir conocimiento"}
              actions={
                editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setForm({
                        title: "",
                        content: "",
                        lang: "es",
                        collectionId: "",
                      });
                    }}
                    className="text-[11px] text-zinc-400 hover:text-zinc-100"
                  >
                    Cancelar
                  </button>
                )
              }
            >
              <div className="space-y-3">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Título (ej. Experiencia con Kubernetes)"
                  className="input-field py-2 text-xs"
                />
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Contenido: pega tu CV, un caso de éxito, la respuesta a una pregunta típica..."
                  rows={12}
                  className="input-field resize-y py-2 text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={form.lang}
                    onChange={(e) => setForm({ ...form, lang: e.target.value })}
                    className="input-field py-2 text-xs"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                  <select
                    value={form.collectionId}
                    onChange={(e) =>
                      setForm({ ...form, collectionId: e.target.value })
                    }
                    className="input-field py-2 text-xs"
                  >
                    <option value="">Colección: entrenamiento</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={saveEntry}
                  disabled={busy}
                  className="btn-primary w-full py-2 text-xs"
                >
                  {busy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  {editingId ? "Guardar y reindexar" : "Añadir y indexar"}
                </button>
              </div>
            </Panel>
          </div>
        )}

        {(tab === "playground" || tab === "simulador") && (
          <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
            <Panel
              title={
                tab === "simulador"
                  ? "Simulador de entrevista"
                  : "Playground del agente"
              }
            >
              <div className="space-y-3">
                {tab === "simulador" && (
                  <>
                    <div className="flex flex-wrap gap-1.5">
                      {INTERVIEW_CATEGORIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategory(c)}
                          className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                            category === c
                              ? "border-emerald-500/40 text-emerald-300"
                              : "border-zinc-800 text-zinc-400 hover:text-zinc-100"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      {questions.map((qq) => (
                        <button
                          key={qq.id}
                          onClick={() => {
                            setPrompt(qq.es);
                            setMode("entrevista");
                            runTest(qq.es, "entrevista");
                          }}
                          className="block w-full rounded-md border border-zinc-800 px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-white"
                        >
                          {qq.es}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    tab === "simulador"
                      ? "O escribe tu propia pregunta de entrevista..."
                      : "Pregunta lo que un prospecto preguntaría..."
                  }
                  rows={3}
                  className="input-field resize-y py-2 text-xs"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      runTest(prompt, tab === "simulador" ? "entrevista" : mode)
                    }
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
                  {tab === "playground" && (
                    <label className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <input
                        type="checkbox"
                        checked={mode === "entrevista"}
                        onChange={(e) =>
                          setMode(e.target.checked ? "entrevista" : "normal")
                        }
                      />
                      Modo reclutador
                    </label>
                  )}
                </div>

                {result && (
                  <div className="space-y-3">
                    {result.gap && (
                      <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <div>
                          <p>
                            Falta contexto en el corpus (mejor similitud{" "}
                            {result.bestSimilarity}). La respuesta puede ser
                            genérica.
                          </p>
                          <button
                            onClick={seedFromGap}
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
                        <Save className="h-3.5 w-3.5" /> Guardar como
                        conocimiento
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Panel>

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
        )}
      </div>
    </>
  );
}
