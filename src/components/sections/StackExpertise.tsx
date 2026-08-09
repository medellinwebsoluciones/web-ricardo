"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  Server,
  ShoppingCart,
  Layers,
  Lamp,
  Code2,
  Database,
  Hexagon,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

export type StackExpertiseItem = {
  area: string;
  items: string[];
  blurb?: string;
  icon?: keyof typeof iconMap;
};

const iconMap = {
  agentic: BrainCircuit,
  ha: Server,
  commerce: ShoppingCart,
  product: Layers,
  lamp: Lamp,
  python: Code2,
  relational: Database,
  nosql: Hexagon,
  graph: Waypoints,
} as const;

type Props = {
  items: StackExpertiseItem[];
};

function resolveIcon(
  key: StackExpertiseItem["icon"],
  index: number,
): LucideIcon {
  if (key && iconMap[key]) return iconMap[key];
  const fallback = Object.values(iconMap);
  return fallback[index % fallback.length];
}

export function StackExpertise({ items }: Props) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const animate = ready && reduceMotion !== true;

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {items.map((cat, i) => {
        const Icon = resolveIcon(cat.icon, i);
        return (
          <motion.article
            key={cat.area}
            className="stack-card group relative h-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-6 backdrop-blur-sm"
            initial={animate ? { opacity: 0, y: 28 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.55,
              delay: 0.05 * i,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={
              animate
                ? { y: -4, transition: { duration: 0.25, ease: "easeOut" } }
                : undefined
            }
          >
            <div
              aria-hidden
              className="stack-card-sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-transform duration-500 group-hover:scale-125"
            />

            <div className="relative flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-400 transition-colors duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-500/15">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-medium tracking-tight text-white">
                  {cat.area}
                </h3>
                {cat.blurb ? (
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                    {cat.blurb}
                  </p>
                ) : null}
              </div>
            </div>

            <ul className="relative mt-5 flex flex-wrap gap-2">
              {cat.items.map((tech, ti) => (
                <li
                  key={tech}
                  className={`stack-tag rounded-lg border border-zinc-800 bg-zinc-950/70 px-2.5 py-1 text-[13px] text-zinc-300 transition-colors duration-300 group-hover:border-zinc-700 group-hover:text-zinc-100${
                    animate ? " stack-tag--in" : ""
                  }`}
                  style={
                    animate
                      ? { animationDelay: `${0.05 * i + 0.04 * ti}s` }
                      : undefined
                  }
                >
                  {tech}
                </li>
              ))}
            </ul>
          </motion.article>
        );
      })}
    </div>
  );
}
