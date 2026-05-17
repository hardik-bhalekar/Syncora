/**
 * SYNCORA SURFACE SYSTEM
 * ----------------------
 * Layered elevation container with automatic border lighting,
 * subtle noise diffusion, and cinematic graphite depth.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

type SurfaceElevation = "base" | "surface" | "elevated" | "subtle";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: SurfaceElevation;
  withNoise?: boolean;
  withLighting?: boolean;
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, elevation = "surface", withNoise = true, withLighting = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          elevation === "base" && "bg-[var(--color-bg)]",
          elevation === "surface" && "bg-[var(--color-surface)] shadow-[var(--shadow-subtle)]",
          elevation === "elevated" && "bg-[var(--color-elevated)] shadow-[var(--shadow-subtle)]",
          elevation === "subtle" && "bg-[var(--color-subtle)]",
          withLighting && "border border-[var(--color-border)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent",
          className
        )}
        {...props}
      >
        {withNoise && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
Surface.displayName = "Surface";
