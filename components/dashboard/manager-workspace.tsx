"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { InteractiveCard } from "@/components/ui/interactive-card";

type Goal = {
  id: string;
  title: string;
  description: string;
  thrustArea: string;
  uomType: string;
  metricDirection: string;
  targetValue: number;
  weightage: number;
  status: string;
  isShared: boolean;
  checkIns?: Array<{
    id: string;
    quarter: string;
    plannedValue: number;
    actualValue: number;
    progressPercentage: number;
    status: string;
    comments?: Array<{ id: string; comment: string; createdAt: string }>;
  }>;
};

type GoalSheet = {
  id: string;
  status: string;
  locked: boolean;
  employee: { id: string; name: string; email: string };
  currentCycle?: { name: string; quarter: string } | null;
  goals: Goal[];
};

type Analytics = {
  totalSheets: number;
  approvedSheets: number;
  submittedSheets: number;
  completionRate: number;
  averageProgress: number;
  goalSheets: GoalSheet[];
  checkIns: Array<{
    id: string;
    quarter: string;
    plannedValue: number;
    actualValue: number;
    progressPercentage: number;
    status: string;
    goal: {
      title: string;
      targetValue: number;
      uomType: string;
      goalSheet: { employee: { name: string; email: string } };
    };
    comments: Array<{ id: string; comment: string; createdAt: string }>;
  }>;
};

export function ManagerWorkspace({
  initialQueue,
  analytics,
}: {
  initialQueue: GoalSheet[];
  analytics: Analytics;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"approvals" | "progress" | "shared">("approvals");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const pendingSheets = initialQueue.filter((s) => s.status === "SUBMITTED");
  const [inlineEdits, setInlineEdits] = useState<Record<string, { targetValue?: number; weightage?: number }>>({});
  const [rejectionComments, setRejectionComments] = useState<Record<string, string>>({});

  const handleEditChange = (goalId: string, field: "targetValue" | "weightage", val: number) => {
    setInlineEdits((prev) => ({
      ...prev,
      [goalId]: { ...prev[goalId], [field]: val },
    }));
  };

  const handleApprove = async (goalSheet: GoalSheet) => {
    setMessage(null);
    try {
      const goalsPayload = goalSheet.goals.map((g) => ({
        id: g.id,
        targetValue: inlineEdits[g.id]?.targetValue ?? g.targetValue,
        weightage: inlineEdits[g.id]?.weightage ?? g.weightage,
      }));

      const res = await fetch("/api/goals/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalSheetId: goalSheet.id,
          goals: goalsPayload,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to approve goal sheet");
      setMessage({ type: "success", text: `Goal sheet for ${goalSheet.employee.name} approved and locked successfully.` });
      startTransition(() => router.refresh());
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const handleRejectOrReturn = async (goalSheetId: string, isReturn: boolean) => {
    setMessage(null);
    const comment = rejectionComments[goalSheetId] || "";
    if (isReturn && !comment.trim()) {
      setMessage({ type: "error", text: "Please provide a comment/reason for returning the goals." });
      return;
    }
    try {
      const res = await fetch("/api/goals/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalSheetId,
          comment: isReturn ? comment : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to reject/return goal sheet");
      setMessage({ type: "success", text: `Goal sheet ${isReturn ? "returned for rework" : "rejected"}.` });
      startTransition(() => router.refresh());
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const [checkInComments, setCheckInComments] = useState<Record<string, string>>({});

  const handleAddComment = async (checkInId: string) => {
    const comment = checkInComments[checkInId];
    if (!comment?.trim()) return;
    setMessage(null);
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkInId, comment }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to add comment");
      setMessage({ type: "success", text: "Review comment recorded successfully." });
      setCheckInComments((prev) => ({ ...prev, [checkInId]: "" }));
      startTransition(() => router.refresh());
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const uniqueEmployees = analytics.goalSheets.map((s) => s.employee);
  const [sharedGoalForm, setSharedGoalForm] = useState({
    title: "",
    description: "",
    thrustArea: "Department KPI",
    targetValue: 100,
    localWeightage: 20,
    employeeIds: [] as string[],
  });

  const handleToggleEmployee = (id: string) => {
    setSharedGoalForm((prev) => ({
      ...prev,
      employeeIds: prev.employeeIds.includes(id)
        ? prev.employeeIds.filter((eId) => eId !== id)
        : [...prev.employeeIds, id],
    }));
  };

  const handlePushSharedGoal = async () => {
    setMessage(null);
    if (!sharedGoalForm.title.trim() || sharedGoalForm.employeeIds.length === 0) {
      setMessage({ type: "error", text: "Please enter a title and select at least one employee." });
      return;
    }
    try {
      const res = await fetch("/api/shared-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sharedGoalForm),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to push shared goal");
      setMessage({ type: "success", text: "Department goal successfully pushed to selected employees." });
      setSharedGoalForm({
        title: "",
        description: "",
        thrustArea: "Department KPI",
        targetValue: 100,
        localWeightage: 20,
        employeeIds: [],
      });
      startTransition(() => router.refresh());
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  return (
    <div className="space-y-8 w-full font-sans text-[var(--color-text-main)]">
      {/* Banner & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] shadow-[var(--shadow-subtle)] gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-text-dimmed)] uppercase tracking-wider mb-1">
            Team Performance Operations
          </div>
          <div className="text-sm font-mono flex items-center gap-6">
            <span>Team Completion Rate: <strong className="text-[var(--color-signal-emerald)]">{analytics.completionRate}%</strong></span>
            <span>Pending Goal Approvals: <strong className="text-[var(--color-signal-cerulean)]">{pendingSheets.length}</strong></span>
            <span>Average Progress: <strong className="text-[var(--color-signal-ochre)]">{analytics.averageProgress}%</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("approvals")}
            className={`px-4 py-2 text-xs font-mono border ${
              activeTab === "approvals"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border-strong)] font-bold shadow-[var(--shadow-subtle)]"
                : "border-transparent text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)]"
            }`}
          >
            [1] Pending Goal Approvals ({pendingSheets.length})
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-2 text-xs font-mono border ${
              activeTab === "progress"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border-strong)] font-bold shadow-[var(--shadow-subtle)]"
                : "border-transparent text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)]"
            }`}
          >
            [2] Quarterly Check-ins
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`px-4 py-2 text-xs font-mono border ${
              activeTab === "shared"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border-strong)] font-bold shadow-[var(--shadow-subtle)]"
                : "border-transparent text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)]"
            }`}
          >
            [3] Shared Goals
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

      {/* TAB 1: APPROVALS */}
      {activeTab === "approvals" && (
        <div className="space-y-8">
          {pendingSheets.length === 0 ? (
            <div className="p-12 text-center border border-[var(--color-border-strong)] bg-[var(--color-elevated)] font-mono text-sm text-[var(--color-text-dimmed)]">
              NO PENDING GOAL SHEETS REQUIRING MANAGER REVIEW.
            </div>
          ) : (
            pendingSheets.map((sheet) => {
              const totalWeight = sheet.goals.reduce((sum, g) => sum + (inlineEdits[g.id]?.weightage ?? g.weightage), 0);

              return (
                <InteractiveCard key={sheet.id} glowColor="cerulean" className="p-6 space-y-6 bg-[var(--color-elevated)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--color-border-strong)] pb-4 gap-4">
                    <div>
                      <div className="font-mono text-xs text-[var(--color-signal-cerulean)] font-bold flex items-center gap-2">
                        <span className="signal-dot signal-dot-cerulean" />
                        EMPLOYEE: {sheet.employee.name} ({sheet.employee.email})
                      </div>
                      <div className="text-xs text-[var(--color-text-dimmed)] font-mono mt-1">
                        Cycle: {sheet.currentCycle?.name || "N/A"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApprove(sheet)}
                        disabled={isPending || totalWeight !== 100}
                        className="px-4 py-2 bg-[var(--color-signal-emerald)] text-black hover:opacity-90 font-mono text-xs font-bold disabled:opacity-50"
                      >
                        {isPending ? "Processing..." : "Approve & Lock Goals"}
                      </button>
                    </div>
                  </div>

                  {totalWeight !== 100 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs">
                      Warning: Total weightage of inline edits is {totalWeight}%. Must equal exactly 100% to approve.
                    </div>
                  )}

                  <div className="space-y-4 font-mono text-xs">
                    <div className="font-bold uppercase text-[var(--color-text-dimmed)]">Submitted Goals (Inline Editable)</div>
                    {sheet.goals.map((goal, index) => (
                      <div key={goal.id} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-strong)] space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-bold text-sm text-[var(--color-text-main)]">
                              [#{index + 1}] {goal.title}
                            </div>
                            <div className="text-[var(--color-text-dimmed)] mt-1">{goal.description}</div>
                            <div className="text-[var(--color-signal-ochre)] mt-2">
                              Thrust: {goal.thrustArea} | Direction: {goal.metricDirection}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="space-y-1">
                              <label className="text-[var(--color-text-dimmed)] text-[10px] uppercase">Target ({goal.uomType})</label>
                              <input
                                type="number"
                                value={inlineEdits[goal.id]?.targetValue ?? goal.targetValue}
                                onChange={(e) => handleEditChange(goal.id, "targetValue", Number(e.target.value))}
                                className="w-24 p-2 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] text-center"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[var(--color-text-dimmed)] text-[10px] uppercase">Weightage (%)</label>
                              <input
                                type="number"
                                value={inlineEdits[goal.id]?.weightage ?? goal.weightage}
                                onChange={(e) => handleEditChange(goal.id, "weightage", Number(e.target.value))}
                                className="w-20 p-2 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border-strong)] flex flex-col md:flex-row items-end gap-4">
                    <div className="space-y-2 flex-1 w-full">
                      <label className="text-[var(--color-text-dimmed)] font-mono text-xs uppercase">Manager Rework Comment / Reason</label>
                      <input
                        type="text"
                        value={rejectionComments[sheet.id] || ""}
                        onChange={(e) => setRejectionComments((prev) => ({ ...prev, [sheet.id]: e.target.value }))}
                        placeholder="Add structured feedback for the employee review discussion..."
                        className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] font-mono text-xs focus:outline-none focus:border-[var(--color-signal-cerulean)]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectOrReturn(sheet.id, true)}
                        disabled={isPending}
                        className="px-4 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-signal-ochre)] border border-[var(--color-border-strong)] font-mono text-xs font-bold"
                      >
                        Return for Rework
                      </button>
                      <button
                        onClick={() => handleRejectOrReturn(sheet.id, false)}
                        disabled={isPending}
                        className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-mono text-xs font-bold"
                      >
                        Reject Goal Sheet
                      </button>
                    </div>
                  </div>
                </InteractiveCard>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: TEAM MOMENTUM & REVIEWS */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          <div className="p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] font-mono text-xs text-[var(--color-text-dimmed)]">
            { "REVIEW EMPLOYEE CHECK-INS, TRACK PLANNED VS ACTUAL VARIANCE, AND PROVIDE STRUCTURED GUIDANCE." }
          </div>

          <div className="space-y-6">
            {analytics.checkIns.map((checkIn) => (
              <InteractiveCard key={checkIn.id} glowColor="emerald" className="p-6 space-y-6 bg-[var(--color-elevated)] font-mono text-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--color-border-strong)] pb-4 gap-2">
                  <div>
                    <span className="text-[var(--color-signal-emerald)] font-bold">{checkIn.goal.goalSheet.employee.name}</span>
                    <span className="text-[var(--color-text-dimmed)] ml-2">({checkIn.goal.goalSheet.employee.email})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[var(--color-text-dimmed)]">Quarter: {checkIn.quarter}</span>
                    <span
                      className={`px-3 py-1 font-bold border ${
                        checkIn.status === "COMPLETED"
                          ? "bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] border-[var(--color-signal-emerald)]/30"
                          : checkIn.status === "ON_TRACK"
                          ? "bg-[var(--color-signal-cerulean)]/20 text-[var(--color-signal-cerulean)] border-[var(--color-signal-cerulean)]/30"
                          : "bg-[var(--color-signal-ochre)]/20 text-[var(--color-signal-ochre)] border-[var(--color-signal-ochre)]/30"
                      }`}
                    >
                      {checkIn.status} ({checkIn.progressPercentage}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[var(--color-surface)] p-4 border border-[var(--color-border-strong)]">
                  <div className="md:col-span-3">
                    <div className="font-bold text-sm text-[var(--color-text-main)]">{checkIn.goal.title}</div>
                    <div className="text-[var(--color-text-dimmed)] mt-1">Target: {checkIn.goal.targetValue} ({checkIn.goal.uomType})</div>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-dimmed)] uppercase block mb-1">Planned Value</span>
                    <span className="text-sm font-bold text-[var(--color-text-main)]">{checkIn.plannedValue}</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-dimmed)] uppercase block mb-1">Actual Value</span>
                    <span className="text-sm font-bold text-[var(--color-text-main)]">{checkIn.actualValue}</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-dimmed)] uppercase block mb-1">Variance / Progress</span>
                    <span className="text-sm font-bold text-[var(--color-signal-emerald)]">{checkIn.progressPercentage}%</span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="font-bold uppercase text-[var(--color-text-dimmed)]">Manager Review Comments</div>
                  {checkIn.comments && checkIn.comments.length > 0 ? (
                    <div className="space-y-2">
                      {checkIn.comments.map((c) => (
                        <div key={c.id} className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] flex justify-between items-start gap-4">
                          <p className="text-[var(--color-text-main)]">{c.comment}</p>
                          <span className="text-[10px] text-[var(--color-text-dimmed)] whitespace-nowrap">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[var(--color-text-dimmed)] italic">No review comments added yet.</div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={checkInComments[checkIn.id] || ""}
                      onChange={(e) => setCheckInComments((prev) => ({ ...prev, [checkIn.id]: e.target.value }))}
                      placeholder="Add structured review comment..."
                      className="flex-1 p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)]"
                    />
                    <button
                      onClick={() => handleAddComment(checkIn.id)}
                      disabled={isPending}
                      className="px-6 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-signal-emerald)] border border-[var(--color-border-strong)] font-bold uppercase"
                    >
                      {isPending ? "Adding..." : "Add Comment"}
                    </button>
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PUSH DEPARTMENT KPIS */}
      {activeTab === "shared" && (
        <InteractiveCard glowColor="purple" className="p-8 space-y-6 bg-[var(--color-elevated)] font-mono text-xs">
          <div className="border-b border-[var(--color-border-strong)] pb-4">
            <div className="font-mono text-xs text-[var(--color-signal-purple)] font-bold flex items-center gap-2">
              <span className="signal-dot signal-dot-purple" />
              Shared Goals System: Top-Down Alignment
            </div>
            <p className="text-[var(--color-text-dimmed)] mt-1 font-sans">
              Push department-wide goals directly into employee goal sheets. Employees can only adjust weightage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">Goal Title *</label>
              <input
                type="text"
                value={sharedGoalForm.title}
                onChange={(e) => setSharedGoalForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Ensure 100% compliance with ISO 27001 standards"
                className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-purple)]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">Description *</label>
              <textarea
                value={sharedGoalForm.description}
                onChange={(e) => setSharedGoalForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                placeholder="Describe the department goal and expected organizational impact..."
                className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-purple)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">Thrust Area</label>
              <input
                type="text"
                value={sharedGoalForm.thrustArea}
                onChange={(e) => setSharedGoalForm((prev) => ({ ...prev, thrustArea: e.target.value }))}
                className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-purple)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">Target Value</label>
              <input
                type="number"
                value={sharedGoalForm.targetValue}
                onChange={(e) => setSharedGoalForm((prev) => ({ ...prev, targetValue: Number(e.target.value) }))}
                className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-purple)]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[var(--color-text-dimmed)] uppercase">Default Assigned Weightage (%)</label>
              <input
                type="number"
                value={sharedGoalForm.localWeightage}
                onChange={(e) => setSharedGoalForm((prev) => ({ ...prev, localWeightage: Number(e.target.value) }))}
                min={10}
                max={100}
                className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-purple)]"
              />
            </div>

            <div className="space-y-3 md:col-span-2 pt-4 border-t border-[var(--color-border-strong)]">
              <label className="text-[var(--color-text-dimmed)] uppercase font-bold block">Select Target Employees</label>
              {uniqueEmployees.length === 0 ? (
                <div className="text-[var(--color-text-dimmed)] italic">No team members found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {uniqueEmployees.map((emp) => (
                    <label
                      key={emp.id}
                      className={`p-4 border flex items-center gap-3 cursor-pointer ${
                        sharedGoalForm.employeeIds.includes(emp.id)
                          ? "bg-[var(--color-signal-purple)]/10 border-[var(--color-signal-purple)] text-[var(--color-text-main)] font-bold"
                          : "bg-[var(--color-surface)] border-[var(--color-border-strong)] text-[var(--color-text-dimmed)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={sharedGoalForm.employeeIds.includes(emp.id)}
                        onChange={() => handleToggleEmployee(emp.id)}
                        className="accent-[var(--color-signal-purple)]"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-[var(--color-text-main)] truncate">{emp.name}</div>
                        <div className="text-[10px] text-[var(--color-text-dimmed)] truncate">{emp.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-4 border-t border-[var(--color-border-strong)]">
              <button
                onClick={handlePushSharedGoal}
                disabled={isPending || sharedGoalForm.employeeIds.length === 0}
                className="w-full py-4 bg-[var(--color-signal-purple)] text-black hover:opacity-90 font-mono text-xs font-bold uppercase disabled:opacity-50"
              >
                {isPending ? "Pushing goal..." : "Push Department Goal to Selected Employees"}
              </button>
            </div>
          </div>
        </InteractiveCard>
      )}
    </div>
  );
}
