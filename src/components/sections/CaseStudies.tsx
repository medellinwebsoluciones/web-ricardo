import Link from "next/link";
import Image from "next/image";
import {
  Bot,
  Server,
  Scale,
  ShoppingCart,
  GraduationCap,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getInternalContent, featuredSlugs } from "@/lib/internal-content";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const icons = [Bot, Scale, Server, ShoppingCart, ShoppingCart, GraduationCap];

export function CaseStudies({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const c = getInternalContent(locale);
  const featured = featuredSlugs
    .map((slug) => c.solutions.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <section id="casos" className="section-pad border-t border-zinc-900">
      <div className="container-wide">
        <Reveal>
          <span className="eyebrow">{dict.cases.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {dict.cases.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            {dict.cases.subheading}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((item, i) => {
            const Icon = icons[i % icons.length];
            const result = item.outcomes[0];
            const thumb = item.productImage || item.heroImage;
            return (
              <Reveal as="article" key={item.slug} delay={0.06 * i}>
                <Link
                  href={`/${locale}/soluciones/${item.slug}`}
                  className="card card-hover group flex h-full flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-zinc-800 bg-zinc-950">
                    <Image
                      src={thumb}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1280px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-950/70 text-emerald-400 backdrop-blur">
                      <Icon className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="absolute right-3 top-3 h-5 w-5 text-zinc-300 opacity-80 transition-colors group-hover:text-emerald-400" />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-400/80">
                      {item.tag}
                    </span>
                    <h3 className="mt-2 text-xl font-medium leading-snug text-white">
                      {item.title}
                    </h3>

                    <dl className="mt-5 space-y-3 border-t border-zinc-800/80 pt-5">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          {dict.cases.challengeLabel}
                        </dt>
                        <dd className="mt-1 text-sm text-zinc-400">
                          {item.challenges[0]}
                        </dd>
                      </div>
                      {item.architectureLayers[0] && (
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            {c.ui.architectureLabel}
                          </dt>
                          <dd className="mt-1 text-sm text-zinc-400">
                            {item.architectureLayers[0]}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-400/80">
                          {dict.cases.resultLabel}
                        </dt>
                        <dd className="mt-1 text-sm text-zinc-300">
                          {result
                            ? `${result.value} — ${result.label}`
                            : item.highlights[0]}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <Link
              href={`/${locale}/soluciones`}
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
            >
              {c.ui.viewAllSolutions}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
