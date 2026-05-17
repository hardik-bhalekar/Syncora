/**
 * SYNCORA STAGGER GROUP
 * ---------------------
 * Orchestrates staggered child reveals (staggerChildren: 0.05)
 * for telemetry lists, bento cards, and marketing prose.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { staggerContainerVariants, fadeInVariants } from "@/lib/motion/springs";

export interface StaggerGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number;
  className?: string;
}

export const StaggerGroup = React.forwardRef<HTMLDivElement, StaggerGroupProps>(
  ({ className, staggerDelay = 0.05, children, ...props }, ref) => {
    const customVariants = React.useMemo(() => ({
      ...staggerContainerVariants,
      animate: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    }), [staggerDelay]);

    return (
      <motion.div
        ref={ref}
        variants={customVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerGroup.displayName = "StaggerGroup";

export interface StaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const StaggerItem = React.forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div ref={ref} variants={fadeInVariants} className={className} {...props}>
        {children}
      </motion.div>
    );
  }
);
StaggerItem.displayName = "StaggerItem";
