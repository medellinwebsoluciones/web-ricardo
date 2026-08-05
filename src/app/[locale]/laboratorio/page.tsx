import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Info, Maximize2 } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getInternalContent } from "@/lib/internal-content";
import { site } from "@/lib/site";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer } from "@/components/VideoPlayer";

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

      {/* Capturas primero — CRM / MWS AI / Nova */}
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

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {c.captures.map((cap, i) => (
              <Reveal
                as="figure"
                key={cap.slug}
                delay={0.04 * i}
                className={
                  i < 2
                    ? "card overflow-hidden md:col-span-2 lg:grid lg:grid-cols-5"
                    : "card overflow-hidden"
                }
              >
                <a
                  href={cap.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    i < 2
                      ? "group relative block border-b border-zinc-800 bg-zinc-950 lg:col-span-3 lg:border-b-0 lg:border-r"
                      : "group relative block border-b border-zinc-800 bg-zinc-950"
                  }
                  aria-label={`${cap.title} — ${c.ui.capturesZoom}`}
                >
                  <Image
                    src={cap.image}
                    alt={cap.title}
                    width={cap.width}
                    height={cap.height}
                    sizes={
                      i < 2
                        ? "(min-width: 1024px) 60vw, 100vw"
                        : "(min-width: 768px) 50vw, 100vw"
                    }
                    className="h-auto w-full"
                    priority={i < 2}
                  />
                  <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-950/85 px-2.5 py-1 text-[11px] text-zinc-300 opacity-90 transition-opacity group-hover:opacity-100">
                    <Maximize2 className="h-3 w-3" />
                    {c.ui.capturesZoom}
                  </span>
                </a>
                <figcaption
                  className={
                    i < 2
                      ? "flex flex-col justify-center p-6 lg:col-span-2 lg:p-7"
                      : "flex flex-col justify-center p-5"
                  }
                >
                  <div className="flex flex-wrap gap-2">
                    {cap.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-white sm:text-xl">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {cap.caption}
                  </p>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Videos del laboratorio */}
      <section className="section-pad container-wide">
        {featured && (
          <Reveal>
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
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {featured.title}
                </h2>
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
