"use client";

import { useState } from "react";
import {
  BookOpen,
  MessagesSquare,
  GraduationCap,
  UserCog,
  BarChart3,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { PageHeader, Stat } from "./ui";
import { CorpusTab, EMPTY_FORM, type CorpusForm } from "./agent/CorpusTab";
import { PersonaTab } from "./agent/PersonaTab";
import { PlaygroundTab } from "./agent/PlaygroundTab";
import { SimulatorTab } from "./agent/SimulatorTab";
import { EvalsTab } from "./agent/EvalsTab";
import { GapsTab } from "./agent/GapsTab";
import { FinetuneTab } from "./agent/FinetuneTab";
import type { CorpusCollection, CorpusEntry } from "./agent/types";

export type { CorpusCollection, CorpusEntry };

type Tab =
  | "corpus"
  | "persona"
  | "playground"
  | "simulador"
  | "evaluaciones"
  | "huecos"
  | "finetuning";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "corpus", label: "Corpus", icon: BookOpen },
  { id: "persona", label: "Persona", icon: UserCog },
  { id: "playground", label: "Playground", icon: MessagesSquare },
  { id: "simulador", label: "Simulador", icon: GraduationCap },
  { id: "evaluaciones", label: "Evaluaciones", icon: BarChart3 },
  { id: "huecos", label: "Huecos", icon: HelpCircle },
  { id: "finetuning", label: "Entrenamiento", icon: Sparkles },
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CorpusForm>(EMPTY_FORM);

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
      setMessage(
        data.warning === "openai_not_configured"
          ? "Guardado, pero sin OPENAI_API_KEY no se generaron embeddings."
          : editingId
            ? "Entrada actualizada y reindexada."
            : `Entrada creada con ${data.chunks} chunks.`,
      );
      setForm(EMPTY_FORM);
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

  /** Lleva una pregunta sin cobertura al formulario del corpus. */
  function seedCorpus(title: string, draft: string) {
    setTab("corpus");
    setEditingId(null);
    setForm({
      title: title.slice(0, 120),
      content: draft,
      lang: "es",
      collectionId: "",
    });
  }

  /** Guarda al corpus la respuesta mejorada que sugirió el juez. */
  async function saveImproved(question: string, answer: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/corpus", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: `Respuesta: ${question.slice(0, 120)}`,
          content: `Pregunta: ${question}\n\nRespuesta correcta de Ricardo:\n${answer}`,
          sourceType: "faq",
          trustTier: "canonical",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setMessage(`Guardado al corpus: ${data.chunks} chunks.`);
      await refreshCorpus();
    } catch {
      setMessage("No se pudo guardar la respuesta mejorada.");
    } finally {
      setBusy(false);
    }
  }

  /** Par preferencia: preferred=improved, rejected=respuesta original. */
  async function savePreferencePair(
    question: string,
    preferred: string,
    rejected: string,
    audience: string,
  ) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/finetune", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "create",
          question,
          answer: preferred,
          rejectedAnswer: rejected,
          audience,
          source: "preferencia",
          approved: false,
          tags: ["from_eval"],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      setMessage(
        "Par preferencia añadido al dataset (por revisar en Entrenamiento).",
      );
    } catch {
      setMessage("No se pudo guardar el par preferencia.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Agente / RAG"
        subtitle={
          openaiConfigured
            ? "Corpus, persona por capas, evaluación con rúbricas y role-play adversario"
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
          <CorpusTab
            collections={collections}
            entries={entries}
            form={form}
            setForm={setForm}
            editingId={editingId}
            setEditingId={setEditingId}
            busy={busy}
            onSave={saveEntry}
            onReindex={reindex}
            onDelete={removeEntry}
          />
        )}
        {tab === "persona" && <PersonaTab notify={setMessage} />}
        {tab === "playground" && (
          <PlaygroundTab notify={setMessage} onSeedCorpus={seedCorpus} />
        )}
        {tab === "simulador" && <SimulatorTab notify={setMessage} />}
        {tab === "evaluaciones" && (
          <EvalsTab
            notify={setMessage}
            onSaveExample={saveImproved}
            onSavePreference={savePreferencePair}
          />
        )}
        {tab === "huecos" && <GapsTab notify={setMessage} />}
        {tab === "finetuning" && (
          <FinetuneTab notify={setMessage} onNavigate={(t) => setTab(t as Tab)} />
        )}
      </div>
    </>
  );
}
