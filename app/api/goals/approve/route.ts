import { approvalSchema } from "@/lib/validators/goals"
import { jsonError, requireSession } from "@/lib/services/authz"
import { reviewGoalSheet } from "@/lib/services/goal-service"

export async function POST(request: Request) {
  try {
    const session = await requireSession(["MANAGER", "ADMIN"])
    const parsed = approvalSchema.parse(await request.json())
    const data = await reviewGoalSheet({ id: session.user.id, role: session.user.role }, parsed.goalSheetId, "APPROVED", parsed.goals)

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
