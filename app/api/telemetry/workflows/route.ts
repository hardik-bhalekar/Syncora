import { NextResponse } from "next/server"
import { getWorkflowLogs, clearWorkflowLogs } from "@/lib/services/workflow-store"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({ logs: getWorkflowLogs() })
}

export async function DELETE() {
  clearWorkflowLogs()
  return NextResponse.json({ success: true })
}
