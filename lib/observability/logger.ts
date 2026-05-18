import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Enterprise Observability Stack
 * Structured JSON logging with AsyncLocalStorage for request tracing.
 * 
 * In production, this can be swapped with Pino/Winston 
 * and exported to Datadog/Loki/Elasticsearch.
 */

export interface LogContext {
  requestId?: string;
  tenantId?: string;
  userId?: string;
  correlationId?: string;
}

const asyncLocalStorage = new AsyncLocalStorage<LogContext>();

export class Logger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Run a function within a specific logging context
   */
  static runWithContext<T>(context: LogContext, fn: () => T): T {
    return asyncLocalStorage.run(context, fn);
  }

  private formatMessage(level: string, message: string, meta?: Record<string, any>) {
    const context = asyncLocalStorage.getStore() || {};
    
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      ...context,
      ...meta,
    });
  }

  info(message: string, meta?: Record<string, any>) {
    console.info(this.formatMessage("INFO", message, meta));
  }

  warn(message: string, meta?: Record<string, any>) {
    console.warn(this.formatMessage("WARN", message, meta));
  }

  error(message: string, error?: Error, meta?: Record<string, any>) {
    console.error(this.formatMessage("ERROR", message, { 
      error: error?.message, 
      stack: error?.stack, 
      ...meta 
    }));
  }

  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.formatMessage("DEBUG", message, meta));
    }
  }
}

export const appLogger = new Logger("syncora-core");
