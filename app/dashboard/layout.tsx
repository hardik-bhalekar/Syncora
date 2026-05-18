/**
 * SYNCORA OPERATIONAL DASHBOARD SHELL
 * -----------------------------------
 * Ultra-clean, minimal enterprise dashboard shell inspired by Apple, Linear,
 * and Raycast. Features persistent precision navigation, role-based context badges,
 * tactile command surfaces, and PageTransition wrapping with restrained motion.
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
      {/* --- OPERATIONAL PRECISION TOP NAVIGATION --- */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border-strong)] bg-[var(--color-surface)]/80 backdrop-blur-2xl px-8 md:px-16 h-16 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-10">
          {/* Logo & System Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-2.5 h-2.5 bg-[var(--color-signal-emerald)] group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="font-mono text-xs font-bold tracking-widest uppercase">SYNCORA</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-text-dimmed)] group-hover:border-white/20 transition-colors">
              WORKSPACE
            </span>
          </Link>

          {/* Role Nav Items */}
          <nav className="hidden md:flex items-center gap-8 border-l border-[var(--color-border)] pl-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors py-1 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--color-signal-emerald)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          {/* Active User Telemetry */}
          <div className="hidden sm:flex items-center gap-4 border-r border-[var(--color-border)] pr-8">
            <div className="flex flex-col text-right">
              <span className="text-xs font-medium text-[var(--color-text-main)]">{session.user.name || session.user.email}</span>
              <span className="text-[10px] font-mono text-[var(--color-signal-emerald)] uppercase tracking-wider">{session.user.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--color-elevated)] border border-[var(--color-border-strong)] flex items-center justify-center font-mono text-xs font-bold text-[var(--color-text-main)] shadow-[var(--shadow-subtle)]">
              {(session.user.name || session.user.email || "U")[0].toUpperCase()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DashboardSignOut />
          </div>
        </div>
      </header>

      {/* --- MOBILE NAVIGATION BAR --- */}
      <div className="md:hidden border-b border-[var(--color-border)] bg-[var(--color-elevated)] px-8 py-3 flex items-center justify-around overflow-x-auto gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* --- MAIN CONTENT & PAGE TRANSITION --- */}
      <main className="flex-1 flex flex-col p-8 md:p-16 max-w-[1600px] w-full mx-auto">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
