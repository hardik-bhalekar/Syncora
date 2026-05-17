/**
 * SYNCORA ADAPTIVE PANEL
 * ----------------------
 * Collapsible, contextual operational surface inspired by Attio and Raycast.
 * Keyboard-first responsiveness and smooth AnimatePresence spring heights.
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
          "bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden transition-colors",
          className
        )}
        {...props}
      >
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-6 py-4 cursor-pointer select-none bg-[var(--color-elevated)] border-b border-[var(--color-border)] hover:bg-[var(--color-subtle)] transition-colors"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-dimmed)]">
            {title}
          </span>
          <div className="flex items-center gap-4">
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
              transition={springs.calm}
            >
              <div className="p-6 border-t border-transparent">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
AdaptivePanel.displayName = "AdaptivePanel";
