import { getEmployeeGoalWorkspace } from "@/lib/services/goal-service"
import { jsonError, requireSession } from "@/lib/services/authz"
import { saveGoalDraft } from "@/lib/services/goal-service"

export async function GET() {
  try {
    const session = await requireSession()
    const data = await getEmployeeGoalWorkspace(session.user.id)

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(["EMPLOYEE", "MANAGER", "ADMIN"])
    const data = await saveGoalDraft({ id: session.user.id, role: session.user.role }, await request.json())

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
