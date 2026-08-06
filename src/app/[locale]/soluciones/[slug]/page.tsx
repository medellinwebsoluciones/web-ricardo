import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getInternalContent,
  getSolution,
  solutionSlugs,
} from "@/lib/internal-content";
import { site } from "@/lib/site";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ArchMap } from "@/components/ArchMap";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    solutionSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const s = getSolution(locale, slug);
  if (!s) return {};
  const url = `${site.url}/${locale}/soluciones/${slug}`;
  return {
    title: `${s.title} | ${site.name}`,
    description: s.summary,
    alternates: {
      canonical: url,
      languages: {
        es: `${site.url}/es/soluciones/${slug}`,
        en: `${site.url}/en/soluciones/${slug}`,
      },
    },
    openGraph: {
      title: `${s.title} | ${site.name}`,
      description: s.summary,
      images: [{ url: s.heroImage }],
    },
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = getDictionary(l);
  const c = getInternalContent(l);
  const s = getSolution(l, slug);
  if (!s) notFound();

  const related = c.solutions.filter((x) => x.slug !== s.slug).slice(0, 4);

  return (
    <SiteShell locale={l} dict={dict}>
      <PageHero
        eyebrow={s.tag}
        title={s.title}
        subtitle={s.summary}
        bgImage={s.archImage}
        crumbs={[
          { label: c.ui.home, href: `/${l}` },
          { label: c.ui.solutionsTitle, href: `/${l}/soluciones` },
          { label: s.title },
        ]}
      />

      {/* Meta grid */}
      <section className="border-b border-zinc-900">
        <div className="container-wide grid grid-cols-2 gap-px overflow-hidden rounded-none sm:grid-cols-4">
          {s.meta.map((m) => (
            <div key={m.label} className="bg-zinc-950 px-2 py-6 sm:px-4">
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                {m.label}
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-white">
                {m.value}
              </dd>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad container-tight">
        {/* Context */}
        <Reveal>
          <span className="eyebrow">{c.ui.contextLabel}</span>
          <p className="mt-5 text-lg leading-relaxed text-zinc-300">
            {s.context}
          </p>
        </Reveal>

        {/* Product screenshot + gallery */}
        {(s.productImage || (s.gallery && s.gallery.length > 0)) && (
          <div className="mt-12">
            {s.productImage && !s.gallery?.length && (
              <Reveal>
                <a
                  href={s.productImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
                  aria-label={`${s.title} — ${c.ui.capturesZoom}`}
                >
                  <Image
                    src={s.productImage}
                    alt={s.title}
                    width={1024}
                    height={433}
                    sizes="(min-width: 768px) 720px, 100vw"
                    className="h-auto w-full"
                    priority
                  />
                </a>
              </Reveal>
            )}

            {s.gallery && s.gallery.length > 0 && (
              <>
                <Reveal>
                  <span className="eyebrow">{c.ui.galleryLabel}</span>
                  <p className="mt-3 text-sm text-zinc-400">{c.ui.galleryIntro}</p>
                </Reveal>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {s.gallery.map((g, i) => (
                    <Reveal
                      key={g.src}
                      delay={0.05 * i}
                      className={i === 0 ? "sm:col-span-2" : undefined}
                    >
                      <a
                        href={g.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
                        aria-label={`${g.alt} — ${c.ui.capturesZoom}`}
                      >
                        <Image
                          src={g.src}
                          alt={g.alt}
                          width={g.width}
                          height={g.height}
                          sizes={
                            i === 0
                              ? "(min-width: 768px) 720px, 100vw"
                              : "(min-width: 768px) 360px, 100vw"
                          }
                          className="h-auto w-full"
                          priority={i === 0}
                        />
                        {g.caption && (
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent px-4 pb-3 pt-10 text-xs text-zinc-300 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                            {g.caption}
                          </span>
                        )}
                      </a>
                    </Reveal>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Video */}
        {s.video && s.videoPoster && (
          <Reveal className="mt-12">
            <VideoPlayer
              src={s.video}
              poster={s.videoPoster}
              title={s.title}
              playLabel={c.ui.playVideo}
            />
          </Reveal>
        )}

        {/* Challenge */}
        <div className="mt-16">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {c.ui.challengeLabel}
            </h2>
          </Reveal>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {s.challenges.map((ch, i) => (
              <Reveal as="li" key={ch} delay={0.05 * i}>
                <div className="card flex h-full items-start gap-3 p-5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-xs font-semibold text-emerald-400">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-zinc-300">
                    {ch}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Approach */}
        <div className="mt-16">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {c.ui.approachLabel}
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {s.approach.map((step, i) => (
              <Reveal key={step.title} delay={0.05 * i}>
                <div className="card card-hover h-full p-6">
                  <span className="text-sm font-semibold text-emerald-400/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-base font-medium text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-y border-zinc-900 bg-zinc-950/60">
        <div className="section-pad container-wide">
          <Reveal>
            <span className="eyebrow">{c.ui.architectureLabel}</span>
          </Reveal>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <ArchMap
                title={s.title}
                archImage={s.archImage}
                archInteractive={s.archInteractive}
                architectureLabel={c.ui.architectureLabel}
                interactiveHint={
                  l === "es"
                    ? "Interactivo · cursor o foco en cada capa"
                    : "Interactive · hover or focus each layer"
                }
              />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-2">
              <p className="text-base leading-relaxed text-zinc-400">
                {s.archCaption}
              </p>
              <div className="mt-6">
                <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                  {c.ui.architectureLayersLabel}
                </h3>
                <ol className="mt-4 space-y-2">
                  {s.architectureLayers.map((layer, i) => (
                    <li
                      key={layer}
                      className="flex gap-3 text-sm text-zinc-300"
                    >
                      <span className="shrink-0 font-mono text-xs text-emerald-400/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{layer}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-6">
                <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                  {c.ui.stackLabel}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-sm text-zinc-300"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Decisions */}
      <section className="section-pad container-tight border-b border-zinc-900">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {c.ui.decisionsLabel}
          </h2>
        </Reveal>
        <ul className="mt-8 space-y-6">
          {s.decisions.map((d, i) => (
            <Reveal as="li" key={d.title} delay={0.05 * i}>
              <div className="border-l border-emerald-500/40 pl-5">
                <h3 className="text-base font-medium text-white">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {d.why}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section-pad container-tight">
        {/* Outcomes */}
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {c.ui.outcomesLabel}
          </h2>
        </Reveal>
        <dl className="mt-6 grid gap-5 sm:grid-cols-3">
          {s.outcomes.map((o, i) => (
            <Reveal key={o.label} delay={0.05 * i}>
              <div className="card h-full p-7">
                <dt className="text-3xl font-semibold text-emerald-400">
                  {o.value}
                </dt>
                <dd className="mt-2 text-sm text-zinc-400">{o.label}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        {/* Highlights */}
        <div className="mt-14">
          <Reveal>
            <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-zinc-500">
              {c.ui.highlightsLabel}
            </h3>
          </Reveal>
          <ul className="mt-5 space-y-3">
            {s.highlights.map((h, i) => (
              <Reveal as="li" key={h} delay={0.05 * i}>
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <span className="text-base text-zinc-300">{h}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Hiring fit */}
        <div className="mt-14 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
          <Reveal>
            <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-emerald-400/90">
              {c.ui.hiringFitLabel}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              {s.hiringFit}
            </p>
            <Link
              href={`/${l}#agenda`}
              className="btn-primary mt-6 inline-flex"
            >
              {c.ui.bookCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-zinc-900">
        <div className="section-pad container-wide">
          <Reveal>
            <div className="flex items-center gap-2 text-zinc-500">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium uppercase tracking-[0.15em]">
                {c.ui.relatedLabel}
              </span>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={0.06 * i}>
                <Link
                  href={`/${l}/soluciones/${r.slug}`}
                  className="card card-hover group flex items-center gap-5 p-5"
                >
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={r.productImage || r.heroImage}
                      alt={r.title}
                      fill
                      sizes="120px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-emerald-400/80">
                      {r.tag}
                    </span>
                    <h3 className="mt-1 text-base font-medium leading-snug text-white">
                      {r.title}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-emerald-400">
                      {c.ui.viewSolution}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </SiteShell>
  );
}
