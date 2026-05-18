import { jsonError, requireSession } from "@/lib/services/authz"
import { listNotifications, markNotificationRead } from "@/lib/services/notification-service"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await requireSession()
    const data = await listNotifications(prisma, session.user.tenantId, session.user.id)

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession()
    const body = await request.json()
    const data = await markNotificationRead(prisma, session.user.tenantId, session.user.id, body.notificationId)

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}