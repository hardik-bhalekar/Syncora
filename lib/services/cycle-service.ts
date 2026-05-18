import type { Role } from "@prisma/client"
import { createAuditLog } from "@/lib/audit/audit-log"
import { prisma } from "@/lib/prisma"
import { resolveActorContext } from "@/lib/services/tenant-context"
import { cycleSchema } from "@/lib/validators/cycles"

type Actor = {
  id: string
  role: Role
}

export async function createCycle(actor: Actor, input: unknown) {
  const parsed = cycleSchema.parse(input)
  const context = await resolveActorContext(actor.id)

  if (context.role !== "ADMIN") {
    throw new Error("Only admins can create or activate cycles.")
  }

  return prisma.$transaction(async (tx) => {
    if (parsed.isActive) {
      await tx.cycle.updateMany({ where: { tenantId: context.tenantId, isActive: true }, data: { isActive: false } })
    }

    const cycle = await tx.cycle.create({
      data: {
        ...parsed,
        tenantId: context.tenantId,
      },
    })

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
