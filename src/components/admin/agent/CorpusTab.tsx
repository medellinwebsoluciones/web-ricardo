"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCw, Trash2, Search } from "lucide-react";
import { Panel, Empty, Tag } from "../ui";
import type { CorpusCollection, CorpusEntry } from "./types";

export type CorpusForm = {
  title: string;
  content: string;
  lang: string;
  collectionId: string;
};

export const EMPTY_FORM: CorpusForm = {
  title: "",
  content: "",
  lang: "es",
  collectionId: "",
};

export function CorpusTab({
  collections,
  entries,
  form,
  setForm,
  editingId,
  setEditingId,
  busy,
  onSave,
  onReindex,
  onDelete,
}: {
  collections: CorpusCollection[];
  entries: CorpusEntry[];
  form: CorpusForm;
  setForm: (f: CorpusForm) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  busy: boolean;
  onSave: () => void;
  onReindex: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");

  const collectionName = useMemo(() => {
    const map = new Map(collections.map((c) => [c.id, c.name]));
    return (id: string) => map.get(id) || "—";
  }, [collections]);

  const filtered = useMemo(() => {
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

  return (
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
        {filtered.length === 0 ? (
          <Empty>Sin entradas. Añade conocimiento a la derecha.</Empty>
        ) : (
          <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
            {filtered.map((e) => (
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
                      onClick={() => onReindex(e.id)}
                      disabled={busy}
                      className="text-zinc-500 hover:text-emerald-400"
                      title="Reindexar"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(e.id)}
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
                setForm(EMPTY_FORM);
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
              onChange={(e) => setForm({ ...form, collectionId: e.target.value })}
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
            onClick={onSave}
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
  );
}
