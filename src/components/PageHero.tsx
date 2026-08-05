import Image from "next/image";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bgImage?: string;
  crumbs?: Crumb[];
  align?: "left" | "center";
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  bgImage,
  crumbs,
  align = "left",
  children,
}: PageHeroProps) {
  const centered = align === "center";
  return (
    <section className="relative overflow-hidden border-b border-zinc-900">
      {bgImage && (
        <>
          <Image
            src={bgImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />
        </>
      )}
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      <div className="container-wide relative pt-28 pb-16 sm:pt-36 sm:pb-20">
        {crumbs && crumbs.length > 0 && (
          <div className={centered ? "flex justify-center" : ""}>
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        <div
          className={`${centered ? "mx-auto text-center" : ""} mt-6 max-w-3xl`}
        >
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p
              className={`mt-5 text-lg leading-relaxed text-zinc-400 ${
                centered ? "mx-auto" : ""
              }`}
            >
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
