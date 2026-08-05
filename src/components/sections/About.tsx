import {
  ShieldCheck,
  Activity,
  Eye,
  Bot,
  Scale,
  ShoppingCart,
  CreditCard,
  GraduationCap,
  Building2,
  MapPin,
  Crosshair,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries";

const principleIcons = [ShieldCheck, Activity, Eye, Bot];

const systemIcons: LucideIcon[] = [
  Bot,
  Scale,
  ShoppingCart,
  CreditCard,
  GraduationCap,
  Building2,
];

const modelIcons: LucideIcon[] = [Users, Crosshair, ShieldCheck];

export function About({ dict }: { dict: Dictionary }) {
  const lead = dict.about.body[0];

  return (
    <section
      id="perfil"
      className="relative overflow-hidden border-t border-zinc-900 section-pad"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.05),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] opacity-40 [mask-image:linear-gradient(180deg,black,transparent_85%)]"
      />

      <div className="container-wide relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <span className="eyebrow">{dict.about.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              {site.firm}
              <span className="mx-2 text-emerald-500/70">·</span>
              Medellín
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {dict.about.heading}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 h-px w-24 bg-gradient-to-r from-emerald-400 to-transparent" />
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-10 max-w-3xl text-xl leading-relaxed text-zinc-300 sm:text-2xl sm:leading-relaxed">
            {lead}
          </p>
        </Reveal>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal delay={0.14}>
              <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-zinc-500">
                {dict.about.systemsHeading}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-400">
                {dict.about.systemsIntro}
              </p>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {dict.about.systems.map((system, i) => {
                const Icon = systemIcons[i % systemIcons.length];
                return (
                  <Reveal key={system.name} delay={0.16 + 0.03 * i}>
                    <article className="stack-card group relative h-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-5 backdrop-blur-sm">
                      <div
                        aria-hidden
                        className="stack-card-sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <div className="relative flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-400 transition-colors duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-500/15">
                          <Icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <h4 className="text-base font-medium tracking-tight text-white">
                              {system.name}
                            </h4>
                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-500/80">
                              {system.tag}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                            {system.blurb}
                          </p>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal delay={0.2} className="lg:col-span-5 lg:sticky lg:top-28">
            <aside className="stack-card group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-zinc-900/50 p-6 backdrop-blur-sm sm:p-7">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl"
              />
              <div
                aria-hidden
                className="stack-card-sheen pointer-events-none absolute inset-0 opacity-40"
              />

              <div className="relative">
                <span className="eyebrow">{site.firm}</span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                  {dict.about.modelHeading}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                  {dict.about.modelIntro}
                </p>

                <ul className="mt-8 space-y-5">
                  {dict.about.modelPillars.map((pillar, i) => {
                    const Icon = modelIcons[i % modelIcons.length];
                    return (
                      <li key={pillar.title} className="flex gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 text-emerald-400">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {pillar.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                            {pillar.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-8 flex items-start gap-2 border-t border-zinc-800/80 pt-5 text-xs leading-relaxed text-zinc-500">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500/70" />
                  <span>{dict.about.modelFootnote}</span>
                </p>
              </div>
            </aside>
          </Reveal>
        </div>

        <Reveal delay={0.22}>
          <ul className="mt-12 flex flex-wrap gap-x-1 gap-y-3 border-y border-zinc-800/80 py-6">
            {dict.about.domains.map((domain, i) => (
              <li
                key={domain}
                className="flex items-center text-sm font-medium tracking-wide text-zinc-300"
              >
                {i > 0 && (
                  <span
                    aria-hidden
                    className="mx-3 h-1 w-1 rounded-full bg-emerald-500/70"
                  />
                )}
                <span className="transition-colors hover:text-emerald-300">
                  {domain}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-zinc-500">
              {dict.about.principlesHeading}
            </h3>
          </Reveal>

          <div className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {dict.about.principles.map((p, i) => {
              const Icon = principleIcons[i % principleIcons.length];
              const index = String(i + 1).padStart(2, "0");
              return (
                <Reveal as="article" key={p.title} delay={0.05 * i}>
                  <div className="group relative h-full border-l border-emerald-500/35 pl-5 transition-colors hover:border-emerald-400/70">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 text-emerald-400 transition-colors group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10">
                          <Icon className="h-4 w-4" />
                        </span>
                        <h4 className="text-lg font-medium text-white">
                          {p.title}
                        </h4>
                      </div>
                      <span className="font-mono text-xs tracking-wider text-zinc-600 transition-colors group-hover:text-emerald-500/70">
                        {index}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {p.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
