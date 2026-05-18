import { PrismaClient } from "@/prisma/generated/client"

const globalForPrisma = globalThis as unknown as {
  prismaV2: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prismaV2 ??
  new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaV2 = prisma
}

/**
 * Executes a callback within a transaction where the PostgreSQL session variable
 * 'app.tenant_id' is set. This enables Row-Level Security (RLS) enforcement.
 */
export async function withTenant<T>(
  tenantId: string,
  callback: (tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    // Set the tenant context for this transaction
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, TRUE)`;
    
    // Execute the business logic within the same transaction
    return await callback(tx);
  });
}