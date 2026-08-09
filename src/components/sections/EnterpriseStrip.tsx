import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CAREER_ITEMS } from "@/lib/career-gallery";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/** Marcas de empleo/cliente, sin productos propios (esos viven en Products & Ventures). */
const BRANDS = CAREER_ITEMS.filter((item) => !item.solutionSlug).map(
  (item) => item.companyPublic,
);

export function EnterpriseStrip({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section
      aria-label={dict.enterprise.label}
      className="border-y border-zinc-900 bg-zinc-950/60"
    >
      <div className="container-wide py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <span className="eyebrow shrink-0">{dict.enterprise.label}</span>
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {BRANDS.map((brand) => (
              <li
                key={brand}
                className="text-sm font-medium tracking-tight text-zinc-400"
              >
                {brand}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-zinc-900 pt-5 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-3xl text-xs leading-relaxed text-zinc-600">
            {dict.enterprise.note}
          </p>
          <Link
            href={`/${locale}/trayectoria`}
            className="group inline-flex shrink-0 items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300"
          >
            {dict.nav.career}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
