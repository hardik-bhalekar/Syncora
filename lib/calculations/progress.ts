import type { MetricDirection, ProgressStatus } from "@prisma/client"

type ProgressInput = {
  direction: MetricDirection
  targetValue: number
  actualValue: number
  plannedValue?: number
  deadlineAt?: Date | string | null
  completionAt?: Date | string | null
  cycleStartAt?: Date | string | null
}

export function calculateProgressPercentage({
  direction,
  targetValue,
  actualValue,
  plannedValue,
  deadlineAt,
  completionAt,
  cycleStartAt,
}: ProgressInput) {
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
    const deadline = toDate(deadlineAt)
    const completion = toDate(completionAt) ?? new Date()
    const cycleStart = toDate(cycleStartAt)

    if (actualValue <= 0) {
      return 0
    }

    if (!deadline) {
      return plannedValue && plannedValue > 0 ? clamp((plannedValue / Math.max(actualValue, 1)) * 100) : 100
    }

    if (completion <= deadline) {
      return 100
    }

    const normalizedStart = cycleStart ?? new Date(deadline.getTime() - 90 * 24 * 60 * 60 * 1000)
    const timelineSpan = Math.max(deadline.getTime() - normalizedStart.getTime(), 24 * 60 * 60 * 1000)
    const lateness = Math.max(completion.getTime() - deadline.getTime(), 0)
    const progress = 100 - (lateness / timelineSpan) * 100

    return clamp(progress)
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

function toDate(value?: Date | string | null) {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
