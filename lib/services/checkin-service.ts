import type { Quarter, Role } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit/audit-log"
import { calculateProgressPercentage, progressStatus } from "@/lib/calculations/progress"
import { checkInCommentSchema, checkInSchema } from "@/lib/validators/checkins"

type Actor = {
  id: string
  role: Role
}

export async function upsertCheckIn(actor: Actor, input: unknown) {
  const parsed = checkInSchema.parse(input)

  return prisma.$transaction(async (tx) => {
    const goal = await tx.goal.findUnique({
      where: { id: parsed.goalId },
      include: { goalSheet: true },
    })

    if (!goal || goal.goalSheet.employeeId !== actor.id) {
      throw new Error("Goal not found.")
    }

    if (!goal.goalSheet.locked) {
      throw new Error("Quarterly check-ins are available only after goals are approved and locked.")
    }

    await assertActiveQuarterWindow(parsed.quarter)

    const previous = await tx.checkIn.findUnique({
      where: { goalId_quarter: { goalId: parsed.goalId, quarter: parsed.quarter } },
    })
    const progressPercentage = calculateProgressPercentage({
      direction: goal.metricDirection,
      targetValue: goal.targetValue,
      plannedValue: parsed.plannedValue,
      actualValue: parsed.actualValue,
    })

    const checkIn = await tx.checkIn.upsert({
      where: { goalId_quarter: { goalId: parsed.goalId, quarter: parsed.quarter } },
      update: {
        plannedValue: parsed.plannedValue,
        actualValue: parsed.actualValue,
        progressPercentage,
        status: progressStatus(progressPercentage),
        submittedAt: new Date(),
      },
      create: {
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

    return checkIn
  })
}

export async function addCheckInComment(actor: Actor, input: unknown) {
  const parsed = checkInCommentSchema.parse(input)

  const checkIn = await prisma.checkIn.findUnique({
    where: { id: parsed.checkInId },
    include: { goal: { include: { goalSheet: { include: { employee: true } } } } },
  })

  if (!checkIn) {
    throw new Error("Check-in not found.")
  }

  if (actor.role === "MANAGER" && checkIn.goal.goalSheet.employee.managerId !== actor.id) {
    throw new Error("Managers can only comment on direct report check-ins.")
  }

  return prisma.checkInComment.create({
    data: {
      checkInId: parsed.checkInId,
      managerId: actor.id,
      comment: parsed.comment,
    },
  })
}

async function assertActiveQuarterWindow(quarter: Quarter) {
  const now = new Date()
  const cycle = await prisma.cycle.findFirst({
    where: {
      quarter,
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
  })

  if (!cycle) {
    throw new Error("Quarterly updates are allowed only inside the active cycle window.")
  }
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
