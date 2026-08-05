import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getInternalContent } from "@/lib/internal-content";
import type { Locale } from "@/i18n/config";

export function LabTeaser({ locale }: { locale: Locale }) {
  const c = getInternalContent(locale);
  const featured = c.lab[0];
  if (!featured) return null;

  return (
    <section id="laboratorio" className="section-pad border-t border-zinc-900">
      <div className="container-wide">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <VideoPlayer
              src={featured.video}
              poster={featured.poster}
              title={featured.title}
              playLabel={c.ui.playVideo}
              loop
            />
          </Reveal>
          <div>
            <Reveal>
              <span className="eyebrow">{c.ui.labEyebrow}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {c.ui.labTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">
                {c.ui.labIntro}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-2">
                {c.lab.map((item) => (
                  <span
                    key={item.slug}
                    className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400"
                  >
                    {item.title}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8">
                <Link href={`/${locale}/laboratorio`} className="btn-primary group">
                  {c.ui.exploreLab}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
