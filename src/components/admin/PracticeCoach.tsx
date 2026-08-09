"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  Loader2,
  MessageSquare,
  Users,
  ListChecks,
  Wand2,
  BookOpen,
  LineChart,
  Send,
  Check,
  X,
} from "lucide-react";
import { PageHeader, Panel, Empty, Tag } from "./ui";
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Tab =
  | "interview"
  | "meeting"
  | "drill"
  | "coach"
  | "vocab"
  | "progress";

type VocabSub = "terms" | "acronyms" | "phrases" | "scripts";

type PanelInfo = {
  id: string;
  name: string;
  audience: string;
  description: string;
};

type MeetingInfo = {
  slug: string;
  titleEn: string;
  titleEs: string;
  summary?: string;
  difficulty: string;
};

type Feedback = {
  scores: Record<string, number>;
  score: number;
  diagnosis: string;
  nativeRewrite: string;
  tips: string[];
  suggestedConnectors: string[];
  glossaryHits: string[];
};

type Turn = {
  role: "user" | "assistant";
  content: string;
  feedback?: Feedback | null;
};

type OpportunityOpt = {
  id: string;
  company: string;
  role: string;
  stage: string;
};

const TABS: { id: Tab; label: string; icon: typeof GraduationCap }[] = [
  { id: "interview", label: "Entrevista", icon: MessageSquare },
  { id: "meeting", label: "Reunión", icon: Users },
  { id: "drill", label: "Drills", icon: ListChecks },
  { id: "coach", label: "Coach", icon: Wand2 },
  { id: "vocab", label: "Vocabulario", icon: BookOpen },
  { id: "progress", label: "Progreso", icon: LineChart },
];

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || `HTTP ${res.status}`,
    );
  }
  return data as T;
}

export function PracticeCoach({
  opportunities,
  initialMode,
  initialOpportunityId,
}: {
  opportunities: OpportunityOpt[];
  initialMode?: string;
  initialOpportunityId?: string;
}) {
  const [tab, setTab] = useState<Tab>(
    (["interview", "meeting", "drill", "coach", "vocab", "progress"].includes(
      initialMode || "",
    )
      ? initialMode
      : "interview") as Tab,
  );
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [panels, setPanels] = useState<PanelInfo[]>([]);
  const [meetings, setMeetings] = useState<MeetingInfo[]>([]);
  const [panelId, setPanelId] = useState("hiring");
  const [meetingSlug, setMeetingSlug] = useState("standup");
  const [difficulty, setDifficulty] = useState("media");
  const [opportunityId, setOpportunityId] = useState(
    initialOpportunityId || "",
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [scoreAvg, setScoreAvg] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);

  // drill
  const [drill, setDrill] = useState<{
    id: string;
    promptEn: string;
    promptEs: string;
    options: string[];
    tags: string[];
  } | null>(null);
  const [drillResult, setDrillResult] = useState<{
    correct: boolean;
    explanationEn: string;
    explanationEs: string;
  } | null>(null);
  const [excludeDrills, setExcludeDrills] = useState<string[]>([]);

  // coach
  const [coachText, setCoachText] = useState("");
  const [coachOut, setCoachOut] = useState<{
    diagnosis: string;
    nativeRewrite: string;
    errors: string[];
    suggestedConnectors: string[];
    score: number;
    levelEstimate: string;
  } | null>(null);

  // vocab
  const [vocabSub, setVocabSub] = useState<VocabSub>("terms");
  const [vocabItems, setVocabItems] = useState<Record<string, unknown>[]>([]);
  const [vocabQ, setVocabQ] = useState("");
  const [quiz, setQuiz] = useState<{
    kind: string;
    itemId: string;
    prompt: string;
    promptEs: string;
    options: string[];
    context?: string;
  } | null>(null);
  const [quizMsg, setQuizMsg] = useState("");
  const [scriptDetail, setScriptDetail] = useState<{
    script: {
      id: string;
      titleEn: string;
      titleEs: string;
      contextEs: string;
      modelEn: string;
      modelEs: string;
    };
    phrases: { en: string; es: string }[];
  } | null>(null);
  const [scriptAttempt, setScriptAttempt] = useState("");

  // progress
  const [progress, setProgress] = useState<{
    mastery: Record<
      string,
      { tracked: number; mastered: number; pct: number }
    >;
    catalogSizes: Record<string, number>;
    weekSeries: { week: string; avg: number }[];
    dimensions: Record<string, number>;
    recentSessions: {
      id: string;
      mode: string;
      scoreAvg: number | null;
      verdict: string | null;
      createdAt: string;
    }[];
    drillAccuracy: number | null;
    profile: { weeklyGoal: number; streakDays: number; cefrEstimate: string | null };
    masteryWeak?: { kind: string; itemId: string }[];
  } | null>(null);

  useEffect(() => {
    void api<{
      panels: PanelInfo[];
      meetings: MeetingInfo[];
    }>("/api/admin/practice/session").then((d) => {
      setPanels(d.panels);
      setMeetings(d.meetings);
      if (d.panels[0]) setPanelId(d.panels[0].id);
      if (d.meetings[0]) setMeetingSlug(d.meetings[0].slug);
    });
  }, []);

  const loadDrill = useCallback(async () => {
    setDrillResult(null);
    const d = await api<{
      id: string;
      promptEn: string;
      promptEs: string;
      options: string[];
      tags: string[];
    }>(
      `/api/admin/practice/drill?exclude=${excludeDrills.join(",")}`,
    );
    setDrill(d);
  }, [excludeDrills]);

  useEffect(() => {
    if (tab === "drill" && !drill) void loadDrill();
  }, [tab, drill, loadDrill]);

  const loadVocab = useCallback(async () => {
    const q = encodeURIComponent(vocabQ);
    if (vocabSub === "terms") {
      const d = await api<{ items: Record<string, unknown>[] }>(
        `/api/admin/practice/glossary?q=${q}`,
      );
      setVocabItems(d.items);
    } else if (vocabSub === "acronyms") {
      const d = await api<{ items: Record<string, unknown>[] }>(
        `/api/admin/practice/acronyms?q=${q}`,
      );
      setVocabItems(d.items);
    } else if (vocabSub === "phrases") {
      const d = await api<{ items: Record<string, unknown>[] }>(
        `/api/admin/practice/phrases?q=${q}`,
      );
      setVocabItems(d.items);
    } else {
      const d = await api<{ items: Record<string, unknown>[] }>(
        `/api/admin/practice/scripts`,
      );
      setVocabItems(d.items);
    }
  }, [vocabSub, vocabQ]);

  useEffect(() => {
    if (tab === "vocab") void loadVocab();
  }, [tab, loadVocab]);

  const loadProgress = useCallback(async () => {
    const d = await api<{
      mastery: Record<
        string,
        { tracked: number; mastered: number; pct: number }
      > & { weak?: { kind: string; itemId: string }[] };
      catalogSizes: Record<string, number>;
      weekSeries: { week: string; avg: number }[];
      dimensions: Record<string, number>;
      recentSessions: {
        id: string;
        mode: string;
        scoreAvg: number | null;
        verdict: string | null;
        createdAt: string;
      }[];
      drillAccuracy: number | null;
      profile: {
        weeklyGoal: number;
        streakDays: number;
        cefrEstimate: string | null;
      };
    }>("/api/admin/practice/progress");
    setProgress({
      ...d,
      masteryWeak: d.mastery.weak,
    });
  }, []);

  useEffect(() => {
    if (tab === "progress") void loadProgress();
  }, [tab, loadProgress]);

  async function startSession(mode: "interview" | "meeting") {
    setBusy(true);
    setMessage("");
    setVerdict(null);
    try {
      const d = await api<{
        sessionId: string;
        opening: string;
      }>("/api/admin/practice/session", {
        method: "POST",
        body: JSON.stringify({
          mode,
          locale,
          scenarioSlug: mode === "interview" ? panelId : meetingSlug,
          difficulty,
          opportunityId: opportunityId || undefined,
        }),
      });
      setSessionId(d.sessionId);
      setTurns([{ role: "assistant", content: d.opening }]);
      setScoreAvg(null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function sendTurn() {
    if (!sessionId || !input.trim()) return;
    setBusy(true);
    setMessage("");
    const userMsg = input.trim();
    setInput("");
    setTurns((t) => [...t, { role: "user", content: userMsg }]);
    try {
      const d = await api<{
        reply: string;
        feedback: Feedback;
        scoreAvg: number;
      }>("/api/admin/practice/turn", {
        method: "POST",
        body: JSON.stringify({ sessionId, message: userMsg }),
      });
      setTurns((t) => {
        const copy = [...t];
        const lastUser = [...copy].reverse().find((x) => x.role === "user");
        if (lastUser) lastUser.feedback = d.feedback;
        return [...copy, { role: "assistant", content: d.reply }];
      });
      setScoreAvg(d.scoreAvg);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    if (!sessionId) return;
    setBusy(true);
    try {
      const d = await api<{ verdict: string; diagnosis: string; scoreAvg: number }>(
        `/api/admin/practice/session/${sessionId}/finish`,
        { method: "POST" },
      );
      setVerdict(`${d.verdict}\n\n${d.diagnosis}`);
      setScoreAvg(d.scoreAvg);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function answerDrill(idx: number) {
    if (!drill) return;
    setBusy(true);
    try {
      const d = await api<{
        correct: boolean;
        explanationEn: string;
        explanationEs: string;
      }>("/api/admin/practice/drill", {
        method: "POST",
        body: JSON.stringify({
          questionId: drill.id,
          chosenIndex: idx,
          sessionId: sessionId || undefined,
        }),
      });
      setDrillResult(d);
      setExcludeDrills((e) => [...e, drill.id]);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function runCoach() {
    setBusy(true);
    setMessage("");
    try {
      const d = await api<NonNullable<typeof coachOut>>("/api/admin/practice/coach", {
        method: "POST",
        body: JSON.stringify({ text: coachText, locale }),
      });
      setCoachOut(d);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function loadQuiz() {
    setQuizMsg("");
    const kind =
      vocabSub === "terms"
        ? "term"
        : vocabSub === "acronyms"
          ? "acronym"
          : vocabSub === "phrases"
            ? "phrase"
            : "script";
    const d = await api<{
      kind: string;
      itemId: string;
      prompt: string;
      promptEs: string;
      options: string[];
      context?: string;
    }>(`/api/admin/practice/study/quiz?kind=${kind}`);
    setQuiz(d);
  }

  async function answerQuiz(chosen: string) {
    if (!quiz) return;
    setBusy(true);
    try {
      const d = await api<{ correct: boolean; correctAnswer: string }>(
        "/api/admin/practice/study/quiz",
        {
          method: "POST",
          body: JSON.stringify({
            kind: quiz.kind,
            itemId: quiz.itemId,
            chosen,
          }),
        },
      );
      setQuizMsg(
        d.correct
          ? "Correcto."
          : `Incorrecto. Respuesta: ${d.correctAnswer}`,
      );
    } catch (e) {
      setQuizMsg(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function openScript(id: string) {
    const d = await api<{
      script: {
        id: string;
        titleEn: string;
        titleEs: string;
        contextEs: string;
        modelEn: string;
        modelEs: string;
      };
      phrases: { en: string; es: string }[];
    }>(`/api/admin/practice/scripts?id=${id}`);
    setScriptDetail(d);
    setScriptAttempt("");
  }

  const interviewOpps = useMemo(
    () =>
      opportunities.filter((o) =>
        ["entrevista", "aplicada", "oferta"].includes(o.stage),
      ),
    [opportunities],
  );

  return (
    <>
      <PageHeader
        title="Práctica — Entrevistas e inglés"
        subtitle="Simulacro, reuniones, drills, coach, vocabulario verídico y progreso."
        actions={
          <div className="flex items-center gap-2">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as "en" | "es")}
              className="input-field py-2 text-xs"
            >
              <option value="en">Practice EN</option>
              <option value="es">Practicar ES</option>
            </select>
            <GraduationCap className="h-5 w-5 text-emerald-400" />
          </div>
        }
      />

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap gap-1 border-b border-zinc-800 pb-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs transition-colors ${
                  active
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {message && (
          <p className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200">
            {message}
          </p>
        )}

        {(tab === "interview" || tab === "meeting") && (
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <Panel title="Configuración">
              <div className="space-y-3 text-xs">
                {tab === "interview" ? (
                  <>
                    <label className="block text-zinc-500">Panel</label>
                    <select
                      value={panelId}
                      onChange={(e) => setPanelId(e.target.value)}
                      className="input-field py-2 text-xs"
                    >
                      {panels.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <label className="block text-zinc-500">
                      Oportunidad (opcional)
                    </label>
                    <select
                      value={opportunityId}
                      onChange={(e) => setOpportunityId(e.target.value)}
                      className="input-field py-2 text-xs"
                    >
                      <option value="">—</option>
                      {interviewOpps.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.company} — {o.role}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label className="block text-zinc-500">Escenario</label>
                    <select
                      value={meetingSlug}
                      onChange={(e) => setMeetingSlug(e.target.value)}
                      className="input-field py-2 text-xs"
                    >
                      {meetings.map((m) => (
                        <option key={m.slug} value={m.slug}>
                          {locale === "en" ? m.titleEn : m.titleEs}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <label className="block text-zinc-500">Dificultad</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="input-field py-2 text-xs"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
                <button
                  disabled={busy}
                  onClick={() =>
                    void startSession(tab === "interview" ? "interview" : "meeting")
                  }
                  className="btn-primary w-full py-2 text-xs"
                >
                  {busy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Iniciar sesión"
                  )}
                </button>
                {sessionId && (
                  <button
                    disabled={busy}
                    onClick={() => void finish()}
                    className="btn-secondary w-full py-2 text-xs"
                  >
                    Cerrar y veredicto
                  </button>
                )}
                {scoreAvg != null && (
                  <p className="text-emerald-400">
                    Score medio: {scoreAvg}/100
                  </p>
                )}
              </div>
            </Panel>

            <Panel title="Conversación">
              {turns.length === 0 ? (
                <Empty>Inicia una sesión para practicar.</Empty>
              ) : (
                <div className="space-y-3">
                  <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                    {turns.map((t, i) => (
                      <div key={i} className="space-y-2">
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            t.role === "assistant"
                              ? "bg-zinc-800/80 text-zinc-200"
                              : "bg-emerald-500/10 text-emerald-100"
                          }`}
                        >
                          <div className="mb-1 text-[10px] uppercase tracking-wide text-zinc-500">
                            {t.role === "assistant"
                              ? tab === "interview"
                                ? "Interviewer"
                                : "Colleague"
                              : "You"}
                          </div>
                          <p className="whitespace-pre-wrap">{t.content}</p>
                        </div>
                        {t.feedback && (
                          <div className="rounded-md border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-xs text-zinc-400">
                            <div className="flex flex-wrap gap-2">
                              <Tag tone="emerald">
                                {t.feedback.score}/100
                              </Tag>
                              {Object.entries(t.feedback.scores).map(
                                ([k, v]) => (
                                  <Tag key={k}>
                                    {k}:{v}
                                  </Tag>
                                ),
                              )}
                            </div>
                            <p className="mt-2">{t.feedback.diagnosis}</p>
                            <p className="mt-2 text-zinc-300">
                              <span className="text-zinc-500">Native: </span>
                              {t.feedback.nativeRewrite}
                            </p>
                            {t.feedback.suggestedConnectors?.length > 0 && (
                              <p className="mt-1">
                                Conectores:{" "}
                                {t.feedback.suggestedConnectors.join(" · ")}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {verdict && (
                    <pre className="whitespace-pre-wrap rounded-md border border-emerald-900/40 bg-emerald-950/20 p-3 text-xs text-emerald-100">
                      {verdict}
                    </pre>
                  )}
                  <div className="flex gap-2">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      rows={3}
                      placeholder={
                        locale === "en"
                          ? "Type your answer in English…"
                          : "Escribe tu respuesta…"
                      }
                      className="input-field resize-y py-2 text-xs"
                    />
                    <button
                      disabled={busy || !sessionId}
                      onClick={() => void sendTurn()}
                      className="btn-primary shrink-0 px-3"
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </Panel>
          </div>
        )}

        {tab === "drill" && (
          <Panel title="Drill MCQ">
            {!drill ? (
              <Empty>Cargando…</Empty>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-zinc-200">
                  {locale === "en" ? drill.promptEn : drill.promptEs}
                </p>
                <div className="flex flex-wrap gap-1">
                  {drill.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <div className="grid gap-2">
                  {drill.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={busy || !!drillResult}
                      onClick={() => void answerDrill(idx)}
                      className="rounded-md border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-left text-xs text-zinc-200 hover:border-emerald-700"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {drillResult && (
                  <div
                    className={`rounded-md border px-3 py-2 text-xs ${
                      drillResult.correct
                        ? "border-emerald-800 text-emerald-300"
                        : "border-red-900/50 text-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-1 font-medium">
                      {drillResult.correct ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                      {drillResult.correct ? "Correcto" : "Incorrecto"}
                    </div>
                    <p className="mt-1 text-zinc-400">
                      {locale === "en"
                        ? drillResult.explanationEn
                        : drillResult.explanationEs}
                    </p>
                    <button
                      className="btn-secondary mt-3 px-3 py-1.5 text-xs"
                      onClick={() => {
                        setDrill(null);
                        void loadDrill();
                      }}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            )}
          </Panel>
        )}

        {tab === "coach" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Tu texto">
              <textarea
                value={coachText}
                onChange={(e) => setCoachText(e.target.value)}
                rows={12}
                placeholder="Paste what you would say in an interview / meeting / client call…"
                className="input-field resize-y py-2 text-xs"
              />
              <button
                disabled={busy || coachText.trim().length < 8}
                onClick={() => void runCoach()}
                className="btn-primary mt-3 px-3 py-2 text-xs"
              >
                {busy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Corregir y mejorar"
                )}
              </button>
            </Panel>
            <Panel title="Feedback">
              {!coachOut ? (
                <Empty>El coach devolverá versión nativa + conectores.</Empty>
              ) : (
                <div className="space-y-3 text-xs text-zinc-300">
                  <Tag tone="emerald">{coachOut.score}/100</Tag>
                  <p>{coachOut.diagnosis}</p>
                  <p className="text-zinc-500">{coachOut.levelEstimate}</p>
                  <div>
                    <div className="text-[11px] uppercase text-zinc-500">
                      Native rewrite
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-zinc-100">
                      {coachOut.nativeRewrite}
                    </p>
                  </div>
                  {coachOut.suggestedConnectors?.length > 0 && (
                    <p>
                      Conectores: {coachOut.suggestedConnectors.join(" · ")}
                    </p>
                  )}
                  {coachOut.errors?.length > 0 && (
                    <ul className="list-disc space-y-1 pl-4 text-zinc-400">
                      {coachOut.errors.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Panel>
          </div>
        )}

        {tab === "vocab" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["terms", "Términos"],
                  ["acronyms", "Siglas"],
                  ["phrases", "Frases"],
                  ["scripts", "Scripts laborales"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    setVocabSub(id);
                    setScriptDetail(null);
                    setQuiz(null);
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs ${
                    vocabSub === id
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {label}
                </button>
              ))}
              <input
                value={vocabQ}
                onChange={(e) => setVocabQ(e.target.value)}
                placeholder="Buscar…"
                className="input-field ml-auto max-w-xs py-1.5 text-xs"
              />
              <button
                onClick={() => void loadQuiz()}
                className="btn-secondary px-3 py-1.5 text-xs"
              >
                Quiz
              </button>
            </div>

            {quiz && (
              <Panel title="Quiz">
                <p className="text-sm text-zinc-200">
                  {locale === "en" ? quiz.prompt : quiz.promptEs}
                </p>
                {quiz.context && (
                  <p className="mt-1 text-xs text-zinc-500">{quiz.context}</p>
                )}
                <div className="mt-3 grid gap-2">
                  {quiz.options.map((o) => (
                    <button
                      key={o}
                      disabled={busy}
                      onClick={() => void answerQuiz(o)}
                      className="rounded-md border border-zinc-700 px-3 py-2 text-left text-xs hover:border-emerald-700"
                    >
                      {o}
                    </button>
                  ))}
                </div>
                {quizMsg && (
                  <p className="mt-2 text-xs text-zinc-300">{quizMsg}</p>
                )}
              </Panel>
            )}

            {vocabSub === "phrases" && (
              <Panel title="Cheat sheet — frases rápidas">
                <div className="grid max-h-[320px] gap-2 overflow-y-auto md:grid-cols-2">
                  {vocabItems.slice(0, 80).map((raw) => {
                    const p = raw as {
                      id: string;
                      en: string;
                      es: string;
                      situation: string;
                      whenToUse: string;
                    };
                    return (
                      <div
                        key={p.id}
                        className="rounded border border-zinc-800 px-2 py-1.5 text-[11px]"
                      >
                        <div className="text-emerald-300">{p.en}</div>
                        <div className="text-zinc-500">{p.es}</div>
                        <div className="mt-0.5 text-zinc-600">
                          {p.situation} · {p.whenToUse}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            )}

            {vocabSub === "scripts" && scriptDetail ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title={scriptDetail.script.titleEn}>
                  <p className="text-xs text-zinc-500">
                    {scriptDetail.script.contextEs}
                  </p>
                  <textarea
                    value={scriptAttempt}
                    onChange={(e) => setScriptAttempt(e.target.value)}
                    rows={8}
                    placeholder="Tu intento en inglés…"
                    className="input-field mt-3 resize-y py-2 text-xs"
                  />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {scriptDetail.phrases.map((p, i) => (
                      <Tag key={i}>{p.en}</Tag>
                    ))}
                  </div>
                </Panel>
                <Panel title="Modelo">
                  <p className="whitespace-pre-wrap text-xs text-zinc-200">
                    {scriptDetail.script.modelEn}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-xs text-zinc-500">
                    {scriptDetail.script.modelEs}
                  </p>
                  <button
                    className="btn-secondary mt-3 px-3 py-1.5 text-xs"
                    onClick={() => setScriptDetail(null)}
                  >
                    Volver
                  </button>
                </Panel>
              </div>
            ) : (
              <Panel
                title={
                  vocabSub === "terms"
                    ? "Términos técnicos"
                    : vocabSub === "acronyms"
                      ? "Siglas"
                      : vocabSub === "phrases"
                        ? "Frases y conectores"
                        : "Scripts laborales / cliente"
                }
              >
                {vocabItems.length === 0 ? (
                  <Empty>Sin resultados.</Empty>
                ) : (
                  <div className="max-h-[480px] space-y-2 overflow-y-auto">
                    {vocabItems.map((raw) => {
                      if (vocabSub === "terms") {
                        const t = raw as {
                          id: string;
                          en: string;
                          es: string;
                          definitionEn: string;
                          interviewLineEn: string;
                          sourceSlug: string;
                          category: string;
                        };
                        return (
                          <div
                            key={t.id}
                            className="rounded-md border border-zinc-800 px-3 py-2 text-xs"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-zinc-100">
                                {t.en}
                              </span>
                              <Tag>{t.category}</Tag>
                              <Tag tone="violet">{t.sourceSlug}</Tag>
                            </div>
                            <p className="mt-1 text-zinc-400">
                              {t.definitionEn}
                            </p>
                            <p className="mt-1 text-emerald-300/90">
                              {t.interviewLineEn}
                            </p>
                          </div>
                        );
                      }
                      if (vocabSub === "acronyms") {
                        const a = raw as {
                          id: string;
                          acronym: string;
                          expansionEn: string;
                          expansionEs: string;
                          definitionEn: string;
                          meetingLineEn: string;
                        };
                        return (
                          <div
                            key={a.id}
                            className="rounded-md border border-zinc-800 px-3 py-2 text-xs"
                          >
                            <span className="font-medium text-emerald-300">
                              {a.acronym}
                            </span>
                            <span className="text-zinc-400">
                              {" "}
                              — {a.expansionEn} / {a.expansionEs}
                            </span>
                            <p className="mt-1 text-zinc-500">
                              {a.definitionEn}
                            </p>
                            <p className="mt-1 text-zinc-300">
                              {a.meetingLineEn}
                            </p>
                          </div>
                        );
                      }
                      if (vocabSub === "phrases") {
                        const p = raw as {
                          id: string;
                          en: string;
                          es: string;
                          whenToUse: string;
                          variant: string;
                        };
                        return (
                          <div
                            key={p.id}
                            className="rounded-md border border-zinc-800 px-3 py-2 text-xs"
                          >
                            <div className="text-zinc-100">{p.en}</div>
                            <div className="text-zinc-500">{p.es}</div>
                            <div className="mt-1 text-zinc-600">
                              {p.whenToUse} · alt: {p.variant}
                            </div>
                          </div>
                        );
                      }
                      const s = raw as {
                        id: string;
                        titleEn: string;
                        titleEs: string;
                        contextEs: string;
                      };
                      return (
                        <button
                          key={s.id}
                          onClick={() => void openScript(s.id)}
                          className="block w-full rounded-md border border-zinc-800 px-3 py-2 text-left text-xs hover:border-emerald-700"
                        >
                          <div className="text-zinc-100">{s.titleEn}</div>
                          <div className="text-zinc-500">{s.contextEs}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Panel>
            )}
          </div>
        )}

        {tab === "progress" && (
          <div className="space-y-4">
            {!progress ? (
              <Empty>Cargando progreso…</Empty>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {(
                    [
                      ["terms", "Glosario", progress.catalogSizes.terms],
                      ["acronyms", "Siglas", progress.catalogSizes.acronyms],
                      ["phrases", "Frases", progress.catalogSizes.phrases],
                      ["scripts", "Scripts", progress.catalogSizes.scripts],
                    ] as const
                  ).map(([key, label, size]) => {
                    const m =
                      progress.mastery[
                        key === "terms"
                          ? "term"
                          : key === "acronyms"
                            ? "acronym"
                            : key === "phrases"
                              ? "phrase"
                              : "script"
                      ];
                    return (
                      <div
                        key={key}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
                      >
                        <div className="text-[11px] uppercase text-zinc-500">
                          {label}
                        </div>
                        <div className="mt-1 text-lg text-emerald-300">
                          {m?.pct ?? 0}%
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {m?.mastered ?? 0} mastered · catálogo {size}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Panel title="Score semanal">
                    {progress.weekSeries.length === 0 ? (
                      <Empty>Aún no hay scores.</Empty>
                    ) : (
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <RLineChart data={progress.weekSeries}>
                            <CartesianGrid stroke="#27272a" />
                            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="avg"
                              stroke="#34d399"
                              strokeWidth={2}
                              dot={false}
                            />
                          </RLineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </Panel>
                  <Panel title="Dimensiones">
                    <div className="space-y-2 text-xs">
                      {Object.entries(progress.dimensions).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2">
                          <span className="text-zinc-400">{k}</span>
                          <span className="text-zinc-200">{v}</span>
                        </div>
                      ))}
                      {progress.drillAccuracy != null && (
                        <p className="pt-2 text-zinc-500">
                          Drill accuracy reciente: {progress.drillAccuracy}%
                        </p>
                      )}
                      <p className="text-zinc-500">
                        Racha: {progress.profile.streakDays} · Meta semanal:{" "}
                        {progress.profile.weeklyGoal}
                      </p>
                    </div>
                  </Panel>
                </div>

                <Panel title="Últimas sesiones">
                  {progress.recentSessions.length === 0 ? (
                    <Empty>Sin sesiones aún.</Empty>
                  ) : (
                    <div className="space-y-2">
                      {progress.recentSessions.map((s) => (
                        <div
                          key={s.id}
                          className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-2 text-xs last:border-0"
                        >
                          <div>
                            <Tag>{s.mode}</Tag>
                            <span className="ml-2 text-zinc-400">
                              {new Date(s.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-emerald-300">
                            {s.scoreAvg ?? "—"}
                          </span>
                          {s.verdict && (
                            <span className="w-full truncate text-zinc-500">
                              {s.verdict}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
