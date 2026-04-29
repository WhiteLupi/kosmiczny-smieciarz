import type { SortingRule } from '@/types/sorting';

export function hyperMartRules(): SortingRule[] {
  return [
    {
      id: 'r1',
      unlock: 0,
      text: 'SCAN all TIER-GOLD items. Flag >500₢ to SUPERVISOR.',
      evaluate: (it) => (it.numer === 'F-17/B' ? 'akcept' : 'odrzut'),
    },
    {
      id: 'r2',
      unlock: 2,
      text: 'DECLINE items from DEPRECATED-EARTH-CATALOG (butelki, gazety).',
      evaluate: (it) => (it.pieczatka === 'czarna' ? 'odrzut' : null),
    },
    {
      id: 'r3',
      unlock: 5,
      text: 'MONETIZE OPPORTUNITY: TIER-BRONZE → SUPERVISOR.',
      evaluate: (it) => (it.data === 'parzysta' ? 'przekaz' : null),
    },
    {
      id: 'r4',
      unlock: 9,
      text: 'APPLY CASHBACK 0.3% on Q4 PROMO if DELIGHTFUL.',
      evaluate: () => null,
    },
  ];
}
