import type { Quarter, Role } from "@prisma/client"
import { createAuditLog } from "@/lib/audit/audit-log"
import { calculateProgressPercentage, progressStatus } from "@/lib/calculations/progress"
import { prisma } from "@/lib/prisma"
import { createEscalation } from "@/lib/services/escalation-service"
import { createNotification } from "@/lib/services/notification-service"
import { resolveActorContext } from "@/lib/services/tenant-context"
import { checkInCommentSchema, checkInSchema } from "@/lib/validators/checkins"

type Actor = {
  id: string
  role: Role
}

export async function upsertCheckIn(actor: Actor, input: unknown) {
  const parsed = checkInSchema.parse(input)
  const context = await resolveActorContext(actor.id)

  if (context.role !== "EMPLOYEE" && context.role !== "ADMIN") {
    throw new Error("Only employees can submit quarterly check-ins.")
  }

  return prisma.$transaction(async (tx) => {
    const goal = await tx.goal.findUnique({
      where: { id: parsed.goalId },
      include: { goalSheet: { include: { employee: true, currentCycle: true } } },
    })

    if (!goal || goal.goalSheet.employeeId !== actor.id || goal.goalSheet.tenantId !== context.tenantId) {
      throw new Error("Goal not found.")
    }

    if (!goal.goalSheet.locked) {
      throw new Error("Quarterly check-ins are available only after goals are approved and locked.")
    }

    const cycle = await assertActiveQuarterWindow(parsed.quarter, context.tenantId)

    const previous = await tx.checkIn.findUnique({
      where: { tenantId_goalId_quarter: { tenantId: goal.tenantId, goalId: parsed.goalId, quarter: parsed.quarter } },
    })
    const progressPercentage = calculateProgressPercentage({
      direction: goal.metricDirection,
      targetValue: goal.targetValue,
      plannedValue: parsed.plannedValue,
      actualValue: parsed.actualValue,
      deadlineAt: goal.deadlineAt ?? goal.goalSheet.currentCycle?.endDate ?? cycle.endDate,
      completionAt: new Date(),
      cycleStartAt: goal.goalSheet.currentCycle?.startDate ?? cycle.startDate,
    })

    const checkIn = await tx.checkIn.upsert({
      where: { tenantId_goalId_quarter: { tenantId: goal.tenantId, goalId: parsed.goalId, quarter: parsed.quarter } },
      update: {
        plannedValue: parsed.plannedValue,
        actualValue: parsed.actualValue,
        progressPercentage,
        status: progressStatus(progressPercentage),
        submittedAt: new Date(),
      },
      create: {
        tenantId: goal.tenantId,
        goalId: parsed.goalId,
        quarter: parsed.quarter,
        plannedValue: parsed.plannedValue,
        actualValue: parsed.actualValue,
        progressPercentage,
        status: progressStatus(progressPercentage),
        submittedAt: new Date(),
      },
    })

    await createAuditLog({
      actorId: actor.id,
      entityType: "CheckIn",
      entityId: checkIn.id,
      action: "UPDATE_CHECKIN",
      previousData: previous ? snapshotCheckIn(previous) : undefined,
      newData: snapshotCheckIn(checkIn),
      client: tx,
    })

    if (goal.goalSheet.employee.managerId) {
      await createNotification(tx, {
        tenantId: context.tenantId,
        userId: goal.goalSheet.employee.managerId,
        type: "CHECKIN",
        title: `${goal.goalSheet.employee.name} updated ${parsed.quarter} check-in`,
        message: `${goal.goalSheet.employee.name} reported ${progressPercentage}% progress on ${goal.title}.`,
      })
    }

    if (progressPercentage < 70 && goal.goalSheet.currentCycle) {
      const existingEscalation = await tx.escalation.findFirst({
        where: {
          tenantId: context.tenantId,
          relatedEntityId: checkIn.id,
          relatedEntityType: "CheckIn",
          type: "CHECKIN_OVERDUE",
          status: "ACTIVE",
        },
      })

      if (!existingEscalation) {
        await createEscalation(tx, {
          tenantId: context.tenantId,
          employeeId: goal.goalSheet.employeeId,
          managerId: goal.goalSheet.employee.managerId,
          type: "CHECKIN_OVERDUE",
          level: "MANAGER",
          reason: `Quarter ${parsed.quarter} check-in for ${goal.title} is below review threshold at ${progressPercentage}%.`,
          relatedEntityId: checkIn.id,
          relatedEntityType: "CheckIn",
        })
      }
    }

    return checkIn
  })
}

export async function addCheckInComment(actor: Actor, input: unknown) {
  const parsed = checkInCommentSchema.parse(input)
  const context = await resolveActorContext(actor.id)

  const checkIn = await prisma.checkIn.findUnique({
    where: { id: parsed.checkInId },
    include: { goal: { include: { goalSheet: { include: { employee: true } } } } },
  })

  if (!checkIn) {
    throw new Error("Check-in not found.")
  }

  if (context.role === "MANAGER" && checkIn.goal.goalSheet.employee.managerId !== actor.id) {
    throw new Error("Managers can only comment on direct report check-ins.")
  }

  if (checkIn.goal.goalSheet.tenantId !== context.tenantId) {
    throw new Error("Check-in not found.")
  }

  const comment = await prisma.checkInComment.create({
    data: {
      checkInId: parsed.checkInId,
      managerId: actor.id,
      comment: parsed.comment,
    },
  })

  await createNotification(prisma, {
    tenantId: context.tenantId,
    userId: checkIn.goal.goalSheet.employeeId,
    type: "CHECKIN",
    title: "Manager added a review comment",
    message: parsed.comment,
  })

  return comment
}

async function assertActiveQuarterWindow(quarter: Quarter, tenantId: string) {
  const now = new Date()
  const cycle = await prisma.cycle.findFirst({
    where: {
      tenantId,
      quarter,
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
  })

  if (!cycle) {
    throw new Error("Quarterly updates are allowed only inside the active cycle window.")
  }

  return cycle
}

function snapshotCheckIn(checkIn: { quarter: Quarter; plannedValue: number; actualValue: number; progressPercentage: number; status: string }) {
  return {
    quarter: checkIn.quarter,
    plannedValue: checkIn.plannedValue,
    actualValue: checkIn.actualValue,
    progressPercentage: checkIn.progressPercentage,
    status: checkIn.status,
  }
}
