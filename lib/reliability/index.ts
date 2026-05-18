import { appLogger } from "../observability/logger";

/**
 * Enterprise Reliability Engineering
 * Implements Circuit Breaker, Exponential Backoff, and Graceful Degradation.
 */

export class CircuitBreaker {
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private failureCount = 0;
  private nextAttempt = Date.now();

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly resetTimeoutMs: number = 30000
  ) {}

  /**
   * Wraps a remote call with circuit breaker protection.
   * Prevents cascading failures when a downstream service is down.
   */
  async execute<T>(action: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() > this.nextAttempt) {
        this.state = "HALF_OPEN";
      } else {
        appLogger.warn("Circuit is OPEN, executing fallback");
        return fallback();
      }
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      appLogger.error("Circuit action failed, executing fallback", error as Error);
      return fallback();
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.resetTimeoutMs;
      appLogger.warn("Circuit Breaker TRIPPED to OPEN state");
    }
  }
}

/**
 * Generic Exponential Backoff Retry Utility
 */
export async function withRetry<T>(
  action: () => Promise<T>, 
  maxAttempts: number = 3, 
  baseDelayMs: number = 500
): Promise<T> {
  let attempt = 1;
  while (attempt <= maxAttempts) {
    try {
      return await action();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      appLogger.warn(`Retry attempt ${attempt} failed, waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }
  throw new Error("Unreachable");
}
