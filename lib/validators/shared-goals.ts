import { z } from "zod"

export const sharedGoalSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(3).max(1000),
  targetValue: z.coerce.number().positive(),
  thrustArea: z.string().trim().min(2).max(120),
  employeeIds: z.array(z.string()).min(1),
  localWeightage: z.coerce.number().min(10).max(100),
})

export const sharedGoalUpdateSchema = sharedGoalSchema.partial().extend({
  sharedGoalId: z.string(),
})
