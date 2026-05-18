/**
 * Enterprise Cinematic Motion Architecture
 * Defines the standard spring physics for the entire application.
 * Replaces generic ease/duration with intentional, natural physical behavior.
 */

import { Transition } from "framer-motion";

export const springs = {
  // Ultra-fluid, highly responsive spring for primary UI interactions (hover, click, layout shifts)
  fluid: {
    type: "spring",
    damping: 24,
    stiffness: 250,
    mass: 0.5,
  } as Transition,

  // Slower, elegant entrance for page-level structural reveals
  cinematic: {
    type: "spring",
    damping: 30,
    stiffness: 100,
    mass: 1.2,
  } as Transition,

  // Snappy, rigid spring for tight spaces (tooltips, small badges)
  snappy: {
    type: "spring",
    damping: 20,
    stiffness: 400,
    mass: 0.8,
  } as Transition,

  // Gentle, heavy spring for modal and sheet backdrops
  heavy: {
    type: "spring",
    damping: 40,
    stiffness: 80,
    mass: 2,
  } as Transition,
};
