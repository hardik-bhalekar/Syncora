/**
 * SYNCORA CURSOR TRACKER
 * ----------------------
 * Hardware-accelerated, spring-interpolated custom cursor follower.
 * Provides subtle magnetic scaling and glow when hovering active elements.
 */

"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CursorTracker: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest("button, a, [role='button'], [data-magnetic]")) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] border border-[var(--color-signal-emerald)] mix-blend-difference hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isHovered ? 1.5 : 1,
        backgroundColor: isHovered ? "var(--color-signal-emerald)" : "rgba(0, 0, 0, 0)",
        opacity: cursorX.get() === -100 ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    />
  );
};
