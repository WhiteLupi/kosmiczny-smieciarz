import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/state/store';

describe('store slices', () => {
  beforeEach(() => {
    useStore.setState({
      mode: 'boot',
      overlay: 'none',
      planet: 'p1',
      inventory: {},
      credits: 0,
      flags: {},
      sorting: null,
      dialog: null,
      activePuzzleId: null,
      puzzleProgress: {},
    });
  });

  it('mode/overlay/planet setters', () => {
    const s = useStore.getState();
    s.setMode('sorting');
    s.setOverlay('dialog');
    s.setPlanet('p2');
    const next = useStore.getState();
    expect(next.mode).toBe('sorting');
    expect(next.overlay).toBe('dialog');
    expect(next.planet).toBe('p2');
  });

  it('inventory add/consume + credits', () => {
    const s = useStore.getState();
    s.addItem('butelki KBK-3', 5);
    s.addItem('butelki KBK-3', 3);
    s.consumeItem('butelki KBK-3', 2);
    s.addCredits(50);
    const next = useStore.getState();
    expect(next.inventory['butelki KBK-3']).toBe(6);
    expect(next.credits).toBe(50);
  });

  it('flags setter', () => {
    const s = useStore.getState();
    s.setFlag('helenaPassed');
    s.setFlag('zenek', true);
    s.setFlag('zenek', false);
    const next = useStore.getState();
    expect(next.flags.helenaPassed).toBe(true);
    expect(next.flags.zenek).toBe(false);
  });

  it('dialog open/close', () => {
    const s = useStore.getState();
    s.openDialog('helena_test', 'h_start');
    expect(useStore.getState().dialog?.nodeId).toBe('h_start');
    s.setDialogNode('h_win');
    expect(useStore.getState().dialog?.nodeId).toBe('h_win');
    s.closeDialog();
    expect(useStore.getState().dialog).toBeNull();
  });

  it('puzzle hotspot/clue lifecycle', () => {
    const s = useStore.getState();
    s.enterPuzzle('f17b');
    s.unlockHotspot('f17b', 'stroz');
    s.collectClue('f17b', 'F-3');
    s.solvePuzzle('f17b');
    const p = useStore.getState().puzzleProgress.f17b;
    expect(p?.unlockedHotspots.has('stroz')).toBe(true);
    expect(p?.collectedClues.has('F-3')).toBe(true);
    expect(p?.solved).toBe(true);
  });

  it('tweaks setter and toggle', () => {
    const s = useStore.getState();
    s.setTweak('paceMode', 'fast');
    s.setTweak('crtIntensity', 0.5);
    s.toggleTweaksPanel();
    const next = useStore.getState();
    expect(next.tweaks.paceMode).toBe('fast');
    expect(next.tweaks.crtIntensity).toBe(0.5);
    expect(next.tweaks.panelVisible).toBe(true);
  });
});
