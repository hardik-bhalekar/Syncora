import "dotenv/config"
import { PrismaClient, Role } from "./generated/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("Demo@123", 10)

  // 1. Organization
  const organization = await prisma.organization.upsert({
    where: { domain: "syncora.com" },
    update: { name: "Syncora Enterprise", plan: "ENTERPRISE" },
    create: {
      name: "Syncora Enterprise",
      domain: "syncora.com",
      plan: "ENTERPRISE",
    },
  })

  // 2. Admin
  await prisma.user.upsert({
    where: { email: "admin@syncora.com" },
    update: { password, role: Role.ADMIN, tenantId: organization.id, name: "Admin User" },
    create: {
      name: "Admin User",
      email: "admin@syncora.com",
      password,
      role: Role.ADMIN,
      tenant: { connect: { id: organization.id } },
    },
  })

  // User's primary demo account
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

  // 3. Manager
  const manager = await prisma.user.upsert({
    where: { email: "manager@syncora.com" },
    update: { password, role: Role.MANAGER, tenantId: organization.id, name: "Manager User" },
    create: {
      name: "Manager User",
      email: "manager@syncora.com",
      password,
      role: Role.MANAGER,
      tenant: { connect: { id: organization.id } },
    },
  })

  // 4. Employee 1 (Approved Goal Sheet + Completed Check-in)
  const employee1 = await prisma.user.upsert({
    where: { email: "employee@syncora.com" },
    update: { password, role: Role.EMPLOYEE, tenantId: organization.id, managerId: manager.id, name: "Employee User" },
    create: {
      name: "Employee User",
      email: "employee@syncora.com",
      password,
      role: Role.EMPLOYEE,
      tenant: { connect: { id: organization.id } },
      manager: { connect: { id: manager.id } },
    },
  })

  // 5. Employee 2 (Pending Approval Goal Sheet)
  const employee2 = await prisma.user.upsert({
    where: { email: "employee2@syncora.com" },
    update: { password, role: Role.EMPLOYEE, tenantId: organization.id, managerId: manager.id, name: "Alex (Pending Employee)" },
    create: {
      name: "Alex (Pending Employee)",
      email: "employee2@syncora.com",
      password,
      role: Role.EMPLOYEE,
      tenant: { connect: { id: organization.id } },
      manager: { connect: { id: manager.id } },
    },
  })

  // Super Admin
  await prisma.user.upsert({
    where: { email: "superadmin@syncora.com" },
    update: { password, role: Role.SUPER_ADMIN, tenantId: organization.id },
    create: {
      name: "Super Admin User",
      email: "superadmin@syncora.com",
      password,
      role: Role.SUPER_ADMIN,
      tenant: { connect: { id: organization.id } },
    },
  })

  // 6. Active Cycle
  const cycle = await prisma.cycle.findFirst({
    where: { tenantId: organization.id, isActive: true },
  }) ?? await prisma.cycle.create({
    data: {
      tenantId: organization.id,
      name: "Q3 2026 Review Cycle",
      quarter: "Q3",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-09-30"),
      isActive: true,
    },
  })

  // 7. Shared Goal
  const sharedGoal = await prisma.sharedGoal.findFirst({
    where: { tenantId: organization.id, title: "Expand Enterprise Market Share by 25%" },
  }) ?? await prisma.sharedGoal.create({
    data: {
      tenantId: organization.id,
      ownerId: manager.id,
      title: "Expand Enterprise Market Share by 25%",
      description: "Drive cross-functional enterprise adoption and secure key strategic accounts.",
      targetValue: 25,
      thrustArea: "Strategic Growth",
      syncEnabled: true,
    },
  })

  // Clean existing goal sheets for these employees in this cycle to avoid conflicts
  await prisma.goalSheet.deleteMany({
    where: {
      tenantId: organization.id,
      employeeId: { in: [employee1.id, employee2.id] },
      currentCycleId: cycle.id,
    },
  })

  // 8. Employee 1 Goal Sheet (APPROVED)
  const sheet1 = await prisma.goalSheet.create({
    data: {
      tenantId: organization.id,
      employeeId: employee1.id,
      currentCycleId: cycle.id,
      status: "APPROVED",
      submittedAt: new Date(),
      approvedAt: new Date(),
      locked: true,
      goals: {
        create: [
          {
            tenantId: organization.id,
            title: "Achieve 100% SLA Compliance for Enterprise Clients",
            description: "Maintain zero downtime and resolve P1 tickets within 15 minutes.",
            thrustArea: "Customer Success",
            uomType: "PERCENTAGE",
            metricDirection: "HIGHER_IS_BETTER",
            targetValue: 100,
            weightage: 40,
            status: "APPROVED",
          },
          {
            tenantId: organization.id,
            title: "Close 5 Enterprise Deals in Q3",
            description: "Lead technical discovery and POCs for tier-1 prospects.",
            thrustArea: "Sales Alignment",
            uomType: "NUMERIC_MAX",
            metricDirection: "HIGHER_IS_BETTER",
            targetValue: 5,
            weightage: 30,
            status: "APPROVED",
          },
          {
            tenantId: organization.id,
            title: "Expand Enterprise Market Share by 25%",
            description: "Drive cross-functional enterprise adoption.",
            thrustArea: "Strategic Growth",
            uomType: "PERCENTAGE",
            metricDirection: "HIGHER_IS_BETTER",
            targetValue: 25,
            weightage: 30,
            status: "APPROVED",
            isShared: true,
            sharedGoalId: sharedGoal.id,
          },
        ],
      },
    },
    include: { goals: true },
  })

  // Add completed check-in for Goal 1 of Employee 1
  const firstGoal = sheet1.goals[0]
  const checkin = await prisma.checkIn.create({
    data: {
      tenantId: organization.id,
      goalId: firstGoal.id,
      quarter: "Q3",
      plannedValue: 100,
      actualValue: 100,
      progressPercentage: 100,
      status: "COMPLETED",
      submittedAt: new Date(),
    },
  })

  await prisma.checkInComment.create({
    data: {
      managerId: manager.id,
      checkInId: checkin.id,
      comment: "Outstanding performance on SLA targets. Flawless execution.",
    },
  })

  // 9. Employee 2 Goal Sheet (SUBMITTED / PENDING APPROVAL)
  await prisma.goalSheet.create({
    data: {
      tenantId: organization.id,
      employeeId: employee2.id,
      currentCycleId: cycle.id,
      status: "SUBMITTED",
      submittedAt: new Date(),
      locked: false,
      goals: {
        create: [
          {
            tenantId: organization.id,
            title: "Migrate Legacy Services to Kubernetes",
            description: "Complete containerization and CI/CD pipeline automation.",
            thrustArea: "Infrastructure",
            uomType: "PERCENTAGE",
            metricDirection: "HIGHER_IS_BETTER",
            targetValue: 100,
            weightage: 60,
            status: "SUBMITTED",
          },
          {
            tenantId: organization.id,
            title: "Reduce Cloud Infrastructure Costs by 15%",
            description: "Optimize auto-scaling groups and eliminate idle resources.",
            thrustArea: "Cost Optimization",
            uomType: "PERCENTAGE",
            metricDirection: "HIGHER_IS_BETTER",
            targetValue: 15,
            weightage: 40,
            status: "SUBMITTED",
          },
        ],
      },
    },
  })

  console.log("Seeded demo accounts and hackathon data successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })