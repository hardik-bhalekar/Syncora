import type { Role } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit/audit-log"
import { sharedGoalSchema } from "@/lib/validators/shared-goals"

type Actor = {
  id: string
  role: Role
}

export async function createAndAssignSharedGoal(actor: Actor, input: unknown) {
  const parsed = sharedGoalSchema.parse(input)

  return prisma.$transaction(async (tx) => {
    const sharedGoal = await tx.sharedGoal.create({
      data: {
        ownerId: actor.id,
        title: parsed.title,
        description: parsed.description,
        targetValue: parsed.targetValue,
        thrustArea: parsed.thrustArea,
      },
    })

    await createAuditLog({
      actorId: actor.id,
      entityType: "SharedGoal",
      entityId: sharedGoal.id,
      action: "CREATE_SHARED_GOAL",
      newData: parsed,
      client: tx,
    })

    for (const employeeId of parsed.employeeIds) {
      await tx.goalAssignment.upsert({
        where: { employeeId_sharedGoalId: { employeeId, sharedGoalId: sharedGoal.id } },
        update: { localWeightage: parsed.localWeightage },
        create: {
          employeeId,
          sharedGoalId: sharedGoal.id,
          localWeightage: parsed.localWeightage,
        },
      })

      const activeCycle = await tx.cycle.findFirst({ where: { isActive: true }, orderBy: { startDate: "desc" } })
      const sheet =
        (await tx.goalSheet.findFirst({
          where: { employeeId, currentCycleId: activeCycle?.id ?? null },
        })) ??
        (await tx.goalSheet.create({
          data: { employeeId, currentCycleId: activeCycle?.id ?? null },
        }))

      await tx.goal.create({
        data: {
          goalSheetId: sheet.id,
          title: sharedGoal.title,
          description: sharedGoal.description,
          thrustArea: sharedGoal.thrustArea,
          uomType: "NUMERIC_MAX",
          metricDirection: "HIGHER_IS_BETTER",
          targetValue: sharedGoal.targetValue,
          weightage: parsed.localWeightage,
          isShared: true,
          sharedGoalId: sharedGoal.id,
        },
      })
    }

    await createAuditLog({
      actorId: actor.id,
      entityType: "SharedGoal",
      entityId: sharedGoal.id,
      action: "ASSIGN_SHARED_GOAL",
      newData: { employeeIds: parsed.employeeIds, localWeightage: parsed.localWeightage },
      client: tx,
    })

    return sharedGoal
  })
}

export async function getSharedGoals() {
  return prisma.sharedGoal.findMany({
    include: { owner: true, assignments: { include: { employee: true } } },
    orderBy: { createdAt: "desc" },
  })
}
