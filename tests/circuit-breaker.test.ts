import assert from "node:assert/strict"
import test from "node:test"
import { CircuitBreaker, withRetry } from "@/lib/reliability"

test("Reliability: CircuitBreaker executes primary action when closed", async () => {
  const breaker = new CircuitBreaker(3, 1000)
  const result = await breaker.execute(
    async () => "PRIMARY_SUCCESS",
    async () => "FALLBACK_SUCCESS"
  )
  assert.equal(result, "PRIMARY_SUCCESS")
})

test("Reliability: CircuitBreaker trips to OPEN state and executes fallback after failure threshold", async () => {
  const breaker = new CircuitBreaker(2, 5000)

  // Attempt 1: Fails
  await breaker.execute(
    async () => { throw new Error("Service Down") },
    async () => "FALLBACK_1"
  )

  // Attempt 2: Fails (Trips breaker)
  await breaker.execute(
    async () => { throw new Error("Service Down") },
    async () => "FALLBACK_2"
  )

  // Attempt 3: Circuit is OPEN, should immediately execute fallback without calling primary action
  let primaryCalled = false
  const fallbackResult = await breaker.execute(
    async () => {
      primaryCalled = true
      return "UNREACHABLE_PRIMARY"
    },
    async () => "FALLBACK_ACTIVE"
  )

  assert.equal(primaryCalled, false)
  assert.equal(fallbackResult, "FALLBACK_ACTIVE")
})

test("Reliability: withRetry succeeds on subsequent attempt with exponential backoff", async () => {
  let attempts = 0
  const result = await withRetry(
    async () => {
      attempts++
      if (attempts < 3) {
        throw new Error("Temporary Network Glitch")
      }
      return "RESOLVED_DATA"
    },
    3,
    10 // fast 10ms base delay for testing speed
  )

  assert.equal(attempts, 3)
  assert.equal(result, "RESOLVED_DATA")
})

test("Reliability: withRetry throws error if all attempts fail", async () => {
  let attempts = 0
  await assert.rejects(
    async () => {
      await withRetry(
        async () => {
          attempts++
          throw new Error("Fatal Outage")
        },
        2,
        10
      )
    },
    (err: any) => err.message === "Fatal Outage"
  )
  assert.equal(attempts, 2)
})
