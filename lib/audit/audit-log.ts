import type { AuditAction, Prisma, PrismaClient } from "@prisma/client"
import { prisma } from "@/lib/prisma"

type AuditClient = PrismaClient | Prisma.TransactionClient

type AuditInput = {
  actorId: string
  entityType: string
  entityId: string
  action: AuditAction
  previousData?: Prisma.InputJsonValue
  newData?: Prisma.InputJsonValue
  client?: AuditClient
}

export async function createAuditLog({
  actorId,
  entityType,
  entityId,
  action,
  previousData,
  newData,
  client = prisma,
}: AuditInput) {
  return client.auditLog.create({
    data: {
      actorId,
      entityType,
      entityId,
      action,
      previousData: previousData ?? undefined,
      newData: newData ?? undefined,
    },
  })
}
