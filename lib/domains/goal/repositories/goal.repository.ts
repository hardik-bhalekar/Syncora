import { IRepository } from "../../core/repository";
import { GoalCreateDTO, GoalUpdateDTO, GoalEntity } from "../contracts/goal.dto";
import { prisma, withTenant } from "@/lib/prisma";

export class GoalRepository implements IRepository<GoalEntity, GoalCreateDTO, GoalUpdateDTO> {
  async findById(tenantId: string, id: string): Promise<GoalEntity | null> {
    return withTenant(tenantId, async (tx) => {
      const goal = await tx.goal.findUnique({
        where: { id },
      });
      return goal as GoalEntity | null;
    });
  }

  async findMany(tenantId: string, params: { goalSheetId?: string; status?: string }): Promise<GoalEntity[]> {
    return withTenant(tenantId, async (tx) => {
      const goals = await tx.goal.findMany({
        where: {
          tenantId, // RLS handles this, but explicit filtering helps query planner
          ...(params.goalSheetId && { goalSheetId: params.goalSheetId }),
          ...(params.status && { status: params.status as any }),
        },
      });
      return goals as GoalEntity[];
    });
  }

  async create(tenantId: string, data: GoalCreateDTO): Promise<GoalEntity> {
    return withTenant(tenantId, async (tx) => {
      const created = await tx.goal.create({
        data: {
          ...data,
          tenantId,
          description: data.description || "",
        },
      });
      return created as GoalEntity;
    });
  }

  async update(tenantId: string, id: string, data: GoalUpdateDTO): Promise<GoalEntity> {
    return withTenant(tenantId, async (tx) => {
      const updated = await tx.goal.update({
        where: { id },
        data,
      });
      return updated as GoalEntity;
    });
  }

  async delete(tenantId: string, id: string): Promise<boolean> {
    return withTenant(tenantId, async (tx) => {
      await tx.goal.delete({
        where: { id },
      });
      return true;
    });
  }
}
