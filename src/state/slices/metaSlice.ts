import type { StateCreator } from 'zustand';

export interface MetaSlice {
  /** Unix ms timestamp when player first interacted with sorting on P1. */
  gameStartedAt: number | null;
  /** Anonymous nick assigned to this device for leaderboard. */
  anonNick: string;
  setGameStartedAt: (t: number | null) => void;
  ensureAnonNick: () => string;
  setAnonNick: (n: string) => void;
}

function generateNick(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `Śmieciarz #${n}`;
}

export const createMetaSlice: StateCreator<MetaSlice> = (set, get) => ({
  gameStartedAt: null,
  anonNick: generateNick(),
  setGameStartedAt: (t) => set({ gameStartedAt: t }),
  ensureAnonNick: () => {
    const cur = get().anonNick;
    if (cur) return cur;
    const n = generateNick();
    set({ anonNick: n });
    return n;
  },
  setAnonNick: (n) => {
    const trimmed = n.trim().slice(0, 32);
    if (trimmed) set({ anonNick: trimmed });
  },
});
