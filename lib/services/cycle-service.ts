import type { Role } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit/audit-log"
import { cycleSchema } from "@/lib/validators/cycles"

type Actor = {
  id: string
  role: Role
}

export async function createCycle(actor: Actor, input: unknown) {
  const parsed = cycleSchema.parse(input)

  return prisma.$transaction(async (tx) => {
    if (parsed.isActive) {
      await tx.cycle.updateMany({ where: { isActive: true }, data: { isActive: false } })
    }

    const cycle = await tx.cycle.create({ data: parsed })

    await createAuditLog({
      actorId: actor.id,
      entityType: "Cycle",
      entityId: cycle.id,
      action: "CREATE_CYCLE",
      newData: {
        name: cycle.name,
        quarter: cycle.quarter,
        startDate: cycle.startDate.toISOString(),
        endDate: cycle.endDate.toISOString(),
        isActive: cycle.isActive,
      },
      client: tx,
    })

    return cycle
  })
}
