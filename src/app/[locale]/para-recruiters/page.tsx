import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, Download, Mail } from "lucide-react";
import { LinkedInIcon, WhatsAppIcon } from "@/components/icons";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cvPath, mailtoContact, site, whatsappContact } from "@/lib/site";
import { CAREER_ITEMS } from "@/lib/career-gallery";
import { getInternalContent, featuredSlugs } from "@/lib/internal-content";
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
  const dict = getDictionary(locale as Locale);
  const url = `${site.url}/${locale}/para-recruiters`;
  return {
    title: dict.recruiters.metaTitle,
    description: dict.recruiters.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        es: `${site.url}/es/para-recruiters`,
        en: `${site.url}/en/para-recruiters`,
      },
    },
    openGraph: {
      title: dict.recruiters.metaTitle,
      description: dict.recruiters.metaDescription,
      url,
      type: "profile",
      images: [`${site.url}/images/og-ricardo.png`],
    },
  };
}

export default async function RecruitersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = getDictionary(l);
  const t = dict.recruiters;
  const content = getInternalContent(l);

  const brands = CAREER_ITEMS.filter((item) => !item.solutionSlug);
  const systems = featuredSlugs
    .map((slug) => content.solutions.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const coreStack = dict.stack.categories.filter((c) => c.tier === "core");

  return (
    <SiteShell locale={l} dict={dict}>
      <PageHero eyebrow={t.eyebrow} title={t.heading} subtitle={t.intro}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={whatsappContact(l)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t.whatsappCta}
          </a>
          <a href={cvPath(l)} download className="btn-secondary">
            <Download className="h-4 w-4" />
            {t.downloadCv}
          </a>
          <a href={`/${l}#agenda`} className="btn-secondary">
            <Calendar className="h-4 w-4" />
            {t.bookCall}
          </a>
        </div>
        <p className="mt-5 text-sm text-zinc-500">{dict.hero.location}</p>
      </PageHero>

      <section className="section-pad pt-16">
        <div className="container-wide grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">
                {t.quickFactsHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <dl className="mt-6 divide-y divide-zinc-900 border-y border-zinc-900">
                {t.quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-3 gap-4 py-3.5 text-sm"
                  >
                    <dt className="text-zinc-500">{fact.label}</dt>
                    <dd className="col-span-2 text-zinc-200">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">
                {t.rolesHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <ul className="mt-6 flex flex-wrap gap-2">
                {dict.hero.roles.map((role) => (
                  <li
                    key={role}
                    className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-1.5 text-sm text-emerald-100"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-sm text-zinc-500">{t.rolesNote}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <h2 className="mt-12 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">
                {t.workModelHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                {t.workModel.map((row) => (
                  <div
                    key={row.label}
                    className="border-l border-emerald-500/40 pl-4"
                  >
                    <dt className="text-sm font-medium text-white">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-zinc-400">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-zinc-900">
        <div className="container-wide">
          <Reveal>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">
              {t.stackHeading}
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {coreStack.map((cat, i) => (
              <Reveal key={cat.title} delay={0.05 * i}>
                <div className="h-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                  <h3 className="text-base font-medium text-white">
                    {cat.title}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {cat.items.map((techItem) => (
                      <li
                        key={techItem}
                        className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-2.5 py-1 text-[13px] text-zinc-300"
                      >
                        {techItem}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h2 className="mt-16 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">
              {t.enterpriseHeading}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
              {brands.map((brand) => (
                <li
                  key={brand.id}
                  className="text-sm font-medium text-zinc-300"
                >
                  {brand.companyPublic}
                  <span className="ml-2 text-xs text-zinc-600">
                    {l === "en" ? brand.sector.en : brand.sector.es}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-3xl text-xs leading-relaxed text-zinc-600">
              {dict.enterprise.note}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad border-t border-zinc-900">
        <div className="container-wide">
          <Reveal>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">
              {t.systemsHeading}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-2xl text-sm text-zinc-500">
              {t.systemsNote}
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {systems.map((system, i) => (
              <Reveal key={system.slug} delay={0.05 * i}>
                <Link
                  href={`/${l}/soluciones/${system.slug}`}
                  className="card card-hover group flex h-full flex-col p-5"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-400/80">
                    {system.tag}
                  </span>
                  <h3 className="mt-2 text-base font-medium text-white">
                    {system.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {system.summary}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-medium text-emerald-400">
                    {content.ui.viewSolution}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-zinc-900">
        <div className="container-wide">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t.ctaHeading}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">{t.ctaBody}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappContact(l)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.whatsappCta}
              </a>
              <a href={cvPath(l)} download className="btn-secondary">
                <Download className="h-4 w-4" />
                {t.downloadCv}
              </a>
              <a href={`/${l}#agenda`} className="btn-secondary">
                <Calendar className="h-4 w-4" />
                {t.bookCall}
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <LinkedInIcon className="h-4 w-4" />
                {t.viewLinkedin}
              </a>
              <a href={mailtoContact(l)} className="btn-secondary">
                <Mail className="h-4 w-4" />
                {t.emailCta}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
