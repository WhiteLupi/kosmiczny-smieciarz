import { useStore, type GameStore } from './store';
import { debounce } from '@/utils/debounce';
import { biurokracja7Rules } from '@/content/sortingRules/biurokracja7';
import { hyperMartRules } from '@/content/sortingRules/hyperMart';
import { flargleBloopRules } from '@/content/sortingRules/flargleBloop';
import { stacjaKoncowaRules } from '@/content/sortingRules/stacjaKoncowa';
import type { SortingRule } from '@/types/sorting';
import type { Pace } from '@/types/game';

const KEY = 'kosmiczny-smieciarz:v1';

interface PersistedSorting {
  sceneId: string;
  pool: unknown[];
  idx: number;
  unlocked: string[];
  correct: number;
  errors: number;
  heroTestDone: boolean;
  firedInterruptions: string[];
}

interface PersistedPuzzle {
  unlockedHotspots: string[];
  collectedClues: string[];
  solved: boolean;
}

export interface PersistedSnapshot {
  version: 1;
  mode: string;
  planet: string;
  credits: number;
  inventory: Record<string, number>;
  flags: Record<string, boolean>;
  sorting?: PersistedSorting | undefined;
  puzzle?: Record<string, PersistedPuzzle> | undefined;
  tweaks?: GameStore['tweaks'] | undefined;
  meta?: { gameStartedAt: number | null; anonNick: string } | undefined;
}

export function loadSnapshot(): PersistedSnapshot | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedSnapshot;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSnapshot(snap: PersistedSnapshot): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(snap));
  } catch {
    /* private mode / quota — ignore */
  }
}

export function clearSnapshot(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

function rulesForScene(sceneId: string, paceMode: Pace): SortingRule[] {
  switch (sceneId) {
    case 'p1':
    case 'p1-biurokracja7':
      return biurokracja7Rules(paceMode);
    case 'p2':
      return hyperMartRules();
    case 'p3':
      return flargleBloopRules();
    case 'p4':
      return stacjaKoncowaRules();
    default:
      return biurokracja7Rules(paceMode);
  }
}

export function serialize(s: GameStore): PersistedSnapshot {
  return {
    version: 1,
    mode: s.mode,
    planet: s.planet,
    credits: s.credits,
    inventory: s.inventory,
    flags: s.flags,
    sorting: s.sorting
      ? {
          sceneId: s.sorting.sceneId,
          pool: s.sorting.pool,
          idx: s.sorting.idx,
          unlocked: Array.from(s.sorting.unlocked),
          correct: s.sorting.correct,
          errors: s.sorting.errors,
          heroTestDone: s.sorting.heroTestDone,
          firedInterruptions: Array.from(s.sorting.firedInterruptions),
        }
      : undefined,
    puzzle: Object.fromEntries(
      Object.entries(s.puzzleProgress).map(([k, v]) => [
        k,
        {
          unlockedHotspots: Array.from(v.unlockedHotspots),
          collectedClues: Array.from(v.collectedClues),
          solved: v.solved,
        },
      ]),
    ),
    tweaks: s.tweaks,
    meta: { gameStartedAt: s.gameStartedAt, anonNick: s.anonNick },
  };
}

export function rehydrate(snap: PersistedSnapshot): void {
  const partial: Partial<GameStore> = {
    mode: snap.mode as GameStore['mode'],
    planet: snap.planet as GameStore['planet'],
    credits: snap.credits,
    inventory: snap.inventory,
    flags: snap.flags,
  };
  if (snap.tweaks) partial.tweaks = snap.tweaks;
  if (snap.meta) {
    partial.gameStartedAt = snap.meta.gameStartedAt;
    if (snap.meta.anonNick) partial.anonNick = snap.meta.anonNick;
  }
  if (snap.puzzle) {
    partial.puzzleProgress = Object.fromEntries(
      Object.entries(snap.puzzle).map(([k, v]) => [
        k,
        {
          unlockedHotspots: new Set(v.unlockedHotspots),
          collectedClues: new Set(v.collectedClues),
          solved: v.solved,
        },
      ]),
    );
  }
  useStore.setState(partial);
  if (snap.sorting) {
    const pace: Pace = (snap.tweaks?.paceMode ?? 'normal') as Pace;
    const ss = snap.sorting;
    useStore.setState({
      sorting: {
        sceneId: ss.sceneId,
        pool: ss.pool as GameStore['sorting'] extends infer X
          ? X extends { pool: infer P }
            ? P
            : never
          : never,
        rules: rulesForScene(ss.sceneId, pace),
        idx: ss.idx,
        unlocked: new Set(ss.unlocked),
        correct: ss.correct,
        errors: ss.errors,
        heroTestDone: ss.heroTestDone,
        firedInterruptions: new Set(ss.firedInterruptions),
      },
    });
  }
}

const debouncedSave = debounce((s: GameStore) => saveSnapshot(serialize(s)), 500);

export function startPersistence(): void {
  const snap = loadSnapshot();
  if (snap) rehydrate(snap);
  useStore.subscribe((s) => {
    // Always save locally
    debouncedSave(s);
    // If logged in, also push to cloud (debounced separately, dynamic import to avoid circular dep)
    if (s.user) {
      void import('./cloudSync').then((m) => m.maybeScheduleCloudPush());
    }
  });
}
