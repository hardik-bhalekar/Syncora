/**
 * SYNCORA PAGE TRANSITION
 * -----------------------
 * AnimatePresence wrapper ensuring smooth route entrances
 * and graceful DOM unmounting.
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { springs } from "@/lib/motion/springs";

export interface PageTransitionProps {
  children: React.ReactNode;
  mode?: "wait" | "sync" | "popLayout";
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, mode = "wait" }) => {
  return (
    <AnimatePresence mode={mode}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={springs.calm}
        className="flex flex-col flex-grow w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
