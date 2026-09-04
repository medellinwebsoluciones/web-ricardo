import { Mail, ArrowRight, Download } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { cvPath, site, mailtoContact } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Footer({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <footer id="contacto" className="border-t border-zinc-900">
      <div className="section-pad container-tight">
        <Reveal>
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-10 text-center sm:p-16">
            <h2 className="mx-auto max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
              {dict.footer.heading}
            </h2>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
              {dict.footer.paths.map((path) => (
                <li key={path}>{path}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`/${locale}#agenda`} className="btn-primary group">
                {dict.nav.booking}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href={cvPath(locale)} download className="btn-secondary">
                <Download className="h-4 w-4" />
                {dict.hero.ctaCv}
              </a>
              <a href={mailtoContact(locale)} className="btn-secondary">
                <Mail className="h-4 w-4" />
                {dict.footer.cta}
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-zinc-900 pt-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-zinc-300">
              {site.name} · {site.firm}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.footer.linkedin}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-emerald-500/40 hover:text-white"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href={mailtoContact(locale)}
              aria-label={dict.footer.email}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-emerald-500/40 hover:text-white"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
