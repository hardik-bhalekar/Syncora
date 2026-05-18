/**
 * SYNCORA MAGNETIC WRAPPER
 * ------------------------
 * Implements 21st.dev magnetic physics. Elements pull towards the
 * user's cursor within a defined bounding threshold.
 */

"use client";

import * as React from "react";
import { useMotionValue, useSpring } from "framer-motion";

export interface MagneticWrapperProps {
  children: React.ReactElement;
  range?: number;
}

export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({ children, range = 20 }) => {
  const ref = React.useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 250, damping: 20, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      const element = ref.current;
      if (!element) return;

      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      x.set((distanceX / width) * range);
      y.set((distanceY / height) * range);
    },
    [range, x, y]
  );

  const handleMouseLeave = React.useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mousemove", handleMouseMove as EventListener);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove as EventListener);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return React.cloneElement(children, {
    ref,
    style: { ...(children as any).props.style, x: springX, y: springY },
    "data-magnetic": true,
  } as any);
};
