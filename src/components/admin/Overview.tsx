"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  Eye,
  MessageSquare,
  UserPlus,
  CalendarCheck,
  Coins,
  Download,
  Video,
  Timer,
  MousePointerClick,
  AlertTriangle,
} from "lucide-react";
import type { Metrics, DailyPoint } from "@/lib/metrics";
import { PageHeader, Panel, Empty, Tag, fmtDay, fmtDateTime } from "./ui";

const ACCENT = "#10b981";
const GRID = "#27272a";
const AXIS = "#71717a";

const RANGES = [7, 14, 30, 90];

function Sparkline({ data, id }: { data: DailyPoint[]; id: string }) {
  return (
    <div className="mt-2 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.4} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={ACCENT}
            strokeWidth={1.5}
            fill={`url(#${id})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  series,
  sparkId,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  series?: DailyPoint[];
  sparkId?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </span>
        <Icon className="h-4 w-4 shrink-0 text-emerald-400" />
      </div>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
      {series && sparkId && <Sparkline data={series} id={sparkId} />}
    </div>
  );
}

function Funnel({ funnel }: { funnel: Metrics["funnel"] }) {
  const steps = [
    { label: "Visitas", value: funnel.visits },
    { label: "Chats", value: funnel.chats },
    { label: "Leads", value: funnel.leads },
    { label: "Citas", value: funnel.appointments },
    { label: "Ganados", value: funnel.won },
  ];
  const max = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className="space-y-2.5">
      {steps.map((s, i) => {
        const prev = i > 0 ? steps[i - 1].value : null;
        const conv = prev && prev > 0 ? Math.round((s.value / prev) * 100) : null;
        return (
          <div key={s.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">{s.label}</span>
              <span className="text-zinc-300">
                {s.value}
                {conv !== null && (
                  <span className="ml-2 text-zinc-500">{conv}%</span>
                )}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500/70"
                style={{ width: `${Math.max((s.value / max) * 100, s.value > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Overview({ metrics }: { metrics: Metrics }) {
  const router = useRouter();
  const params = useSearchParams();
  const { totals, series, leadsBySource, topQuestions, upcoming, funnel, pipeline } =
    metrics;

  function setRange(days: number) {
    const next = new URLSearchParams(params.toString());
    next.set("days", String(days));
    router.push(`/admin?${next.toString()}`);
  }

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle={`Últimos ${metrics.days} días`}
        actions={
          <>
            <div className="flex rounded-lg border border-zinc-800 p-0.5">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded px-2.5 py-1 text-xs transition-colors ${
                    metrics.days === r
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
            <a
              href="/api/admin/export?type=leads"
              className="btn-secondary px-3 py-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" /> Leads CSV
            </a>
            <a
              href="/api/admin/export?type=appointments"
              className="btn-secondary px-3 py-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" /> Citas CSV
            </a>
          </>
        }
      />

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            icon={Users}
            label="Visitas"
            value={totals.visits}
            sub={`${totals.pageViews} páginas vistas`}
            series={series.visits}
            sparkId="sp-visits"
          />
          <KpiCard
            icon={MessageSquare}
            label="Sesiones chat"
            value={totals.chatSessions}
            sub={`${totals.chatMessages} mensajes`}
            series={series.chats}
            sparkId="sp-chats"
          />
          <KpiCard
            icon={UserPlus}
            label="Leads"
            value={totals.leads}
            series={series.leads}
            sparkId="sp-leads"
          />
          <KpiCard
            icon={CalendarCheck}
            label="Citas"
            value={totals.appointments}
            sub={`${totals.upcomingAppointments} próximas`}
            series={series.appointments}
            sparkId="sp-appts"
          />
          <KpiCard
            icon={Timer}
            label="Dwell prom."
            value={`${totals.avgDwellSec}s`}
            sub={`Scroll ${totals.avgScrollPct}%`}
          />
          <KpiCard
            icon={MousePointerClick}
            label="Scroll prom."
            value={`${totals.avgScrollPct}%`}
          />
          <KpiCard icon={Eye} label="Páginas vistas" value={totals.pageViews} />
          <KpiCard
            icon={Coins}
            label="Coste IA"
            value={`$${totals.costUsd.toFixed(3)}`}
            sub={`${totals.tokens.toLocaleString("es-CO")} tokens`}
            series={series.cost}
            sparkId="sp-cost"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Embudo de conversión">
            <Funnel funnel={funnel} />
          </Panel>

          <Panel title="Visitas" className="lg:col-span-2">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series.visits}>
                  <defs>
                    <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: AXIS, fontSize: 11 }}
                    tickFormatter={(d: string) => d.slice(5)}
                  />
                  <YAxis
                    tick={{ fill: AXIS, fontSize: 11 }}
                    allowDecimals={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: `1px solid ${GRID}`,
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={ACCENT}
                    fill="url(#gv)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Leads por día">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series.leads}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: AXIS, fontSize: 11 }}
                    tickFormatter={(d: string) => d.slice(5)}
                  />
                  <YAxis
                    tick={{ fill: AXIS, fontSize: 11 }}
                    allowDecimals={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: `1px solid ${GRID}`,
                      borderRadius: 8,
                      color: "#fff",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar dataKey="value" fill={ACCENT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Coste IA por día (USD)">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series.cost}>
                  <defs>
                    <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: AXIS, fontSize: 11 }}
                    tickFormatter={(d: string) => d.slice(5)}
                  />
                  <YAxis
                    tick={{ fill: AXIS, fontSize: 11 }}
                    width={44}
                    tickFormatter={(v: number) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: `1px solid ${GRID}`,
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={ACCENT}
                    fill="url(#gc)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel
            title="Próximas citas (Meet)"
            actions={
              <Link href="/admin/agenda" className="text-xs text-emerald-400">
                Ver agenda
              </Link>
            }
          >
            <div className="space-y-3">
              {upcoming.length === 0 && <Empty>Sin citas próximas.</Empty>}
              {upcoming.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{a.name}</p>
                    <p className="truncate text-xs text-zinc-500">{a.email}</p>
                    <p className="text-xs text-zinc-500">
                      {fmtDateTime(a.scheduledAt)}
                    </p>
                  </div>
                  {a.meetLink ? (
                    <a
                      href={a.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary shrink-0 px-3 py-1.5 text-xs"
                    >
                      <Video className="h-3.5 w-3.5" /> Meet
                    </a>
                  ) : (
                    <Tag tone="amber">Enviar invitación</Tag>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Acciones pendientes"
            actions={<AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
          >
            <div className="space-y-3">
              {pipeline.dueSoon.length === 0 && (
                <Empty>Nada agendado por hacer.</Empty>
              )}
              {pipeline.dueSoon.map((d) => {
                const late = new Date(d.nextActionAt) < new Date();
                return (
                  <Link
                    key={`${d.kind}-${d.id}`}
                    href={d.kind === "lead" ? "/admin/leads" : "/admin/oportunidades"}
                    className="block border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-zinc-200">{d.label}</p>
                      <Tag tone={late ? "red" : "neutral"}>
                        {fmtDay(d.nextActionAt)}
                      </Tag>
                    </div>
                    {d.nextAction && (
                      <p className="mt-0.5 truncate text-xs text-zinc-500">
                        {d.nextAction}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </Panel>

          <Panel
            title="Preguntas recientes al agente"
            actions={
              <div className="flex flex-wrap justify-end gap-1.5">
                {leadsBySource.map((s) => (
                  <Tag key={s.source}>
                    {s.source}: {s.count}
                  </Tag>
                ))}
              </div>
            }
          >
            <div className="space-y-2">
              {topQuestions.length === 0 && <Empty>Aún no hay preguntas.</Empty>}
              {topQuestions.map((q, i) => (
                <p
                  key={i}
                  className="truncate border-b border-zinc-800/60 pb-2 text-sm text-zinc-400 last:border-0 last:pb-0"
                >
                  {q.content}
                </p>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
