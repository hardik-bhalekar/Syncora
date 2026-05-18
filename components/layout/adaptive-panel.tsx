/**
 * SYNCORA CINEMATIC ADAPTIVE PANEL
 * --------------------------------
 * Collapsible, contextual operational surface inspired by Attio, Linear, and Raycast.
 * Features ultra-clean borders, smooth AnimatePresence spring heights, and premium typography.
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion/springs";

export interface AdaptivePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  defaultExpanded?: boolean;
  headerAction?: React.ReactNode;
}

export const AdaptivePanel = React.forwardRef<HTMLDivElement, AdaptivePanelProps>(
  ({ className, title, defaultExpanded = true, headerAction, children, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[var(--color-surface)] border border-[var(--color-border-strong)] overflow-hidden transition-all duration-300 shadow-[var(--shadow-subtle)] group",
          className
        )}
        {...props}
      >
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-8 py-5 cursor-pointer select-none bg-[var(--color-elevated)] border-b border-[var(--color-border)] hover:bg-[var(--color-subtle)] transition-colors relative"
        >
          {/* Subtle top reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-dimmed)] group-hover:text-[var(--color-text-main)] transition-colors">
            {title}
          </span>
          <div className="flex items-center gap-6">
            {headerAction && <div onClick={(e) => e.stopPropagation()}>{headerAction}</div>}
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={springs.snappy}
              className="text-[var(--color-text-muted)] text-xs font-mono"
            >
              ▼
            </motion.span>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={springs.fluid}
            >
              <div className="p-8 border-t border-transparent bg-[var(--color-surface)]">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
AdaptivePanel.displayName = "AdaptivePanel";
