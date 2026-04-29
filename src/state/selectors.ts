import type { GameStore } from './store';
import type { MoodId } from '@/types/game';

export function selectMood(s: GameStore): MoodId {
  const override = s.tweaks.moodOverride;
  if (override !== 'auto') return override;
  if (s.flags.recentSurprise) return 'pl_surprised';
  if (s.flags.recentPanic) return 'pl_panicked';
  if (s.sorting && s.sorting.correct >= 10) return 'pl_tired';
  if (s.credits >= 200) return 'pl_greedy';
  return 'pl_normal';
}
