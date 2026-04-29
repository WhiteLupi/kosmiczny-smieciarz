import { describe, it, expect } from 'vitest';
import { evaluateItem, ruleUnlocksTriggered } from '@/game/sortingEngine';
import { biurokracja7Rules } from '@/content/sortingRules/biurokracja7';
import type { SortingItem } from '@/types/sorting';

const baseItem: SortingItem = {
  id: 'a',
  numer: 'F-17/B',
  pieczatka: 'niebieska',
  stempel: 'suchy',
  obywatel: 'Ziemianin',
  data: 'nieparzysta',
  osoba: 'X',
  dataStr: '1.04',
  sprawa: 'Wniosek',
  okienko: 3,
};

describe('evaluateItem', () => {
  const rules = biurokracja7Rules('normal');

  it('r1 only — F-17/B → akcept, else odrzut', () => {
    const u = new Set(['r1']);
    expect(evaluateItem(baseItem, rules, u).expected).toBe('akcept');
    expect(evaluateItem({ ...baseItem, numer: 'F-3' }, rules, u).expected).toBe('odrzut');
  });

  it('r5 has highest priority — mokry + okienko != 12 → odrzut', () => {
    const u = new Set(['r1', 'r2', 'r3', 'r4', 'r5']);
    const wet = { ...baseItem, stempel: 'mokry' as const, okienko: 7 };
    expect(evaluateItem(wet, rules, u).expected).toBe('odrzut');
  });

  it('r4 inverts marsjanin — czarna pieczątka → akcept', () => {
    const u = new Set(['r1', 'r2', 'r3', 'r4']);
    const mars = { ...baseItem, obywatel: 'Marsjanin' as const, pieczatka: 'czarna' as const };
    expect(evaluateItem(mars, rules, u).expected).toBe('akcept');
  });

  it('rule returning null falls through to lower priority', () => {
    // r3 returns null for nieparzysta → r2/r1 used
    const u = new Set(['r1', 'r2', 'r3']);
    expect(evaluateItem(baseItem, rules, u).expected).toBe('akcept');
  });

  it('mokry F-17/B with okienko=12 — r5 returns null, falls through to r2 (akcept)', () => {
    const u = new Set(['r1', 'r2', 'r3', 'r4', 'r5']);
    const wetOk = { ...baseItem, stempel: 'mokry' as const, okienko: 12 };
    expect(evaluateItem(wetOk, rules, u).expected).toBe('akcept');
  });
});

describe('ruleUnlocksTriggered', () => {
  const rules = biurokracja7Rules('normal');

  it('returns rules whose unlock <= correct and not yet unlocked', () => {
    expect(ruleUnlocksTriggered(rules, new Set(['r1']), 3).map((r) => r.id)).toEqual(['r2']);
    expect(ruleUnlocksTriggered(rules, new Set(['r1']), 12).map((r) => r.id)).toEqual([
      'r2', 'r3', 'r4', 'r5',
    ]);
    expect(ruleUnlocksTriggered(rules, new Set(['r1', 'r2', 'r3']), 12).map((r) => r.id)).toEqual([
      'r4', 'r5',
    ]);
  });

  it('returns empty when nothing to unlock', () => {
    expect(ruleUnlocksTriggered(rules, new Set(['r1']), 0)).toEqual([]);
  });
});
