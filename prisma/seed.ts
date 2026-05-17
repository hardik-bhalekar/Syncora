import "dotenv/config"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("password123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Avery Admin",
      email: "admin@demo.com",
      password,
      role: "ADMIN",
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: "manager@demo.com" },
    update: {},
    create: {
      name: "Morgan Manager",
      email: "manager@demo.com",
      password,
      role: "MANAGER",
    },
  })

  const employee = await prisma.user.upsert({
    where: { email: "employee@demo.com" },
    update: { managerId: manager.id },
    create: {
      name: "Emery Employee",
      email: "employee@demo.com",
      password,
      role: "EMPLOYEE",
      managerId: manager.id,
    },
  })

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 45)

  await prisma.cycle.updateMany({ data: { isActive: false } })
  const cycle = await prisma.cycle.create({
    data: {
      name: "FY26 Q1 Goal Cycle",
      quarter: "Q1",
      startDate,
      endDate,
      isActive: true,
    },
  })

  const sharedGoal = await prisma.sharedGoal.create({
    data: {
      ownerId: manager.id,
      title: "Improve customer onboarding activation",
      description: "Raise activation for newly onboarded enterprise customers through guided success motions.",
      targetValue: 82,
      thrustArea: "Customer Success",
      syncEnabled: true,
      assignments: {
        create: {
          employeeId: employee.id,
          localWeightage: 30,
        },
      },
    },
  })

  const sheet = await prisma.goalSheet.create({
    data: {
      employeeId: employee.id,
      currentCycleId: cycle.id,
      status: "APPROVED",
      submittedAt: new Date(),
      approvedAt: new Date(),
      locked: true,
      goals: {
        create: [
          {
            title: sharedGoal.title,
            description: sharedGoal.description,
            thrustArea: sharedGoal.thrustArea,
            uomType: "PERCENTAGE",
            metricDirection: "HIGHER_IS_BETTER",
            targetValue: sharedGoal.targetValue,
            weightage: 30,
            status: "APPROVED",
            isShared: true,
            sharedGoalId: sharedGoal.id,
          },
          {
            title: "Reduce support escalation turnaround",
            description: "Bring priority escalation turnaround below target through daily triage and better handoffs.",
            thrustArea: "Operational Excellence",
            uomType: "NUMERIC_MIN",
            metricDirection: "LOWER_IS_BETTER",
            targetValue: 24,
            weightage: 25,
            status: "APPROVED",
          },
          {
            title: "Launch enablement knowledge base",
            description: "Publish reusable enablement content for implementation teams and customer stakeholders.",
            thrustArea: "Enablement",
            uomType: "NUMERIC_MAX",
            metricDirection: "HIGHER_IS_BETTER",
            targetValue: 20,
            weightage: 25,
            status: "APPROVED",
          },
          {
            title: "Zero critical compliance misses",
            description: "Maintain clean controls for required quarterly compliance evidence.",
            thrustArea: "Governance",
            uomType: "ZERO_BASED",
            metricDirection: "ZERO_BASED",
            targetValue: 0,
            weightage: 20,
            status: "APPROVED",
          },
        ],
      },
    },
    include: { goals: true },
  })

  const activationGoal = sheet.goals.find((goal) => goal.sharedGoalId === sharedGoal.id)
  if (activationGoal) {
    await prisma.checkIn.create({
      data: {
        goalId: activationGoal.id,
        quarter: "Q1",
        plannedValue: 70,
        actualValue: 74,
        progressPercentage: 90.24,
        status: "ON_TRACK",
        submittedAt: new Date(),
        comments: {
          create: {
            managerId: manager.id,
            comment: "Strong early lift. Keep the onboarding playbook updates visible to the wider team.",
          },
        },
      },
    })
  }

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: employee.id,
        entityType: "GoalSheet",
        entityId: sheet.id,
        action: "SUBMIT_GOALS",
        newData: { status: "SUBMITTED" },
      },
      {
        actorId: manager.id,
        entityType: "GoalSheet",
        entityId: sheet.id,
        action: "APPROVE_GOALS",
        previousData: { status: "SUBMITTED", locked: false },
        newData: { status: "APPROVED", locked: true },
      },
      {
        actorId: manager.id,
        entityType: "SharedGoal",
        entityId: sharedGoal.id,
        action: "CREATE_SHARED_GOAL",
        newData: { title: sharedGoal.title, targetValue: sharedGoal.targetValue },
      },
      {
        actorId: admin.id,
        entityType: "Cycle",
        entityId: cycle.id,
        action: "CREATE_CYCLE",
        newData: { name: cycle.name, quarter: cycle.quarter, isActive: cycle.isActive },
      },
    ],
  })

  console.log("Seeded demo users: employee@demo.com, manager@demo.com, admin@demo.com")
  console.log("Password for all demo users: password123")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
