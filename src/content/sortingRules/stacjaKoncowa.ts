import type { SortingRule } from '@/types/sorting';

export function stacjaKoncowaRules(): SortingRule[] {
  return [
    {
      id: 'r1',
      unlock: 0,
      text: 'Sortuj do 4 kategorii. Arbiter akceptuje wszystko.',
      evaluate: () => 'akcept',
    },
  ];
}
