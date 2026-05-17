import { z } from "zod"

export const goalInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(3).max(1000),
  thrustArea: z.string().trim().min(2).max(120),
  uomType: z.enum(["NUMERIC_MIN", "NUMERIC_MAX", "PERCENTAGE", "TIMELINE", "ZERO_BASED"]),
  metricDirection: z.enum(["HIGHER_IS_BETTER", "LOWER_IS_BETTER", "ZERO_BASED", "TIMELINE"]),
  targetValue: z.coerce.number().positive(),
  weightage: z.coerce.number().min(10).max(100),
  sharedGoalId: z.string().optional().nullable(),
})

export const saveGoalSheetSchema = z.object({
  cycleId: z.string().optional().nullable(),
  goals: z.array(goalInputSchema).min(1).max(8),
})

export const submitGoalSheetSchema = z.object({
  goalSheetId: z.string(),
})

export const approvalSchema = z.object({
  goalSheetId: z.string(),
  comment: z.string().trim().max(1000).optional(),
  goals: z
    .array(
      z.object({
        id: z.string(),
        targetValue: z.coerce.number().positive().optional(),
        weightage: z.coerce.number().min(10).max(100).optional(),
      })
    )
    .optional(),
})

export const unlockGoalSheetSchema = z.object({
  goalSheetId: z.string(),
  reason: z.string().trim().min(3).max(1000),
})

export function validateWeightage(goals: Array<{ weightage: number }>) {
  if (goals.length > 8) {
    return "Maximum goals per employee is 8."
  }

  if (goals.some((goal) => goal.weightage < 10)) {
    return "Each goal must have a minimum weightage of 10%."
  }

  const total = goals.reduce((sum, goal) => sum + Number(goal.weightage), 0)
  if (Math.round(total * 100) / 100 !== 100) {
    return "Total weightage must equal exactly 100%."
  }

  return null
}
