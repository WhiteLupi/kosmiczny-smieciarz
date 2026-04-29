import type { PlanetId } from '@/types/game';
import type { ZoneId } from '@/types/sorting';

export interface PlanetMeta {
  id: PlanetId;
  name: string;
  sub: string;
  zoneLabels: ReadonlyArray<{ id: ZoneId; icon: string; sub: string }>;
  questText: string;
  beltLabel: string;
}

export const PLANETS: Record<PlanetId, PlanetMeta> = {
  p1: {
    id: 'p1',
    name: 'BIUROKRACJA-7 · STACJA Q-4',
    sub: 'sortownia odpadów pozaziemskich · zmiana II',
    questText: 'Pani Helena: „Przynieś 5 formularzy F-17/B. Nie ma ich w kosmosie.”',
    beltLabel: '▸ TAŚMA WEJŚCIOWA',
    zoneLabels: [
      { id: 'akcept', icon: '✓ AKCEPT', sub: 'pieczątka OK · numer zgodny' },
      { id: 'odrzut', icon: '✗ ODRZUT', sub: 'brak stempla · zły numer' },
      { id: 'przekaz', icon: '↑ PRZEKAŻ WYŻEJ', sub: 'nie nasza kompetencja' },
    ],
  },
  p2: {
    id: 'p2',
    name: 'HYPER-MART GALAKTYCZNY · KASA 47',
    sub: 'Customer Delight Programme™ · zmiana premium',
    questText: 'Officer 4782-B: „Proszę podpisać klauzulę w 17 miejscach.”',
    beltLabel: '▸ TAŚMA KASOWA',
    zoneLabels: [
      { id: 'akcept', icon: '✓ SKANUJ', sub: 'ring up' },
      { id: 'odrzut', icon: '✗ ODMÓW', sub: 'deprecated' },
      { id: 'przekaz', icon: '↑ SUPERVISOR', sub: 'flag up' },
    ],
  },
  p3: {
    id: 'p3',
    name: 'FLARGLEBLOOP-IV · STACJA 3-OCZU',
    sub: 'segregacja żółtości · czas gra rolę',
    questText: 'Blorgonauta Xyzzy: „Zdobądź NAPRAWDĘ ŻÓŁTY surowiec. Albo kamień.”',
    beltLabel: '▸ TAŚMA ŻÓŁTOŚCI',
    zoneLabels: [
      { id: 'akcept', icon: 'ŻÓŁTY', sub: 'zwykły' },
      { id: 'odrzut', icon: 'BARDZO ŻÓŁTY', sub: 'z kropkami' },
      { id: 'przekaz', icon: 'NAPRAWDĘ ŻÓŁTY', sub: 'z fioletem' },
    ],
  },
  p4: {
    id: 'p4',
    name: 'STACJA KOŃCOWA · SALA TRONOWA',
    sub: 'meta-sortowanie życia · arbitraż ostateczny',
    questText: 'Arbiter Śmieci: „Przynieś mi MÓJ ZAGUBIONY PORTFEL. Zostawiłem go w nebuli.”',
    beltLabel: '▸ TAŚMA OSTATECZNA',
    zoneLabels: [
      { id: 'akcept', icon: 'W LEWEJ RĘCE', sub: 'rzeczy zebrane' },
      { id: 'odrzut', icon: 'Z DZIECIŃSTWA', sub: 'rzeczy pamiętane' },
      { id: 'przekaz', icon: 'FIOLETOWE', sub: 'metafizycznie' },
    ],
  },
};
