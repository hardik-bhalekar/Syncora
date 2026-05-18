import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getEmployeeGoalWorkspace } from "@/lib/services/goal-service";
import { EmployeeWorkspace } from "@/components/dashboard/employee-workspace";

export default async function EmployeeDashboardPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const workspaceData = await getEmployeeGoalWorkspace(session.user.id);

  return (
    <div className="flex flex-col gap-16 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--color-border-strong)] pb-10">
        <div className="space-y-3">
          <div className="cinematic-kicker">
            <span className="signal-dot signal-dot-emerald" />
            Performance Workspace
          </div>
          <h1 className="text-cinematic-h2 leading-tight">
            Goals & <span className="text-cinematic-italic">Quarterly Check-ins</span>.
          </h1>
        </div>
        <div className="font-mono text-xs text-[var(--color-text-dimmed)] flex flex-col items-end space-y-1">
          <span>{`CURRENT_REVIEW_CYCLE: ${workspaceData.activeCycle?.name || "NONE"}`}</span>
          <span>{`QUARTER: ${workspaceData.activeCycle?.quarter || ""}`}</span>
          <span>{`GOAL_SHEET_STATUS: ${workspaceData.goalSheet?.status || "DRAFT"}`}</span>
        </div>
      </div>

      <EmployeeWorkspace
        initialGoalSheet={workspaceData.goalSheet as any}
        activeCycle={workspaceData.activeCycle as any}
      />
    </div>
  );
}
