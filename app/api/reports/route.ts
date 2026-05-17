import { getDashboardAnalytics, goalSheetsToCsv } from "@/lib/services/report-service"
import { jsonError, requireSession } from "@/lib/services/authz"

export async function GET() {
  try {
    const session = await requireSession(["MANAGER", "ADMIN"])
    const data = await getDashboardAnalytics(session.user.id, session.user.role)
    const csv = goalSheetsToCsv(data.goalSheets)

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="goal-report.csv"',
      },
    })
  } catch (error) {
    return jsonError(error)
  }
}
