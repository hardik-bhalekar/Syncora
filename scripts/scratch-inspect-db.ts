import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching database state...");

  const orgs = await prisma.organization.findMany({
    include: {
      _count: {
        select: {
          users: true,
          goalSheets: true,
          goals: true,
          sharedGoals: true,
          cycles: true,
        }
      }
    }
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      tenantId: true,
      managerId: true,
    }
  });

  const cycles = await prisma.cycle.findMany();

  const goalSheets = await prisma.goalSheet.findMany({
    include: {
      goals: true,
    }
  });

  const sharedGoals = await prisma.sharedGoal.findMany({
    select: {
      id: true,
      tenantId: true,
      ownerId: true,
      title: true,
      description: true,
      targetValue: true,
      thrustArea: true,
      syncEnabled: true,
      createdAt: true,
      updatedAt: true,
      assignments: true,
    }
  });

  const checkIns = await prisma.checkIn.findMany();

  const result = {
    organizations: orgs,
    users,
    cycles,
    goalSheets,
    sharedGoals,
    checkIns,
  };

  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch(e => {
    console.error("Error inspecting DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
