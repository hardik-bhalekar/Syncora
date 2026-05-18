/**
 * SYNCORA CINEMATIC BENTO GRID
 * ----------------------------
 * Asymmetrical, responsive CSS grid composition for telemetry bento boxes
 * and narrative feature highlights. Features premium noise diffusion,
 * ambient reflections, and ethereal hover glows.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, columns = 3, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-8",
          columns === 3 && "lg:grid-cols-3",
          columns === 4 && "lg:grid-cols-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BentoGrid.displayName = "BentoGrid";

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  glowColor?: "emerald" | "indigo" | "cerulean" | "amber" | "purple";
}

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ className, colSpan = 1, rowSpan = 1, glowColor = "emerald", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-none bg-[var(--color-surface)] border border-[var(--color-border-strong)] p-10 flex flex-col justify-between transition-all duration-500 group shadow-[var(--shadow-subtle)]",
          glowColor && "hover:border-[var(--color-accent-primary)]/50 hover:shadow-[var(--shadow-ethereal-primary)]",
          colSpan === 2 && "md:col-span-2",
          colSpan === 3 && "lg:col-span-3",
          rowSpan === 2 && "md:row-span-2",
          className
        )}
        {...props}
      >
        {/* Subtle noise diffusion */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Ambient top light reflection */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full">{children}</div>
      </div>
    );
  }
);
BentoCard.displayName = "BentoCard";
