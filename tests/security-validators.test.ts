import assert from "node:assert/strict"
import test from "node:test"
import { goalInputSchema, saveGoalSheetSchema, approvalSchema, unlockGoalSheetSchema } from "@/lib/validators/goals"

test("Security Validator: goalInputSchema enforces string lengths and numeric boundaries", () => {
  // Valid payload
  const validGoal = {
    title: "Quarterly Revenue Growth",
    description: "Expand enterprise sales pipeline by 25% in Q3",
    thrustArea: "Sales & Expansion",
    uomType: "PERCENTAGE",
    metricDirection: "HIGHER_IS_BETTER",
    targetValue: 25,
    weightage: 30,
  }
  const parsed = goalInputSchema.safeParse(validGoal)
  assert.equal(parsed.success, true)

  // Malicious / Invalid payload: title too short, negative target, excessive weightage
  const invalidGoal = {
    title: "ab", // min 3 required
    description: "short",
    thrustArea: "X", // min 2 required, but 1 char
    uomType: "INVALID_UOM",
    metricDirection: "HIGHER_IS_BETTER",
    targetValue: -50, // positive required
    weightage: 150, // max 100
  }
  const invalidParsed = goalInputSchema.safeParse(invalidGoal)
  assert.equal(invalidParsed.success, false)
})

test("Security Validator: saveGoalSheetSchema validates goal count limits", () => {
  // Exceeds 8 goals limit
  const excessiveGoals = Array.from({ length: 9 }, (_, i) => ({
    title: `Goal ${i + 1}`,
    description: "Valid description text",
    thrustArea: "Core Operations",
    uomType: "NUMERIC_MAX",
    metricDirection: "HIGHER_IS_BETTER",
    targetValue: 100,
    weightage: 12,
  }))

  const parsed = saveGoalSheetSchema.safeParse({ goals: excessiveGoals })
  assert.equal(parsed.success, false)
})

test("Security Validator: approvalSchema validates manager review payloads", () => {
  const validApproval = {
    goalSheetId: "sheet_12345",
    comment: "Excellent alignment with Q3 OKRs.",
    goals: [
      { id: "goal_1", weightage: 50 },
      { id: "goal_2", targetValue: 200 },
    ],
  }
  const parsed = approvalSchema.safeParse(validApproval)
  assert.equal(parsed.success, true)

  // Invalid approval payload (missing sheet ID, invalid weightage edit)
  const invalidApproval = {
    goalSheetId: "", // empty string
    goals: [{ id: "goal_1", weightage: 5 }], // min 10 required
  }
  const invalidParsed = approvalSchema.safeParse(invalidApproval)
  assert.equal(invalidParsed.success, false)
})

test("Security Validator: unlockGoalSheetSchema enforces mandatory reason string", () => {
  const validUnlock = {
    goalSheetId: "sheet_999",
    reason: "Executive restructuring requires Q3 KPI adjustments.",
  }
  assert.equal(unlockGoalSheetSchema.safeParse(validUnlock).success, true)

  const invalidUnlock = {
    goalSheetId: "sheet_999",
    reason: "ab", // min 3 chars required
  }
  assert.equal(unlockGoalSheetSchema.safeParse(invalidUnlock).success, false)
})
