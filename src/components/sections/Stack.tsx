import { Reveal } from "@/components/Reveal";
import { StackExpertise } from "@/components/sections/StackExpertise";
import type { Dictionary } from "@/i18n/dictionaries";

export function Stack({ dict }: { dict: Dictionary }) {
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

        <StackExpertise
          items={dict.stack.categories.map((cat) => ({
            area: cat.title,
            items: cat.items,
            blurb: cat.blurb,
            icon: cat.icon,
          }))}
        />
      </div>
    </section>
  );
}
