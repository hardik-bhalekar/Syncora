/**
 * SYNCORA EDITORIAL CONTAINER
 * ---------------------------
 * Enforces max-width canvas bounds, editorial side margins,
 * and responsive Fibonacci vertical spacing.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface EditorialContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "marketing" | "dashboard" | "constrained";
}

export const EditorialContainer = React.forwardRef<HTMLDivElement, EditorialContainerProps>(
  ({ className, variant = "marketing", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full mx-auto px-8 md:px-16",
          variant === "marketing" && "max-w-[1440px] section-act-marketing",
          variant === "dashboard" && "max-w-[1600px] section-act-dashboard",
          variant === "constrained" && "max-w-[840px] py-12 md:py-24",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
EditorialContainer.displayName = "EditorialContainer";
