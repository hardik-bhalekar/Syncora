"use client";

import dynamic from "next/dynamic";
import * as React from "react";

// Create a fallback loader to prevent layout shift while Three.js loads
const GoalGalaxyLoader = () => (
  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[var(--color-surface)] z-10 gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent-primary)] border-t-transparent animate-spin" />
    <span className="font-mono text-xs text-[var(--color-text-dimmed)] tracking-widest uppercase">
      INITIALIZING WEBGL...
    </span>
  </div>
);

// Dynamically import the heavy Three.js scene with SSR disabled
export const GoalGalaxy = dynamic(
  () => import("@/components/three/goal-galaxy").then((mod) => mod.GoalGalaxy),
  { 
    ssr: false,
    loading: () => <GoalGalaxyLoader />
  }
);
