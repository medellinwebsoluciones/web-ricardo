import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getInternalContent } from "@/lib/internal-content";
import { site } from "@/lib/site";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LabShowcase } from "@/components/LabShowcase";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = getInternalContent(locale);
  const url = `${site.url}/${locale}/laboratorio`;
  return {
    title: `${c.ui.labTitle} | ${site.name}`,
    description: c.ui.labIntro,
    alternates: {
      canonical: url,
      languages: {
        es: `${site.url}/es/laboratorio`,
        en: `${site.url}/en/laboratorio`,
      },
    },
    openGraph: {
      title: `${c.ui.labTitle} | ${site.name}`,
      description: c.ui.labIntro,
      images: [{ url: "/images/og-laboratorio.png" }],
    },
  };
}

export default async function LaboratorioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = getDictionary(l);
  const c = getInternalContent(l);
  const n = c.labNarrative;

  const [featured, ...rest] = c.lab;

  return (
    <SiteShell locale={l} dict={dict}>
      <PageHero
        eyebrow={c.ui.labEyebrow}
        title={c.ui.labTitle}
        subtitle={c.ui.labIntro}
        bgImage="/images/og-laboratorio.png"
        crumbs={[
          { label: c.ui.home, href: `/${l}` },
          { label: c.ui.labTitle },
        ]}
      />

      {/* Narrativa: problema, aplicacion, validacion */}
      <section className="border-b border-zinc-900 bg-zinc-950/40">
        <div className="section-pad container-wide">
          <Reveal>
            <span className="eyebrow">{n.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {n.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-400">
              {n.intro}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {n.blocks.map((block, i) => (
              <Reveal
                as="article"
                key={block.title}
                delay={0.06 * i}
                className="relative border-l border-emerald-500/30 pl-5"
              >
                <h3 className="text-lg font-medium text-white">{block.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {block.body}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-14">
              <span className="eyebrow">{n.capabilitiesEyebrow}</span>
              <h3 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {n.capabilitiesTitle}
              </h3>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {n.capabilities.map((cap, i) => (
              <Reveal
                as="article"
                key={cap.title}
                delay={0.04 * i}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5"
              >
                <h4 className="text-base font-medium text-emerald-300">
                  {cap.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {cap.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Carrusel profesional de superficies Nova */}
      <section id="capturas" className="border-b border-zinc-900 bg-zinc-950/60">
        <div className="section-pad container-wide">
          <Reveal>
            <div className="mb-10 flex items-start gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-400">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>{c.ui.labDisclaimer}</span>
            </div>
          </Reveal>

          <Reveal>
            <span className="eyebrow">{c.ui.capturesEyebrow}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {c.ui.capturesTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-400">
              {c.ui.capturesIntro}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            <LabShowcase
              items={c.captures}
              zoomLabel={c.ui.capturesZoom}
              prevLabel={c.ui.labPrev}
              nextLabel={c.ui.labNext}
            />
          </Reveal>
        </div>
      </section>

      {/* Videos de orquestacion */}
      <section className="section-pad container-wide">
        <Reveal>
          <span className="eyebrow">{c.ui.labVideosEyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {c.ui.labVideosTitle}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-400">
            {c.ui.labVideosIntro}
          </p>
        </Reveal>

        {featured && (
          <Reveal delay={0.12} className="mt-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <VideoPlayer
                src={featured.video}
                poster={featured.poster}
                title={featured.title}
                playLabel={c.ui.playVideo}
                loop
              />
              <div>
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-zinc-400">
                  {featured.description}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {featured.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-3 text-sm text-zinc-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {rest.map((item, i) => (
            <Reveal as="article" key={item.slug} delay={0.06 * i}>
              <VideoPlayer
                src={item.video}
                poster={item.poster}
                title={item.title}
                playLabel={c.ui.playVideo}
                loop
              />
              <div className="mt-5">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 text-xl font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
