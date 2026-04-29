import { describe, it, expect, beforeEach } from 'vitest';
import { applyDialogEffect } from '@/game/dialogEffects';
import { useStore } from '@/state/store';

describe('dialog effects integration', () => {
  beforeEach(() => {
    useStore.setState({
      mode: 'sorting',
      overlay: 'dialog',
      planet: 'p1',
      credits: 0,
      inventory: {},
      flags: {},
      dialog: { treeId: 'helena_test', nodeId: 'h_start' },
      activePuzzleId: null,
      puzzleProgress: {},
      sorting: null,
    });
  });

  it('helena_passed_grant gives +20₢ + 5 F-17/B + helenaPassed flag', () => {
    applyDialogEffect(useStore.getState(), 'helena_passed_grant');
    const s = useStore.getState();
    expect(s.credits).toBe(20);
    expect(s.inventory['F-17/B']).toBe(5);
    expect(s.flags.helenaPassed).toBe(true);
  });

  it('end_p1_day switches mode to dayEnd and clears overlay', () => {
    applyDialogEffect(useStore.getState(), 'end_p1_day');
    const s = useStore.getState();
    expect(s.mode).toBe('dayEnd');
    expect(s.overlay).toBe('none');
    expect(s.dialog).toBeNull();
  });

  it('zenek_accept sets the accepted flag', () => {
    applyDialogEffect(useStore.getState(), 'zenek_accept');
    expect(useStore.getState().flags.acceptedZenk).toBe(true);
  });

  it('puzzle chain F-3 → F-9 → solve grants 5 F-17/B', () => {
    applyDialogEffect(useStore.getState(), 'puzzle_collect_F3');
    expect(useStore.getState().inventory['F-3']).toBe(1);
    applyDialogEffect(useStore.getState(), 'puzzle_swap_F3_to_F9');
    expect(useStore.getState().inventory['F-3']).toBe(0);
    expect(useStore.getState().inventory['F-9']).toBe(1);
    applyDialogEffect(useStore.getState(), 'puzzle_solve_f17b');
    const s = useStore.getState();
    expect(s.inventory['F-9']).toBe(0);
    expect(s.inventory['F-17/B']).toBe(5);
    expect(s.flags.f17bSolved).toBe(true);
    expect(s.flags.helenaPassed).toBe(true);
    expect(s.mode).toBe('dayEnd');
  });

  it('arbiter_offer_quest enters wallet puzzle', () => {
    applyDialogEffect(useStore.getState(), 'arbiter_offer_quest');
    const s = useStore.getState();
    expect(s.activePuzzleId).toBe('arbiter_wallet');
    expect(s.overlay).toBe('puzzle');
    expect(s.dialog).toBeNull();
  });

  it('arbiter_finale_choose_collect/refuse → finale mode', () => {
    applyDialogEffect(useStore.getState(), 'arbiter_finale_choose_collect');
    expect(useStore.getState().mode).toBe('finale');
    useStore.setState({ mode: 'sorting', overlay: 'dialog', dialog: { treeId: 'arbiter_finale', nodeId: 'f_offer' } });
    applyDialogEffect(useStore.getState(), 'arbiter_finale_choose_refuse');
    expect(useStore.getState().mode).toBe('finale');
  });
});
