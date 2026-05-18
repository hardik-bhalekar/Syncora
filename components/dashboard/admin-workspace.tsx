"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { InteractiveCard } from "@/components/ui/interactive-card";

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  previousData?: unknown;
  newData?: unknown;
  timestamp: string | Date;
  actor: { name: string; email: string };
};

type GoalSheet = {
  id: string;
  status: string;
  locked: boolean;
  employee: { name: string; email: string };
  currentCycle?: { name: string; quarter: string } | null;
};

type Analytics = {
  totalSheets: number;
  approvedSheets: number;
  submittedSheets: number;
  completionRate: number;
  goalSheets: GoalSheet[];
  auditLogs: AuditLog[];
};

export function AdminWorkspace({ analytics }: { analytics: Analytics }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"cycles" | "audit" | "unlock" | "reports">("cycles");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [cycleForm, setCycleForm] = useState({
    name: "2026 Q4 Operational Objectives",
    quarter: "Q4",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    isActive: true,
  });

  const handleCreateCycle = async () => {
    setMessage(null);
    try {
      const res = await fetch("/api/cycles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cycleForm,
          startDate: new Date(cycleForm.startDate).toISOString(),
          endDate: new Date(cycleForm.endDate).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to create cycle");
      setMessage({ type: "success", text: "New operational cycle created and activated successfully!" });
      startTransition(() => router.refresh());
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const [unlockReasons, setUnlockReasons] = useState<Record<string, string>>({});

  const handleUnlock = async (goalSheetId: string) => {
    const reason = unlockReasons[goalSheetId];
    if (!reason?.trim()) {
      setMessage({ type: "error", text: "Please enter a mandatory audit reason to unlock this goal sheet." });
      return;
    }
    setMessage(null);
    try {
      const res = await fetch("/api/goals/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalSheetId, reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to unlock goal sheet");
      setMessage({ type: "success", text: "Goal sheet unlocked and returned to employee successfully!" });
      setUnlockReasons((prev) => ({ ...prev, [goalSheetId]: "" }));
      startTransition(() => router.refresh());
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const [auditFilter, setAuditFilter] = useState("");

  const filteredLogs = analytics.auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(auditFilter.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(auditFilter.toLowerCase()) ||
      log.entityType.toLowerCase().includes(auditFilter.toLowerCase())
  );

  const lockedSheets = analytics.goalSheets.filter((s) => s.locked);

  return (
    <div className="space-y-8 w-full font-sans text-[var(--color-text-main)]">
      {/* Banner & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] shadow-[var(--shadow-subtle)] gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-text-dimmed)] uppercase tracking-wider mb-1">
            Organization Control Center
          </div>
          <div className="text-sm font-mono flex items-center gap-6">
            <span>Org Completion Rate: <strong className="text-[var(--color-signal-emerald)]">{analytics.completionRate}%</strong></span>
            <span>Total Goal Sheets: <strong className="text-[var(--color-signal-cerulean)]">{analytics.totalSheets}</strong></span>
            <span>Locked Sheets: <strong className="text-[var(--color-signal-ochre)]">{lockedSheets.length}</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("cycles")}
            className={`px-4 py-2 text-xs font-mono border ${
              activeTab === "cycles"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border-strong)] font-bold shadow-[var(--shadow-subtle)]"
                : "border-transparent text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)]"
            }`}
          >
            [1] Cycle Control
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 text-xs font-mono border ${
              activeTab === "audit"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border-strong)] font-bold shadow-[var(--shadow-subtle)]"
                : "border-transparent text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)]"
            }`}
          >
            [2] Audit & Change History ({analytics.auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab("unlock")}
            className={`px-4 py-2 text-xs font-mono border ${
              activeTab === "unlock"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border-strong)] font-bold shadow-[var(--shadow-subtle)]"
                : "border-transparent text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)]"
            }`}
          >
            [3] Goal Unlocking ({lockedSheets.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 text-xs font-mono border ${
              activeTab === "reports"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border-strong)] font-bold shadow-[var(--shadow-subtle)]"
                : "border-transparent text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)]"
            }`}
          >
            [4] Reporting & Exports
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 border text-xs font-mono flex items-center justify-between ${
            message.type === "success"
              ? "bg-[var(--color-signal-emerald)]/10 text-[var(--color-signal-emerald)] border-[var(--color-signal-emerald)]/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold hover:opacity-70">
            [X]
          </button>
        </div>
      )}

      {/* TAB 1: CYCLE CONTROL */}
      {activeTab === "cycles" && (
        <InteractiveCard glowColor="amber" className="p-8 space-y-6 bg-[var(--color-elevated)] font-mono text-xs">
          <div className="border-b border-[var(--color-border-strong)] pb-4">
            <div className="font-mono text-xs text-[var(--color-signal-ochre)] font-bold flex items-center gap-2">
              <span className="signal-dot signal-dot-ochre" />
              Quarterly Cycle Management
            </div>
            <p className="text-[var(--color-text-dimmed)] mt-1 font-sans">
              Define new active goal-setting windows and check-in schedules. Activating a new cycle automatically archives previous ones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">Cycle Name *</label>
              <input
                type="text"
                value={cycleForm.name}
                onChange={(e) => setCycleForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-ochre)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">Quarter *</label>
              <select
                value={cycleForm.quarter}
                onChange={(e) => setCycleForm((prev) => ({ ...prev, quarter: e.target.value }))}
                className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-ochre)]"
              >
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">Active Status</label>
              <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-signal-emerald)] font-bold flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cycleForm.isActive}
                  onChange={(e) => setCycleForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="accent-[var(--color-signal-emerald)]"
                />
                <span>SET AS ACTIVE ORG CYCLE</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">Start Date *</label>
              <input
                type="date"
                value={cycleForm.startDate}
                onChange={(e) => setCycleForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-ochre)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">End Date *</label>
              <input
                type="date"
                value={cycleForm.endDate}
                onChange={(e) => setCycleForm((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-ochre)]"
              />
            </div>

            <div className="md:col-span-2 pt-4 border-t border-[var(--color-border-strong)]">
              <button
                onClick={handleCreateCycle}
                disabled={isPending}
                className="w-full py-4 bg-[var(--color-signal-ochre)] text-black hover:opacity-90 font-mono text-xs font-bold uppercase disabled:opacity-50"
              >
                {isPending ? "Creating Cycle..." : "Create & Activate Operational Cycle"}
              </button>
            </div>
          </div>
        </InteractiveCard>
      )}

      {/* TAB 2: AUDIT SPINE */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] gap-4">
            <span className="font-mono text-xs text-[var(--color-text-dimmed)] uppercase">
              Immutable event stream tracking all governance mutations
            </span>
            <input
              type="text"
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              placeholder="Filter by action, actor, or entity..."
              className="p-2 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] font-mono text-xs focus:outline-none focus:border-[var(--color-signal-emerald)]"
            />
          </div>

          <div className="space-y-4 font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center border border-[var(--color-border-strong)] bg-[var(--color-elevated)] text-[var(--color-text-dimmed)]">
                NO MATCHING AUDIT LOGS FOUND.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[var(--color-border-strong)] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] font-bold border border-[var(--color-signal-emerald)]/30">
                        {log.action}
                      </span>
                      <span className="text-[var(--color-text-main)] font-bold">{log.actor.name} ({log.actor.email})</span>
                    </div>
                    <span className="text-[var(--color-text-dimmed)]">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--color-surface)] p-4 border border-[var(--color-border-strong)]">
                    <div>
                      <span className="text-[var(--color-text-dimmed)] uppercase block mb-1">Previous State</span>
                      <pre className="text-[10px] text-[var(--color-text-dimmed)] overflow-x-auto p-2 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] max-h-32">
                        {log.previousData ? JSON.stringify(log.previousData, null, 2) : "NULL / NONE"}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-dimmed)] uppercase block mb-1">New State</span>
                      <pre className="text-[10px] text-[var(--color-signal-emerald)] overflow-x-auto p-2 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] max-h-32">
                        {log.newData ? JSON.stringify(log.newData, null, 2) : "NULL / NONE"}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GOAL UNLOCKING */}
      {activeTab === "unlock" && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] text-[var(--color-text-dimmed)]">
            Administrative override: unlock approved goals for mandatory rework or exceptional realignment.
          </div>

          <div className="space-y-6">
            {lockedSheets.length === 0 ? (
              <div className="p-12 text-center border border-[var(--color-border-strong)] bg-[var(--color-elevated)] text-[var(--color-text-dimmed)]">
                NO LOCKED GOAL SHEETS REQUIRING UNLOCKING.
              </div>
            ) : (
              lockedSheets.map((sheet) => (
                <InteractiveCard key={sheet.id} glowColor="amber" className="p-6 space-y-6 bg-[var(--color-elevated)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--color-border-strong)] pb-4 gap-2">
                    <div>
                      <span className="text-[var(--color-signal-ochre)] font-bold">{sheet.employee.name}</span>
                      <span className="text-[var(--color-text-dimmed)] ml-2">({sheet.employee.email})</span>
                    </div>
                    <span className="text-[var(--color-text-dimmed)]">Cycle: {sheet.currentCycle?.name || "N/A"}</span>
                  </div>

                  <div className="flex flex-col md:flex-row items-end gap-4">
                    <div className="space-y-2 flex-1 w-full">
                      <label className="text-[var(--color-text-dimmed)] uppercase font-bold block">Mandatory Audit Reason for Unlocking *</label>
                      <input
                        type="text"
                        value={unlockReasons[sheet.id] || ""}
                        onChange={(e) => setUnlockReasons((prev) => ({ ...prev, [sheet.id]: e.target.value }))}
                        placeholder="e.g. Executive mandate to adjust Q3 goals..."
                        className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-ochre)]"
                      />
                    </div>

                    <button
                      onClick={() => handleUnlock(sheet.id)}
                      disabled={isPending}
                      className="px-6 py-3 bg-[var(--color-signal-ochre)] text-black hover:opacity-90 font-bold uppercase disabled:opacity-50"
                    >
                      {isPending ? "Unlocking..." : "Unlock Goal Sheet"}
                    </button>
                  </div>
                </InteractiveCard>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: REPORTING & EXPORTS */}
      {activeTab === "reports" && (
        <InteractiveCard glowColor="indigo" className="p-8 space-y-6 bg-[var(--color-elevated)] font-mono text-xs">
          <div className="border-b border-[var(--color-border-strong)] pb-4">
            <div className="font-mono text-xs text-[var(--color-signal-indigo)] font-bold flex items-center gap-2">
              <span className="signal-dot signal-dot-indigo" />
              PERFORMANCE REPORTING & CSV EXPORTS
            </div>
            <p className="text-[var(--color-text-dimmed)] mt-1 font-sans">
              Generate planned vs actual variance reports, audit trails, and compliance exports for executive review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-strong)] space-y-4 flex flex-col justify-between">
              <div>
                <div className="font-bold text-sm text-[var(--color-text-main)]">Planned vs Actual Export</div>
                <p className="text-[var(--color-text-dimmed)] mt-2 font-sans">
                  Complete CSV export containing all employee goal sheets, locked statuses, active cycle mappings, and weightages.
                </p>
              </div>
              <a
                href="/api/reports"
                download="goal-report.csv"
                className="block text-center w-full py-3 bg-[var(--color-signal-indigo)] text-black font-bold uppercase hover:opacity-90"
              >
                Download CSV Export
              </a>
            </div>

            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-strong)] space-y-4 flex flex-col justify-between opacity-60">
              <div>
                <div className="font-bold text-sm text-[var(--color-text-main)]">Quarterly Check-In Analytics</div>
                <p className="text-[var(--color-text-dimmed)] mt-2 font-sans">
                  Aggregated Excel export of team momentum, milestone completion rates, and variance signals.
                </p>
              </div>
              <button disabled className="w-full py-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-dimmed)] font-bold uppercase cursor-not-allowed">
                { "[Excel Export Coming Soon]" }
              </button>
            </div>

            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-strong)] space-y-4 flex flex-col justify-between opacity-60">
              <div>
                <div className="font-bold text-sm text-[var(--color-text-main)]">Escalation History Export</div>
                <p className="text-[var(--color-text-dimmed)] mt-2 font-sans">
                  Audit log of all rule-based escalations (Employee → Manager → HR) and resolution timestamps.
                </p>
              </div>
              <button disabled className="w-full py-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-dimmed)] font-bold uppercase cursor-not-allowed">
                { "[Escalation Export Coming Soon]" }
              </button>
            </div>
          </div>
        </InteractiveCard>
      )}
    </div>
  );
}
