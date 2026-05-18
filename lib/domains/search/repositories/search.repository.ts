import { prisma, withTenant } from "@/lib/prisma";
import { appLogger } from "@/lib/observability/logger";

/**
 * Enterprise Search Platform
 * Phase 1: PostgreSQL Full-Text Search (FTS) and pgvector readiness.
 */

export interface SearchResult {
  id: string;
  type: "GOAL" | "USER" | "CYCLE";
  title: string;
  subtitle?: string;
  score?: number;
}

export class SearchRepository {
  /**
   * Performs a cross-domain, full-text search scoped to the tenant.
   * Utilizes PostgreSQL native FTS.
   */
  static async globalSearch(tenantId: string, query: string): Promise<SearchResult[]> {
    appLogger.info("Executing global search", { tenantId, query });

    // Formatting query for Postgres FTS (tsquery format)
    const formattedQuery = query.trim().split(/\s+/).join(' | ');
    if (!formattedQuery) return [];

    return withTenant(tenantId, async (tx) => {
      // Search Goals (Title and Description)
      // Note: We use executeRaw for advanced tsvector ranking
      const goals: any[] = await tx.$queryRaw`
        SELECT 
          id, 
          'GOAL' as type, 
          title, 
          description as subtitle,
          ts_rank(
            setweight(to_tsvector('english', title), 'A') || 
            setweight(to_tsvector('english', coalesce(description, '')), 'B'),
            to_tsquery('english', ${formattedQuery})
          ) as rank
        FROM "Goal"
        WHERE "tenantId" = ${tenantId}
          AND (
            to_tsvector('english', title) @@ to_tsquery('english', ${formattedQuery}) OR
            to_tsvector('english', coalesce(description, '')) @@ to_tsquery('english', ${formattedQuery})
          )
        ORDER BY rank DESC
        LIMIT 10;
      `;

      // In a unified search engine, we'd UNION ALL with Users, Cycles, etc.
      // For now, map the raw DB rows to the SearchResult DTO.
      return goals.map(g => ({
        id: g.id,
        type: g.type,
        title: g.title,
        subtitle: g.subtitle,
        score: g.rank
      }));
    });
  }

  /**
   * Phase 2 Readiness: Semantic/Vector Search
   * This stub prepares for pgvector embedding searches.
   */
  static async vectorSearch(tenantId: string, embedding: number[]): Promise<SearchResult[]> {
    // Stub for vector similarity search
    // await tx.$queryRaw`SELECT id FROM "Goal" ORDER BY embedding <-> ${embedding}::vector LIMIT 5`;
    return [];
  }
}
