import type { StateCreator } from 'zustand';
import type { PuzzleProgress } from '@/types/puzzle';

function ensureProgress(map: Record<string, PuzzleProgress>, id: string): PuzzleProgress {
  return map[id] ?? { unlockedHotspots: new Set(), collectedClues: new Set(), solved: false };
}

export interface PuzzleSlice {
  activePuzzleId: string | null;
  puzzleProgress: Record<string, PuzzleProgress>;
  enterPuzzle: (id: string) => void;
  exitPuzzle: () => void;
  unlockHotspot: (puzzleId: string, hotspotId: string) => void;
  collectClue: (puzzleId: string, clueId: string) => void;
  solvePuzzle: (puzzleId: string) => void;
}

export const createPuzzleSlice: StateCreator<PuzzleSlice> = (set) => ({
  activePuzzleId: null,
  puzzleProgress: {},
  enterPuzzle: (id) =>
    set((s) => ({
      activePuzzleId: id,
      puzzleProgress: { ...s.puzzleProgress, [id]: ensureProgress(s.puzzleProgress, id) },
    })),
  exitPuzzle: () => set({ activePuzzleId: null }),
  unlockHotspot: (puzzleId, hotspotId) =>
    set((s) => {
      const cur = ensureProgress(s.puzzleProgress, puzzleId);
      const next = new Set(cur.unlockedHotspots);
      next.add(hotspotId);
      return { puzzleProgress: { ...s.puzzleProgress, [puzzleId]: { ...cur, unlockedHotspots: next } } };
    }),
  collectClue: (puzzleId, clueId) =>
    set((s) => {
      const cur = ensureProgress(s.puzzleProgress, puzzleId);
      const next = new Set(cur.collectedClues);
      next.add(clueId);
      return { puzzleProgress: { ...s.puzzleProgress, [puzzleId]: { ...cur, collectedClues: next } } };
    }),
  solvePuzzle: (puzzleId) =>
    set((s) => {
      const cur = ensureProgress(s.puzzleProgress, puzzleId);
      return { puzzleProgress: { ...s.puzzleProgress, [puzzleId]: { ...cur, solved: true } } };
    }),
});
