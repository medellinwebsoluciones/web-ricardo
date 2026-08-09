"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { LabCapture } from "@/lib/internal-content";

type Props = {
  items: LabCapture[];
  zoomLabel: string;
  prevLabel: string;
  nextLabel: string;
};

export function LabShowcase({ items, zoomLabel, prevLabel, nextLabel }: Props) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      const n = items.length;
      if (!n) return;
      setIndex(((next % n) + n) % n);
    },
    [items.length],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    child.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index, reduceMotion]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const children = [...el.children] as HTMLElement[];
      if (!children.length) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      children.forEach((child, i) => {
        const center = child.offsetLeft + child.offsetWidth / 2;
        const d = Math.abs(center - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex((cur) => (cur === best ? cur : best));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  if (!items.length) return null;
  const active = items[index] ?? items[0];

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={active.title}
      onKeyDown={onKey}
      tabIndex={0}
    >
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-[0_0_0_1px_rgba(16,185,129,0.06)]">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((cap, i) => (
            <figure
              key={cap.slug}
              className="relative w-full shrink-0 snap-center snap-always"
              aria-hidden={i !== index}
            >
              <a
                href={cap.image}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block bg-zinc-950"
                aria-label={`${cap.title} — ${zoomLabel}`}
                tabIndex={i === index ? 0 : -1}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={cap.image}
                    alt={cap.title}
                    fill
                    sizes="(min-width: 1024px) 960px, 100vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.01]"
                    priority={i === 0}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                </div>
                <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md border border-zinc-700/80 bg-zinc-950/80 px-2.5 py-1 text-[11px] text-zinc-300 backdrop-blur-sm">
                  <Maximize2 className="h-3 w-3" />
                  {zoomLabel}
                </span>
              </a>
            </figure>
          ))}
        </div>

        <div className="grid gap-6 border-t border-zinc-800 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              {active.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300"
                >
                  {t}
                </span>
              ))}
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {active.title}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              {active.caption}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-200 transition hover:border-emerald-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              aria-label={prevLabel}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-200 transition hover:border-emerald-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              aria-label={nextLabel}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="mt-6 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Slides"
      >
        {items.map((cap, i) => (
          <button
            key={cap.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={cap.title}
            onClick={() => go(i)}
            className={
              i === index
                ? "h-2 w-8 rounded-full bg-emerald-400 transition-all"
                : "h-2 w-2 rounded-full bg-zinc-700 transition-all hover:bg-zinc-500"
            }
          />
        ))}
      </div>
    </div>
  );
}
