import { prisma } from "@/lib/prisma"
import { createCycle } from "@/lib/services/cycle-service"
import { jsonError, requireSession } from "@/lib/services/authz"

export async function GET() {
  try {
    await requireSession()
    const data = await prisma.cycle.findMany({ orderBy: { startDate: "desc" } })

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(["ADMIN"])
    const data = await createCycle({ id: session.user.id, role: session.user.role }, await request.json())

    return Response.json({ ok: true, data })
  } catch (error) {
    return jsonError(error)
  }
}
