"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries";

export function Hero({ dict }: { dict: Dictionary }) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      <div className="container-wide relative grid items-center gap-12 pt-28 pb-20 lg:min-h-[92vh] lg:grid-cols-12 lg:gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-7"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {dict.hero.availability}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-8 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            <span className="text-gradient">Ricardo Zuluaga</span>
            <span className="mt-2 block text-2xl font-normal text-zinc-400 sm:text-3xl lg:text-4xl">
              Senior Solutions Architect{" "}
              <span className="text-emerald-400">&</span> AI Automation Expert
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-base leading-relaxed text-zinc-400"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#agenda" className="btn-primary">
              <Calendar className="h-4 w-4" />
              {dict.hero.ctaPrimary}
            </a>
            <a href="#casos" className="btn-secondary group">
              {dict.hero.ctaSecondary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-zinc-800/80 pt-8"
          >
            {dict.hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-semibold text-white sm:text-3xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs text-zinc-500 sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="portrait relative mx-auto w-full max-w-[18rem] lg:col-span-5 lg:max-w-none"
        >
          <div className="relative aspect-[3/4] w-full lg:origin-bottom lg:scale-110">
            <div aria-hidden className="portrait-ambient pointer-events-none" />
            <div aria-hidden className="portrait-bloom pointer-events-none" />
            <div aria-hidden className="portrait-halo pointer-events-none" />
            <Image
              src="/images/ricardo-hero.png"
              alt={`${site.name} — ${site.role}`}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 18rem"
              className="relative object-contain object-bottom"
            />
            <div aria-hidden className="portrait-fade pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
