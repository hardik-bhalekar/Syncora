"use client";

import * as React from "react";
import { motion } from "framer-motion";

export const TelemetryGrid = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent perspective-[1000px]">
      {/* 3D Tilted Grid Floor */}
      <motion.div
        className="absolute w-[200vw] h-[200vh] border border-[var(--color-accent-primary)]/20"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-accent-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-accent-primary) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          rotateX: 60,
          y: "30%",
          opacity: 0.15,
        }}
        animate={{
          backgroundPosition: ["0px 0px", "0px 60px"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating Vertical Data Beams */}
      <div className="absolute inset-0 flex items-end justify-around px-20 opacity-30">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-px bg-gradient-to-t from-[var(--color-accent-primary)] to-transparent"
            initial={{ height: "0%" }}
            animate={{ height: ["20%", "80%", "30%"] }}
            transition={{
              duration: 3 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Ambient Core Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-[var(--color-accent-primary)] filter blur-[120px] opacity-10 pointer-events-none rounded-full" />
    </div>
  );
};
