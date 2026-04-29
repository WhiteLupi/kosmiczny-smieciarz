export type ZoneId = 'akcept' | 'odrzut' | 'przekaz';

export interface SortingItem {
  id: string;
  numer: string;
  pieczatka: 'niebieska' | 'czarna' | 'czerwona';
  stempel: 'mokry' | 'suchy';
  obywatel: 'Ziemianin' | 'Marsjanin' | 'Inny';
  data: 'parzysta' | 'nieparzysta';
  osoba: string;
  dataStr: string;
  sprawa: string;
  okienko: number;
  isHeroTest?: boolean;
}

export interface SortingZone {
  id: ZoneId;
  label: string;
  sub: string;
}

export type RuleEvaluate = (item: SortingItem) => ZoneId | null;

export interface SortingRule {
  id: string;
  unlock: number;
  text: string;
  evaluate: RuleEvaluate;
}

export interface SortingState {
  sceneId: string;
  pool: SortingItem[];
  idx: number;
  rules: SortingRule[];
  unlocked: Set<string>;
  correct: number;
  errors: number;
  heroTestDone: boolean;
  firedInterruptions: Set<string>;
  hintsRemaining: number;
}
