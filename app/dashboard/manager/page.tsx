import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getManagerQueue } from "@/lib/services/goal-service";
import { getDashboardAnalytics } from "@/lib/services/report-service";
import { ManagerWorkspace } from "@/components/dashboard/manager-workspace";

export default async function ManagerDashboardPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const [queue, analytics] = await Promise.all([
    getManagerQueue(session.user.id, session.user.role),
    getDashboardAnalytics(session.user.id, session.user.role),
  ]);

  return (
    <div className="flex flex-col gap-16 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--color-border-strong)] pb-10">
        <div className="space-y-3">
          <div className="cinematic-kicker">
            <span className="signal-dot signal-dot-cerulean" />
            Team Performance Operations
          </div>
          <h1 className="text-cinematic-h2 leading-tight">
            Team Performance & <span className="text-cinematic-italic">Approval Queues</span>.
          </h1>
        </div>
        <div className="font-mono text-xs text-[var(--color-text-dimmed)] flex flex-col items-end space-y-1">
          <span>{`TEAM_GOAL_SHEETS: ${analytics.totalSheets}`}</span>
          <span>{`PENDING_REVIEWS: ${queue.filter((s) => s.status === "SUBMITTED").length}`}</span>
        </div>
      </div>

      <ManagerWorkspace initialQueue={queue as any} analytics={analytics as any} />
    </div>
  );
}
