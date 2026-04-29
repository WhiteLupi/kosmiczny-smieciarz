import { describe, it, expect, beforeEach } from 'vitest';
import { applyHotspotEffect } from '@/game/puzzleEngine';
import { useStore } from '@/state/store';

describe('puzzleEngine — Arbiter wallet', () => {
  beforeEach(() => {
    useStore.setState({
      mode: 'sorting',
      overlay: 'puzzle',
      activePuzzleId: 'arbiter_wallet',
      puzzleProgress: {
        arbiter_wallet: {
          unlockedHotspots: new Set(),
          collectedClues: new Set(),
          solved: false,
        },
      },
      dialog: null,
      inventory: {},
    });
  });

  it('drawer locked when fewer than 3 clues collected', () => {
    applyHotspotEffect(useStore.getState(), 'arbiter_wallet', 'szuflada', 'arbiter_open_drawer');
    expect(useStore.getState().dialog?.treeId).toBe('arbiter_drawer_locked');
    expect(useStore.getState().puzzleProgress.arbiter_wallet?.solved).toBe(false);
  });

  it('drawer opens with 3 clues and triggers finale dialog', () => {
    applyHotspotEffect(useStore.getState(), 'arbiter_wallet', 'paragon', 'arbiter_collect_paragon');
    applyHotspotEffect(useStore.getState(), 'arbiter_wallet', 'zdjecie', 'arbiter_collect_zdjecie');
    applyHotspotEffect(useStore.getState(), 'arbiter_wallet', 'kupon', 'arbiter_collect_kupon');
    expect(useStore.getState().puzzleProgress.arbiter_wallet?.collectedClues.size).toBe(3);

    applyHotspotEffect(useStore.getState(), 'arbiter_wallet', 'szuflada', 'arbiter_open_drawer');
    const s = useStore.getState();
    expect(s.inventory['portfel_arbitra']).toBe(1);
    expect(s.puzzleProgress.arbiter_wallet?.solved).toBe(true);
    expect(s.dialog?.treeId).toBe('arbiter_finale');
    expect(s.activePuzzleId).toBeNull();
  });

  it('open_dialog hotspot effect transitions overlay to dialog', () => {
    applyHotspotEffect(useStore.getState(), 'f17b', 'stroz', 'open_dialog:stroz');
    const s = useStore.getState();
    expect(s.dialog?.treeId).toBe('stroz');
    expect(s.dialog?.nodeId).toBe('s_start');
    expect(s.overlay).toBe('dialog');
  });
});
