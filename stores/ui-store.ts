import { create } from "zustand";

/**
 * Enterprise Frontend State Segmentation (Phase 5)
 * Strictly limits Zustand to ephemeral UI state (modals, command palette, command K).
 * Server state remains strictly managed by TanStack Query.
 */

interface UiState {
  // Global Command Palette
  isCommandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  setCommandPalette: (open: boolean) => void;

  // Cinematic Side Panels
  activePanel: "NONE" | "GOAL_DETAIL" | "AI_ASSISTANT" | "NOTIFICATIONS";
  activePanelId: string | null;
  openPanel: (panel: "GOAL_DETAIL" | "AI_ASSISTANT" | "NOTIFICATIONS", id?: string) => void;
  closePanel: () => void;

  // Focus Modes (Progressive disclosure)
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCommandPaletteOpen: false,
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPalette: (open) => set({ isCommandPaletteOpen: open }),

  activePanel: "NONE",
  activePanelId: null,
  openPanel: (panel, id) => set({ activePanel: panel, activePanelId: id ?? null }),
  closePanel: () => set({ activePanel: "NONE", activePanelId: null }),

  isFocusMode: false,
  toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
}));
