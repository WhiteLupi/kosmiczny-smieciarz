import type { StateCreator } from 'zustand';
import type { Mode, OverlayMode, PlanetId } from '@/types/game';

export interface ModeSlice {
  mode: Mode;
  overlay: OverlayMode;
  planet: PlanetId;
  setMode: (m: Mode) => void;
  setOverlay: (o: OverlayMode) => void;
  setPlanet: (p: PlanetId) => void;
}

export const createModeSlice: StateCreator<ModeSlice> = (set) => ({
  mode: 'boot',
  overlay: 'none',
  planet: 'p1',
  setMode: (m) => set({ mode: m }),
  setOverlay: (o) => set({ overlay: o }),
  setPlanet: (p) => set({ planet: p }),
});
