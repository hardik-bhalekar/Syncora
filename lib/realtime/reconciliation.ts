import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/hooks/use-presence";
import { queryKeys } from "../query/keys/factory";
import { appLogger } from "../observability/logger";

/**
 * Enterprise Realtime Reconciliation Engine
 * Subscribes to Postgres CDC (via Supabase Realtime) and reconciles 
 * incoming domain events directly into the TanStack Query cache.
 */

export function useRealtimeSync(tenantId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tenantId) return;

    appLogger.info("Initializing Realtime Sync Engine", { tenantId });

    // Listen to changes scoped to this tenant's rows
    const channel = supabase.channel(`db-changes:${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'Goal',
          filter: `tenantId=eq.${tenantId}`
        },
        (payload) => {
          appLogger.info("Realtime Postgres Change Detected", { payload });
          
          // Reconcile cache instead of full refetch to preserve cinematic UX
          const { eventType, new: newRecord, old: oldRecord } = payload;
          const workspaceKey = queryKeys.goals.workspace((newRecord as any).employeeId || (oldRecord as any)?.employeeId);

          queryClient.setQueryData(workspaceKey, (oldCache: any) => {
            if (!oldCache) return oldCache;

            let updatedGoals = [...oldCache.goalSheet.goals];

            if (eventType === 'INSERT') {
              updatedGoals.push(newRecord);
            } else if (eventType === 'UPDATE') {
              updatedGoals = updatedGoals.map(g => g.id === newRecord.id ? newRecord : g);
            } else if (eventType === 'DELETE') {
              updatedGoals = updatedGoals.filter(g => g.id !== oldRecord.id);
            }

            return {
              ...oldCache,
              goalSheet: {
                ...oldCache.goalSheet,
                goals: updatedGoals
              }
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId, queryClient]);
}
