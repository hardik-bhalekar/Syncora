import { unlockGoalSheetSchema } from "@/lib/validators/goals"
import { jsonError, requireSession } from "@/lib/services/authz"
import { unlockGoalSheet } from "@/lib/services/goal-service"

export async function POST(request: Request) {
  try {
    const session = await requireSession(["ADMIN"])
    const parsed = unlockGoalSheetSchema.parse(await request.json())
    const data = await unlockGoalSheet({ id: session.user.id, role: session.user.role }, parsed.goalSheetId, parsed.reason)

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
