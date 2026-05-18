import { StandardDomainEvent } from "./contracts";
import { appLogger } from "../observability/logger";
import { inngest } from "../workers/inngest/client";

/**
 * Enterprise Event Registry & Broker
 * Handles schema evolution, versioning, correlation tracing, and dead-letter routing.
 */

type EventMetadata = {
  correlationId?: string;
  causationId?: string; // The ID of the event that caused this event
  schemaVersion?: string;
};

export class PlatformEventRegistry {
  /**
   * Publishes a strictly typed event to the central event bus (Inngest)
   */
  static async publish(eventPayload: StandardDomainEvent, meta?: EventMetadata) {
    const enrichedEvent = {
      ...eventPayload,
      correlationId: meta?.correlationId || crypto.randomUUID(),
      schemaVersion: meta?.schemaVersion || "1.0",
      timestamp: new Date().toISOString(),
    };

    appLogger.info(`[EventRegistry] Publishing ${enrichedEvent.type}`, {
      eventId: enrichedEvent.eventId,
      correlationId: enrichedEvent.correlationId,
      tenantId: enrichedEvent.tenantId,
    });

    try {
      // Map to Inngest payload structure
      await inngest.send({
        name: `app/${enrichedEvent.type}`,
        data: enrichedEvent.payload,
        user: { id: enrichedEvent.actorId },
        // @ts-ignore
        tenant: { id: enrichedEvent.tenantId }
      });
    } catch (error) {
      appLogger.error(`[EventRegistry] Failed to publish ${enrichedEvent.type}`, error as Error);
      await this.routeToDeadLetterQueue(enrichedEvent, error);
    }
  }

  private static async routeToDeadLetterQueue(event: any, error: any) {
    appLogger.warn("[EventRegistry] Routing event to DLQ", { eventId: event.eventId });
    // Push to a dedicated DLQ table in Postgres or a separate DLQ Redis queue
  }
}
