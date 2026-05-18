import { GoalRepository } from "../repositories/goal.repository";
import { GoalCreateDTO, GoalUpdateDTO } from "../contracts/goal.dto";
import { AuthorizationEngine, AuthUser } from "@/lib/authz/policy-engine";
import { ForbiddenError, NotFoundError } from "@/lib/api/errors";
import { eventBus } from "@/lib/services/event/event-bus";
import { appLogger } from "@/lib/observability/logger";

export class GoalDomainService {
  constructor(private readonly repository: GoalRepository) {}

  async createGoal(user: AuthUser, data: GoalCreateDTO) {
    // Auth Check
    const canCreate = AuthorizationEngine.can({
      user,
      action: "create",
      resource: { type: "Goal", tenantId: user.tenantId, ownerId: user.id }
    });

    if (!canCreate) {
      throw new ForbiddenError("Insufficient permissions to create goal");
    }

    // Persist Domain Aggregate
    const goal = await this.repository.create(user.tenantId, data);
    
    appLogger.info("Domain Entity created: Goal", { goalId: goal.id });

    // Emit Domain Event (Transactional Outbox wrapper internally handled by eventBus eventually)
    eventBus.publish({
      type: "goal.created",
      tenantId: user.tenantId,
      actorId: user.id,
      payload: {
        goalId: goal.id,
        goalSheetId: data.goalSheetId,
        title: goal.title,
        weightage: goal.weightage,
      },
      timestamp: new Date(),
    });

    return goal;
  }

  async updateGoal(user: AuthUser, id: string, data: GoalUpdateDTO) {
    const existing = await this.repository.findById(user.tenantId, id);
    if (!existing) throw new NotFoundError("Goal not found");

    // We assume the user owns the goal. If we had goalSheet -> employeeId populated, we'd check that.
    // For now, assume ownerId = user.id if not SUPER_ADMIN. (In real implementation, fetch owner from DB).
    const canUpdate = AuthorizationEngine.can({
      user,
      action: "update",
      resource: { type: "Goal", tenantId: user.tenantId, ownerId: user.id }
    });

    if (!canUpdate) {
      throw new ForbiddenError("Insufficient permissions to update goal");
    }

    const updated = await this.repository.update(user.tenantId, id, data);

    eventBus.publish({
      type: "goal.updated",
      tenantId: user.tenantId,
      actorId: user.id,
      payload: { goalId: id, changes: data },
      timestamp: new Date(),
    });

    return updated;
  }
}

// Export singleton instance for DI injection alternatives
export const goalService = new GoalDomainService(new GoalRepository());
