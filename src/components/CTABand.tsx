import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function CTABand({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="section-pad container-tight">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-10 text-center sm:p-16">
          <div className="hero-glow pointer-events-none absolute inset-0" />
          <h2 className="relative mx-auto max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
            {dict.footer.heading}
          </h2>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={`/${locale}#agenda`} className="btn-primary group">
              <Calendar className="h-4 w-4" />
              {dict.hero.ctaPrimary}
            </Link>
            <Link href={`/${locale}/soluciones`} className="btn-secondary group">
              {dict.nav.cases}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
