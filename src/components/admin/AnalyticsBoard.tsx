"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Eye, Users, Timer, MousePointerClick } from "lucide-react";
import type { PageAnalytics } from "@/lib/metrics";
import { PageHeader, Panel, Stat, Empty } from "./ui";

const ACCENT = "#10b981";
const GRID = "#27272a";
const AXIS = "#71717a";
const RANGES = [7, 14, 30, 90];

function Bar({ value, max }: { value: number; max: number }) {
  return (
    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
      <div
        className="h-full rounded-full bg-emerald-500/60"
        style={{ width: `${Math.max((value / Math.max(max, 1)) * 100, 2)}%` }}
      />
    </div>
  );
}

export function AnalyticsBoard({ data }: { data: PageAnalytics }) {
  const router = useRouter();
  const params = useSearchParams();

  function setRange(days: number) {
    const next = new URLSearchParams(params.toString());
    next.set("days", String(days));
    router.push(`/admin/analytics?${next.toString()}`);
  }

  const maxViews = Math.max(...data.topPaths.map((p) => p.views), 1);
  const maxRef = Math.max(...data.topReferrers.map((r) => r.count), 1);

  return (
    <>
      <PageHeader
        title="Analytics de páginas"
        subtitle={`Datos propios (sin cookies de terceros) · últimos ${data.days} días`}
        actions={
          <div className="flex rounded-lg border border-zinc-800 p-0.5">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded px-2.5 py-1 text-xs transition-colors ${
                  data.days === r
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
        }
      />

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={Eye} label="Páginas vistas" value={data.totals.pageViews} />
          <Stat
            icon={Users}
            label="Visitantes únicos"
            value={data.totals.uniqueVisitors}
          />
          <Stat
            icon={Timer}
            label="Dwell promedio"
            value={`${data.totals.avgDwellSec}s`}
          />
          <Stat
            icon={MousePointerClick}
            label="Scroll promedio"
            value={`${data.totals.avgScrollPct}%`}
          />
        </div>

        <Panel title="Páginas vistas por día">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.series.views}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#ga)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Top páginas (vistas · dwell · scroll)">
            {data.topPaths.length === 0 ? (
              <Empty>Sin datos de navegación todavía.</Empty>
            ) : (
              <div className="space-y-2.5">
                {data.topPaths.map((p) => (
                  <div key={p.path}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="truncate text-zinc-300">{p.path}</span>
                      <span className="shrink-0 text-zinc-500">
                        {p.views} · {p.avgDwellSec}s · {p.avgScrollPct}%
                      </span>
                    </div>
                    <Bar value={p.views} max={maxViews} />
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <div className="space-y-4">
            <Panel title="Orígenes (referrer)">
              {data.topReferrers.length === 0 ? (
                <Empty>Sin referrers registrados.</Empty>
              ) : (
                <div className="space-y-2.5">
                  {data.topReferrers.map((r) => (
                    <div key={r.referrer}>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="truncate text-zinc-300">{r.referrer}</span>
                        <span className="shrink-0 text-zinc-500">{r.count}</span>
                      </div>
                      <Bar value={r.count} max={maxRef} />
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Campañas UTM">
              {data.utm.length === 0 ? (
                <Empty>Sin tráfico etiquetado con UTM.</Empty>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] uppercase tracking-wide text-zinc-500">
                      <tr>
                        <th className="pb-2 font-medium">Source</th>
                        <th className="pb-2 font-medium">Medium</th>
                        <th className="pb-2 font-medium">Campaign</th>
                        <th className="pb-2 text-right font-medium">Sesiones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.utm.map((u, i) => (
                        <tr key={i} className="border-t border-zinc-800/60">
                          <td className="py-1.5 text-zinc-300">{u.source}</td>
                          <td className="py-1.5 text-zinc-400">{u.medium}</td>
                          <td className="py-1.5 text-zinc-400">{u.campaign}</td>
                          <td className="py-1.5 text-right text-zinc-300">
                            {u.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Páginas de entrada">
            {data.landingPaths.length === 0 ? (
              <Empty>Sin datos.</Empty>
            ) : (
              <div className="space-y-2">
                {data.landingPaths.map((l) => (
                  <div
                    key={l.path}
                    className="flex items-center justify-between gap-3 border-b border-zinc-800/60 pb-2 text-xs last:border-0 last:pb-0"
                  >
                    <span className="truncate text-zinc-300">{l.path}</span>
                    <span className="shrink-0 text-zinc-500">{l.count}</span>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Idioma de navegación">
            {data.byLocale.length === 0 ? (
              <Empty>Sin datos.</Empty>
            ) : (
              <div className="space-y-2">
                {data.byLocale.map((l) => (
                  <div
                    key={l.locale}
                    className="flex items-center justify-between gap-3 border-b border-zinc-800/60 pb-2 text-xs last:border-0 last:pb-0"
                  >
                    <span className="uppercase text-zinc-300">{l.locale}</span>
                    <span className="text-zinc-500">{l.count} vistas</span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
