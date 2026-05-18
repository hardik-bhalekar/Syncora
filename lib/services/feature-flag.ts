import * as LaunchDarkly from 'launchdarkly-node-server-sdk';

/**
 * Enterprise Feature Flag Service
 * Uses LaunchDarkly for tenant-based progressive rollouts.
 */
class FeatureFlagService {
  private client: LaunchDarkly.LDClient;
  private isInitialized = false;

  constructor() {
    // In dev mode or when LD_SDK_KEY is missing, we use offline mode
    const sdkKey = process.env.LD_SDK_KEY || 'mock-key';
    
    this.client = LaunchDarkly.init(sdkKey, {
      offline: !process.env.LD_SDK_KEY,
    });

    this.client.once('ready', () => {
      this.isInitialized = true;
      console.log('[FeatureFlag] LaunchDarkly client initialized');
    });
  }

  /**
   * Evaluates a feature flag for a specific tenant and user context.
   */
  async getFlag(flagKey: string, tenantId: string, userId?: string, defaultValue: any = false): Promise<any> {
    await this.client.waitForInitialization();

    // Create a multi-context targeting the tenant, and optionally the user
    const context: LaunchDarkly.LDContext = {
      kind: 'multi',
      tenant: {
        key: tenantId,
        // You could pass additional tenant attributes here like plan_type
      }
    };

    if (userId) {
      // @ts-ignore
      context.user = {
        key: userId
      };
    }

    return this.client.variation(flagKey, context, defaultValue);
  }

  /**
   * Closes the LD client gracefully during shutdown
   */
  async close() {
    await this.client.close();
  }
}

export const featureFlags = new FeatureFlagService();
