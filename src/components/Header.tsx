"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const nav = [
    { href: `/${locale}/perfil`, label: dict.nav.about },
    { href: `/${locale}/soluciones`, label: dict.nav.cases },
    { href: `/${locale}/laboratorio`, label: dict.nav.lab },
    { href: `/${locale}/servicios`, label: dict.nav.services },
    { href: `/${locale}#stack`, label: dict.nav.stack },
  ];

  const isActive = (href: string) =>
    href.includes("#") ? false : pathname === href;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-wide flex h-16 items-center justify-between">
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2.5"
          aria-label="Ricardo Zuluaga"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-sm font-semibold text-emerald-400 transition-colors group-hover:border-emerald-500/50">
            RZ
          </span>
          <span className="hidden text-sm font-medium tracking-tight text-zinc-200 sm:block">
            Ricardo Zuluaga
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-white ${
                isActive(item.href) ? "text-white" : "text-zinc-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageToggle locale={locale} />
          <Link
            href={`/${locale}#agenda`}
            className="btn-primary hidden px-4 py-2 text-xs sm:inline-flex"
          >
            {dict.nav.booking}
          </Link>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white lg:hidden"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md lg:hidden">
          <nav
            className="container-wide flex flex-col gap-1 py-4"
            aria-label="Mobile"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${locale}#agenda`}
              className="btn-primary mt-2 w-full"
            >
              <Calendar className="h-4 w-4" />
              {dict.nav.booking}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
