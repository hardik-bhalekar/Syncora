import { createAndAssignSharedGoal, getSharedGoals } from "@/lib/services/shared-goal-service"
import { jsonError, requireSession } from "@/lib/services/authz"

export async function GET() {
  try {
    await requireSession(["MANAGER", "ADMIN"])
    const data = await getSharedGoals()

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(["MANAGER", "ADMIN"])
    const data = await createAndAssignSharedGoal({ id: session.user.id, role: session.user.role }, await request.json())

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
