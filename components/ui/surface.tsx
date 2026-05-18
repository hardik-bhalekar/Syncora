/**
 * SYNCORA CINEMATIC SURFACE SYSTEM
 * --------------------------------
 * Layered elevation container with automatic border lighting,
 * subtle noise diffusion, ambient top reflections, and cinematic graphite depth.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

type SurfaceElevation = "base" | "surface" | "elevated" | "subtle" | "glass" | "ethereal";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: SurfaceElevation;
  withNoise?: boolean;
  withLighting?: boolean;
  ambientColor?: "emerald" | "indigo" | "cerulean" | "amber" | "purple" | "none";
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, elevation = "surface", withNoise = true, withLighting = true, ambientColor = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-500",
          elevation === "base" && "bg-[var(--color-bg)]",
          elevation === "surface" && "bg-[var(--color-surface)] shadow-[var(--shadow-subtle)] border border-[var(--color-border-strong)]",
          elevation === "elevated" && "bg-[var(--color-elevated)] shadow-[var(--shadow-elevated)] border border-[var(--color-border-strong)]",
          elevation === "subtle" && "bg-[var(--color-subtle)] border border-[var(--color-border)]",
          elevation === "glass" && "glass-panel",
          elevation === "ethereal" && "bg-[var(--color-surface)]/80 backdrop-blur-3xl border border-white/20 shadow-[var(--shadow-float)]",
          withLighting && "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent",
          className
        )}
        {...props}
      >
        {withNoise && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        )}

        {/* Ambient colored background glows */}
        {ambientColor === "emerald" && <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--color-glow-primary)] rounded-full filter blur-[64px] pointer-events-none opacity-40 z-0" />}
        {ambientColor === "indigo" && <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--color-glow-primary)] rounded-full filter blur-[64px] pointer-events-none opacity-40 z-0" />}
        {ambientColor === "cerulean" && <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--color-glow-primary)] rounded-full filter blur-[64px] pointer-events-none opacity-40 z-0" />}
        {ambientColor === "amber" && <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--color-glow-primary)] rounded-full filter blur-[64px] pointer-events-none opacity-40 z-0" />}
        {ambientColor === "purple" && <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--color-glow-primary)] rounded-full filter blur-[64px] pointer-events-none opacity-40 z-0" />}

        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
Surface.displayName = "Surface";
