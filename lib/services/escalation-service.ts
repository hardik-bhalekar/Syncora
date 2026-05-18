import type { EscalationLevel, EscalationStatus, EscalationType, Prisma, PrismaClient } from "@prisma/client"

type DbClient = PrismaClient | Prisma.TransactionClient

type EscalationInput = {
  tenantId: string
  employeeId: string
  managerId?: string | null
  type: EscalationType
  level?: EscalationLevel
  reason: string
  relatedEntityId?: string | null
  relatedEntityType?: string | null
}

export async function createEscalation(client: DbClient, input: EscalationInput) {
  return client.escalation.create({
    data: {
      tenantId: input.tenantId,
      employeeId: input.employeeId,
      managerId: input.managerId ?? null,
      type: input.type,
      level: input.level ?? "MANAGER",
      reason: input.reason,
      relatedEntityId: input.relatedEntityId ?? null,
      relatedEntityType: input.relatedEntityType ?? null,
      status: "ACTIVE",
    },
  })
}

export async function resolveEscalation(client: DbClient, tenantId: string, escalationId: string, status: EscalationStatus = "RESOLVED") {
  return client.escalation.updateMany({
    where: { id: escalationId, tenantId },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
  })
}