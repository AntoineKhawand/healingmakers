import { create } from "zustand";

interface SizeQuizStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useSizeQuizStore = create<SizeQuizStore>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
