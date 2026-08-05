import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getInternalContent } from "@/lib/internal-content";
import { site, mailtoContact } from "@/lib/site";
import { LinkedInIcon } from "@/components/icons";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { StackExpertise } from "@/components/sections/StackExpertise";

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
  const url = `${site.url}/${locale}/perfil`;
  return {
    title: `${c.ui.profileTitle} | ${site.name}`,
    description: c.profile.intro,
    alternates: {
      canonical: url,
      languages: {
        es: `${site.url}/es/perfil`,
        en: `${site.url}/en/perfil`,
      },
    },
    openGraph: {
      title: `${c.ui.profileTitle} | ${site.name}`,
      description: c.profile.intro,
      images: [{ url: "/images/og-ricardo.png", width: 1200, height: 630 }],
    },
  };
}

export default async function PerfilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = getDictionary(l);
  const c = getInternalContent(l);
  const p = c.profile;

  return (
    <SiteShell locale={l} dict={dict}>
      <PageHero
        eyebrow={c.ui.profileEyebrow}
        title={c.ui.profileTitle}
        subtitle={p.intro}
        bgImage="/images/perfil-abstract.png"
        crumbs={[
          { label: c.ui.home, href: `/${l}` },
          { label: c.ui.profileTitle },
        ]}
      />

      {/* Bio + image */}
      <section className="section-pad container-wide">
        <div className="grid gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="space-y-5">
              {p.bio.map((para) => (
                <p key={para} className="text-lg leading-relaxed text-zinc-300">
                  {para}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={mailtoContact(l)} className="btn-secondary">
                <Mail className="h-4 w-4" />
                {site.email}
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <LinkedInIcon className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-2">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 lg:sticky lg:top-28">
              <Image
                src={p.image}
                alt={`${site.name} — ${site.role}`}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent p-6 pt-16">
                <figcaption>
                  <span className="block text-base font-medium text-white">
                    {site.name}
                  </span>
                  <span className="mt-1 block text-sm text-zinc-400">
                    {site.firm}
                  </span>
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Expertise */}
      <section className="relative overflow-hidden border-y border-zinc-900 bg-zinc-950/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06),transparent_55%)]"
        />
        <div className="section-pad container-wide relative">
          <Reveal>
            <span className="eyebrow">{c.ui.stackLabel}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
              {c.ui.stackIntro}
            </p>
          </Reveal>
          <StackExpertise items={p.expertise} />
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad container-tight">
        <div className="grid gap-8 sm:grid-cols-3">
          {p.timeline.map((t, i) => (
            <Reveal key={t.title} delay={0.06 * i}>
              <div className="relative border-l border-zinc-800 pl-5">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium uppercase tracking-wide text-emerald-400/80">
                  {t.period}
                </span>
                <h3 className="mt-2 text-base font-medium text-white">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {t.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-zinc-900">
        <div className="section-pad container-wide">
          <div className="grid gap-4 sm:grid-cols-2">
            {p.values.map((v, i) => (
              <Reveal key={v.title} delay={0.05 * i}>
                <div className="card card-hover h-full p-6">
                  <h3 className="text-base font-medium text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {v.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10">
              <Link
                href={`/${l}/soluciones`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                {c.ui.viewAllSolutions}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </SiteShell>
  );
}
