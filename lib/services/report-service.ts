import type { Role } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { resolveActorContext } from "@/lib/services/tenant-context"

export async function getDashboardAnalytics(actorId: string, role: Role) {
  const context = await resolveActorContext(actorId)
  const employeeFilter =
    role === "ADMIN"
      ? { tenantId: context.tenantId }
      : role === "MANAGER"
        ? { tenantId: context.tenantId, employee: { managerId: actorId } }
        : { tenantId: context.tenantId, employeeId: actorId }

  const [goalSheets, checkIns, auditLogs] = await Promise.all([
    prisma.goalSheet.findMany({
      where: employeeFilter,
      include: { employee: true, goals: { include: { checkIns: true } }, currentCycle: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.checkIn.findMany({
      where:
        role === "EMPLOYEE"
          ? { tenantId: context.tenantId, goal: { goalSheet: { employeeId: actorId } } }
          : role === "MANAGER"
            ? { tenantId: context.tenantId, goal: { goalSheet: { employee: { managerId: actorId } } } }
            : { tenantId: context.tenantId },
      include: { goal: { include: { goalSheet: { include: { employee: true } } } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.auditLog.findMany({
      where: { tenantId: context.tenantId },
      take: 25,
      include: { actor: true },
      orderBy: { timestamp: "desc" },
    }),
  ])

  const totalSheets = goalSheets.length
  const approvedSheets = goalSheets.filter((sheet) => sheet.status === "APPROVED").length
  const submittedSheets = goalSheets.filter((sheet) => sheet.status === "SUBMITTED").length
  const averageProgress = checkIns.length
    ? Math.round(checkIns.reduce((sum, checkIn) => sum + checkIn.progressPercentage, 0) / checkIns.length)
    : 0
  const overdueSheets = goalSheets.filter((sheet) => sheet.status === "SUBMITTED" && sheet.submittedAt && Date.now() - sheet.submittedAt.getTime() > 3 * 24 * 60 * 60 * 1000)
  const pendingReviews = goalSheets.filter((sheet) => sheet.status === "SUBMITTED").length
  const quarterlyTrends = Array.from(new Set(checkIns.map((checkIn) => checkIn.quarter))).map((quarter) => {
    const quarterCheckIns = checkIns.filter((checkIn) => checkIn.quarter === quarter)
    return {
      quarter,
      averageProgress: quarterCheckIns.length
        ? Math.round(quarterCheckIns.reduce((sum, checkIn) => sum + checkIn.progressPercentage, 0) / quarterCheckIns.length)
        : 0,
      completed: quarterCheckIns.filter((checkIn) => checkIn.status === "COMPLETED").length,
    }
  })

  const goalDistribution = goalSheets.reduce<Record<string, number>>((acc, sheet) => {
    for (const goal of sheet.goals) {
      acc[goal.thrustArea] = (acc[goal.thrustArea] ?? 0) + 1
    }

    return acc
  }, {})

  return {
    totalSheets,
    approvedSheets,
    submittedSheets,
    completionRate: totalSheets ? Math.round((approvedSheets / totalSheets) * 100) : 0,
    averageProgress,
    overdueSheets: overdueSheets.length,
    pendingReviews,
    quarterlyTrends,
    goalDistribution,
    goalSheets,
    checkIns,
    auditLogs,
  }
}

export function goalSheetsToCsv(goalSheets: Awaited<ReturnType<typeof getDashboardAnalytics>>["goalSheets"]) {
  const rows = [
    ["Employee", "Email", "Status", "Locked", "Cycle", "Goals", "Weightage", "SubmittedAt"],
    ...goalSheets.map((sheet) => [
      sheet.employee.name,
      sheet.employee.email,
      sheet.status,
      sheet.locked ? "Yes" : "No",
      sheet.currentCycle?.name ?? "No active cycle",
      String(sheet.goals.length),
      String(sheet.goals.reduce((sum, goal) => sum + goal.weightage, 0)),
      sheet.submittedAt ? sheet.submittedAt.toISOString() : "",
    ]),
  ]

  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
}
