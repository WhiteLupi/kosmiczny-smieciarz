import type { SortingRule } from '@/types/sorting';
import type { Pace } from '@/types/game';

export const PACE_UNLOCKS: Record<Pace, [number, number, number, number]> = {
  fast: [2, 3, 5, 7],
  normal: [3, 6, 9, 12],
  slow: [5, 8, 11, 14],
};

export function biurokracja7Rules(pace: Pace): SortingRule[] {
  const u = PACE_UNLOCKS[pace];
  return [
    {
      id: 'r1',
      unlock: 0,
      text: 'AKCEPT: tylko numer F-17/B. Reszta = ODRZUT.',
      evaluate: (it) => (it.numer === 'F-17/B' ? 'akcept' : 'odrzut'),
    },
    {
      id: 'r2',
      unlock: u[0],
      text: 'Pieczątka NIEBIESKA = AKCEPT. CZARNA = ODRZUT.',
      evaluate: (it) => {
        if (it.pieczatka === 'czarna') return 'odrzut';
        if (it.pieczatka === 'niebieska' && it.numer === 'F-17/B') return 'akcept';
        return null;
      },
    },
    {
      id: 'r3',
      unlock: u[1],
      text: 'Data PARZYSTA = PRZEKAŻ WYŻEJ.',
      evaluate: (it) => (it.data === 'parzysta' ? 'przekaz' : null),
    },
    {
      id: 'r4',
      unlock: u[2],
      text: 'MARSJANIE: czarna pieczątka = AKCEPT (odwrotnie niż Ziemianie).',
      evaluate: (it) => {
        if (it.obywatel === 'Marsjanin' && it.pieczatka === 'czarna') return 'akcept';
        if (it.obywatel === 'Marsjanin' && it.pieczatka === 'niebieska') return 'odrzut';
        return null;
      },
    },
    {
      id: 'r5',
      unlock: u[3],
      text: 'Stempel MOKRY + niesprawdzony w okienku 12 = ODRZUT (okienko 12 nie istnieje).',
      evaluate: (it) => (it.stempel === 'mokry' && it.okienko !== 12 ? 'odrzut' : null),
    },
  ];
}
