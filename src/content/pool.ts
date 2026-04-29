import type { SortingItem } from '@/types/sorting';

const NUMS = ['F-17/B','F-3','F-22','F-99','F-17/B','F-22','F-17/B','F-3','F-99','F-17/B','F-22','F-3','F-17/B','F-99','F-22'] as const;
const STAMPS = ['niebieska','niebieska','czarna','niebieska','czerwona','niebieska','czarna','niebieska','czerwona','niebieska','niebieska','czarna','niebieska','czerwona','niebieska'] as const;
const WET = ['suchy','mokry','suchy','mokry','suchy','mokry','mokry','suchy','mokry','suchy','mokry','mokry','suchy','suchy','mokry'] as const;
const OBYW = ['Ziemianin','Marsjanin','Ziemianin','Ziemianin','Marsjanin','Inny','Ziemianin','Marsjanin','Ziemianin','Marsjanin','Ziemianin','Ziemianin','Marsjanin','Inny','Ziemianin'] as const;
const NAMES = ['Kowalski J.','Nowak T.','Xkrgl #3','Wiśniewska A.','M’klorp','Zenek z piwnicy','Kowalska A.','Blorgonauta','Wójcik P.','Qrrrk','Dąbrowski M.','Lewandowska Z.','Fnord J.','Xyzzy B.','Kaczmarek L.'] as const;
const SPRAWA = ['Wniosek o wniosek','Podanie o podanie','Zażalenie','Odwołanie od odwołania','Pokwitowanie','Zgłoszenie','Zaświadczenie','Wniosek','Prośba','Skarga','Petycja'] as const;
const OKIENKO = [3, 7, 12, 4, 9, 2, 11, 5, 8, 1] as const;

export function buildBiurokracja7Pool(): SortingItem[] {
  const pool: SortingItem[] = [];
  for (let i = 0; i < 15; i++) {
    pool.push({
      id: `f${i}`,
      numer: NUMS[i]!,
      pieczatka: STAMPS[i]!,
      stempel: WET[i]!,
      obywatel: OBYW[i]!,
      data: (i + 1) % 2 === 0 ? 'parzysta' : 'nieparzysta',
      osoba: NAMES[i]!,
      dataStr: `${i + 1}.04.2026`,
      sprawa: SPRAWA[i % SPRAWA.length]!,
      okienko: OKIENKO[i % OKIENKO.length]!,
    });
  }
  return pool;
}
