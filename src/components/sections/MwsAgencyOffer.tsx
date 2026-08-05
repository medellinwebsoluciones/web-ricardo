import Link from "next/link";
import { ArrowRight, Calendar, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function MwsAgencyOffer({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const t = dict.mwsAgency;
  return (
    <section id="mws-agencias" className="section-pad border-t border-zinc-900">
      <div className="container-wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">{t.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {t.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
                {t.body}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-8 space-y-3">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="lg:col-span-5">
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a href="#agenda" className="btn-primary justify-center">
                <Calendar className="h-4 w-4" />
                {t.ctaPrimary}
              </a>
              <Link
                href={`/${locale}/soluciones/wp-ai-agent`}
                className="btn-secondary group justify-center"
              >
                {t.ctaSecondary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
