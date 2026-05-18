/**
 * SYNCORA STAGGER GROUP
 * ---------------------
 * Orchestrates staggered child reveals (staggerChildren: 0.05)
 * for telemetry lists, bento cards, and marketing prose.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItemReveal } from "@/lib/motion/transitions";

type CleanDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration">;

export interface StaggerGroupProps extends CleanDivProps {
  staggerDelay?: number;
  className?: string;
}

export const StaggerGroup = React.forwardRef<HTMLDivElement, StaggerGroupProps>(
  ({ className, staggerDelay = 0.05, children, ...props }, ref) => {
    const customVariants = React.useMemo(() => ({
      ...staggerContainer,
      show: {
        ...staggerContainer.show,
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
        initial="hidden"
        animate="show"
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

export interface StaggerItemProps extends CleanDivProps {
  className?: string;
}

export const StaggerItem = React.forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div ref={ref} variants={staggerItemReveal} className={className} {...props}>
        {children}
      </motion.div>
    );
  }
);
StaggerItem.displayName = "StaggerItem";
