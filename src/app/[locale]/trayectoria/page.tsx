import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { CAREER_ITEMS } from "@/lib/career-gallery";
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
  const en = locale === "en";
  const title = en ? "Career path" : "Trayectoria";
  const description = en
    ? "Public career highlights across enterprise brands and own products — no confidential client internals."
    : "Hitos públicos de trayectoria en marcas empresariales y productos propios — sin detalle confidencial de clientes.";
  const url = `${site.url}/${locale}/trayectoria`;
  return {
    title: `${title} | ${site.name}`,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: `${site.url}/es/trayectoria`,
        en: `${site.url}/en/trayectoria`,
      },
    },
  };
}

export default async function TrayectoriaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = getDictionary(l);
  const en = l === "en";

  return (
    <SiteShell locale={l} dict={dict}>
      <PageHero
        eyebrow={en ? "Career" : "Trayectoria"}
        title={
          en
            ? "Where Ricardo has shipped — public view"
            : "Dónde ha entregado Ricardo — vista pública"
        }
        subtitle={
          en
            ? "Enterprise brands and own products. Some cards show anonymized captures from public campaigns / product panels; no confidential client data is exposed."
            : "Marcas empresariales y productos propios. Algunas tarjetas muestran capturas anonimizadas de campañas públicas / paneles de producto; sin exponer datos confidenciales de cliente."
        }
      />

      <section className="section-pad pt-0">
        <div className="container-wide">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAREER_ITEMS.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.03, 0.3)}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
                  {item.image ? (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={`${item.companyPublic} — captura`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      {item.imageNote && (
                        <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                          {en ? item.imageNote.en : item.imageNote.es}
                        </span>
                      )}
                      <span className="absolute bottom-3 left-5 text-lg font-semibold tracking-tight text-white drop-shadow">
                        {item.companyPublic}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="flex h-28 items-end px-5 pb-4"
                      style={{
                        background: `linear-gradient(135deg, hsl(${item.placeholderHue} 35% 18%), hsl(${(item.placeholderHue + 40) % 360} 30% 10%))`,
                      }}
                    >
                      <span className="text-lg font-semibold tracking-tight text-white">
                        {item.companyPublic}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                      {en ? item.sector.en : item.sector.es}
                    </p>
                    <h2 className="text-sm font-medium text-zinc-100">
                      {en ? item.role.en : item.role.es}
                    </h2>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {en ? item.summary.en : item.summary.es}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                      {item.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    {item.solutionSlug && (
                      <Link
                        href={`/${l}/soluciones/${item.solutionSlug}`}
                        className="mt-2 text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        {en ? "See public case →" : "Ver caso público →"}
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-zinc-600">
            {dict.enterprise.note}
          </p>
          <p className="mt-4 max-w-2xl text-sm text-zinc-500">
            {en
              ? "Looking for role fit or a project? Book a 15-minute technical call or use the contact form — name, email and phone required."
              : "¿Encaje de rol o un proyecto? Agenda la llamada técnica de 15 minutos o usa el formulario — nombre, email y teléfono imprescindibles."}
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
