import type { StateCreator } from 'zustand';

export interface FlagsSlice {
  flags: Record<string, boolean>;
  setFlag: (id: string, on?: boolean) => void;
}

export const createFlagsSlice: StateCreator<FlagsSlice> = (set) => ({
  flags: {},
  setFlag: (id, on = true) => set((s) => ({ flags: { ...s.flags, [id]: on } })),
});
