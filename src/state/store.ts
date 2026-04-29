import { create } from 'zustand';
import { createModeSlice, type ModeSlice } from './slices/modeSlice';
import { createInventorySlice, type InventorySlice } from './slices/inventorySlice';
import { createFlagsSlice, type FlagsSlice } from './slices/flagsSlice';
import { createSortingSlice, type SortingSlice } from './slices/sortingSlice';
import { createDialogSlice, type DialogSlice } from './slices/dialogSlice';
import { createPuzzleSlice, type PuzzleSlice } from './slices/puzzleSlice';
import { createTweaksSlice, type TweaksSlice } from './slices/tweaksSlice';
import { createAuthSlice, type AuthSlice } from './slices/authSlice';
import { createMetaSlice, type MetaSlice } from './slices/metaSlice';

export type GameStore = ModeSlice &
  InventorySlice &
  FlagsSlice &
  SortingSlice &
  DialogSlice &
  PuzzleSlice &
  TweaksSlice &
  AuthSlice &
  MetaSlice;

export const useStore = create<GameStore>()((...a) => ({
  ...createModeSlice(...a),
  ...createInventorySlice(...a),
  ...createFlagsSlice(...a),
  ...createSortingSlice(...a),
  ...createDialogSlice(...a),
  ...createPuzzleSlice(...a),
  ...createTweaksSlice(...a),
  ...createAuthSlice(...a),
  ...createMetaSlice(...a),
}));
