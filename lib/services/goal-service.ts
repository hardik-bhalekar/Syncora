import type { GoalSheetStatus, Prisma, Role } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit/audit-log"
import { saveGoalSheetSchema, validateWeightage } from "@/lib/validators/goals"

type Actor = {
  id: string
  role: Role
}

export async function getEmployeeGoalWorkspace(employeeId: string) {
  const activeCycle = await prisma.cycle.findFirst({
    where: { isActive: true },
    orderBy: { startDate: "desc" },
  })

  const goalSheet = await prisma.goalSheet.findFirst({
    where: {
      employeeId,
      currentCycleId: activeCycle?.id ?? null,
    },
    include: {
      currentCycle: true,
      goals: {
        include: {
          sharedGoal: true,
          checkIns: { orderBy: { quarter: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return { activeCycle, goalSheet }
}

export async function saveGoalDraft(actor: Actor, input: unknown) {
  const parsed = saveGoalSheetSchema.parse(input)
  const weightageError = validateWeightage(parsed.goals)

  if (weightageError) {
    throw new Error(weightageError)
  }

  return prisma.$transaction(async (tx) => {
    const existingSheet = await tx.goalSheet.findFirst({
      where: {
        employeeId: actor.id,
        currentCycleId: parsed.cycleId ?? null,
      },
      include: { goals: true },
    })
    const goalSheet =
      existingSheet ??
      (await tx.goalSheet.create({
        data: {
          employeeId: actor.id,
          currentCycleId: parsed.cycleId ?? null,
        },
        include: { goals: true },
      }))

    if (goalSheet.locked) {
      throw new Error("Locked goals cannot be edited.")
    }

    if (!["DRAFT", "REJECTED", "RETURNED"].includes(goalSheet.status)) {
      throw new Error("Only draft, rejected, or returned goal sheets can be edited.")
    }

    const existingById = new Map(goalSheet.goals.map((goal) => [goal.id, goal]))
    const incomingIds = parsed.goals.map((goal) => goal.id).filter(Boolean) as string[]

    await tx.goal.deleteMany({
      where: {
        goalSheetId: goalSheet.id,
        id: { notIn: incomingIds.length ? incomingIds : [""] },
        isShared: false,
      },
    })

    for (const goal of parsed.goals) {
      const previous = goal.id ? existingById.get(goal.id) : null

      if (previous?.isShared) {
        await tx.goal.update({
          where: { id: previous.id },
          data: { weightage: goal.weightage },
        })
        await createAuditLog({
          actorId: actor.id,
          entityType: "Goal",
          entityId: previous.id,
          action: "UPDATE_WEIGHTAGE",
          previousData: { weightage: previous.weightage },
          newData: { weightage: goal.weightage },
          client: tx,
        })
        continue
      }

      const data = {
        title: goal.title,
        description: goal.description,
        thrustArea: goal.thrustArea,
        uomType: goal.uomType,
        metricDirection: goal.metricDirection,
        targetValue: goal.targetValue,
        weightage: goal.weightage,
        status: "DRAFT" as const,
      }

      const savedGoal = goal.id
        ? await tx.goal.update({ where: { id: goal.id }, data })
        : await tx.goal.create({ data: { ...data, goalSheetId: goalSheet.id } })

      await createAuditLog({
        actorId: actor.id,
        entityType: "Goal",
        entityId: savedGoal.id,
        action: previous ? "UPDATE_GOAL" : "CREATE_GOAL",
        previousData: previous ? cleanGoal(previous) : undefined,
        newData: cleanGoal(savedGoal),
        client: tx,
      })
    }

    return tx.goalSheet.findUnique({
      where: { id: goalSheet.id },
      include: { goals: { orderBy: { createdAt: "asc" } }, currentCycle: true },
    })
  })
}

export async function submitGoalSheet(actor: Actor, goalSheetId: string) {
  return prisma.$transaction(async (tx) => {
    const goalSheet = await tx.goalSheet.findUnique({
      where: { id: goalSheetId },
      include: { goals: true },
    })

    if (!goalSheet || goalSheet.employeeId !== actor.id) {
      throw new Error("Goal sheet not found.")
    }

    if (goalSheet.locked) {
      throw new Error("Locked goals cannot be submitted.")
    }

    if (goalSheet.status === "SUBMITTED") {
      throw new Error("Goal sheet has already been submitted.")
    }

    const weightageError = validateWeightage(goalSheet.goals)
    if (weightageError) {
      throw new Error(weightageError)
    }

    const updated = await tx.goalSheet.update({
      where: { id: goalSheet.id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        goals: { updateMany: { where: {}, data: { status: "SUBMITTED" } } },
      },
    })

    await createAuditLog({
      actorId: actor.id,
      entityType: "GoalSheet",
      entityId: goalSheet.id,
      action: "SUBMIT_GOALS",
      previousData: { status: goalSheet.status },
      newData: { status: updated.status },
      client: tx,
    })

    return updated
  })
}

export async function reviewGoalSheet(actor: Actor, goalSheetId: string, status: Extract<GoalSheetStatus, "APPROVED" | "REJECTED" | "RETURNED">, goals?: Array<{ id: string; targetValue?: number; weightage?: number }>) {
  return prisma.$transaction(async (tx) => {
    const goalSheet = await tx.goalSheet.findUnique({
      where: { id: goalSheetId },
      include: { employee: true, goals: true },
    })

    if (!goalSheet) {
      throw new Error("Goal sheet not found.")
    }

    if (actor.role === "MANAGER" && goalSheet.employee.managerId !== actor.id) {
      throw new Error("Managers can only review direct reports.")
    }

    if (goalSheet.status !== "SUBMITTED") {
      throw new Error("Only submitted goal sheets can be reviewed.")
    }

    if (goals?.length) {
      for (const edit of goals) {
        const existing = goalSheet.goals.find((goal) => goal.id === edit.id)
        if (!existing) {
          throw new Error("A goal edit references an unknown goal.")
        }

        await tx.goal.update({
          where: { id: edit.id },
          data: {
            targetValue: edit.targetValue ?? existing.targetValue,
            weightage: edit.weightage ?? existing.weightage,
          },
        })
      }
    }

    const refreshedGoals = await tx.goal.findMany({ where: { goalSheetId } })
    const weightageError = validateWeightage(refreshedGoals)
    if (weightageError) {
      throw new Error(weightageError)
    }

    const updated = await tx.goalSheet.update({
      where: { id: goalSheet.id },
      data: {
        status,
        approvedAt: status === "APPROVED" ? new Date() : null,
        locked: status === "APPROVED",
        goals: { updateMany: { where: {}, data: { status } } },
      },
    })

    await createAuditLog({
      actorId: actor.id,
      entityType: "GoalSheet",
      entityId: goalSheet.id,
      action: status === "APPROVED" ? "APPROVE_GOALS" : status === "REJECTED" ? "REJECT_GOALS" : "RETURN_GOALS",
      previousData: { status: goalSheet.status, locked: goalSheet.locked },
      newData: { status: updated.status, locked: updated.locked },
      client: tx,
    })

    return updated
  })
}

export async function unlockGoalSheet(actor: Actor, goalSheetId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const goalSheet = await tx.goalSheet.findUnique({ where: { id: goalSheetId } })

    if (!goalSheet) {
      throw new Error("Goal sheet not found.")
    }

    const updated = await tx.goalSheet.update({
      where: { id: goalSheetId },
      data: {
        locked: false,
        status: "RETURNED",
        goals: { updateMany: { where: {}, data: { status: "RETURNED" } } },
      },
    })

    await createAuditLog({
      actorId: actor.id,
      entityType: "GoalSheet",
      entityId: goalSheetId,
      action: "UNLOCK_GOALS",
      previousData: { locked: goalSheet.locked, status: goalSheet.status },
      newData: { locked: updated.locked, status: updated.status, reason },
      client: tx,
    })

    return updated
  })
}

export async function getManagerQueue(managerId: string, role: Role) {
  return prisma.goalSheet.findMany({
    where: role === "ADMIN" ? {} : { employee: { managerId } },
    include: {
      employee: true,
      currentCycle: true,
      goals: { include: { checkIns: true, sharedGoal: true }, orderBy: { createdAt: "asc" } },
    },
    orderBy: [{ status: "desc" }, { updatedAt: "desc" }],
  })
}

function cleanGoal(goal: Prisma.GoalGetPayload<Record<string, never>>) {
  return {
    id: goal.id,
    title: goal.title,
    targetValue: goal.targetValue,
    weightage: goal.weightage,
    status: goal.status,
  }
}
