import { addCheckInComment, upsertCheckIn } from "@/lib/services/checkin-service"
import { jsonError, requireSession } from "@/lib/services/authz"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const session = body.checkInId
      ? await requireSession(["MANAGER", "ADMIN"])
      : await requireSession(["EMPLOYEE"])

    const data = body.checkInId
      ? await addCheckInComment({ id: session.user.id, role: session.user.role }, body)
      : await upsertCheckIn({ id: session.user.id, role: session.user.role }, body)

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
