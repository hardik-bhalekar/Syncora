export type WorkflowLog = {
  id: string
  timestamp: string
  type: "TEAMS_WEBHOOK" | "EMAIL"
  recipient: string
  subjectOrTitle: string
  payload: any
  status: "SUCCESS" | "SIMULATED" | "ERROR"
}

declare global {
  var workflowLogs: WorkflowLog[] | undefined
}

if (!globalThis.workflowLogs) {
  globalThis.workflowLogs = []
}

export function getWorkflowLogs(): WorkflowLog[] {
  return globalThis.workflowLogs || []
}

export function clearWorkflowLogs() {
  globalThis.workflowLogs = []
}

export function addWorkflowLog(log: Omit<WorkflowLog, "id" | "timestamp">) {
  const newLog: WorkflowLog = {
    ...log,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
  }
  if (!globalThis.workflowLogs) {
    globalThis.workflowLogs = []
  }
  globalThis.workflowLogs.unshift(newLog)
  // Keep last 50 logs
  if (globalThis.workflowLogs.length > 50) {
    globalThis.workflowLogs.pop()
  }
}
