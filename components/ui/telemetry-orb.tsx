"use client";

import * as React from "react";
import { motion } from "framer-motion";

export const TelemetryOrb = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* Abstract Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* Primary Ambient Core Glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-[var(--color-accent-primary)] filter blur-[100px] opacity-30 z-0"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-[var(--color-accent-primary)] filter blur-[60px] opacity-50 z-0"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cinematic Orbital Rings */}
      <div className="relative w-[400px] h-[400px] z-10 flex items-center justify-center">
        {/* Outer Orbit */}
        <motion.div
          className="absolute w-[360px] h-[360px] rounded-full border border-[var(--color-border-strong)] border-dashed opacity-50"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {/* Node on Outer Orbit */}
          <div className="absolute -top-2 left-1/2 w-4 h-4 rounded-full bg-[var(--color-accent-primary)] shadow-[0_0_15px_var(--color-accent-primary)] -translate-x-1/2" />
          <div className="absolute top-1/2 -left-2 w-3 h-3 rounded-full bg-[var(--color-text-main)] shadow-[0_0_10px_#fff] -translate-y-1/2 opacity-70" />
        </motion.div>

        {/* Middle Orbit */}
        <motion.div
          className="absolute w-[240px] h-[240px] rounded-full border border-[var(--color-accent-primary)] opacity-30"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {/* Node on Middle Orbit */}
          <div className="absolute bottom-4 right-8 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]" />
          <div className="absolute -top-1.5 left-1/4 w-3 h-3 rounded-full bg-[var(--color-accent-primary)] shadow-[0_0_15px_var(--color-accent-primary)]" />
        </motion.div>

        {/* Inner Core Ring */}
        <motion.div
          className="absolute w-[120px] h-[120px] rounded-full border-[2px] border-[var(--color-text-main)] opacity-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* The Central Synchronizer Core */}
        <motion.div
          className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--color-bg)] to-[var(--color-surface)] border border-[var(--color-border-strong)] flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20"
          animate={{ rotate: 180 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-6 h-6 rounded-sm border border-[var(--color-accent-primary)] rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-[var(--color-accent-primary)] rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Floating Telemetry Data Nodes */}
      <motion.div
        className="absolute top-1/4 left-10 glass-panel px-3 py-2 font-mono text-[10px] text-[var(--color-text-dimmed)] z-20 flex flex-col gap-1 border border-white/5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <span className="text-[var(--color-accent-primary)] font-bold">NODE_ALPHA</span>
        <span>SYNC: 99.8%</span>
        <span>LATENCY: 4MS</span>
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-10 glass-panel px-3 py-2 font-mono text-[10px] text-[var(--color-text-dimmed)] z-20 flex flex-col gap-1 border border-white/5 text-right"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <span className="text-white font-bold">GLOBAL_LEDGER</span>
        <span>BLOCK: #8492</span>
        <span className="text-[var(--color-accent-primary)]">VERIFIED</span>
      </motion.div>

      {/* Scanning Line Effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent-primary)] to-transparent opacity-30 z-30"
        animate={{ y: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
