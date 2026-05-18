import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("password123", 10)
  const organization = await prisma.organization.upsert({
    where: { domain: "goal-sync.local" },
    update: { name: "Goal Sync Demo Org", plan: "ENTERPRISE" },
    create: {
      name: "Goal Sync Demo Org",
      domain: "goal-sync.local",
      plan: "ENTERPRISE",
    },
  })

  // Admin
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@test.com",
      password,
      role: Role.ADMIN,
      tenant: { connect: { id: organization.id } },
    },
  })

  // Manager
  const manager = await prisma.user.create({
    data: {
      name: "Manager User",
      email: "manager@test.com",
      password,
      role: Role.MANAGER,
      tenant: { connect: { id: organization.id } },
    },
  })

  // Employee
  await prisma.user.create({
    data: {
      name: "Employee User",
      email: "employee@test.com",
      password,
      role: Role.EMPLOYEE,
      tenant: { connect: { id: organization.id } },
      manager: { connect: { id: manager.id } },
    },
  })

  console.log("Seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })