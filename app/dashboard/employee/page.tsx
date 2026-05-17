/**
 * SYNCORA EMPLOYEE GOAL CONTINUUM
 * -------------------------------
 * High-precision operational view for intent drafting, check-in rhythm,
 * and shared dependencies.
 */

import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InteractiveCard } from "@/components/ui/interactive-card";
import { AdaptivePanel } from "@/components/layout/adaptive-panel";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";

export default async function EmployeeDashboardPage() {
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
            <span className="signal-dot signal-dot-emerald" />
            Employee Goal Continuum
          </div>
          <h1 className="text-display-xl mt-2">
            Intent Drafting & <span className="editorial-serif-italic">Check-in Rhythm</span>.
          </h1>
        </div>
        <div className="font-mono text-xs text-[var(--color-text-dimmed)] flex flex-col items-end">
          <span>{"ACTIVE_GOALS: 3 // ON_TRACK"}</span>
          <span>{"NEXT_CHECK_IN: IN 3 DAYS"}</span>
        </div>
      </div>

      {/* Telemetry Grid */}
      <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">WORKSPACE_01</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">ACTIVE GOALS</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Draft, refine, and track individual key results aligned to top-level organizational objectives.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[API_ACTIVE]</span>
              <span className="text-[var(--color-text-main)]">3 ASSIGNED</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">WORKSPACE_02</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">CHECK-IN CADENCE</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Submit bi-weekly progress updates, confidence scores, and blocker flags to managerial queues.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[CADENCE_OK]</span>
              <span className="text-[var(--color-text-main)]">100% SUBMITTED</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">WORKSPACE_03</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">SHARED DEPENDENCIES</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Map cross-functional blockers and upstream dependencies across engineering and product squads.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[ALL_CLEAR]</span>
              <span className="text-[var(--color-text-main)]">0 BLOCKERS</span>
            </div>
          </InteractiveCard>
        </StaggerItem>
      </StaggerGroup>

      {/* Operational Adaptive Panels */}
      <div className="flex flex-col gap-6 mt-4">
        <AdaptivePanel title="Current Q3 Goal Execution Continuum" defaultExpanded={true}>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex items-center justify-between p-4 bg-[var(--color-elevated)] border border-[var(--color-border)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">{"KR_01 // \"Achieve 99.99% Uptime across Core API Gateways\""}</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">{"// PROGRESS: 85%"}</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] text-xs font-bold">
                ON TRACK
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--color-elevated)] border border-[var(--color-border)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">{"KR_02 // \"Reduce Bundle Size by 40% using Next.js App Router\""}</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">{"// PROGRESS: 60%"}</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] text-xs font-bold">
                ON TRACK
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--color-elevated)] border border-[var(--color-border)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">{"KR_03 // \"Implement 21st.dev Ethereal Design Tokens\""}</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">{"// PROGRESS: 100%"}</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] text-xs font-bold">
                COMPLETED
              </span>
            </div>
          </div>
        </AdaptivePanel>

        <AdaptivePanel title="Retrospective Check-In History" defaultExpanded={false}>
          <div className="p-4 border border-[var(--color-border)] bg-[var(--color-elevated)] font-mono text-xs text-[var(--color-text-dimmed)]">
            ALL PREVIOUS CHECK-INS FOR Q1 & Q2 HAVE BEEN CRYPTOGRAPHICALLY VERIFIED AND ARCHIVED.
          </div>
        </AdaptivePanel>
      </div>
    </div>
  );
}
