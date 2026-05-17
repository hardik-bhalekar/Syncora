/**
 * SYNCORA OPERATIONAL DASHBOARD SHELL
 * -----------------------------------
 * High-precision, editorial dashboard shell featuring persistent navigation,
 * role-based context badges, tactile command surfaces, and PageTransition wrapping.
 */

import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { getDashboardNavItems } from "@/lib/rbac";
import { PageTransition } from "@/components/motion/page-transition";
import { DashboardSignOut } from "@/components/dashboard/dashboard-sign-out";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const navItems = getDashboardNavItems(session.user.role);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-main)] font-sans select-none overflow-x-hidden">
      {/* --- OPERATIONAL TOP NAVIGATION BAR --- */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md px-8 md:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo & System Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-3 h-3 bg-[var(--color-signal-emerald)] group-hover:scale-110 transition-transform" />
            <span className="font-mono text-sm font-bold tracking-widest uppercase">SYNCORA</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-text-dimmed)] group-hover:border-white/20 transition-colors">
              WORKSPACE
            </span>
          </Link>

          {/* Role Nav Items */}
          <nav className="hidden md:flex items-center gap-6 border-l border-[var(--color-border)] pl-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* Active User Telemetry */}
          <div className="hidden sm:flex items-center gap-3 border-r border-[var(--color-border)] pr-6">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-[var(--color-text-main)]">{session.user.name || session.user.email}</span>
              <span className="text-[10px] font-mono text-[var(--color-signal-emerald)] uppercase tracking-wider">{session.user.role}</span>
            </div>
            <div className="w-8 h-8 rounded-none bg-[var(--color-elevated)] border border-[var(--color-border)] flex items-center justify-center font-mono text-xs font-bold text-[var(--color-text-main)]">
              {(session.user.name || session.user.email || "U")[0].toUpperCase()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DashboardSignOut />
          </div>
        </div>
      </header>

      {/* --- MOBILE NAVIGATION BAR --- */}
      <div className="md:hidden border-b border-[var(--color-border)] bg-[var(--color-elevated)] px-8 py-3 flex items-center justify-around overflow-x-auto gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* --- MAIN CONTENT & PAGE TRANSITION --- */}
      <main className="flex-1 flex flex-col p-8 md:p-12 max-w-[1600px] w-full mx-auto">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
