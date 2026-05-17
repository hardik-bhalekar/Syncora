import assert from "node:assert/strict"
import test from "node:test"
import { calculateProgressPercentage } from "@/lib/calculations/progress"
import { validateWeightage } from "@/lib/validators/goals"

test("requires total weightage to equal exactly 100", () => {
  assert.equal(validateWeightage([{ weightage: 60 }, { weightage: 30 }]), "Total weightage must equal exactly 100%.")
  assert.equal(validateWeightage([{ weightage: 60 }, { weightage: 50 }]), "Total weightage must equal exactly 100%.")
  assert.equal(validateWeightage([{ weightage: 60 }, { weightage: 40 }]), null)
})

test("requires minimum weightage and maximum goal count", () => {
  assert.equal(validateWeightage([{ weightage: 95 }, { weightage: 5 }]), "Each goal must have a minimum weightage of 10%.")
  assert.equal(
    validateWeightage(Array.from({ length: 9 }, () => ({ weightage: 12 }))),
    "Maximum goals per employee is 8."
  )
})

test("calculates progress for supported metric directions", () => {
  assert.equal(calculateProgressPercentage({ direction: "HIGHER_IS_BETTER", targetValue: 100, actualValue: 50 }), 50)
  assert.equal(calculateProgressPercentage({ direction: "LOWER_IS_BETTER", targetValue: 20, actualValue: 40 }), 50)
  assert.equal(calculateProgressPercentage({ direction: "ZERO_BASED", targetValue: 0, actualValue: 0 }), 100)
  assert.equal(calculateProgressPercentage({ direction: "ZERO_BASED", targetValue: 0, actualValue: 1 }), 0)
})
