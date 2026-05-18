type FunctionConfig = {
  id: string
  retries?: number
  concurrency?: { limit: number }
}

type EventTrigger = { event: string } | { cron: string }

type WorkerContext = {
  event: { data: { tenantId: string; payload: Record<string, unknown> } }
  step: {
    run: <T>(name: string, fn: () => Promise<T>) => Promise<T>
  }
}

type WorkerHandler<T = unknown> = (context: WorkerContext) => Promise<T>

class LocalInngestClient {
  constructor(private readonly config: { id: string; eventKey: string }) {}

  createFunction<T>(config: FunctionConfig, trigger: EventTrigger, handler: WorkerHandler<T>) {
    return { config, trigger, handler }
  }

  async send(event: { name: string; data: unknown; user?: { id: string }; tenant?: { id: string } }) {
    return { ids: [`${this.config.id}:${event.name}`] }
  }
}

export const inngest = new LocalInngestClient({
  id: "syncora-core",
  eventKey: process.env.INNGEST_EVENT_KEY || "local",
})

export const CRITICAL_RETRY_POLICY = {
  retries: 5,
}

export const STANDARD_RETRY_POLICY = {
  retries: 3,
}
