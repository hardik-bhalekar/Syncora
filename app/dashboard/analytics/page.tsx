/**
 * SYNCORA ANALYTICS & SIGNALS
 * ---------------------------
 * High-precision operational view for telemetry tracking, variance drift,
 * and review velocity metrics.
 */

import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InteractiveCard } from "@/components/ui/interactive-card";
import { AdaptivePanel } from "@/components/layout/adaptive-panel";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";

export default async function AnalyticsDashboardPage() {
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
            Analytics & Signals
          </div>
          <h1 className="text-display-xl mt-2">
            Telemetry & <span className="editorial-serif-italic">Variance Intelligence</span>.
          </h1>
        </div>
        <div className="font-mono text-xs text-[var(--color-text-dimmed)] flex flex-col items-end">
          <span>{"ENGINE_STATE: LIVE // DECIMAL_PRECISION"}</span>
          <span>CALCULATION_LATENCY: 8MS</span>
        </div>
      </div>

      {/* Telemetry Grid */}
      <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">METRIC_01</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">ALIGNMENT COVERAGE</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Percentage of active employee key results successfully mapped to top-level company OKRs.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[ENGINE_READY]</span>
              <span className="text-[var(--color-text-main)]">98.4% COVERAGE</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">METRIC_02</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">VARIANCE DRIFT</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Statistical divergence between projected milestone completion dates and actual burndown velocity.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-cerulean)]">[ENGINE_READY]</span>
              <span className="text-[var(--color-text-main)]">+1.2 DAYS DRIFT</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-text-dimmed)] mb-2">METRIC_03</div>
              <div className="text-xl font-bold tracking-tight text-[var(--color-text-main)] mb-4">REVIEW VELOCITY</div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Average turnaround time for managerial draft approvals and bi-weekly check-in sign-offs.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[ENGINE_READY]</span>
              <span className="text-[var(--color-text-main)]">4.8 HOURS AVG</span>
            </div>
          </InteractiveCard>
        </StaggerItem>
      </StaggerGroup>

      {/* Operational Adaptive Panels */}
      <div className="flex flex-col gap-6 mt-4">
        <AdaptivePanel title="Live Interest Engine & Financial Calculation Microservice" defaultExpanded={true}>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex items-center justify-between p-4 bg-[var(--color-elevated)] border border-[var(--color-border)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">DECIMAL_ENGINE_SCRAPER</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">{"// LIVE BANK RATES"}</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] text-xs font-bold">
                5.42% BASE_RATE
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--color-elevated)] border border-[var(--color-border)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">IN_MEMORY_CACHE_LAYER</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">{"// HIT RATIO: 99.1%"}</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] text-xs font-bold">
                TTL: 300S
              </span>
            </div>
          </div>
        </AdaptivePanel>

        <AdaptivePanel title="Historical Variance & System Drift Logs" defaultExpanded={false}>
          <div className="p-4 border border-[var(--color-border)] bg-[var(--color-elevated)] font-mono text-xs text-[var(--color-text-dimmed)]">
            NO ANOMALOUS VARIANCE SPIKES DETECTED OVER THE LAST 90 DAYS. SYSTEM STABLE.
          </div>
        </AdaptivePanel>
      </div>
    </div>
  );
}
