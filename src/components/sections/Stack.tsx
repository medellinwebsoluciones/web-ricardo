import { Reveal } from "@/components/Reveal";
import { StackExpertise } from "@/components/sections/StackExpertise";
import type { Dictionary, StackTier } from "@/i18n/dictionaries";

const TIER_ORDER: StackTier[] = ["core", "strong", "infra", "ai"];

export function Stack({ dict }: { dict: Dictionary }) {
  const tiers = TIER_ORDER.map((tier) => ({
    tier,
    label: dict.stack.tiers[tier],
    categories: dict.stack.categories.filter((cat) => cat.tier === tier),
  })).filter((group) => group.categories.length > 0);

  return (
    <section
      id="stack"
      className="section-pad relative overflow-hidden border-t border-zinc-900"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05),transparent_55%)]"
      />
      <div className="container-wide relative">
        <Reveal>
          <span className="eyebrow">{dict.stack.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {dict.stack.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            {dict.stack.subheading}
          </p>
        </Reveal>

        {tiers.map((group) => (
          <div key={group.tier} className="mt-14 first:mt-12">
            <Reveal>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
                {group.label}
              </h3>
            </Reveal>
            <StackExpertise
              items={group.categories.map((cat) => ({
                area: cat.title,
                items: cat.items,
                blurb: cat.blurb,
                icon: cat.icon,
              }))}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
