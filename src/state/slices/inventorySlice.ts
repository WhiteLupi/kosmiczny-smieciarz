import type { StateCreator } from 'zustand';

export interface InventorySlice {
  inventory: Record<string, number>;
  credits: number;
  addItem: (id: string, n?: number) => void;
  consumeItem: (id: string, n?: number) => void;
  addCredits: (n: number) => void;
}

export const createInventorySlice: StateCreator<InventorySlice> = (set) => ({
  inventory: {},
  credits: 0,
  addItem: (id, n = 1) =>
    set((s) => ({ inventory: { ...s.inventory, [id]: (s.inventory[id] ?? 0) + n } })),
  consumeItem: (id, n = 1) =>
    set((s) => {
      const cur = s.inventory[id] ?? 0;
      return { inventory: { ...s.inventory, [id]: Math.max(0, cur - n) } };
    }),
  addCredits: (n) => set((s) => ({ credits: s.credits + n })),
});
