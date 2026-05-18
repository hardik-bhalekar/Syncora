import { z } from "zod";

/**
 * Goal Domain Data Transfer Objects (DTOs)
 */

export const GoalCreateDTOSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  thrustArea: z.string(),
  uomType: z.enum(["NUMERIC_MIN", "NUMERIC_MAX", "PERCENTAGE", "TIMELINE", "ZERO_BASED"]),
  metricDirection: z.enum(["HIGHER_IS_BETTER", "LOWER_IS_BETTER", "ZERO_BASED", "TIMELINE"]),
  targetValue: z.number(),
  weightage: z.number().min(0).max(100),
  goalSheetId: z.string().cuid(),
});

export type GoalCreateDTO = z.infer<typeof GoalCreateDTOSchema>;

export const GoalUpdateDTOSchema = GoalCreateDTOSchema.partial().extend({
  status: z.enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "RETURNED"]).optional(),
});

export type GoalUpdateDTO = z.infer<typeof GoalUpdateDTOSchema>;

/**
 * Enterprise Aggregate Root Shape
 */
export interface GoalEntity {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  targetValue: number;
  weightage: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
