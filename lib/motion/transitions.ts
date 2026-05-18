import { Variants } from "framer-motion";
import { springs } from "./springs";

/**
 * Common Stagger Choreography
 * Creates flowing, cascading animations for lists and grids.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemReveal: Variants = {
  hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: springs.fluid,
  },
};

/**
 * Standard Layout Transitions
 */
export const fadeTransition: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
};

export const slideUpTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: springs.cinematic },
  exit: { opacity: 0, y: 10, transition: { duration: 0.15, ease: "easeIn" } },
};
