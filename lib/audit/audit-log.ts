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
  // Automatically resolve tenantId from actor to ensure multi-tenant isolation
  // Use prisma fallback if client is transaction client without user model exposed
  const db = (client as any).user ? client : prisma;
  const user = await (db as any).user.findUnique({
    where: { id: actorId },
    select: { tenantId: true },
  });
  const tenantId = user?.tenantId || "default-tenant-id";

  return client.auditLog.create({
    data: {
      actorId,
      tenantId,
      entityType,
      entityId,
      action,
      previousData: previousData ?? undefined,
      newData: newData ?? undefined,
    },
  });
}
