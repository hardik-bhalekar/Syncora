import { z } from "zod"

export const checkInSchema = z.object({
  goalId: z.string(),
  quarter: z.enum(["Q1", "Q2", "Q3", "Q4"]),
  plannedValue: z.coerce.number().min(0),
  actualValue: z.coerce.number().min(0),
})

export const checkInCommentSchema = z.object({
  checkInId: z.string(),
  comment: z.string().trim().min(2).max(1000),
})
