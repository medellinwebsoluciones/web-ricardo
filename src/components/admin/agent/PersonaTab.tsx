"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Copy, Trash2, Save } from "lucide-react";
import { Panel, Empty, Tag } from "../ui";
import type { PersonaVersion } from "./types";

type Meta = {
  audiences: { key: string; label: string }[];
  stages: { key: string; label: string }[];
};

/**
 * Editor de la persona por capas. El núcleo (identidad y grounding) no se
 * expone a propósito: es lo que impide que el agente invente precios, y no
 * debería poder desactivarse desde una caja de texto.
 */
export function PersonaTab({ notify }: { notify: (msg: string) => void }) {
  const [versions, setVersions] = useState<PersonaVersion[]>([]);
  const [meta, setMeta] = useState<Meta>({ audiences: [], stages: [] });
  const [selectedId, setSelectedId] = useState<string>("");
  const [draft, setDraft] = useState<PersonaVersion | null>(null);
  const [layerKey, setLayerKey] = useState("psicologia");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load(keepId?: string) {
    const res = await fetch("/api/admin/agent/persona");
    if (!res.ok) {
      notify("No se pudo cargar la persona.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setVersions(data.versions);
    setMeta(data.meta);
    const target =
      data.versions.find((v: PersonaVersion) => v.id === keepId) ??
      data.versions.find((v: PersonaVersion) => v.isActive) ??
      data.versions[0];
    if (target) {
      setSelectedId(target.id);
      setDraft(target);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(id: string) {
    const v = versions.find((x) => x.id === id);
    if (!v) return;
    setSelectedId(id);
    setDraft(v);
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/persona", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: draft.id,
          name: draft.name,
          notes: draft.notes,
          psychologyLayer: draft.psychologyLayer,
          audienceLayers: draft.audienceLayers,
          stageLayers: draft.stageLayers,
          model: draft.model,
          temperature: draft.temperature,
          maxTokens: draft.maxTokens,
        }),
      });
      if (!res.ok) throw new Error("error");
      notify("Versión guardada.");
      await load(draft.id);
    } catch {
      notify("No se pudo guardar la versión.");
    } finally {
      setBusy(false);
    }
  }

  async function duplicate() {
    if (!draft) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/persona", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fromId: draft.id,
          name: `${draft.name} (copia)`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("error");
      notify(`Versión ${data.version} creada. Edítala y actívala cuando esté lista.`);
      await load(data.id);
    } catch {
      notify("No se pudo duplicar.");
    } finally {
      setBusy(false);
    }
  }

  async function activate() {
    if (!draft) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agent/persona", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: draft.id, activate: true }),
      });
      if (!res.ok) throw new Error("error");
      notify(`Versión ${draft.version} activa. El chat público ya la usa.`);
      await load(draft.id);
    } catch {
      notify("No se pudo activar.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!draft || draft.isActive) return;
    if (!confirm(`¿Borrar la versión ${draft.version}?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/agent/persona?id=${draft.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("error");
      notify("Versión borrada.");
      await load();
    } catch {
      notify("No se pudo borrar.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <Panel title="Persona">
        <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
      </Panel>
    );
  }

  if (!draft) {
    return (
      <Panel title="Persona">
        <Empty>No hay ninguna versión de persona todavía.</Empty>
      </Panel>
    );
  }

  const layerValue =
    layerKey === "psicologia"
      ? draft.psychologyLayer
      : layerKey.startsWith("aud:")
        ? (draft.audienceLayers[layerKey.slice(4)] ?? "")
        : (draft.stageLayers[layerKey.slice(4)] ?? "");

  function setLayerValue(value: string) {
    if (!draft) return;
    if (layerKey === "psicologia") {
      setDraft({ ...draft, psychologyLayer: value });
    } else if (layerKey.startsWith("aud:")) {
      setDraft({
        ...draft,
        audienceLayers: { ...draft.audienceLayers, [layerKey.slice(4)]: value },
      });
    } else {
      setDraft({
        ...draft,
        stageLayers: { ...draft.stageLayers, [layerKey.slice(4)]: value },
      });
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <Panel title="Versiones">
          <div className="space-y-1.5">
            {versions.map((v) => (
              <button
                key={v.id}
                onClick={() => select(v.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                  selectedId === v.id
                    ? "border-emerald-500/40 text-emerald-300"
                    : "border-zinc-800 text-zinc-400 hover:text-zinc-100"
                }`}
              >
                <span className="truncate">
                  v{v.version} · {v.name}
                </span>
                {v.isActive && <Tag tone="emerald">activa</Tag>}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Ajustes del modelo">
          <div className="space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-wide text-zinc-500">
                Modelo
              </label>
              <input
                value={draft.model}
                onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                className="input-field mt-1 py-2 text-xs"
                placeholder="gpt-4o o ft:gpt-4o-mini:..."
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] uppercase tracking-wide text-zinc-500">
                  Temperatura
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1.5"
                  value={draft.temperature}
                  onChange={(e) =>
                    setDraft({ ...draft, temperature: Number(e.target.value) })
                  }
                  className="input-field mt-1 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-zinc-500">
                  Máx. tokens
                </label>
                <input
                  type="number"
                  step="50"
                  min="100"
                  max="4000"
                  value={draft.maxTokens}
                  onChange={(e) =>
                    setDraft({ ...draft, maxTokens: Number(e.target.value) })
                  }
                  className="input-field mt-1 py-2 text-xs"
                />
              </div>
            </div>
            <p className="text-[11px] text-zinc-500">
              Con temperatura por debajo de 0.5 el agente repite las mismas
              fórmulas turno a turno y suena a plantilla.
            </p>
          </div>
        </Panel>
      </div>

      <Panel
        title={`v${draft.version} · ${draft.name}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="btn-secondary px-3 py-1.5 text-[11px]"
            >
              <Save className="h-3 w-3" /> Guardar
            </button>
            <button
              onClick={duplicate}
              disabled={busy}
              className="btn-secondary px-3 py-1.5 text-[11px]"
            >
              <Copy className="h-3 w-3" /> Duplicar
            </button>
            {!draft.isActive && (
              <>
                <button
                  onClick={activate}
                  disabled={busy}
                  className="btn-primary px-3 py-1.5 text-[11px]"
                >
                  <CheckCircle2 className="h-3 w-3" /> Activar
                </button>
                <button
                  onClick={remove}
                  disabled={busy}
                  className="text-zinc-500 hover:text-red-400"
                  title="Borrar versión"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        }
      >
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Nombre de la versión"
              className="input-field py-2 text-xs"
            />
            <input
              value={draft.notes ?? ""}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              placeholder="Qué cambia respecto a la anterior"
              className="input-field py-2 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <LayerButton
              active={layerKey === "psicologia"}
              onClick={() => setLayerKey("psicologia")}
              label="Psicológica"
            />
            {meta.audiences.map((a) => (
              <LayerButton
                key={a.key}
                active={layerKey === `aud:${a.key}`}
                onClick={() => setLayerKey(`aud:${a.key}`)}
                label={a.label}
              />
            ))}
            {meta.stages.map((s) => (
              <LayerButton
                key={s.key}
                active={layerKey === `stg:${s.key}`}
                onClick={() => setLayerKey(`stg:${s.key}`)}
                label={s.label}
              />
            ))}
          </div>

          <textarea
            value={layerValue}
            onChange={(e) => setLayerValue(e.target.value)}
            rows={22}
            className="input-field resize-y py-2 font-mono text-[11px] leading-relaxed"
          />
          <p className="text-[11px] text-zinc-500">
            Estas capas se componen sobre un núcleo fijo que prohíbe inventar
            precios, cifras y clientes. Ese núcleo no es editable desde aquí.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function LayerButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
        active
          ? "border-emerald-500/40 text-emerald-300"
          : "border-zinc-800 text-zinc-400 hover:text-zinc-100"
      }`}
    >
      {label}
    </button>
  );
}
