import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-emerald-400"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-zinc-300" : ""}>{item.label}</span>
              )}
              {!last && <ChevronRight className="h-3 w-3 text-zinc-700" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
