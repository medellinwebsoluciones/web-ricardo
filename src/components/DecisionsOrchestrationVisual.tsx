"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
};

const copy = {
  es: {
    caption: "Topologia de orquestacion",
    ceo: "CEO",
    hubs: ["Ops", "Research", "Content"],
    specialists: "29 especialistas",
    local: "Local-first",
    network: "Red por dominio",
    config: "Config en vivo",
  },
  en: {
    caption: "Orchestration topology",
    ceo: "CEO",
    hubs: ["Ops", "Research", "Content"],
    specialists: "29 specialists",
    local: "Local-first",
    network: "Domain routing",
    config: "Live config",
  },
} as const;

const HUBS = [
  { x: 70, y: 118 },
  { x: 160, y: 118 },
  { x: 250, y: 118 },
] as const;

const SPECIALISTS = [
  { x: 36, y: 188 },
  { x: 70, y: 198 },
  { x: 104, y: 188 },
  { x: 126, y: 198 },
  { x: 160, y: 188 },
  { x: 194, y: 198 },
  { x: 216, y: 188 },
  { x: 250, y: 198 },
  { x: 284, y: 188 },
] as const;

/**
 * Diagrama de orquestacion para la seccion Decisiones de diseno (caso Nova).
 * Grafo CEO → hubs → especialistas, con anotaciones de las tres decisiones.
 */
export function DecisionsOrchestrationVisual({ locale }: Props) {
  const t = copy[locale] ?? copy.es;
  const reduce = useReducedMotion();

  return (
    <figure
      className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
      aria-label={t.caption}
    >
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-2.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400/90">
          {t.caption}
        </span>
        <span className="font-mono text-[11px] text-zinc-500">CEO → hubs → …</span>
      </div>

      <div className="relative aspect-[4/3] w-full bg-[#050506] sm:aspect-[5/4]">
        {/* Atmosphere: soft radial, no purple/glow cards */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 28%, rgba(16,185,129,0.07), transparent 70%)",
          }}
        />

        <svg
          viewBox="0 0 320 260"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dec-edge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* Edges: CEO → hubs */}
          {HUBS.map((h, i) => (
            <motion.line
              key={`ceo-hub-${i}`}
              x1={160}
              y1={52}
              x2={h.x}
              y2={h.y}
              stroke="url(#dec-edge)"
              strokeWidth={1.25}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.08, ease: "easeOut" }}
            />
          ))}

          {/* Edges: hubs → specialist clusters */}
          {SPECIALISTS.map((s, i) => {
            const hub = HUBS[Math.min(2, Math.floor(i / 3))];
            return (
              <line
                key={`hub-sp-${i}`}
                x1={hub.x}
                y1={hub.y}
                x2={s.x}
                y2={s.y}
                stroke="#27272a"
                strokeWidth={1}
              />
            );
          })}

          {/* CEO node */}
          <motion.g
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <rect
              x={128}
              y={22}
              width={64}
              height={36}
              rx={8}
              fill="#18181b"
              stroke="#34d399"
              strokeOpacity={0.55}
              strokeWidth={1.25}
            />
            <text
              x={160}
              y={44}
              textAnchor="middle"
              fill="#ecfdf5"
              fontSize={11}
              fontWeight={600}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {t.ceo}
            </text>
          </motion.g>

          {/* Hub nodes */}
          {HUBS.map((h, i) => (
            <motion.g
              key={`hub-${i}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
            >
              <rect
                x={h.x - 34}
                y={h.y - 14}
                width={68}
                height={28}
                rx={6}
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth={1}
              />
              <text
                x={h.x}
                y={h.y + 4}
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize={10}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {t.hubs[i]}
              </text>
            </motion.g>
          ))}

          {/* Specialist dots */}
          {SPECIALISTS.map((s, i) => (
            <motion.circle
              key={`sp-${i}`}
              cx={s.x}
              cy={s.y}
              r={4.5}
              fill="#27272a"
              stroke="#34d399"
              strokeOpacity={0.35}
              strokeWidth={1}
              initial={reduce ? false : { opacity: 0 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: [0.55, 1, 0.55],
                    }
              }
              transition={
                reduce
                  ? { duration: 0.3, delay: 0.4 + i * 0.03 }
                  : {
                      opacity: {
                        duration: 2.8,
                        delay: 0.6 + i * 0.12,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }
              }
            />
          ))}

          <text
            x={160}
            y={228}
            textAnchor="middle"
            fill="#71717a"
            fontSize={10}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            letterSpacing="0.06em"
          >
            {t.specialists}
          </text>

          {/* Decision annotations */}
          <g fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize={9}>
            <text x={16} y={16} fill="#34d399" fillOpacity={0.75}>
              {t.local}
            </text>
            <text x={160} y={252} textAnchor="middle" fill="#71717a">
              {t.network}
            </text>
            <text x={304} y={16} textAnchor="end" fill="#a1a1aa">
              {t.config}
            </text>
          </g>
        </svg>
      </div>
    </figure>
  );
}
