/**
 * SYNCORA BENTO GRID
 * ------------------
 * Asymmetrical, responsive CSS grid composition for telemetry bento boxes
 * and narrative feature highlights.
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
          "grid grid-cols-1 md:grid-cols-2 gap-6",
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
}

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ className, colSpan = 1, rowSpan = 1, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] p-8 flex flex-col justify-between transition-all duration-300 group hover:border-white/20 hover:shadow-[var(--shadow-ethereal-emerald)]",
          colSpan === 2 && "md:col-span-2",
          colSpan === 3 && "lg:col-span-3",
          rowSpan === 2 && "md:row-span-2",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 flex flex-col h-full">{children}</div>
      </div>
    );
  }
);
BentoCard.displayName = "BentoCard";
