/**
 * SYNCORA ANALYTICS & SIGNALS
 * ---------------------------
 * Ultra-clean, minimal operational view for telemetry tracking, variance drift,
 * and review velocity metrics. Inspired by Linear and Apple precision ergonomics.
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
    <div className="flex flex-col gap-16 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--color-border-strong)] pb-10">
        <div className="space-y-3">
          <div className="cinematic-kicker">
            <span className="signal-dot signal-dot-cerulean" />
            Performance Analytics
          </div>
          <h1 className="text-cinematic-h2 leading-tight">
            Performance Metrics & <span className="text-cinematic-italic-indigo">Trend Analysis</span>.
          </h1>
        </div>
        <div className="font-mono text-xs text-[var(--color-text-dimmed)] flex flex-col items-end space-y-1">
          <span>{"ENGINE_STATE: LIVE | DECIMAL_PRECISION"}</span>
          <span>CALCULATION_LATENCY: 8MS</span>
        </div>
      </div>


      <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StaggerItem>
          <InteractiveCard glowColor="emerald" className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-signal-emerald)] mb-3 flex items-center gap-2">
                <span className="signal-dot signal-dot-emerald" />
                METRIC_01
              </div>
              <div className="text-xl font-serif text-[var(--color-text-main)] mb-4">ALIGNMENT COVERAGE</div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed font-sans">
                Percentage of active employee key results successfully mapped to top-level company OKRs.
              </p>
            </div>
            <div className="mt-12 pt-6 border-t border-[var(--color-border-strong)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[ENGINE_READY]</span>
              <span className="text-[var(--color-text-main)] font-bold">98.4% COVERAGE</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard glowColor="cerulean" className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-signal-cerulean)] mb-3 flex items-center gap-2">
                <span className="signal-dot signal-dot-cerulean" />
                METRIC_02
              </div>
              <div className="text-xl font-serif text-[var(--color-text-main)] mb-4">VARIANCE DRIFT</div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed font-sans">
                Statistical divergence between projected milestone completion dates and actual burndown velocity.
              </p>
            </div>
            <div className="mt-12 pt-6 border-t border-[var(--color-border-strong)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-cerulean)]">[ENGINE_READY]</span>
              <span className="text-[var(--color-text-main)] font-bold">+1.2 DAYS DRIFT</span>
            </div>
          </InteractiveCard>
        </StaggerItem>

        <StaggerItem>
          <InteractiveCard glowColor="indigo" className="h-full flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-signal-indigo)] mb-3 flex items-center gap-2">
                <span className="signal-dot signal-dot-indigo" />
                METRIC_03
              </div>
              <div className="text-xl font-serif text-[var(--color-text-main)] mb-4">REVIEW VELOCITY</div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed font-sans">
                Average turnaround time for managerial draft approvals and bi-weekly check-in sign-offs.
              </p>
            </div>
            <div className="mt-12 pt-6 border-t border-[var(--color-border-strong)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--color-signal-emerald)]">[ENGINE_READY]</span>
              <span className="text-[var(--color-text-main)] font-bold">4.8 HOURS AVG</span>
            </div>
          </InteractiveCard>
        </StaggerItem>
      </StaggerGroup>


      <div className="flex flex-col gap-8 mt-6">
        <AdaptivePanel title="Live Interest Engine & Financial Calculation Microservice" defaultExpanded={true}>
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex items-center justify-between p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] shadow-[var(--shadow-subtle)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">DECIMAL_ENGINE_SCRAPER</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">LIVE BANK RATES</span>
              </div>
              <span className="px-3 py-1 bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] text-xs font-bold border border-[var(--color-signal-emerald)]/30">
                5.42% BASE_RATE
              </span>
            </div>

            <div className="flex items-center justify-between p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] shadow-[var(--shadow-subtle)]">
              <div>
                <span className="text-[var(--color-text-main)] font-bold">IN_MEMORY_CACHE_LAYER</span>
                <span className="text-xs text-[var(--color-text-dimmed)] ml-4">HIT RATIO: 99.1%</span>
              </div>
              <span className="px-3 py-1 bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] text-xs font-bold border border-[var(--color-signal-emerald)]/30">
                TTL: 300S
              </span>
            </div>
          </div>
        </AdaptivePanel>

        <AdaptivePanel title="Historical Variance & System Drift Logs" defaultExpanded={false}>
          <div className="p-6 border border-[var(--color-border-strong)] bg-[var(--color-elevated)] font-mono text-xs text-[var(--color-text-dimmed)] shadow-[var(--shadow-subtle)]">
            NO ANOMALOUS VARIANCE SPIKES DETECTED OVER THE LAST 90 DAYS. SYSTEM STABLE.
          </div>
        </AdaptivePanel>
      </div>
    </div>
  );
}
