import type { Role } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export async function getDashboardAnalytics(actorId: string, role: Role) {
  const employeeFilter = role === "ADMIN" ? {} : role === "MANAGER" ? { employee: { managerId: actorId } } : { employeeId: actorId }

  const [goalSheets, checkIns, auditLogs] = await Promise.all([
    prisma.goalSheet.findMany({
      where: employeeFilter,
      include: { employee: true, goals: { include: { checkIns: true } }, currentCycle: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.checkIn.findMany({
      where: role === "EMPLOYEE" ? { goal: { goalSheet: { employeeId: actorId } } } : role === "MANAGER" ? { goal: { goalSheet: { employee: { managerId: actorId } } } } : {},
      include: { goal: { include: { goalSheet: { include: { employee: true } } } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.auditLog.findMany({
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

  return {
    totalSheets,
    approvedSheets,
    submittedSheets,
    completionRate: totalSheets ? Math.round((approvedSheets / totalSheets) * 100) : 0,
    averageProgress,
    goalSheets,
    checkIns,
    auditLogs,
  }
}

export function goalSheetsToCsv(goalSheets: Awaited<ReturnType<typeof getDashboardAnalytics>>["goalSheets"]) {
  const rows = [
    ["Employee", "Email", "Status", "Locked", "Cycle", "Goals", "Weightage"],
    ...goalSheets.map((sheet) => [
      sheet.employee.name,
      sheet.employee.email,
      sheet.status,
      sheet.locked ? "Yes" : "No",
      sheet.currentCycle?.name ?? "No active cycle",
      String(sheet.goals.length),
      String(sheet.goals.reduce((sum, goal) => sum + goal.weightage, 0)),
    ]),
  ]

  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
}
