/**
 * Enterprise Query Key Factory
 * Standardizes cache keys for TanStack Query to prevent cache collisions and enable targeted invalidation.
 */

export const queryKeys = {
  // Goal Domain
  goals: {
    all: ["goals"] as const,
    workspace: (employeeId: string) => ["goals", "workspace", employeeId] as const,
    detail: (id: string) => ["goals", "detail", id] as const,
    lists: () => ["goals", "list"] as const,
    list: (filters: string) => ["goals", "list", { filters }] as const,
  },
  
  // Analytics Domain
  analytics: {
    all: ["analytics"] as const,
    tenantKPIs: (quarter: string) => ["analytics", "kpi", quarter] as const,
  },

  // Auth Domain
  auth: {
    session: ["auth", "session"] as const,
    permissions: ["auth", "permissions"] as const,
  }
};
