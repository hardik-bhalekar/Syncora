import { z } from "zod";

/**
 * Enterprise Event Contract Standardization
 * Strictly typed schemas for all domain events across the platform.
 */

// ------------------------------------------------------
// Base Event Envelope
// ------------------------------------------------------
export const BaseEventSchema = z.object({
  eventId: z.string().uuid(),
  tenantId: z.string().cuid(),
  correlationId: z.string().uuid().optional(),
  actorId: z.string().cuid(),
  timestamp: z.string().datetime(),
  schemaVersion: z.string().default("1.0"),
});

// ------------------------------------------------------
// Domain Event Payloads
// ------------------------------------------------------

// 1. Goal Events
export const GoalCreatedEventSchema = BaseEventSchema.extend({
  type: z.literal("goal.created"),
  payload: z.object({
    goalId: z.string().cuid(),
    goalSheetId: z.string().cuid(),
    title: z.string(),
    weightage: z.number().min(0).max(100),
  }),
});

export const GoalUpdatedEventSchema = BaseEventSchema.extend({
  type: z.literal("goal.updated"),
  payload: z.object({
    goalId: z.string().cuid(),
    changes: z.record(z.string(), z.any()), // Can be strictly typed later
  }),
});

// 2. Check-In Events
export const CheckInCompletedEventSchema = BaseEventSchema.extend({
  type: z.literal("checkin.completed"),
  payload: z.object({
    checkInId: z.string().cuid(),
    goalId: z.string().cuid(),
    progressPercentage: z.number().min(0).max(100),
    status: z.enum(["NOT_STARTED", "AT_RISK", "ON_TRACK", "COMPLETED"]),
  }),
});

// 3. AI Intelligence Events
export const AIReviewGeneratedEventSchema = BaseEventSchema.extend({
  type: z.literal("ai.review.generated"),
  payload: z.object({
    goalId: z.string().cuid(),
    suggestedSMARTTitle: z.string(),
    confidenceScore: z.number().min(0).max(1),
  }),
});

// 4. Workflow / Escalation Events
export const EscalationTriggeredEventSchema = BaseEventSchema.extend({
  type: z.literal("escalation.triggered"),
  payload: z.object({
    entityId: z.string().cuid(),
    entityType: z.enum(["GOAL", "CHECKIN"]),
    reason: z.string(),
    escalatedToManagerId: z.string().cuid(),
  }),
});

// ------------------------------------------------------
// Union Type for Event Bus
// ------------------------------------------------------
export const DomainEventUnion = z.discriminatedUnion("type", [
  GoalCreatedEventSchema,
  GoalUpdatedEventSchema,
  CheckInCompletedEventSchema,
  AIReviewGeneratedEventSchema,
  EscalationTriggeredEventSchema,
]);

export type StandardDomainEvent = z.infer<typeof DomainEventUnion>;
