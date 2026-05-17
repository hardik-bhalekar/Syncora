/**
 * SYNCORA MANAGER REVIEW & ALIGNMENT
 * ----------------------------------
 * High-precision operational view for team alignment, approval queues,
 * and variance signal tracking.
 */

import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InteractiveCard } from "@/components/ui/interactive-card";
import { AdaptivePanel } from "@/components/layout/adaptive-panel";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";

export default async function ManagerDashboardPage() {
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
            <span className="signal-dot signal-dot-cerulean" />
            Manager Review & Alignment
          </div>
          <h1 className="text-display-xl mt-2">
            Team Alignment & <span className="editorial-serif-italic">Approval Queues</span>.
          </h1>
        </div>
        <div className="font-mono text-xs text-[var(--color-text-dimmed)] flex flex-col items-end">
          <span>{"TEAM_MEMBERS: 12 // ACTIVE"}</span>
          <span>{"PENDING_REVIEWS: 4 // URGENT"}</span>
        </div>
      </div>

      {/* Telemetry Grid */}
      <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">QUEUE_01</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">PENDING APPROVALS</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Review and cryptographically sign employee goal drafts for the upcoming operational cycle.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-cerulean)]">[ACTION_REQD]</span>
              <span className="text-[var(--color-text-main)]">4 DRAFTS</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">QUEUE_02</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">TEAM MOMENTUM</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Real-time velocity tracking of key results, milestone check-ins, and confidence scores.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[VELOCITY_HIGH]</span>
              <span className="text-[var(--color-text-main)]">94.2% ON_TRACK</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">QUEUE_03</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">VARIANCE SIGNALS</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Automated anomaly detection highlighting goals at risk of deadline slippage or budget overrun.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-ochre)]">[MONITORING]</span>
              <span className="text-[var(--color-text-main)]">2 AT_RISK</span>
            </div>
          </InteractiveCard>
        </StaggerItem>
      </StaggerGroup>

      {/* Operational Adaptive Panels */}
      <div className="flex flex-col gap-6 mt-4">
        <AdaptivePanel title="Pending Employee Draft Approvals // Q3" defaultExpanded={true}>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex items-center justify-between p-4 bg-[var(--color-elevated)] border border-[var(--color-border)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">{"ALEX_CHEN // ENG_04"}</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">{"// \"Migrate Core Services to Next.js 15\""}</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-signal-cerulean)]/20 text-[var(--color-signal-cerulean)] text-xs font-bold">
                NEEDS REVIEW
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--color-elevated)] border border-[var(--color-border)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">{"MARIA_SANTOS // DES_02"}</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">{"// \"Implement Spline 3D Spatial Design System\""}</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-signal-cerulean)]/20 text-[var(--color-signal-cerulean)] text-xs font-bold">
                NEEDS REVIEW
              </span>
            </div>
          </div>
        </AdaptivePanel>

        <AdaptivePanel title="Team Cadence & Review History" defaultExpanded={false}>
          <div className="p-4 border border-[var(--color-border)] bg-[var(--color-elevated)] font-mono text-xs text-[var(--color-text-dimmed)]">
            NO PAST ARCHIVED QUEUES FOUND FOR CURRENT FISCAL YEAR.
          </div>
        </AdaptivePanel>
      </div>
    </div>
  );
}
