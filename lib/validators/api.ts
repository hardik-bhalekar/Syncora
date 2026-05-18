import { z } from "zod";

/**
 * Enterprise API Validators (DTOs)
 * Standardizing incoming requests and query parameters.
 */

export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const DateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const TenantQuerySchema = z.object({
  tenantId: z.string().cuid(),
});

/**
 * Common standard request structures
 */
export const GetListRequestSchema = PaginationSchema.merge(DateRangeSchema).extend({
  status: z.string().optional(),
  query: z.string().optional(), // for search
});

export type GetListRequestDTO = z.infer<typeof GetListRequestSchema>;
