/**
 * SYNCORA THEME TOGGLE
 * --------------------
 * High-precision, tactile theme switcher interacting with next-themes.
 * Features spring rotation transforms and magnetic pull physics.
 */

"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { springs } from "@/lib/motion/springs";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 border border-[var(--color-border)] bg-[var(--color-surface)] animate-pulse" />;
  }

  const isDark = theme === "dark";

  return (
    <InteractiveButton
      variant="secondary"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 p-0 flex items-center justify-center rounded-none font-mono text-xs border border-[var(--color-border)] hover:border-[var(--color-signal-emerald)] transition-colors"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: [0.9, 1.1, 1] }}
        transition={springs.snappy}
        className="flex items-center justify-center text-lg text-[var(--color-text-main)]"
      >
        {isDark ? "☼" : "☾"}
      </motion.div>
    </InteractiveButton>
  );
};
