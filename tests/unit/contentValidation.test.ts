import { describe, it, expect } from 'vitest';
import { evaluateItem } from '@/game/sortingEngine';
import { biurokracja7Rules } from '@/content/sortingRules/biurokracja7';
import { buildBiurokracja7Pool } from '@/content/pool';

describe('content validation', () => {
  it('every item in P1 pool evaluates to a valid zone with all rules unlocked', () => {
    const pool = buildBiurokracja7Pool();
    const rules = biurokracja7Rules('normal');
    const unlocked = new Set(rules.map((r) => r.id));
    const valid = new Set(['akcept', 'odrzut', 'przekaz']);
    for (const item of pool) {
      const { expected } = evaluateItem(item, rules, unlocked);
      expect(valid.has(expected), `${item.id} resolved to ${expected}`).toBe(true);
    }
  });

  it('pool has exactly 15 items', () => {
    expect(buildBiurokracja7Pool()).toHaveLength(15);
  });

  it('every item has all required SortingItem fields', () => {
    const pool = buildBiurokracja7Pool();
    for (const it of pool) {
      expect(it.numer).toBeTruthy();
      expect(['niebieska', 'czarna', 'czerwona']).toContain(it.pieczatka);
      expect(['mokry', 'suchy']).toContain(it.stempel);
      expect(['Ziemianin', 'Marsjanin', 'Inny']).toContain(it.obywatel);
      expect(['parzysta', 'nieparzysta']).toContain(it.data);
    }
  });
});
