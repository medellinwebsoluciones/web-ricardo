"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  LineChart,
  Brain,
  FolderOpen,
  Target,
  Sparkles,
  GraduationCap,
  LogOut,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";

export type PendingCounts = {
  leads: number;
  appointments: number;
  overdue: number;
  opportunities: number;
};

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, badge: null },
  { href: "/admin/leads", label: "Leads", icon: Users, badge: "leads" },
  {
    href: "/admin/agenda",
    label: "Agenda Meets",
    icon: CalendarCheck,
    badge: "appointments",
  },
  { href: "/admin/analytics", label: "Analytics", icon: LineChart, badge: null },
  { href: "/admin/agente", label: "Agente / RAG", icon: Brain, badge: null },
  {
    href: "/admin/documentos",
    label: "Documentos",
    icon: FolderOpen,
    badge: null,
  },
  {
    href: "/admin/oportunidades",
    label: "Oportunidades",
    icon: Target,
    badge: "opportunities",
  },
  {
    href: "/admin/practica",
    label: "Práctica EN",
    icon: GraduationCap,
    badge: null,
  },
  { href: "/admin/generador", label: "Generador IA", icon: Sparkles, badge: null },
] as const;

function NavLinks({
  pending,
  onNavigate,
}: {
  pending: PendingCounts;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const count = item.badge
          ? pending[item.badge as keyof PendingCounts]
          : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-emerald-500/10 text-emerald-300"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            {count > 0 && (
              <span className="ml-auto rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Shell({
  email,
  pending,
  children,
}: {
  email: string;
  pending: PendingCounts;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 lg:flex">
      {/* Sidebar desktop */}
      <aside className="hidden w-60 shrink-0 border-r border-zinc-800 bg-zinc-950 lg:flex lg:flex-col">
        <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-4">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/10 text-xs font-bold text-emerald-400">
            RZ
          </span>
          <span className="text-sm font-semibold text-white">Consola</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks pending={pending} />
        </div>
        <div className="border-t border-zinc-800 p-3">
          {pending.overdue > 0 && (
            <Link
              href="/admin"
              className="mb-2 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-2.5 py-2 text-[11px] text-amber-300 hover:bg-amber-500/10"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {pending.overdue} acción{pending.overdue === 1 ? "" : "es"} vencida
              {pending.overdue === 1 ? "" : "s"}
            </Link>
          )}
          <p className="truncate px-3 text-[11px] text-zinc-500">{email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
          >
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>
      </aside>

      {/* Topbar móvil */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-zinc-800 px-4 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="text-zinc-400 hover:text-white"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-white">Consola RZ</span>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            />
            <div className="absolute left-0 top-0 h-full w-64 border-r border-zinc-800 bg-zinc-950 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-white">Consola</span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-zinc-400 hover:text-white"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NavLinks pending={pending} onNavigate={() => setOpen(false)} />
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="mt-4 flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-900"
              >
                <LogOut className="h-3.5 w-3.5" /> Salir
              </button>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
