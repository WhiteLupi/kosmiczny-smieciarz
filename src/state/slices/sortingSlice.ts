import type { StateCreator } from 'zustand';
import type { SortingState, SortingItem, SortingRule, ZoneId } from '@/types/sorting';

export interface SortingSlice {
  sorting: SortingState | null;
  startSortingScene: (scene: { sceneId: string; pool: SortingItem[]; rules: SortingRule[] }) => void;
  resolveSort: (chosen: ZoneId, expected: ZoneId) => void;
  unlockRule: (ruleId: string) => void;
  insertItemAtCurrent: (item: SortingItem) => void;
  removeCurrentItem: () => void;
  markInterruption: (id: string) => void;
  setHeroTestDone: () => void;
  consumeHint: () => boolean;
}

export const createSortingSlice: StateCreator<SortingSlice> = (set, get) => ({
  sorting: null,
  startSortingScene: ({ sceneId, pool, rules }) =>
    set({
      sorting: {
        sceneId,
        pool,
        idx: 0,
        rules,
        unlocked: new Set(['r1']),
        correct: 0,
        errors: 0,
        heroTestDone: false,
        firedInterruptions: new Set(),
        hintsRemaining: 3,
      },
    }),
  resolveSort: (chosen, expected) =>
    set((s) => {
      if (!s.sorting) return {};
      const correct = chosen === expected;
      return {
        sorting: {
          ...s.sorting,
          idx: s.sorting.idx + 1,
          correct: s.sorting.correct + (correct ? 1 : 0),
          errors: s.sorting.errors + (correct ? 0 : 1),
        },
      };
    }),
  unlockRule: (id) =>
    set((s) => {
      if (!s.sorting) return {};
      const next = new Set(s.sorting.unlocked);
      next.add(id);
      return { sorting: { ...s.sorting, unlocked: next } };
    }),
  insertItemAtCurrent: (item) =>
    set((s) => {
      if (!s.sorting) return {};
      const pool = [...s.sorting.pool];
      pool.splice(s.sorting.idx, 0, item);
      return { sorting: { ...s.sorting, pool } };
    }),
  removeCurrentItem: () =>
    set((s) => {
      if (!s.sorting) return {};
      const pool = [...s.sorting.pool];
      pool.splice(s.sorting.idx, 1);
      return { sorting: { ...s.sorting, pool } };
    }),
  markInterruption: (id) =>
    set((s) => {
      if (!s.sorting) return {};
      const next = new Set(s.sorting.firedInterruptions);
      next.add(id);
      return { sorting: { ...s.sorting, firedInterruptions: next } };
    }),
  setHeroTestDone: () =>
    set((s) => (s.sorting ? { sorting: { ...s.sorting, heroTestDone: true } } : {})),
  consumeHint: () => {
    const cur = get().sorting;
    if (!cur || cur.hintsRemaining <= 0) return false;
    set({ sorting: { ...cur, hintsRemaining: cur.hintsRemaining - 1 } });
    return true;
  },
});
