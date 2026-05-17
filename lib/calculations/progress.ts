import type { MetricDirection, ProgressStatus } from "@prisma/client"

type ProgressInput = {
  direction: MetricDirection
  targetValue: number
  actualValue: number
  plannedValue?: number
}

export function calculateProgressPercentage({ direction, targetValue, actualValue, plannedValue }: ProgressInput) {
  if (direction === "ZERO_BASED") {
    return actualValue === 0 ? 100 : 0
  }

  if (direction === "LOWER_IS_BETTER") {
    if (actualValue === 0) {
      return 100
    }

    return clamp((targetValue / actualValue) * 100)
  }

  if (direction === "TIMELINE") {
    if (!plannedValue || plannedValue <= 0) {
      return actualValue > 0 ? 100 : 0
    }

    return clamp((plannedValue / Math.max(actualValue, 1)) * 100)
  }

  if (targetValue === 0) {
    return 0
  }

  return clamp((actualValue / targetValue) * 100)
}

export function progressStatus(progressPercentage: number): ProgressStatus {
  if (progressPercentage >= 100) {
    return "COMPLETED"
  }

  if (progressPercentage >= 70) {
    return "ON_TRACK"
  }

  if (progressPercentage > 0) {
    return "AT_RISK"
  }

  return "NOT_STARTED"
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value * 100) / 100))
}
