import { getDashboardAnalytics, goalSheetsToCsv } from "@/lib/services/report-service"
import { jsonError, requireSession } from "@/lib/services/authz"

export async function GET(request: Request) {
  try {
    const session = await requireSession(["MANAGER", "ADMIN"])
    const data = await getDashboardAnalytics(session.user.id, session.user.role)
    const format = new URL(request.url).searchParams.get("format")

    if (format === "excel") {
      const excelHtml = `
        <html>
          <head><meta charset="utf-8" /></head>
          <body>
            <table>
              <thead>
                <tr><th>Employee</th><th>Email</th><th>Status</th><th>Locked</th><th>Cycle</th><th>Goals</th><th>Weightage</th><th>SubmittedAt</th></tr>
              </thead>
              <tbody>
                ${data.goalSheets
                  .map(
                    (sheet) => `
                      <tr>
                        <td>${sheet.employee.name}</td>
                        <td>${sheet.employee.email}</td>
                        <td>${sheet.status}</td>
                        <td>${sheet.locked ? "Yes" : "No"}</td>
                        <td>${sheet.currentCycle?.name ?? "No active cycle"}</td>
                        <td>${sheet.goals.length}</td>
                        <td>${sheet.goals.reduce((sum, goal) => sum + goal.weightage, 0)}</td>
                        <td>${sheet.submittedAt ? sheet.submittedAt.toISOString() : ""}</td>
                      </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>`

      return new Response(excelHtml, {
        headers: {
          "Content-Type": "application/vnd.ms-excel; charset=utf-8",
          "Content-Disposition": 'attachment; filename="goal-report.xls"',
        },
      })
    }

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
