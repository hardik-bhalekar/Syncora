import { getDashboardAnalytics } from "@/lib/services/report-service"
import { jsonError, requireSession } from "@/lib/services/authz"

export async function GET() {
  try {
    const session = await requireSession()
    const data = await getDashboardAnalytics(session.user.id, session.user.role)

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
