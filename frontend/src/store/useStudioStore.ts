import { create } from "zustand";

interface StudioState {
  generationCounter: number;
  incrementGenerationCounter: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  generationCounter: 0,
  incrementGenerationCounter: () => set((state) => ({ generationCounter: state.generationCounter + 1 })),
}));