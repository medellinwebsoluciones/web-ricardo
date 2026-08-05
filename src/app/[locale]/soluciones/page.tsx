import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getInternalContent } from "@/lib/internal-content";
import { site } from "@/lib/site";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

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
  const url = `${site.url}/${locale}/soluciones`;
  return {
    title: `${c.ui.solutionsTitle} | ${site.name}`,
    description: c.ui.solutionsIntro,
    alternates: {
      canonical: url,
      languages: {
        es: `${site.url}/es/soluciones`,
        en: `${site.url}/en/soluciones`,
      },
    },
  };
}

export default async function SolucionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = getDictionary(l);
  const c = getInternalContent(l);

  return (
    <SiteShell locale={l} dict={dict}>
      <PageHero
        eyebrow={c.ui.solutionsEyebrow}
        title={c.ui.solutionsTitle}
        subtitle={c.ui.solutionsIntro}
        bgImage="/images/hero-soluciones.png"
        crumbs={[
          { label: c.ui.home, href: `/${l}` },
          { label: c.ui.solutionsTitle },
        ]}
      />

      <section className="section-pad container-wide">
        <div className="grid gap-6 lg:grid-cols-3">
          {c.solutions.map((s, i) => (
            <Reveal as="article" key={s.slug} delay={0.06 * i}>
              <Link
                href={`/${l}/soluciones/${s.slug}`}
                className="card card-hover group flex h-full flex-col overflow-hidden"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={s.heroImage}
                    alt={s.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-emerald-500/30 bg-zinc-950/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-400 backdrop-blur">
                    {s.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-medium leading-snug text-white">
                    {s.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
                    {s.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                    {c.ui.viewSolution}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

    </SiteShell>
  );
}
