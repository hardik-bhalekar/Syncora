import { prisma } from "../../prisma";

/**
 * Enterprise Tenant Configuration Engine
 * Manages per-tenant settings: workflows, reviews, scoring, branding, and policies.
 */

export interface BrandingConfig {
  primaryColor: string;
  logoUrl?: string;
  fontFamily?: string;
}

export interface WorkflowRules {
  requireManagerApprovalForSubmission: boolean;
  allowSelfEvaluation: boolean;
  maxGoalsPerSheet: number;
}

export interface TenantConfig {
  branding: BrandingConfig;
  workflow: WorkflowRules;
  features: Record<string, boolean>; // e.g. { "ai_review": true }
}

const DEFAULT_TENANT_CONFIG: TenantConfig = {
  branding: {
    primaryColor: "#000000",
  },
  workflow: {
    requireManagerApprovalForSubmission: true,
    allowSelfEvaluation: true,
    maxGoalsPerSheet: 5,
  },
  features: {},
};

export class TenantConfigEngine {
  /**
   * Retrieves full configuration for a tenant.
   * In production, this heavily leverages Redis caching with Pub/Sub invalidation.
   */
  static async getConfig(tenantId: string): Promise<TenantConfig> {
    // 1. Check Redis Cache
    // const cached = await redis.get(`tenant:config:${tenantId}`);
    // if (cached) return JSON.parse(cached);

    // 2. Fallback to DB (assuming we add a config JSON column or related tables)
    // For now, we mock DB retrieval.
    const config = { ...DEFAULT_TENANT_CONFIG };

    // 3. Set Cache
    // await redis.set(`tenant:config:${tenantId}`, JSON.stringify(config), 'EX', 3600);

    return config;
  }

  /**
   * Checks a specific workflow rule for a tenant.
   */
  static async evaluateRule<K extends keyof WorkflowRules>(
    tenantId: string, 
    rule: K
  ): Promise<WorkflowRules[K]> {
    const config = await this.getConfig(tenantId);
    return config.workflow[rule];
  }
}
