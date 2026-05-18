import { inngest, CRITICAL_RETRY_POLICY, STANDARD_RETRY_POLICY } from "./client";
import { aiIntelligence } from "../../services/ai/intelligence";
import { appLogger } from "../../observability/logger";

/**
 * Enterprise Background Worker Functions
 * Handles resilient, asynchronous processing off the main request thread.
 */

// 1. AI Processing Worker
export const processGoalAI = inngest.createFunction(
  { 
    id: "process-goal-ai", 
    ...STANDARD_RETRY_POLICY,
    concurrency: {
      limit: 10, // Avoid rate limiting on OpenAI
    }
  },
  { event: "app/goal.created" },
  async ({ event, step }) => {
    const { tenantId, payload } = event.data;
    const goalId = String(payload.goalId ?? "");
    const title = String(payload.title ?? "");
    
    appLogger.info("Starting AI processing for goal", { tenantId, goalId });

    await step.run("generate-smart-insights", async () => {
      // In a real implementation, we inject the AI logic directly here or call the service
      await aiIntelligence.rewriteGoal(tenantId, title);
    });

    return { status: "success", goalId };
  }
);

// 2. Notification Delivery Worker
export const deliverNotification = inngest.createFunction(
  { 
    id: "deliver-notification",
    ...CRITICAL_RETRY_POLICY
  },
  { event: "app/notification.triggered" },
  async ({ event, step }) => {
    const { tenantId, payload } = event.data;

    // E.g., send via Resend / SendGrid
    await step.run("send-email", async () => {
      appLogger.info("Simulating email delivery", { tenantId, userId: String(payload.userId ?? "") });
    });

    return { status: "delivered" };
  }
);

// 3. Nightly Analytics Aggregation (Scheduled Job)
export const aggregateAnalytics = inngest.createFunction(
  { id: "aggregate-tenant-analytics" },
  { cron: "TZ=UTC 0 0 * * *" }, // Run daily at midnight UTC
  async ({ step }) => {
    await step.run("calculate-org-health", async () => {
      appLogger.info("Running nightly analytics aggregation");
      // Heavy DB read/write operation for computed metrics
    });
  }
);

export const workerFunctions = [
  processGoalAI,
  deliverNotification,
  aggregateAnalytics
];
