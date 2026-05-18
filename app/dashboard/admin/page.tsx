import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardAnalytics } from "@/lib/services/report-service";
import { AdminWorkspace } from "@/components/dashboard/admin-workspace";

export default async function AdminDashboardPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const analytics = await getDashboardAnalytics(session.user.id, session.user.role);

  return (
    <div className="flex flex-col gap-16 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--color-border-strong)] pb-10">
        <div className="space-y-3">
          <div className="cinematic-kicker">
            <span className="signal-dot signal-dot-ochre" />
            Organization Control Center
          </div>
          <h1 className="text-cinematic-h2 leading-tight">
            Cycle Configuration & <span className="text-cinematic-italic-ochre">Audit History</span>.
          </h1>
        </div>
        <div className="font-mono text-xs text-[var(--color-text-dimmed)] flex flex-col items-end space-y-1">
          <span>{`TOTAL_GOAL_SHEETS: ${analytics.totalSheets}`}</span>
          <span>{`COMPLETION_RATE: ${analytics.completionRate}%`}</span>
        </div>
      </div>

      <AdminWorkspace analytics={analytics} />
    </div>
  );
}
