import { create } from "zustand";

export const useAppStore = create((set) => ({
  target: "both",
  setTarget: (t) => set({ target: t }),

  color: "#ffffff",
  setColor: (c) => set({ color: c }),

  pattern: null,
  setPattern: (p) => set({ pattern: p }),
}));
