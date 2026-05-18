import { prisma } from "@/lib/prisma"
import { addWorkflowLog, getWorkflowLogs, clearWorkflowLogs, type WorkflowLog } from "./workflow-store"

export { getWorkflowLogs, clearWorkflowLogs, type WorkflowLog }

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://syncora.app"

// ============================================================================
// Teams Incoming Webhook & Adaptive Cards
// ============================================================================

export async function sendTeamsWebhook(
  title: string,
  summary: string,
  facts: { title: string; value: string }[],
  actionUrl: string,
  actionTitle: string = "Open Goal Sheet"
) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL

  // Construct Microsoft Teams Adaptive Card (v1.4)
  const adaptiveCard = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          msTeams: { width: "Full" },
          body: [
            {
              type: "Container",
              style: "emphasis",
              padding: { top: "large", bottom: "large", left: "large", right: "large" },
              items: [
                {
                  type: "TextBlock",
                  size: "Large",
                  weight: "Bolder",
                  text: title,
                  wrap: true,
                  color: "Accent",
                },
                {
                  type: "TextBlock",
                  size: "Medium",
                  weight: "Lighter",
                  text: summary,
                  wrap: true,
                  spacing: "Small",
                },
              ],
            },
            {
              type: "Container",
              padding: { top: "medium", bottom: "medium", left: "large", right: "large" },
              items: [
                {
                  type: "FactSet",
                  facts: facts.map((f) => ({ title: `${f.title}:`, value: f.value })),
                },
              ],
            },
          ],
          actions: [
            {
              type: "Action.OpenUrl",
              title: actionTitle,
              url: actionUrl,
              style: "positive",
            },
          ],
        },
      },
    ],
  }

  if (!webhookUrl) {
    console.log("[Teams Webhook Simulated]", JSON.stringify(adaptiveCard, null, 2))
    addWorkflowLog({
      type: "TEAMS_WEBHOOK",
      recipient: "Microsoft Teams Channel (Simulated)",
      subjectOrTitle: title,
      payload: adaptiveCard,
      status: "SIMULATED",
    })
    return { success: true, simulated: true }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adaptiveCard),
    })

    if (!response.ok) {
      throw new Error(`Teams webhook failed: ${response.statusText}`)
    }

    addWorkflowLog({
      type: "TEAMS_WEBHOOK",
      recipient: "Microsoft Teams Channel",
      subjectOrTitle: title,
      payload: adaptiveCard,
      status: "SUCCESS",
    })

    return { success: true, simulated: false }
  } catch (error: any) {
    console.error("[Teams Webhook Error]", error)
    addWorkflowLog({
      type: "TEAMS_WEBHOOK",
      recipient: "Microsoft Teams Channel",
      subjectOrTitle: title,
      payload: adaptiveCard,
      status: "ERROR",
    })
    return { success: false, error: error.message }
  }
}

// ============================================================================
// Email Automation (Resend / SendGrid)
// ============================================================================

export async function sendEmail(to: string, subject: string, htmlBody: string) {
  const resendKey = process.env.RESEND_API_KEY
  const sendgridKey = process.env.SENDGRID_API_KEY

  const cleanHtml = `
    <div style="font-family: 'Inter', monospace, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; color: #111; background-color: #fcfcfc; border: 1px solid #eaeaea;">
      <div style="border-bottom: 2px solid #0066cc; padding-bottom: 12px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #0066cc; font-size: 20px;">SYNCORA ENTERPRISE TELEMETRY</h2>
      </div>
      ${htmlBody}
      <div style="margin-top: 36px; padding-top: 12px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
        <p>This is an automated workflow notification from Syncora Goal Alignment Portal. Do not reply directly to this email.</p>
        <p>Microsoft Entra ID / Azure AD SSO Integration Active.</p>
      </div>
    </div>
  `

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Syncora Enterprise <notifications@syncora.app>",
          to,
          subject,
          html: cleanHtml,
        }),
      })
      if (!res.ok) throw new Error("Resend API error")
      addWorkflowLog({
        type: "EMAIL",
        recipient: to,
        subjectOrTitle: subject,
        payload: { html: cleanHtml, provider: "Resend" },
        status: "SUCCESS",
      })
      return { success: true, provider: "Resend" }
    } catch (e: any) {
      console.error("[Resend Error]", e)
      addWorkflowLog({
        type: "EMAIL",
        recipient: to,
        subjectOrTitle: subject,
        payload: { html: cleanHtml, error: e.message },
        status: "ERROR",
      })
      return { success: false, error: e.message }
    }
  } else if (sendgridKey) {
    try {
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: "notifications@syncora.app", name: "Syncora Enterprise" },
          subject,
          content: [{ type: "text/html", value: cleanHtml }],
        }),
      })
      if (!res.ok) throw new Error("SendGrid API error")
      addWorkflowLog({
        type: "EMAIL",
        recipient: to,
        subjectOrTitle: subject,
        payload: { html: cleanHtml, provider: "SendGrid" },
        status: "SUCCESS",
      })
      return { success: true, provider: "SendGrid" }
    } catch (e: any) {
      console.error("[SendGrid Error]", e)
      addWorkflowLog({
        type: "EMAIL",
        recipient: to,
        subjectOrTitle: subject,
        payload: { html: cleanHtml, error: e.message },
        status: "ERROR",
      })
      return { success: false, error: e.message }
    }
  } else {
    // Simulated Email
    console.log(`[Email Simulated to ${to}] Subject: ${subject}`)
    addWorkflowLog({
      type: "EMAIL",
      recipient: to,
      subjectOrTitle: subject,
      payload: { html: cleanHtml, provider: "Simulated" },
      status: "SIMULATED",
    })
    return { success: true, simulated: true }
  }
}

// ============================================================================
// High-Level Workflow Triggers
// ============================================================================

export async function triggerGoalSubmittedWorkflow(goalSheetId: string) {
  const goalSheet = await prisma.goalSheet.findUnique({
    where: { id: goalSheetId },
    include: {
      employee: { include: { manager: true } },
      currentCycle: true,
      goals: true,
    },
  })

  if (!goalSheet) return

  const employeeName = goalSheet.employee.name
  const manager = goalSheet.employee.manager
  const goalsCount = goalSheet.goals.length
  const cycleName = goalSheet.currentCycle?.name || "Active Cycle"
  const actionUrl = `${APP_URL}/dashboard/manager`

  // 1. Teams Webhook Notification
  await sendTeamsWebhook(
    "🔔 Goal Submission Pending Approval",
    `${employeeName} has submitted their goal sheet for ${cycleName}.`,
    [
      { title: "Employee", value: employeeName },
      { title: "Department / Role", value: goalSheet.employee.role },
      { title: "Goals Submitted", value: goalsCount.toString() },
      { title: "Review Deadline", value: "48 hours" },
    ],
    actionUrl,
    "Open Goal Sheet"
  )

  // 2. Email to Manager
  if (manager?.email) {
    const emailBody = `
      <h3 style="color: #333;">Goal Submission Pending Approval</h3>
      <p>Hello ${manager.name},</p>
      <p><strong>${employeeName}</strong> has submitted their goal sheet (${goalsCount} goals) for <strong>${cycleName}</strong> and is awaiting your review and approval.</p>
      <div style="margin: 24px 0;">
        <a href="${actionUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Open Goal Sheet</a>
      </div>
      <p style="color: #666; font-size: 14px;">Please review within 48 hours to maintain alignment SLAs.</p>
    `
    await sendEmail(manager.email, `Action Required: Goal Sheet Submitted by ${employeeName}`, emailBody)
  }
}

export async function triggerGoalReviewedWorkflow(goalSheetId: string, status: "APPROVED" | "REJECTED" | "RETURNED") {
  const goalSheet = await prisma.goalSheet.findUnique({
    where: { id: goalSheetId },
    include: {
      employee: { include: { manager: true } },
      currentCycle: true,
      goals: true,
    },
  })

  if (!goalSheet) return

  const employee = goalSheet.employee
  const managerName = employee.manager?.name || "Manager"
  const cycleName = goalSheet.currentCycle?.name || "Active Cycle"
  const actionUrl = `${APP_URL}/dashboard/employee`

  if (status === "APPROVED") {
    await sendTeamsWebhook(
      "✅ Goal Sheet Approved & Locked",
      `The goal sheet for ${employee.name} has been approved by ${managerName}.`,
      [
        { title: "Employee", value: employee.name },
        { title: "Manager", value: managerName },
        { title: "Cycle", value: cycleName },
        { title: "Status", value: "Approved & Locked" },
      ],
      actionUrl,
      "View Goal Sheet"
    )

    if (employee.email) {
      const emailBody = `
        <h3 style="color: #008800;">Goal Sheet Approved</h3>
        <p>Hello ${employee.name},</p>
        <p>Your goal sheet for <strong>${cycleName}</strong> has been fully approved by <strong>${managerName}</strong> and is now locked for the quarter.</p>
        <div style="margin: 24px 0;">
          <a href="${actionUrl}" style="background-color: #008800; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">View Goal Sheet</a>
        </div>
      `
      await sendEmail(employee.email, `✅ Your Goal Sheet has been Approved`, emailBody)
    }
  } else {
    const statusLabel = status === "REJECTED" ? "Rejected" : "Returned for Rework"
    await sendTeamsWebhook(
      `⚠️ Goal Sheet ${statusLabel}`,
      `The goal sheet for ${employee.name} was ${status?.toLowerCase()} by ${managerName}.`,
      [
        { title: "Employee", value: employee.name },
        { title: "Manager", value: managerName },
        { title: "Cycle", value: cycleName },
        { title: "Action Required", value: "Rework & Resubmit" },
      ],
      actionUrl,
      "Open Goal Sheet"
    )

    if (employee.email) {
      const emailBody = `
        <h3 style="color: #cc0000;">Goal Sheet ${statusLabel}</h3>
        <p>Hello ${employee.name},</p>
        <p>Your goal sheet for <strong>${cycleName}</strong> was ${status?.toLowerCase()} by <strong>${managerName}</strong>. Please review the comments and resubmit.</p>
        <div style="margin: 24px 0;">
          <a href="${actionUrl}" style="background-color: #cc0000; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Open Goal Sheet</a>
        </div>
      `
      await sendEmail(employee.email, `⚠️ Your Goal Sheet Requires Rework`, emailBody)
    }
  }
}

export async function triggerEscalationWorkflow(escalationId: string) {
  const escalation = await prisma.escalation.findUnique({
    where: { id: escalationId },
    include: {
      employee: true,
      manager: true,
    },
  })

  if (!escalation) return

  const employeeName = escalation.employee.name
  const managerName = escalation.manager?.name || "Unassigned"
  const actionUrl = `${APP_URL}/dashboard/admin`

  await sendTeamsWebhook(
    "🚨 SLA Escalation Triggered",
    `An automated SLA escalation has been triggered for ${employeeName}.`,
    [
      { title: "Employee", value: employeeName },
      { title: "Manager", value: managerName },
      { title: "Escalation Type", value: escalation.type },
      { title: "Escalation Level", value: escalation.level },
      { title: "Reason", value: escalation.reason },
    ],
    actionUrl,
    "View Escalation"
  )

  // Send email to Manager and Admin
  const recipients = [escalation.manager?.email, "admin@syncora.com"].filter(Boolean) as string[]
  for (const email of recipients) {
    const emailBody = `
      <h3 style="color: #cc0000;">🚨 Automated SLA Escalation Triggered</h3>
      <p>An escalation has been recorded in the Syncora portal.</p>
      <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 16px 0;">
        <tr style="border-bottom: 1px solid #eee;"><th style="padding: 8px 0;">Employee:</th><td>${employeeName}</td></tr>
        <tr style="border-bottom: 1px solid #eee;"><th style="padding: 8px 0;">Manager:</th><td>${managerName}</td></tr>
        <tr style="border-bottom: 1px solid #eee;"><th style="padding: 8px 0;">Type:</th><td>${escalation.type}</td></tr>
        <tr style="border-bottom: 1px solid #eee;"><th style="padding: 8px 0;">Level:</th><td>${escalation.level}</td></tr>
        <tr style="border-bottom: 1px solid #eee;"><th style="padding: 8px 0;">Reason:</th><td>${escalation.reason}</td></tr>
      </table>
      <div style="margin: 24px 0;">
        <a href="${actionUrl}" style="background-color: #cc0000; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">View Escalation Dashboard</a>
      </div>
    `
    await sendEmail(email, `🚨 SLA Escalation: ${employeeName} (${escalation.type})`, emailBody)
  }
}
