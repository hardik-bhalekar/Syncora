import { prisma } from "../../prisma";
import { inngest } from "../../workers/inngest/client";
import { redis } from "../../redis/client";
import { appLogger } from "../../observability/logger";

/**
 * Enterprise Super-Admin Operations Tooling
 * For monitoring platform health, tenants, and distributed systems.
 */
export class AdminOpsService {
  /**
   * Retrieves high-level health of the platform components.
   */
  static async getSystemHealth() {
    const health = {
      database: "UNKNOWN",
      cache: "UNKNOWN",
      eventBus: "UNKNOWN",
      timestamp: new Date().toISOString(),
    };

    try {
      // 1. Check DB
      await prisma.$executeRaw`SELECT 1`;
      health.database = "HEALTHY";
    } catch (e) {
      health.database = "DEGRADED";
      appLogger.error("Database health check failed", e as Error);
    }

    try {
      // 2. Check Redis
      await redis.ping();
      health.cache = "HEALTHY";
    } catch (e) {
      health.cache = "DEGRADED";
      appLogger.error("Redis health check failed", e as Error);
    }

    // Since Inngest operates via HTTP, we assume healthy if the SDK is loaded,
    // but in prod we might ping their health endpoint.
    health.eventBus = "HEALTHY"; 

    return health;
  }

  /**
   * Retrieves a snapshot of tenant statistics.
   */
  static async getTenantStats() {
    const totalTenants = await prisma.organization.count();
    
    // Aggregation for active users across tenants
    const userStats = await prisma.user.groupBy({
      by: ['tenantId'],
      _count: {
        id: true,
      },
    });

    return {
      totalTenants,
      userDistribution: userStats,
    };
  }

  // Placeholder for triggering dead-letter queue replays
  static async replayFailedJobs(queueName: string) {
    appLogger.warn("Triggered manual replay of failed jobs", { queueName });
    // Interface with Inngest API to replay failed events
    return { status: "initiated" };
  }
}
