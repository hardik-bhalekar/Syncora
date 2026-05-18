import { submitGoalSheetSchema } from "@/lib/validators/goals"
import { jsonError, requireSession } from "@/lib/services/authz"
import { submitGoalSheet } from "@/lib/services/goal-service"

export async function POST(request: Request) {
  try {
    const session = await requireSession(["EMPLOYEE"])
    const parsed = submitGoalSheetSchema.parse(await request.json())
    const data = await submitGoalSheet({ id: session.user.id, role: session.user.role }, parsed.goalSheetId)

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
