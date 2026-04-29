import type { SortingRule } from '@/types/sorting';

export function flargleBloopRules(): SortingRule[] {
  return [
    {
      id: 'r1',
      unlock: 0,
      text: 'NAPRAWDĘ ŻÓŁTY = żółty z fioletem.',
      evaluate: () => 'akcept',
    },
    {
      id: 'r2',
      unlock: 2,
      text: 'BARDZO ŻÓŁTY = żółty z zielonymi kropkami. NAPRAWDĘ ŻÓŁTY teraz = cyjan.',
      evaluate: () => null,
    },
    {
      id: 'r3',
      unlock: 4,
      text: 'Wszystko jest NIE-ŻÓŁTE. Poza żółtym. Ten żółty jest BARDZO ŻÓŁTY.',
      evaluate: () => null,
    },
  ];
}
