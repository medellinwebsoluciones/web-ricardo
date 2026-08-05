import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getInternalContent } from "@/lib/internal-content";
import { site } from "@/lib/site";
import { getIcon } from "@/components/iconMap";
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
  const url = `${site.url}/${locale}/servicios`;
  return {
    title: `${c.ui.servicesTitle} | ${site.name}`,
    description: c.ui.servicesIntro,
    alternates: {
      canonical: url,
      languages: {
        es: `${site.url}/es/servicios`,
        en: `${site.url}/en/servicios`,
      },
    },
  };
}

export default async function ServiciosPage({
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
        eyebrow={c.ui.servicesEyebrow}
        title={c.ui.servicesTitle}
        subtitle={c.ui.servicesIntro}
        bgImage="/images/texture-grid.png"
        crumbs={[
          { label: c.ui.home, href: `/${l}` },
          { label: c.ui.servicesTitle },
        ]}
      />

      <section className="section-pad container-wide">
        <div className="grid gap-6 md:grid-cols-2">
          {c.services.map((svc, i) => {
            const Icon = getIcon(svc.icon);
            return (
              <Reveal as="article" key={svc.slug} delay={0.06 * i}>
                <div className="card card-hover flex h-full flex-col p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-medium text-white">
                        {svc.title}
                      </h2>
                      <p className="text-sm text-emerald-400/80">
                        {svc.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                    {svc.description}
                  </p>

                  <div className="mt-6 border-t border-zinc-800/80 pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {c.ui.deliverablesLabel}
                    </h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {svc.deliverables.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-sm text-zinc-300"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-4 py-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {c.ui.idealForLabel}:
                    </span>{" "}
                    <span className="text-sm text-zinc-300">{svc.idealFor}</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-zinc-900 bg-zinc-950/60">
        <div className="section-pad container-wide">
          <Reveal>
            <span className="eyebrow">{c.ui.processLabel}</span>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {c.process.map((step, i) => (
              <Reveal key={step.phase} delay={0.06 * i}>
                <div className="relative h-full">
                  <span className="text-4xl font-semibold text-zinc-800">
                    {step.phase}
                  </span>
                  <h3 className="mt-3 text-base font-medium text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                  {i < c.process.length - 1 && (
                    <ArrowRight className="absolute -right-1 top-2 hidden h-4 w-4 text-zinc-700 lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </SiteShell>
  );
}
