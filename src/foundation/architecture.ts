import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * SYNCORA FOUNDATIONAL ARCHITECTURE & DESIGN LANGUAGE
 * ---------------------------------------------------
 * A complete departure from templated SaaS, AI-glitter, glassmorphism,
 * and boxed dashboard patterns. This foundation establishes a cinematic,
 * editorial, and highly intentional operational system.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const EditorialPalette = {
  // Absorbing, cinematic dark foundation (Replacing generic dark modes)
  graphite: {
    base: "#0A0A0C",
    surface: "#121215",
    elevated: "#1A1A1E",
    subtle: "#222227",
  },
  // Crisp, stark typography & surface highlights (Replacing generic white/gray)
  alabaster: {
    stark: "#FFFFFF",
    base: "#F4F4F6",
    muted: "#A1A1AA",
    dimmed: "#71717A",
  },
  // Architectural warm accents
  parchment: {
    base: "#E2DFD8",
    subtle: "#C9C6BF",
  },
  // Intentional, restrained signal tones (No neon glow, no crypto gradients)
  signal: {
    crimson: "#D9383A", // Variance / Alert / Drift
    cerulean: "#2B5B84", // Alignment / Active / Flow
    ochre: "#C8963E", // Pending / Governance Queue
    emerald: "#2D7D46", // Verified / Audit Lock
  },
  // Fine structural hairlines
  hairline: {
    base: "rgba(255, 255, 255, 0.08)",
    strong: "rgba(255, 255, 255, 0.16)",
  },
} as const

export const TypographySystem = {
  // High-contrast editorial anchors
  serif: {
    family: "var(--font-serif), Georgia, serif",
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
    },
  },
  // Brutalist / Geometric sans for narrative structure
  sans: {
    family: "var(--font-space-grotesk), system-ui, sans-serif",
    weights: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
  // High-precision telemetry & data alignment
  mono: {
    family: "var(--font-mono), monospace",
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
    },
  },
} as const

export const SpatialRhythm = {
  // Asymmetric macro-layout rhythms
  macro: {
    sidebarWidth: "320px",
    marginaliaWidth: "240px",
    containerMaxWidth: "1440px",
  },
  // Micro-spacing scale
  scale: {
    "3xs": "0.25rem",
    "2xs": "0.5rem",
    xs: "0.75rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2.5rem",
    xl: "4rem",
    "2xl": "6.5rem",
    "3xl": "10rem",
  },
} as const

export const MotionArchitecture = {
  // Weighty, deliberate, calm transitions (No springy bounce)
  curves: {
    cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
    curtain: "cubic-bezier(0.16, 1, 0.3, 1)",
    subtle: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  },
  durations: {
    quick: "200ms",
    base: "400ms",
    slow: "700ms",
    epic: "1200ms",
  },
} as const
