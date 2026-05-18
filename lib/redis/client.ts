import { Redis } from '@upstash/redis';

/**
 * Enterprise Redis Infrastructure Setup
 * Utilizing Upstash for serverless/edge compatibility.
 */

// We use process.env to ensure it connects correctly in production.
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://mock-redis.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'mock-token',
});

/**
 * Cache invalidation tags and TTL constants
 */
export const CACHE_TTL = {
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
};

export class CacheManager {
  /**
   * Generates a deterministic cache key.
   */
  static generateKey(namespace: string, tenantId: string, resourceId?: string) {
    if (resourceId) {
      return `${namespace}:${tenantId}:${resourceId}`;
    }
    return `${namespace}:${tenantId}`;
  }

  /**
   * Get an item from the cache.
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      return await redis.get<T>(key);
    } catch (error) {
      console.error(`[Redis] Cache miss/error for ${key}`, error);
      return null;
    }
  }

  /**
   * Set an item in the cache with a specific TTL.
   */
  static async set(key: string, value: any, ttlSeconds: number = CACHE_TTL.HOUR) {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      console.error(`[Redis] Failed to set cache for ${key}`, error);
    }
  }

  /**
   * Invalidate a specific cache key.
   */
  static async invalidate(key: string) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`[Redis] Failed to invalidate cache for ${key}`, error);
    }
  }

  /**
   * Invalidate multiple keys by pattern (expensive, use sparingly).
   */
  static async invalidatePattern(pattern: string) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error(`[Redis] Failed to invalidate pattern ${pattern}`, error);
    }
  }
}
