/**
 * SYNCORA INTERACTIVE CARD
 * ------------------------
 * Embedded 21st.dev tactile hover states, ethereal shadows, and
 * spring physics for telemetry panels and actionable bento cards.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion/springs";

export interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  withGlow?: boolean;
  layoutId?: string;
}

export const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ className, withGlow = true, layoutId, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        layoutId={layoutId}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={springs.calm}
        className={cn(
          "relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] p-6 transition-shadow cursor-pointer group",
          withGlow && "hover:shadow-[var(--shadow-ethereal-emerald)] hover:border-white/20",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
InteractiveCard.displayName = "InteractiveCard";
