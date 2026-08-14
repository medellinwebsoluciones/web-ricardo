"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Download } from "lucide-react";
import { LinkedInIcon, WhatsAppIcon } from "@/components/icons";
import { cvPath, site, whatsappContact } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
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
              {dict.hero.role}
            </span>
            <span className="mt-3 block text-base font-normal tracking-wide text-emerald-400 sm:text-lg">
              {dict.hero.roleSpec}
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-base leading-relaxed text-zinc-400"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-8 max-w-2xl">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
              {dict.hero.rolesLabel}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dict.hero.roles.map((role) => (
                <li
                  key={role}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-[13px] text-zinc-300"
                >
                  {role}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <a
              href={whatsappContact(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {dict.hero.ctaWhatsapp}
            </a>
            <a href="#agenda" className="btn-secondary">
              <Calendar className="h-4 w-4" />
              {dict.hero.ctaPrimary}
            </a>
            <a href={cvPath(locale)} download className="btn-secondary">
              <Download className="h-4 w-4" />
              {dict.hero.ctaCv}
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
          >
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
            >
              <LinkedInIcon className="h-4 w-4" />
              {dict.hero.ctaLinkedin}
            </a>
            <a
              href={`tel:+${site.phoneE164}`}
              className="text-zinc-400 transition-colors hover:text-white"
            >
              {site.phoneDisplay}
            </a>
            <a
              href="#casos"
              className="group inline-flex items-center gap-2 font-medium text-emerald-400 hover:text-emerald-300"
            >
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
