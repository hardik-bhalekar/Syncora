import { updateSharedGoal } from "@/lib/services/shared-goal-service"
import { jsonError, requireSession } from "@/lib/services/authz"

export async function PATCH(request: Request, { params }: { params: Promise<{ sharedGoalId: string }> }) {
  try {
    const session = await requireSession(["MANAGER", "ADMIN"])
    const { sharedGoalId } = await params
    const payload = await request.json()
    const data = await updateSharedGoal({ id: session.user.id, role: session.user.role }, { ...payload, sharedGoalId })

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
