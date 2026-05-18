import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys/factory";
import { GoalsSdk, CreateGoalInput, Goal } from "../../frontend-sdk/goals";

/**
 * Enterprise Frontend Query Pipeline
 * Implements optimistic updates, cache invalidation, and rollback handling.
 */
export function useCreateGoalMutation(employeeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newGoal: CreateGoalInput) => GoalsSdk.createDraft(newGoal),
    
    // 1. Optimistic Update (Immediate UI response)
    onMutate: async (newGoal) => {
      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.goals.workspace(employeeId) });

      // Snapshot the previous value for rollback
      const previousWorkspace = queryClient.getQueryData(queryKeys.goals.workspace(employeeId));

      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.goals.workspace(employeeId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          goalSheet: {
            ...old.goalSheet,
            goals: [
              ...old.goalSheet.goals,
              { ...newGoal, id: `optimistic-${Date.now()}`, status: "DRAFT", isOptimistic: true }
            ]
          }
        };
      });

      // Return context object with the snapshotted value
      return { previousWorkspace };
    },
    
    // 2. Rollback on Error
    onError: (err, newGoal, context) => {
      if (context?.previousWorkspace) {
        queryClient.setQueryData(queryKeys.goals.workspace(employeeId), context.previousWorkspace);
      }
    },
    
    // 3. Revalidate & Settle on Success/Error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.workspace(employeeId) });
    },
  });
}
