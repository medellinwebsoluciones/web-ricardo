import { Globe2, FileSignature, Shield, Languages } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";

const icons = [Globe2, FileSignature, Shield, Languages];

export function EngagementTrust({ dict }: { dict: Dictionary }) {
  const t = dict.trust;
  return (
    <section id="confianza" className="section-pad border-t border-zinc-900">
      <div className="container-wide">
        <Reveal>
          <span className="eyebrow">{t.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.heading}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {t.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal as="article" key={item.title} delay={0.05 * i}>
                <div className="h-full border-l border-emerald-500/40 pl-5">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Icon className="h-4 w-4" />
                    <h3 className="text-base font-medium text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
              {t.profileHeading}
            </h3>
            <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {t.profile.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between gap-6 border-b border-zinc-800/70 pb-3 text-sm"
                >
                  <dt className="text-zinc-500">{row.label}</dt>
                  <dd className="text-right font-medium text-zinc-200">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
