import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { Role } from "@prisma/client";

/**
 * Enterprise Auth/Session Orchestration (Phase 6)
 * Wraps next-auth's useSession to provide strict typing, tenant contexts, 
 * and RBAC-aware UI gates.
 */

export interface TenantSessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
}

export function useTenantSession() {
  const { data: session, status } = useSession();
  
  const user = session?.user as TenantSessionUser | undefined;

  const permissions = useMemo(() => {
    if (!user) return null;
    
    return {
      canManageSettings: user.role === "ADMIN" || user.role === "SUPER_ADMIN",
      canApproveGoals: user.role === "MANAGER" || user.role === "ADMIN",
      // Add fine-grained frontend feature gates here
      isManager: user.role === "MANAGER",
    };
  }, [user]);

  return {
    user,
    tenantId: user?.tenantId,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    permissions,
  };
}


