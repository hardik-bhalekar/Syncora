import { AuditAction } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { jsonError, requireSession } from "@/lib/services/authz"

export async function GET(request: Request) {
  try {
    const session = await requireSession(["ADMIN"])
    const { searchParams } = new URL(request.url)
    const take = Math.min(Number(searchParams.get("take") ?? 50), 100)
    const q = searchParams.get("q")?.trim() ?? ""
    const action = searchParams.get("action")?.trim() ?? ""
    const entityType = searchParams.get("entityType")?.trim() ?? ""
    const actorId = searchParams.get("actorId")?.trim() ?? ""

    const data = await prisma.auditLog.findMany({
      where: {
        tenantId: session.user.tenantId,
        ...(q
          ? {
              OR: [
                { actor: { name: { contains: q, mode: "insensitive" } } },
                { entityType: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(action ? { action: action as AuditAction } : {}),
        ...(entityType ? { entityType } : {}),
        ...(actorId ? { actorId } : {}),
      },
      take,
      include: { actor: true },
      orderBy: { timestamp: "desc" },
    })

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
