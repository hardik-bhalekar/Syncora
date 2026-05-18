import { prisma, withTenant } from "../../prisma";
import { eventBus } from "../event/event-bus";
import { saveGoalSheetSchema, validateWeightage } from "@/lib/validators/goals";
import type { Role } from "@prisma/client";

type Actor = {
  id: string;
  role: Role;
  tenantId: string;
};

export class GoalService {
  /**
   * Fetch the current active goal workspace for an employee, scoped to their tenant.
   */
  static async getEmployeeWorkspace(tenantId: string, employeeId: string) {
    return withTenant(tenantId, async (tx) => {
      const activeCycle = await tx.cycle.findFirst({
        where: { isActive: true, tenantId },
        orderBy: { startDate: "desc" },
      });

      const goalSheet = await tx.goalSheet.findFirst({
        where: {
          employeeId,
          tenantId,
          currentCycleId: activeCycle?.id ?? null,
        },
        include: {
          currentCycle: true,
          goals: {
            include: {
              sharedGoal: true,
              checkIns: { orderBy: { quarter: "asc" } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return { activeCycle, goalSheet };
    });
  }

  /**
   * Create or update a goal draft using the outbox/event pattern.
   */
  static async saveDraft(actor: Actor, input: unknown) {
    const parsed = saveGoalSheetSchema.parse(input);
    const weightageError = validateWeightage(parsed.goals);

    if (weightageError) {
      throw new Error(weightageError);
    }

    return withTenant(actor.tenantId, async (tx) => {
      let goalSheet = await tx.goalSheet.findFirst({
        where: {
          employeeId: actor.id,
          currentCycleId: parsed.cycleId ?? null,
        },
        include: { goals: true },
      });

      if (!goalSheet) {
        goalSheet = await tx.goalSheet.create({
          data: {
            employeeId: actor.id,
            tenantId: actor.tenantId,
            currentCycleId: parsed.cycleId ?? null,
          },
          include: { goals: true },
        });
      }

      if (goalSheet.locked) {
        throw new Error("Locked goals cannot be edited.");
      }

      if (!["DRAFT", "REJECTED", "RETURNED"].includes(goalSheet.status)) {
        throw new Error("Only draft, rejected, or returned goal sheets can be edited.");
      }

      const existingById = new Map(goalSheet.goals.map((g) => [g.id, g]));
      const incomingIds = parsed.goals.map((g) => g.id).filter(Boolean) as string[];

      // Soft or hard delete removed goals
      const toDelete = goalSheet.goals.filter(g => !incomingIds.includes(g.id) && !g.isShared);
      if (toDelete.length > 0) {
        await tx.goal.deleteMany({
          where: { id: { in: toDelete.map(g => g.id) } },
        });
        
        toDelete.forEach(g => {
          eventBus.publish({
            type: "GoalDeleted",
            tenantId: actor.tenantId,
            payload: { goalId: g.id, actorId: actor.id },
            timestamp: new Date()
          });
        });
      }

      for (const goal of parsed.goals) {
        const previous = goal.id ? existingById.get(goal.id) : null;

        if (previous?.isShared) {
          await tx.goal.update({
            where: { id: previous.id },
            data: { weightage: goal.weightage },
          });
          
          eventBus.publish({
             type: "GoalWeightageUpdated",
             tenantId: actor.tenantId,
             payload: { goalId: previous.id, newWeightage: goal.weightage, actorId: actor.id },
             timestamp: new Date()
          });
          continue;
        }

        const data = {
          title: goal.title,
          description: goal.description || "",
          thrustArea: goal.thrustArea,
          uomType: goal.uomType,
          metricDirection: goal.metricDirection,
          targetValue: goal.targetValue,
          weightage: goal.weightage,
          tenantId: actor.tenantId,
        };

        if (previous) {
          const updated = await tx.goal.update({
            where: { id: previous.id },
            data,
          });
          eventBus.publish({
             type: "GoalUpdated",
             tenantId: actor.tenantId,
             payload: { goalId: updated.id, changes: data, actorId: actor.id },
             timestamp: new Date()
          });
        } else {
          const created = await tx.goal.create({
            data: {
              ...data,
              goalSheetId: goalSheet!.id,
            },
          });
          eventBus.publish({
             type: "GoalCreated",
             tenantId: actor.tenantId,
             payload: { goalId: created.id, title: created.title, actorId: actor.id },
             timestamp: new Date()
          });
        }
      }

      return await tx.goalSheet.findUnique({
        where: { id: goalSheet.id },
        include: { goals: true },
      });
    });
  }
}
