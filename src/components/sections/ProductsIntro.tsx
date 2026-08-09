import { Reveal } from "@/components/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";

/** Cabecera de la banda Products & Ventures: separa producto propio de la trayectoria de empleo. */
export function ProductsIntro({ dict }: { dict: Dictionary }) {
  const t = dict.products;
  return (
    <section id="productos" className="border-t border-zinc-900 pt-20 sm:pt-24">
      <div className="container-wide">
        <Reveal>
          <span className="eyebrow">{t.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            {t.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
