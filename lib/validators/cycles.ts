import { z } from "zod"

export const cycleSchema = z
  .object({
    name: z.string().trim().min(3).max(120),
    quarter: z.enum(["Q1", "Q2", "Q3", "Q4"]),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isActive: z.coerce.boolean().default(false),
  })
  .refine((value) => value.endDate > value.startDate, {
    message: "Cycle end date must be after the start date.",
    path: ["endDate"],
  })
