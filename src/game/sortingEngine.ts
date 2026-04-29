import type { SortingItem, SortingRule, ZoneId } from '@/types/sorting';

export interface EvaluateResult {
  expected: ZoneId;
  ruleId: string;
}

export function evaluateItem(
  item: SortingItem,
  rules: SortingRule[],
  unlocked: ReadonlySet<string>,
): EvaluateResult {
  const active = rules.filter((r) => unlocked.has(r.id)).sort((a, b) => b.unlock - a.unlock);
  for (const r of active) {
    const v = r.evaluate(item);
    if (v) return { expected: v, ruleId: r.id };
  }
  return { expected: item.numer === 'F-17/B' ? 'akcept' : 'odrzut', ruleId: 'r1-fallback' };
}

export function ruleUnlocksTriggered(
  rules: SortingRule[],
  unlocked: ReadonlySet<string>,
  correct: number,
): SortingRule[] {
  return rules.filter((r) => !unlocked.has(r.id) && correct >= r.unlock);
}
