import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CAREER_ITEMS } from "@/lib/career-gallery";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function CareerTeaser({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const en = locale === "en";
  const preview = CAREER_ITEMS.filter((c) => !c.solutionSlug).slice(0, 6);

  return (
    <section className="section-pad border-t border-zinc-900">
      <div className="container-wide">
        <Reveal>
          <span className="eyebrow">
            {en ? "Career path" : "Trayectoria"}
          </span>
        </Reveal>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <Reveal delay={0.05}>
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {en
                ? "Enterprise brands and own products — public view only."
                : "Marcas empresariales y productos propios — solo vista pública."}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href={`/${locale}/trayectoria`}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              {en ? "Full gallery" : "Ver galería"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((item, i) => (
            <Reveal key={item.id} delay={0.05 + i * 0.03}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
                <div
                  className="mb-2 h-1.5 w-10 rounded-full"
                  style={{
                    background: `hsl(${item.placeholderHue} 50% 45%)`,
                  }}
                />
                <p className="font-medium text-zinc-100">{item.companyPublic}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {en ? item.sector.en : item.sector.es}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {en ? item.role.en : item.role.es}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-zinc-600">
            {dict.enterprise.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
