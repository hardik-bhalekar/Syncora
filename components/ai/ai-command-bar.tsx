"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/stores/ui-store";
import { slideUpTransition } from "@/lib/motion/transitions";
import { springs } from "@/lib/motion/springs";

/**
 * Enterprise performance command bar for operational prompts.
 */
export function AiCommandBar() {
  const { isCommandPaletteOpen, setCommandPalette } = useUiStore();
  const [query, setQuery] = useState("");

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          {/* Cinematic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            onClick={() => setCommandPalette(false)}
          />

          {/* Floating Command Palette */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <motion.div
              variants={slideUpTransition}
              initial="hidden"
              animate="show"
              exit="exit"
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/5">
                <span className="text-zinc-500 mr-3">✧</span>
                <input
                  autoFocus
                  className="w-full bg-transparent text-lg text-zinc-100 placeholder-zinc-600 focus:outline-none"
                  placeholder="Search goals, approvals, reviews, or audit activity..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="text-xs text-zinc-600 border border-zinc-800 rounded px-2 py-1">ESC</div>
              </div>

              {/* Streaming Results Area */}
              <div className="min-h-50 p-4 text-zinc-400">
                {query.length > 0 ? (
                  <div className="animate-pulse">Analyzing context...</div>
                ) : (
                  <div className="text-sm">
                    <p className="mb-2 text-zinc-500 font-medium">Suggestions</p>
                    <ul className="space-y-2">
                      <li className="hover:bg-zinc-900 px-3 py-2 rounded-lg cursor-pointer transition-colors">
                        Create a goal sheet for Q2 performance planning
                      </li>
                      <li className="hover:bg-zinc-900 px-3 py-2 rounded-lg cursor-pointer transition-colors">
                        Review pending approvals and check-ins
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
