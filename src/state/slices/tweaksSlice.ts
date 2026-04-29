import type { StateCreator } from 'zustand';
import type { Pace, MoodId } from '@/types/game';

export interface Tweaks {
  crtIntensity: number;
  paceMode: Pace;
  moodOverride: 'auto' | MoodId;
  sfxOn: boolean;
  textSpeed: number;
  panelVisible: boolean;
}

export interface TweaksSlice {
  tweaks: Tweaks;
  setTweak: <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;
  toggleTweaksPanel: () => void;
}

export const createTweaksSlice: StateCreator<TweaksSlice> = (set) => ({
  tweaks: {
    crtIntensity: 0.2,
    paceMode: 'normal',
    moodOverride: 'auto',
    sfxOn: true,
    textSpeed: 35,
    panelVisible: false,
  },
  setTweak: (k, v) => set((s) => ({ tweaks: { ...s.tweaks, [k]: v } })),
  toggleTweaksPanel: () =>
    set((s) => ({ tweaks: { ...s.tweaks, panelVisible: !s.tweaks.panelVisible } })),
});
