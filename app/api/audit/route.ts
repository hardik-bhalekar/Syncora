import { prisma } from "@/lib/prisma"
import { jsonError, requireSession } from "@/lib/services/authz"

export async function GET(request: Request) {
  try {
    await requireSession(["ADMIN"])
    const { searchParams } = new URL(request.url)
    const take = Math.min(Number(searchParams.get("take") ?? 50), 100)
    const data = await prisma.auditLog.findMany({
      take,
      include: { actor: true },
      orderBy: { timestamp: "desc" },
    })

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
