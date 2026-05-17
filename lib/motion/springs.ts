/**
 * SYNCORA MOTION PRIMITIVES & PHYSICS PROFILES
 * --------------------------------------------
 * Centralized Framer Motion physics definitions and choreographic variants.
 * Designed for calm, expensive, physically connected transitions.
 */

import type { Variants } from "framer-motion";

/* --- 1. PHYSICS SPRING PROFILES --- */

export const springs = {
  // Snappy / Direct: Quick, responsive, zero overshoot for operational controls.
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  // Calm / Cinematic: Smooth, elegant settling with a subtle luxurious glide.
  calm: {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1,
  },
  // Heavy / Grand: Conveys weight and importance for hero statements and modals.
  heavy: {
    type: "spring",
    stiffness: 80,
    damping: 15,
    mass: 1.5,
  },
} as const;

/* --- 2. CHOREOGRAPHIC VARIANTS --- */

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: springs.calm },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: springs.calm },
  exit: { opacity: 0, y: 12, transition: { duration: 0.2 } },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

export const scaleUpVariants: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: springs.calm },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};
