import { describe, it, expect } from 'vitest';
import { dayEndCalc } from '@/game/dayEndCalc';

describe('dayEndCalc', () => {
  it('basic 0 correct, no bonus', () => {
    expect(dayEndCalc(0, false)).toEqual({ pay: 0, bonus: 0, total: 0 });
  });
  it('22 correct + helena bonus', () => {
    expect(dayEndCalc(22, true)).toEqual({ pay: 44, bonus: 20, total: 64 });
  });
  it('15 correct, no bonus', () => {
    expect(dayEndCalc(15, false)).toEqual({ pay: 30, bonus: 0, total: 30 });
  });
});
