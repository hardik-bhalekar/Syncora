import type { Role } from "@/prisma/generated/client"
import { createAuditLog } from "@/lib/audit/audit-log"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/services/notification-service"
import { resolveActorContext } from "@/lib/services/tenant-context"
import { sharedGoalSchema, sharedGoalUpdateSchema } from "@/lib/validators/shared-goals"

type Actor = {
  id: string
  role: Role
}

export async function createAndAssignSharedGoal(actor: Actor, input: unknown) {
  const parsed = sharedGoalSchema.parse(input)
  const context = await resolveActorContext(actor.id)

  if (context.role !== "MANAGER" && context.role !== "ADMIN") {
    throw new Error("Only managers and admins can push shared goals.")
  }

  return prisma.$transaction(async (tx) => {
    const activeCycle = await tx.cycle.findFirst({
      where: { tenantId: context.tenantId, isActive: true },
      orderBy: { startDate: "desc" },
    })

    const sharedGoal = await tx.sharedGoal.create({
      data: {
        ownerId: actor.id,
        tenantId: context.tenantId,
        title: parsed.title,
        description: parsed.description,
        targetValue: parsed.targetValue,
        deadlineAt: activeCycle?.endDate ?? null,
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
      await upsertSharedAssignment(tx, {
        tenantId: context.tenantId,
        employeeId,
        sharedGoalId: sharedGoal.id,
        localWeightage: parsed.localWeightage,
        sharedGoal,
        cycleId: activeCycle?.id ?? null,
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

export async function updateSharedGoal(actor: Actor, input: unknown) {
  const parsed = sharedGoalUpdateSchema.parse(input)
  const context = await resolveActorContext(actor.id)

  return prisma.$transaction(async (tx) => {
    const sharedGoal = await tx.sharedGoal.findUnique({
      where: { id: parsed.sharedGoalId },
      include: { assignments: true },
    })

    if (!sharedGoal || sharedGoal.tenantId !== context.tenantId) {
      throw new Error("Shared goal not found.")
    }

    if (context.role === "MANAGER" && sharedGoal.ownerId !== actor.id) {
      throw new Error("Managers can only update the shared goals they created.")
    }

    const updated = await tx.sharedGoal.update({
      where: { id: sharedGoal.id },
      data: {
        title: parsed.title ?? sharedGoal.title,
        description: parsed.description ?? sharedGoal.description,
        targetValue: parsed.targetValue ?? sharedGoal.targetValue,
        thrustArea: parsed.thrustArea ?? sharedGoal.thrustArea,
      },
    })

    await createAuditLog({
      actorId: actor.id,
      entityType: "SharedGoal",
      entityId: sharedGoal.id,
      action: "UPDATE_GOAL",
      previousData: {
        title: sharedGoal.title,
        description: sharedGoal.description,
        targetValue: sharedGoal.targetValue,
        thrustArea: sharedGoal.thrustArea,
      },
      newData: {
        title: updated.title,
        description: updated.description,
        targetValue: updated.targetValue,
        thrustArea: updated.thrustArea,
      },
      client: tx,
    })

    const activeCycle = await tx.cycle.findFirst({
      where: { tenantId: context.tenantId, isActive: true },
      orderBy: { startDate: "desc" },
    })

    for (const assignment of sharedGoal.assignments) {
      await upsertSharedAssignment(tx, {
        tenantId: context.tenantId,
        employeeId: assignment.employeeId,
        sharedGoalId: sharedGoal.id,
        localWeightage: assignment.localWeightage,
        sharedGoal: updated,
        cycleId: activeCycle?.id ?? null,
      })
    }

    return updated
  })
}

export async function getSharedGoals(actorId: string) {
  const context = await resolveActorContext(actorId)

  return prisma.sharedGoal.findMany({
    where: { tenantId: context.tenantId },
    include: { owner: true, assignments: { include: { employee: true } } },
    orderBy: { createdAt: "desc" },
  })
}

async function upsertSharedAssignment(
  client: Parameters<typeof prisma.$transaction>[0] extends (tx: infer T) => Promise<unknown> ? T : never,
  input: {
    tenantId: string
    employeeId: string
    sharedGoalId: string
    localWeightage: number
    sharedGoal: { title: string; description: string; targetValue: number; thrustArea: string; deadlineAt: Date | null }
    cycleId: string | null
  }
) {
  await client.goalAssignment.upsert({
    where: { employeeId_sharedGoalId: { employeeId: input.employeeId, sharedGoalId: input.sharedGoalId } },
    update: { localWeightage: input.localWeightage },
    create: {
      employeeId: input.employeeId,
      sharedGoalId: input.sharedGoalId,
      localWeightage: input.localWeightage,
    },
  })

  const sheet =
    (await client.goalSheet.findFirst({
      where: { tenantId: input.tenantId, employeeId: input.employeeId, currentCycleId: input.cycleId },
    })) ??
    (await client.goalSheet.create({
      data: { employeeId: input.employeeId, tenantId: input.tenantId, currentCycleId: input.cycleId },
    }))

  const existingGoal = await client.goal.findFirst({
    where: { tenantId: input.tenantId, goalSheetId: sheet.id, sharedGoalId: input.sharedGoalId },
  })

  const goalPayload = {
    title: input.sharedGoal.title,
    description: input.sharedGoal.description,
    thrustArea: input.sharedGoal.thrustArea,
    uomType: "NUMERIC_MAX" as const,
    metricDirection: "HIGHER_IS_BETTER" as const,
    targetValue: input.sharedGoal.targetValue,
    deadlineAt: input.sharedGoal.deadlineAt,
    weightage: input.localWeightage,
    isShared: true,
    sharedGoalId: input.sharedGoalId,
  }

  if (existingGoal) {
    await client.goal.update({
      where: { id: existingGoal.id },
      data: goalPayload,
    })
    return existingGoal
  }

  return client.goal.create({
    data: {
      tenantId: input.tenantId,
      goalSheetId: sheet.id,
      ...goalPayload,
    },
  })
}
