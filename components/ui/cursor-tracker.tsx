/**
 * SYNCORA CINEMATIC CURSOR TRACKER
 * --------------------------------
 * Hardware-accelerated, spring-interpolated custom cursor follower.
 * Features a luxurious outer magnetic ring and an ultra-precise inner core,
 * providing subtle magnetic scaling, glow, and liquid physics when hovering active elements.
 */

"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CursorTracker: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfigOuter = { damping: 30, stiffness: 250, mass: 0.6 };
  const springConfigInner = { damping: 20, stiffness: 450, mass: 0.2 };
  
  const cursorXSpringOuter = useSpring(cursorX, springConfigOuter);
  const cursorYSpringOuter = useSpring(cursorY, springConfigOuter);
  
  const cursorXSpringInner = useSpring(cursorX, springConfigInner);
  const cursorYSpringInner = useSpring(cursorY, springConfigInner);

  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest("button, a, [role='button'], [data-magnetic], .interactive-card, input")) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block overflow-hidden">
      {/* Outer Magnetic Ring */}
      <motion.div
        className="absolute top-0 left-0 w-10 h-10 rounded-full border border-white/40 bg-white/5 backdrop-blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        style={{
          x: cursorXSpringOuter,
          y: cursorYSpringOuter,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isActive ? 0.8 : isHovered ? 1.6 : 1,
          borderColor: isHovered ? "var(--color-accent-primary)" : "rgba(255, 255, 255, 0.4)",
          backgroundColor: isHovered ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.05)",
          opacity: cursorX.get() === -100 ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

      {/* Inner Ultra-Precise Core */}
      <motion.div
        className="absolute top-0 left-0 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        style={{
          x: cursorXSpringInner,
          y: cursorYSpringInner,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isActive ? 0.5 : isHovered ? 0 : 1,
          backgroundColor: isHovered ? "var(--color-accent-primary)" : "#FFFFFF",
          opacity: cursorX.get() === -100 ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      />
    </div>
  );
};
