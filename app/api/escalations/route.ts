import { prisma } from "@/lib/prisma"
import { jsonError, requireSession } from "@/lib/services/authz"
import { createEscalation, resolveEscalation } from "@/lib/services/escalation-service"

export async function GET() {
  try {
    const session = await requireSession(["MANAGER", "ADMIN"])
    const data = await prisma.escalation.findMany({
      where: { tenantId: session.user.tenantId },
      include: { employee: true, manager: true },
      orderBy: { createdAt: "desc" },
    })

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(["MANAGER", "ADMIN"])
    const body = await request.json()
    const data = await createEscalation(prisma, {
      tenantId: session.user.tenantId,
      employeeId: body.employeeId,
      managerId: body.managerId ?? null,
      type: body.type,
      level: body.level,
      reason: body.reason,
      relatedEntityId: body.relatedEntityId ?? null,
      relatedEntityType: body.relatedEntityType ?? null,
    })

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession(["MANAGER", "ADMIN"])
    const body = await request.json()
    const data = await resolveEscalation(prisma, session.user.tenantId, body.escalationId, body.status)

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}