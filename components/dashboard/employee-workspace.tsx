"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { InteractiveCard } from "@/components/ui/interactive-card";
import { AdaptivePanel } from "@/components/layout/adaptive-panel";

type Goal = {
  id?: string;
  title: string;
  description: string;
  thrustArea: string;
  uomType: "NUMERIC_MIN" | "NUMERIC_MAX" | "PERCENTAGE" | "TIMELINE" | "ZERO_BASED";
  metricDirection: "HIGHER_IS_BETTER" | "LOWER_IS_BETTER" | "ZERO_BASED" | "TIMELINE";
  targetValue: number;
  deadlineAt?: string | null;
  weightage: number;
  status?: string;
  isShared?: boolean;
  sharedGoalId?: string | null;
  checkIns?: Array<{
    id: string;
    quarter: "Q1" | "Q2" | "Q3" | "Q4";
    plannedValue: number;
    actualValue: number;
    progressPercentage: number;
    status: string;
  }>;
};

type GoalSheet = {
  id: string;
  status: string;
  locked: boolean;
  currentCycleId?: string | null;
  goals: Goal[];
};

type ActiveCycle = {
  id: string;
  name: string;
  quarter: string;
  startDate: string;
  endDate: string;
};

export function EmployeeWorkspace({
  initialGoalSheet,
  activeCycle,
}: {
  initialGoalSheet?: GoalSheet | null;
  activeCycle?: ActiveCycle | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"goals" | "checkins">("goals");
  const [goals, setGoals] = useState<Goal[]>(initialGoalSheet?.goals || []);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const status = initialGoalSheet?.status || "DRAFT";
  const locked = initialGoalSheet?.locked || false;
  const isEditable = !locked && ["DRAFT", "REJECTED", "RETURNED"].includes(status);

  const totalWeightage = useMemo(() => {
    return goals.reduce((sum, g) => sum + Number(g.weightage || 0), 0);
  }, [goals]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (goals.length === 0) errors.push("Add at least one goal.");
    if (goals.length > 8) errors.push("Maximum goals per employee is 8.");
    if (goals.some((g) => Number(g.weightage) < 10)) {
      errors.push("Each goal must have a minimum weightage of 10%.");
    }
    if (Math.round(totalWeightage * 100) / 100 !== 100) {
      errors.push(`Total weightage must equal exactly 100% (Current: ${totalWeightage}%).`);
    }
    if (goals.some((g) => !g.title?.trim() || !g.description?.trim() || !g.thrustArea?.trim())) {
      errors.push("All required fields (Title, Description, Thrust Area) must be filled.");
    }
    if (goals.some((g) => g.uomType === "TIMELINE" && !g.deadlineAt)) {
      errors.push("Timeline goals must include a deadline.");
    }
    return errors;
  }, [goals, totalWeightage]);

  const handleAddGoal = () => {
    if (goals.length >= 8) return;
    setGoals([
      ...goals,
      {
        title: "",
        description: "",
        thrustArea: "Core Operations",
        uomType: "PERCENTAGE",
        metricDirection: "HIGHER_IS_BETTER",
        targetValue: 100,
        deadlineAt: activeCycle?.endDate ? new Date(activeCycle.endDate).toISOString().slice(0, 10) : null,
        weightage: 10,
      },
    ]);
  };

  const handleUpdateGoal = (index: number, field: keyof Goal, value: string | number) => {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value } as Goal;
    setGoals(updated);
  };

  const handleRemoveGoal = (index: number) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
  };

  const handleSaveDraft = async () => {
    setMessage(null);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cycleId: activeCycle?.id || null,
          goals: goals.map((g) => ({
            id: g.id,
            title: g.title,
            description: g.description,
            thrustArea: g.thrustArea,
            uomType: g.uomType,
            metricDirection: g.metricDirection,
            targetValue: Number(g.targetValue),
            deadlineAt: g.deadlineAt || null,
            weightage: Number(g.weightage),
            sharedGoalId: g.sharedGoalId || null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to save draft");
      setMessage({ type: "success", text: "Draft saved successfully!" });
      startTransition(() => router.refresh());
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const handleSubmitGoalSheet = async () => {
    if (validationErrors.length > 0) {
      setMessage({ type: "error", text: "Please fix validation errors before submitting." });
      return;
    }
    setMessage(null);
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cycleId: activeCycle?.id || null,
          goals: goals.map((g) => ({
            id: g.id,
            title: g.title,
            description: g.description,
            thrustArea: g.thrustArea,
            uomType: g.uomType,
            metricDirection: g.metricDirection,
            targetValue: Number(g.targetValue),
            deadlineAt: g.deadlineAt || null,
            weightage: Number(g.weightage),
            sharedGoalId: g.sharedGoalId || null,
          })),
        }),
      });

      if (!initialGoalSheet?.id) {
        throw new Error("Goal sheet ID not found. Please save draft first.");
      }

      const res = await fetch("/api/goals/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalSheetId: initialGoalSheet.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to submit goal sheet");
      setMessage({ type: "success", text: "Goal sheet submitted successfully!" });
      startTransition(() => router.refresh());
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const [selectedQuarter, setSelectedQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q3");
  const [checkInValues, setCheckInValues] = useState<Record<string, { plannedValue: number; actualValue: number }>>({});

  const handleCheckInChange = (goalId: string, field: "plannedValue" | "actualValue", val: number) => {
    setCheckInValues((prev) => ({
      ...prev,
      [goalId]: {
        plannedValue: prev[goalId]?.plannedValue || 0,
        actualValue: prev[goalId]?.actualValue || 0,
        [field]: val,
      },
    }));
  };

  const handleSaveCheckIn = async (goalId: string) => {
    setMessage(null);
    const vals = checkInValues[goalId] || { plannedValue: 0, actualValue: 0 };
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId,
          quarter: selectedQuarter,
          plannedValue: Number(vals.plannedValue),
          actualValue: Number(vals.actualValue),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to save check-in");
      setMessage({ type: "success", text: "Check-in updated successfully!" });
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
            Current Review Cycle: {activeCycle?.name || "None Active"} ({activeCycle?.quarter})
          </div>
          <div className="text-lg font-serif font-bold flex items-center gap-3">
            <span>Goal Sheet Status:</span>
            <span
              className={`px-3 py-1 text-xs font-mono font-bold uppercase border ${
                status === "APPROVED"
                  ? "bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] border-[var(--color-signal-emerald)]/30"
                  : status === "SUBMITTED"
                  ? "bg-[var(--color-signal-cerulean)]/20 text-[var(--color-signal-cerulean)] border-[var(--color-signal-cerulean)]/30"
                  : "bg-[var(--color-signal-ochre)]/20 text-[var(--color-signal-ochre)] border-[var(--color-signal-ochre)]/30"
              }`}
            >
              {status} {locked && "(LOCKED)"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("goals")}
            className={`px-4 py-2 text-xs font-mono border ${
              activeTab === "goals"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border-strong)] font-bold shadow-[var(--shadow-subtle)]"
                : "border-transparent text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)]"
            }`}
          >
            [1] Goal Sheet
          </button>
          {locked && (
            <button
              onClick={() => setActiveTab("checkins")}
              className={`px-4 py-2 text-xs font-mono border ${
                activeTab === "checkins"
                  ? "bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border-strong)] font-bold shadow-[var(--shadow-subtle)]"
                  : "border-transparent text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)]"
              }`}
            >
              [2] Quarterly Check-ins
            </button>
          )}
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

      {/* TAB 1: GOALS */}
      {activeTab === "goals" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)]">
            <div>
              <div className="text-sm font-serif font-bold mb-1">Submission Validation</div>
              <div className="text-xs text-[var(--color-text-dimmed)] font-mono flex items-center gap-4">
                <span>Total Weightage: {totalWeightage}% / 100%</span>
                <span>Goal Count: {goals.length} / 8</span>
              </div>
            </div>

            {isEditable && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddGoal}
                  disabled={goals.length >= 8}
                  className="px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-main)] border border-[var(--color-border-strong)] text-xs font-mono font-bold disabled:opacity-50"
                >
                  Add Goal
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={isPending}
                  className="px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-main)] border border-[var(--color-border-strong)] text-xs font-mono font-bold disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  onClick={handleSubmitGoalSheet}
                  disabled={validationErrors.length > 0 || isPending}
                  className="px-4 py-2 bg-[var(--color-signal-emerald)] text-black hover:opacity-90 font-mono text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Goal Sheet
                </button>
              </div>
            )}
          </div>

          {validationErrors.length > 0 && isEditable && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs space-y-1">
              <div className="font-bold uppercase mb-2">Submission Rules:</div>
              {validationErrors.map((err, i) => (
                <div key={i}>- {err}</div>
              ))}
            </div>
          )}

          <div className="space-y-6">
            {goals.map((goal, index) => (
              <InteractiveCard key={goal.id || index} glowColor="emerald" className="p-6 space-y-6 bg-[var(--color-elevated)]">
                <div className="flex items-center justify-between border-b border-[var(--color-border-strong)] pb-4">
                  <div className="font-mono text-xs text-[var(--color-signal-emerald)] font-bold flex items-center gap-2">
                    <span className="signal-dot signal-dot-emerald" />
                    { `GOAL_#${index + 1}` } {goal.isShared && "Shared KPI"}
                  </div>
                  {isEditable && !goal.isShared && (
                    <button
                      onClick={() => handleRemoveGoal(index)}
                      className="text-xs font-mono text-red-400 hover:text-red-300"
                    >
                      [REMOVE]
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[var(--color-text-dimmed)] uppercase">Goal Title *</label>
                    <input
                      type="text"
                      disabled={!isEditable || goal.isShared}
                      value={goal.title}
                      onChange={(e) => handleUpdateGoal(index, "title", e.target.value)}
                      placeholder="e.g. Improve monthly delivery completion to 95%"
                      className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)] disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[var(--color-text-dimmed)] uppercase">Thrust Area *</label>
                    <input
                      type="text"
                      disabled={!isEditable || goal.isShared}
                      value={goal.thrustArea}
                      onChange={(e) => handleUpdateGoal(index, "thrustArea", e.target.value)}
                      placeholder="e.g. Core Operations"
                      className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)] disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <label className="text-[var(--color-text-dimmed)] uppercase">Description *</label>
                    <textarea
                      disabled={!isEditable || goal.isShared}
                      value={goal.description}
                      onChange={(e) => handleUpdateGoal(index, "description", e.target.value)}
                      rows={2}
                      placeholder="Describe the measurable business outcome and operational impact..."
                      className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)] disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[var(--color-text-dimmed)] uppercase">Unit of Measurement</label>
                    <select
                      disabled={!isEditable || goal.isShared}
                      value={goal.uomType}
                      onChange={(e) => handleUpdateGoal(index, "uomType", e.target.value as Goal["uomType"])}
                      className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)] disabled:opacity-60"
                    >
                      <option value="PERCENTAGE">PERCENTAGE</option>
                      <option value="NUMERIC_MIN">NUMERIC_MIN</option>
                      <option value="NUMERIC_MAX">NUMERIC_MAX</option>
                      <option value="TIMELINE">TIMELINE</option>
                      <option value="ZERO_BASED">ZERO_BASED</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[var(--color-text-dimmed)] uppercase">Direction</label>
                    <select
                      disabled={!isEditable || goal.isShared}
                      value={goal.metricDirection}
                      onChange={(e) => handleUpdateGoal(index, "metricDirection", e.target.value as Goal["metricDirection"])}
                      className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)] disabled:opacity-60"
                    >
                      <option value="HIGHER_IS_BETTER">HIGHER_IS_BETTER</option>
                      <option value="LOWER_IS_BETTER">LOWER_IS_BETTER</option>
                      <option value="ZERO_BASED">ZERO_BASED</option>
                      <option value="TIMELINE">TIMELINE</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[var(--color-text-dimmed)] uppercase">Target</label>
                    <input
                      type="number"
                      disabled={!isEditable || goal.isShared}
                      value={goal.targetValue}
                      onChange={(e) => handleUpdateGoal(index, "targetValue", Number(e.target.value))}
                      className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)] disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[var(--color-text-dimmed)] uppercase">Deadline</label>
                    <input
                      type="date"
                      disabled={!isEditable || goal.isShared}
                      value={goal.deadlineAt || ""}
                      onChange={(e) => handleUpdateGoal(index, "deadlineAt", e.target.value)}
                      className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)] disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[var(--color-text-dimmed)] uppercase">Weightage (%) *</label>
                    <input
                      type="number"
                      disabled={!isEditable}
                      value={goal.weightage}
                      onChange={(e) => handleUpdateGoal(index, "weightage", Number(e.target.value))}
                      min={10}
                      max={100}
                      className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)] disabled:opacity-60"
                    />
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CHECK-INS */}
      {activeTab === "checkins" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] font-mono text-xs">
            <span className="font-bold uppercase">Select Review Quarter</span>
            <div className="flex gap-2">
              {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={`px-4 py-2 border ${
                    selectedQuarter === q
                      ? "bg-[var(--color-signal-emerald)] text-black font-bold border-[var(--color-signal-emerald)]"
                      : "bg-[var(--color-surface)] text-[var(--color-text-dimmed)] border-[var(--color-border-strong)] hover:text-[var(--color-text-main)]"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {goals.map((goal, index) => {
              const currentCheckIn = goal.checkIns?.find((c) => c.quarter === selectedQuarter);
              const vals = checkInValues[goal.id!] || {
                plannedValue: currentCheckIn?.plannedValue || 0,
                actualValue: currentCheckIn?.actualValue || 0,
              };

              return (
                <AdaptivePanel
                  key={goal.id || index}
                  title={`[GOAL #${index + 1}] ${goal.title} (${goal.weightage}%)`}
                  defaultExpanded={true}
                >
                  <div className="p-6 bg-[var(--color-elevated)] border border-[var(--color-border-strong)] space-y-6 font-mono text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                      <div className="space-y-2">
                        <label className="text-[var(--color-text-dimmed)] uppercase">Planned Value</label>
                        <input
                          type="number"
                          value={vals.plannedValue}
                          onChange={(e) => handleCheckInChange(goal.id!, "plannedValue", Number(e.target.value))}
                          className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[var(--color-text-dimmed)] uppercase">Actual Achievement</label>
                        <input
                          type="number"
                          value={vals.actualValue}
                          onChange={(e) => handleCheckInChange(goal.id!, "actualValue", Number(e.target.value))}
                          className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-signal-emerald)]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[var(--color-text-dimmed)] uppercase">Planned Target</label>
                        <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-dimmed)]">
                          {goal.targetValue} ({goal.uomType})
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => handleSaveCheckIn(goal.id!)}
                          disabled={isPending}
                          className="w-full py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-signal-emerald)] border border-[var(--color-border-strong)] font-bold uppercase"
                        >
                          {isPending ? "Updating..." : `Save ${selectedQuarter} Check-in`}
                        </button>
                      </div>
                    </div>

                    {currentCheckIn && (
                      <div className="pt-4 border-t border-[var(--color-border-strong)] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4 text-[var(--color-text-dimmed)]">
                          <span>Last Submitted: {currentCheckIn.status}</span>
                          <span>Progress: {currentCheckIn.progressPercentage}%</span>
                        </div>
                        <span
                          className={`px-3 py-1 font-bold border ${
                            currentCheckIn.status === "COMPLETED"
                              ? "bg-[var(--color-signal-emerald)]/20 text-[var(--color-signal-emerald)] border-[var(--color-signal-emerald)]/30"
                              : currentCheckIn.status === "ON_TRACK"
                              ? "bg-[var(--color-signal-cerulean)]/20 text-[var(--color-signal-cerulean)] border-[var(--color-signal-cerulean)]/30"
                              : "bg-[var(--color-signal-ochre)]/20 text-[var(--color-signal-ochre)] border-[var(--color-signal-ochre)]/30"
                          }`}
                        >
                          {currentCheckIn.status}
                        </span>
                      </div>
                    )}
                  </div>
                </AdaptivePanel>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
