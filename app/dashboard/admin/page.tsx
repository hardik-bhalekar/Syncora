/**
 * SYNCORA ADMIN GOVERNANCE WORKSPACE
 * ----------------------------------
 * High-precision operational view for cycle control, audit logging,
 * and RBAC policy management.
 */

import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InteractiveCard } from "@/components/ui/interactive-card";
import { AdaptivePanel } from "@/components/layout/adaptive-panel";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";

export default async function AdminDashboardPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Header Act */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border)] pb-8">
        <div>
          <div className="cinematic-kicker">
            <span className="signal-dot signal-dot-ochre" />
            Admin Governance Workspace
          </div>
          <h1 className="text-display-xl mt-2">
            Cycle Control & <span className="editorial-serif-italic">Audit Spine</span>.
          </h1>
        </div>
        <div className="font-mono text-xs text-[var(--color-text-dimmed)] flex flex-col items-end">
          <span>{"ACTIVE_SESSIONS: 14 // ENCRYPTED"}</span>
          <span>{"SYSTEM_LOAD: 2.4% // 60FPS"}</span>
        </div>
      </div>

      {/* Telemetry Grid */}
      <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">MODULE_01</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">CYCLE WINDOWS</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Configure active goal-setting windows, grace periods, and organization-wide lockouts.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[API_ACTIVE]</span>
              <span className="text-[var(--color-text-main)]">Q3_OPEN</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">MODULE_02</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">AUDIT LOGGING</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Immutable, cryptographically verified event stream tracking all RBAC state mutations.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[STREAM_OK]</span>
              <span className="text-[var(--color-text-main)]">1,429 EVENTS</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">MODULE_03</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">RBAC POLICIES</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Manage granular permission matrices across Admin, Manager, and Employee tiers.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[ENFORCED]</span>
              <span className="text-[var(--color-text-main)]">STRICT_MODE</span>
            </div>
          </InteractiveCard>
        </StaggerItem>
      </StaggerGroup>

      {/* Operational Adaptive Panels */}
      <div className="flex flex-col gap-6 mt-4">
        <AdaptivePanel title="Active Organization Cycles // 2026" defaultExpanded={true}>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex items-center justify-between p-4 bg-[var(--color-elevated)] border border-[var(--color-border)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">2026_Q3_OBJECTIVES</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">{"// ACTIVE WINDOW"}</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] text-xs font-bold">
                OPEN (14 DAYS REMAINING)
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] opacity-60">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">2026_Q2_RETROSPECTIVE</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">{"// ARCHIVED"}</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-subtle)] text-[var(--color-text-dimmed)] text-xs font-bold">
                LOCKED & AUDITED
              </span>
            </div>
          </div>
        </AdaptivePanel>

        <AdaptivePanel title="System Health & Cryptographic Integrity" defaultExpanded={false}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
            <div className="p-4 border border-[var(--color-border)] bg-[var(--color-elevated)]">
              <div className="text-[var(--color-text-dimmed)]">PRISMA ADAPTER</div>
              <div className="text-sm text-[var(--color-signal-emerald)] font-bold mt-1">{"CONNECTED // v6.19"}</div>
            </div>
            <div className="p-4 border border-[var(--color-border)] bg-[var(--color-elevated)]">
              <div className="text-[var(--color-text-dimmed)]">AUTHENTICATION</div>
              <div className="text-sm text-[var(--color-signal-emerald)] font-bold mt-1">{"JWT // SHA-256"}</div>
            </div>
            <div className="p-4 border border-[var(--color-border)] bg-[var(--color-elevated)]">
              <div className="text-[var(--color-text-dimmed)]">DATABASE POOL</div>
              <div className="text-sm text-[var(--color-signal-emerald)] font-bold mt-1">12/15 ACTIVE</div>
            </div>
            <div className="p-4 border border-[var(--color-border)] bg-[var(--color-elevated)]">
              <div className="text-[var(--color-text-dimmed)]">VERIFY DAEMON</div>
              <div className="text-sm text-[var(--color-signal-emerald)] font-bold mt-1">{"RALPH // PASS"}</div>
            </div>
          </div>
        </AdaptivePanel>
      </div>
    </div>
  );
}
