import { Role } from "@prisma/client";

/**
 * Enterprise Authorization Engine (Policy Engine)
 * Defines ABAC/RBAC rules centrally.
 */

export type AuthUser = {
  id: string;
  role: Role;
  tenantId: string;
};

export type Resource = {
  type: "Goal" | "GoalSheet" | "Cycle" | "TenantSettings" | "Billing";
  id?: string;
  tenantId?: string; // To check cross-tenant access
  ownerId?: string;  // To check ownership
  [key: string]: any;
};

export type Action = 
  | "read" 
  | "create" 
  | "update" 
  | "delete" 
  | "approve" 
  | "submit" 
  | "manage";

type PolicyCheck = {
  user: AuthUser;
  action: Action;
  resource: Resource;
};

export class AuthorizationEngine {
  /**
   * Main entry point for permission checks.
   * Throws ForbiddenError if denied, or returns a boolean.
   */
  static can({ user, action, resource }: PolicyCheck): boolean {
    // 1. Tenant Boundary Check (Hard Stop)
    if (resource.tenantId && resource.tenantId !== user.tenantId) {
      if (user.role !== "SUPER_ADMIN") {
        return false;
      }
    }

    // 2. Super Admin Override
    if (user.role === "SUPER_ADMIN") {
      return true;
    }

    // 3. Delegate to resource-specific policies
    switch (resource.type) {
      case "Goal":
      case "GoalSheet":
        return this.evalGoalPolicy(user, action, resource);
      case "Cycle":
      case "TenantSettings":
        return this.evalAdminPolicy(user, action);
      default:
        return false; // Default deny
    }
  }

  private static evalGoalPolicy(user: AuthUser, action: Action, resource: Resource): boolean {
    if (user.role === "ADMIN") return true; // Admins can manage all goals in tenant

    if (action === "read") {
      // Assuming a transparent org, anyone in tenant can read. 
      // If strict, we'd check if user.id === resource.ownerId || user is manager of owner.
      return true; 
    }

    if (["create", "update", "delete", "submit"].includes(action)) {
      // Must own the resource to edit it
      return user.id === resource.ownerId;
    }

    if (action === "approve") {
      // Must be MANAGER of the owner (Manager hierarchy check should be resolved before calling `can`,
      // or we pass a boolean `isManagerOfOwner` in the resource meta).
      return user.role === "MANAGER" && resource.isDirectReport === true;
    }

    return false;
  }

  private static evalAdminPolicy(user: AuthUser, action: Action): boolean {
    // Only tenant admins can manage cycles and settings
    if (action === "read") return true;
    return user.role === "ADMIN";
  }
}
