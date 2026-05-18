/**
 * SYNCORA CINEMATIC INTERACTIVE BUTTON
 * ------------------------------------
 * Premium liquid glass button featuring tactile hover scale transforms,
 * glowing ethereal box shadows, magnetic spring physics, and subtle micro-borders.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion/springs";
import { MagneticWrapper } from "@/components/ui/magnetic-wrapper";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "glass" | "glow";

type CleanButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration">;

export interface InteractiveButtonProps extends CleanButtonProps {
  variant?: ButtonVariant;
  withMagnetic?: boolean;
}

export const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ className, variant = "primary", withMagnetic = true, children, ...props }, ref) => {
    const button = (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={springs.snappy}
        className={cn(
          "relative inline-flex items-center justify-center font-sans text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] cursor-pointer min-h-[var(--touch-target-min)] px-6 py-3 select-none overflow-hidden rounded-none group tracking-wide",
          variant === "primary" && "bg-[var(--color-accent-primary)] text-white hover:bg-[#059669] shadow-[var(--shadow-ethereal-primary)] border border-white/20 hover:border-white/40",
          variant === "secondary" && "bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-main)] hover:bg-[var(--color-elevated)] shadow-[var(--shadow-subtle)] hover:border-white/30",
          variant === "ghost" && "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-subtle)]/50",
          variant === "destructive" && "bg-[var(--color-signal-crimson)] text-white hover:bg-[#DC2626] shadow-[0_0_25px_rgba(244,63,94,0.3)]",
          variant === "glass" && "glass-panel text-[var(--color-text-main)] hover:bg-white/10 hover:border-white/30 shadow-[var(--shadow-float)]",
          variant === "glow" && "bg-[var(--color-accent-primary)] text-white shadow-[var(--shadow-ethereal-primary)] hover:shadow-[0_0_40px_var(--color-accent-primary)] border border-white/30",
          className
        )}
        {...props}
      >
        {/* Subtle internal shine effect */}
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    );

    if (withMagnetic) {
      return <MagneticWrapper>{button}</MagneticWrapper>;
    }

    return button;
  }
);
InteractiveButton.displayName = "InteractiveButton";
