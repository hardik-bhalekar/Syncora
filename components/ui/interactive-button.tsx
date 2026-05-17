/**
 * SYNCORA INTERACTIVE BUTTON
 * --------------------------
 * Tactile hover scale transforms (scale: 0.98 press / scale: 1.01 hover)
 * combined with ethereal box shadows and magnetic spring physics.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion/springs";
import { MagneticWrapper } from "@/components/ui/magnetic-wrapper";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  withMagnetic?: boolean;
}

export const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ className, variant = "primary", withMagnetic = true, children, ...props }, ref) => {
    const button = (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={springs.snappy}
        className={cn(
          "relative inline-flex items-center justify-center font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-signal-emerald)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] cursor-pointer min-h-[var(--touch-target-min)] px-4 py-2 select-none overflow-hidden",
          variant === "primary" && "bg-[var(--color-signal-emerald)] text-white hover:bg-[#059669] shadow-[var(--shadow-ethereal-emerald)]",
          variant === "secondary" && "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-elevated)] shadow-[var(--shadow-subtle)]",
          variant === "ghost" && "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-subtle)]",
          variant === "destructive" && "bg-[var(--color-signal-crimson)] text-white hover:bg-[#DC2626]",
          className
        )}
        {...props}
      >
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
