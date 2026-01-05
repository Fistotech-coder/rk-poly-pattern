import { create } from "zustand";

export const useAppStore = create((set) => ({
  target: "both", // top | bottom | both
  color: "#ffffff",
  pattern: null,

  setTarget: (v) => set({ target: v }),
  setColor: (v) => set({ color: v }),
  setPattern: (v) => set({ pattern: v }),
}));
