import "dotenv/config"
import { PrismaClient, Role } from "./generated/client"
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
  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: { password, role: Role.ADMIN, tenantId: organization.id },
    create: {
      name: "Admin User",
      email: "admin@test.com",
      password,
      role: Role.ADMIN,
      tenant: { connect: { id: organization.id } },
    },
  })

  // Labop69 Admin (User's primary demo account)
  await prisma.user.upsert({
    where: { email: "labop69@gmail.com" },
    update: { password, role: Role.ADMIN, tenantId: organization.id },
    create: {
      name: "Hardik (Admin)",
      email: "labop69@gmail.com",
      password,
      role: Role.ADMIN,
      tenant: { connect: { id: organization.id } },
    },
  })

  // Manager
  const manager = await prisma.user.upsert({
    where: { email: "manager@test.com" },
    update: { password, role: Role.MANAGER, tenantId: organization.id },
    create: {
      name: "Manager User",
      email: "manager@test.com",
      password,
      role: Role.MANAGER,
      tenant: { connect: { id: organization.id } },
    },
  })

  // Employee
  await prisma.user.upsert({
    where: { email: "employee@test.com" },
    update: { password, role: Role.EMPLOYEE, tenantId: organization.id, managerId: manager.id },
    create: {
      name: "Employee User",
      email: "employee@test.com",
      password,
      role: Role.EMPLOYEE,
      tenant: { connect: { id: organization.id } },
      manager: { connect: { id: manager.id } },
    },
  })

  // Super Admin
  await prisma.user.upsert({
    where: { email: "superadmin@test.com" },
    update: { password, role: Role.SUPER_ADMIN, tenantId: organization.id },
    create: {
      name: "Super Admin User",
      email: "superadmin@test.com",
      password,
      role: Role.SUPER_ADMIN,
      tenant: { connect: { id: organization.id } },
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