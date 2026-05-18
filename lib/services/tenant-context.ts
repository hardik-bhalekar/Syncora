import { prisma } from "@/lib/prisma"

export async function resolveActorContext(actorId: string) {
  const user = await prisma.user.findUnique({
    where: { id: actorId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      tenantId: true,
      managerId: true,
    },
  })

  if (!user) {
    throw new Error("Actor not found.")
  }

  return user
}