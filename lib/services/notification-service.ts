import type { NotificationType, Prisma, PrismaClient } from "@/prisma/generated/client"

type DbClient = PrismaClient | Prisma.TransactionClient

type NotificationInput = {
  tenantId: string
  userId: string
  type: NotificationType
  title: string
  message: string
}

export async function createNotification(client: DbClient, input: NotificationInput) {
  return client.notification.create({
    data: input,
  })
}

export async function listNotifications(client: DbClient, tenantId: string, userId: string) {
  return client.notification.findMany({
    where: { tenantId, userId },
    orderBy: { createdAt: "desc" },
  })
}

export async function markNotificationRead(client: DbClient, tenantId: string, userId: string, notificationId: string) {
  return client.notification.updateMany({
    where: { id: notificationId, tenantId, userId },
    data: { read: true },
  })
}