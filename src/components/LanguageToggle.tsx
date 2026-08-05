"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const other = locales.find((l) => l !== locale) ?? "en";

  const targetPath = pathname.replace(/^\/(es|en)/, `/${other}`) || `/${other}`;

  return (
    <Link
      href={targetPath}
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
      aria-label={`Switch language to ${other.toUpperCase()}`}
    >
      <Languages className="h-3.5 w-3.5" />
      {other.toUpperCase()}
    </Link>
  );
}
