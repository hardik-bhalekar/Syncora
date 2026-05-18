/**
 * SYNCORA CINEMATIC INTERACTIVE CARD
 * ----------------------------------
 * Embedded 21st.dev tactile hover states, ethereal shadows, premium noise,
 * and spring physics for telemetry panels and actionable bento cards.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion/springs";

type CleanDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration">;

export interface InteractiveCardProps extends CleanDivProps {
  withGlow?: boolean;
  layoutId?: string;
  glowColor?: "emerald" | "indigo" | "cerulean" | "amber" | "purple";
}

export const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ className, withGlow = true, glowColor = "emerald", layoutId, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        layoutId={layoutId}
        whileHover={{ scale: 1.015, y: -4 }}
        whileTap={{ scale: 0.985 }}
        transition={springs.fluid}
        className={cn(
          "interactive-card relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border-strong)] p-8 transition-all duration-300 cursor-pointer group shadow-[var(--shadow-subtle)]",
          withGlow && "hover:shadow-[var(--shadow-ethereal-primary)] hover:border-[var(--color-accent-primary)]/50",
          className
        )}
        {...props}
      >
        {/* Subtle noise diffusion */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Ambient top light reflection */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
InteractiveCard.displayName = "InteractiveCard";
