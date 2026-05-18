"use client"

import { useCallback, useState, useEffect } from "react"
import { Terminal, Bell, Mail, MessageSquare, CheckCircle2, AlertCircle, RefreshCw, Trash2, Maximize2, Minimize2, ExternalLink } from "lucide-react"

type WorkflowLog = {
  id: string
  timestamp: string
  type: "TEAMS_WEBHOOK" | "EMAIL"
  recipient: string
  subjectOrTitle: string
  payload: any
  status: "SUCCESS" | "SIMULATED" | "ERROR"
}

export function WorkflowInspector() {
  const [logs, setLogs] = useState<WorkflowLog[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState<WorkflowLog | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/telemetry/workflows")
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (e) {
      console.error("Failed to fetch workflow logs", e)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearLogs = async () => {
    try {
      await fetch("/api/telemetry/workflows", { method: "DELETE" })
      setLogs([])
      setSelectedLog(null)
    } catch (e) {
      console.error("Failed to clear logs", e)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchLogs, 0)
    const interval = setInterval(fetchLogs, 5000)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [fetchLogs])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Collapsed Badge / Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center gap-3 bg-[var(--color-graphite-elevated)]/90 backdrop-blur-xl border border-[var(--hairline-strong)] hover:border-[var(--color-signal-cerulean)] p-3 shadow-2xl transition-all duration-300 group cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <Terminal className="w-4 h-4 text-[var(--color-signal-cerulean)] group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-signal-cerulean)] animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-signal-cerulean)]" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-mono text-[10px] text-[var(--color-alabaster-muted)] uppercase tracking-wider">
            ENTERPRISE TELEMETRY
          </span>
          <span className="font-mono text-xs font-bold text-[var(--color-alabaster-stark)] flex items-center gap-2">
            Workflows & Integrations
            <span className="px-1.5 py-0.2 bg-[var(--color-signal-cerulean)]/20 text-[var(--color-signal-cerulean)] text-[10px] border border-[var(--color-signal-cerulean)]/30">
              {logs.length} LIVE
            </span>
          </span>
        </div>
        {isOpen ? <Minimize2 className="w-4 h-4 text-[var(--color-alabaster-muted)] ml-2" /> : <Maximize2 className="w-4 h-4 text-[var(--color-alabaster-muted)] ml-2" />}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="pointer-events-auto mt-3 w-[650px] max-w-[90vw] max-h-[70vh] bg-[var(--color-graphite-elevated)]/95 backdrop-blur-2xl border border-[var(--hairline-strong)] shadow-2xl flex flex-col animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--hairline-strong)] px-6 py-4 bg-[var(--color-graphite-base)]/50">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[var(--color-signal-cerulean)] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <span className="font-mono text-xs font-bold text-[var(--color-alabaster-stark)] tracking-wider uppercase">
                DISPATCHED WORKFLOW TELEMETRY
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/10 text-[var(--color-alabaster-muted)] hover:text-[var(--color-alabaster-stark)] transition-colors cursor-pointer"
                title="Refresh Logs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={clearLogs}
                className="p-1.5 hover:bg-[var(--color-signal-crimson)]/20 border border-transparent hover:border-[var(--color-signal-crimson)] text-[var(--color-alabaster-muted)] hover:text-[var(--color-signal-crimson)] transition-colors cursor-pointer"
                title="Clear Logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex overflow-hidden min-h-[350px]">
            {/* Logs List */}
            <div className="w-1/2 border-r border-[var(--hairline-strong)] overflow-y-auto divide-y divide-[var(--hairline-base)]">
              {logs.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center text-[var(--color-alabaster-muted)] h-full">
                  <Bell className="w-8 h-8 mb-3 opacity-20" />
                  <span className="font-mono text-xs">No workflows dispatched yet.</span>
                  <span className="font-mono text-[10px] opacity-60 mt-1">Submit or review a goal sheet to trigger Teams webhooks & Emails.</span>
                </div>
              ) : (
                logs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`w-full text-left p-4 transition-colors flex flex-col gap-2 cursor-pointer ${
                      selectedLog?.id === log.id
                        ? "bg-[var(--color-signal-cerulean)]/10 border-l-2 border-[var(--color-signal-cerulean)]"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {log.type === "TEAMS_WEBHOOK" ? (
                          <MessageSquare className="w-3.5 h-3.5 text-[#0078D4]" />
                        ) : (
                          <Mail className="w-3.5 h-3.5 text-[#10B981]" />
                        )}
                        <span className="font-mono text-xs font-bold text-[var(--color-alabaster-stark)]">
                          {log.type === "TEAMS_WEBHOOK" ? "Teams Webhook" : "Email Notification"}
                        </span>
                      </div>
                      {log.status === "SUCCESS" && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                      {log.status === "SIMULATED" && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[var(--color-signal-cerulean)]/20 text-[var(--color-signal-cerulean)] border border-[var(--color-signal-cerulean)]/30 uppercase">
                          Simulated
                        </span>
                      )}
                      {log.status === "ERROR" && <AlertCircle className="w-3.5 h-3.5 text-[var(--color-signal-crimson)]" />}
                    </div>

                    <div className="font-mono text-xs text-[var(--color-alabaster-stark)] truncate">
                      {log.subjectOrTitle}
                    </div>

                    <div className="flex items-center justify-between font-mono text-[10px] text-[var(--color-alabaster-muted)]">
                      <span className="truncate max-w-[180px]">To: {log.recipient}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Log Detail / Inspection */}
            <div className="w-1/2 overflow-y-auto bg-[var(--color-graphite-base)]/30 p-6 flex flex-col">
              {selectedLog ? (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div className="font-mono text-[10px] text-[var(--color-alabaster-muted)] uppercase tracking-wider mb-1">
                      DISPATCH DESTINATION
                    </div>
                    <div className="font-mono text-xs text-[var(--color-alabaster-stark)] bg-[var(--color-graphite-elevated)] p-3 border border-[var(--hairline-strong)] flex items-center justify-between">
                      <span>{selectedLog.recipient}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--color-alabaster-muted)]" />
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] text-[var(--color-alabaster-muted)] uppercase tracking-wider mb-1">
                      PAYLOAD & ADAPTIVE CARD INSPECTION
                    </div>
                    {selectedLog.type === "EMAIL" ? (
                      <div className="bg-white text-black p-4 border border-[var(--hairline-strong)] max-h-[250px] overflow-y-auto text-xs font-sans shadow-inner">
                        <div dangerouslySetInnerHTML={{ __html: selectedLog.payload.html }} />
                      </div>
                    ) : (
                      <pre className="font-mono text-[11px] text-[var(--color-alabaster-stark)] bg-[var(--color-graphite-elevated)] p-4 border border-[var(--hairline-strong)] overflow-x-auto max-h-[250px]">
                        {JSON.stringify(selectedLog.payload, null, 2)}
                      </pre>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[var(--hairline-strong)] flex items-center justify-between text-[10px] font-mono text-[var(--color-alabaster-muted)]">
                    <span>STATUS: {selectedLog.status}</span>
                    <span>ID: {selectedLog.id}</span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-alabaster-muted)] text-center">
                  <Terminal className="w-8 h-8 mb-3 opacity-20" />
                  <span className="font-mono text-xs">Select a workflow log to inspect payload.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
