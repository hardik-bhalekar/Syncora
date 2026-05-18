import { ApiClient } from "../core/client";

/**
 * Enterprise Frontend SDK - Goals Domain
 */

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
  targetValue: number;
  weightage: number;
}

export interface CreateGoalInput {
  goalSheetId: string;
  title: string;
  description?: string;
  targetValue: number;
  weightage: number;
  thrustArea: string;
  uomType: string;
  metricDirection: string;
}

export class GoalsSdk {
  /**
   * Fetches the current employee workspace (goals, active cycle, goal sheet).
   */
  static async getWorkspace(employeeId: string) {
    return ApiClient.get<{ activeCycle: any; goalSheet: any }>(
      `/goals/workspace?employeeId=${employeeId}`
    );
  }

  /**
   * Creates a new goal draft.
   */
  static async createDraft(input: CreateGoalInput) {
    return ApiClient.post<Goal>("/goals", input);
  }

  /**
   * Updates an existing goal.
   */
  static async updateGoal(id: string, updates: Partial<CreateGoalInput>) {
    return ApiClient.put<Goal>(`/goals/${id}`, updates);
  }

  /**
   * Submits a goalsheet for manager approval.
   */
  static async submitGoalSheet(goalSheetId: string) {
    return ApiClient.post<{ status: string }>(`/goals/sheet/${goalSheetId}/submit`, {});
  }
}
