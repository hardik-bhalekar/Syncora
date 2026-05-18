/**
 * Enterprise Event Bus
 * 
 * Abstracted layer to handle domain events. 
 * In a production environment, this wraps Kafka (for durable, ordered events) 
 * or NATS (for low-latency fan-out). 
 * 
 * For development/prototyping, we use a simple asynchronous emitter.
 */

export type DomainEvent = {
  type: string;
  tenantId: string;
  actorId?: string;
  payload: any;
  timestamp: Date;
};

type EventHandler = (event: DomainEvent) => Promise<void>;

class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Subscribe to a specific domain event.
   */
  subscribe(eventType: string, handler: EventHandler) {
    const existing = this.handlers.get(eventType) || [];
    this.handlers.set(eventType, [...existing, handler]);
    console.log(`[EventBus] Subscribed to ${eventType}`);
  }

  /**
   * Publish a domain event to the bus.
   * This is fire-and-forget to decouple from the main request lifecycle.
   */
  publish(event: DomainEvent) {
    console.log(`[EventBus] Publishing event: ${event.type} for tenant: ${event.tenantId}`);
    
    const handlers = this.handlers.get(event.type) || [];
    
    // Execute asynchronously (non-blocking)
    setImmediate(() => {
      handlers.forEach(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          console.error(`[EventBus] Error handling event ${event.type}:`, error);
          // In prod: forward to Dead Letter Queue (DLQ)
        }
      });
    });
  }
}

// Singleton instance for the application
export const eventBus = new EventBus();
