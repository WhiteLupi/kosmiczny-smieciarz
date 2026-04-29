export interface PuzzleHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  effect: string;
}

export interface PuzzleScene {
  id: string;
  title: string;
  bgPalette: 'p1' | 'p2' | 'p3' | 'p4';
  hotspots: PuzzleHotspot[];
}

export interface PuzzleProgress {
  unlockedHotspots: Set<string>;
  collectedClues: Set<string>;
  solved: boolean;
}
