import { describe, it, expect, beforeEach } from 'vitest';
import { loadSnapshot, saveSnapshot, clearSnapshot, serialize } from '@/state/persistence';
import { useStore } from '@/state/store';

describe('persistence', () => {
  beforeEach(() => {
    clearSnapshot();
    useStore.setState({ credits: 0, inventory: {}, flags: {}, sorting: null, puzzleProgress: {} });
  });

  it('round trips a snapshot', () => {
    useStore.getState().addCredits(50);
    useStore.getState().addItem('butelki KBK-3', 3);
    useStore.getState().setFlag('helenaPassed');
    const snap = serialize(useStore.getState());
    saveSnapshot(snap);
    const loaded = loadSnapshot();
    expect(loaded?.credits).toBe(50);
    expect(loaded?.inventory['butelki KBK-3']).toBe(3);
    expect(loaded?.flags.helenaPassed).toBe(true);
  });

  it('returns null when version mismatch', () => {
    localStorage.setItem('kosmiczny-smieciarz:v1', JSON.stringify({ version: 99 }));
    expect(loadSnapshot()).toBeNull();
  });

  it('returns null when key missing', () => {
    clearSnapshot();
    expect(loadSnapshot()).toBeNull();
  });
});
