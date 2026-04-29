import type { PuzzleScene } from '@/types/puzzle';

export const f17bPuzzle: PuzzleScene = {
  id: 'f17b',
  title: 'BIURO HELENY · ZAGADKA F-17/B',
  bgPalette: 'p1',
  hotspots: [
    { id: 'helena_door',  label: 'Pani Helena (okienko 7)', x:  80, y: 120, w: 120, h: 200, effect: 'open_dialog:helena_quest' },
    { id: 'stroz',        label: 'Stróż przy składzie',     x: 240, y: 380, w: 120, h: 200, effect: 'open_dialog:stroz' },
    { id: 'szwagier',     label: 'Szwagier Heleny',          x: 420, y: 280, w: 120, h: 200, effect: 'open_dialog:szwagier' },
    { id: 'okienko12',    label: 'Okienko 12 (?)',           x: 620, y: 200, w: 120, h: 280, effect: 'open_dialog:okienko12' },
    { id: 'biurko_zenek', label: 'Biurko z gazetami',        x: 820, y: 420, w: 140, h: 160, effect: 'flavor_gazety' },
    { id: 'archiwista',   label: 'Drzwi archiwum',           x:1020, y: 200, w: 120, h: 280, effect: 'open_dialog:archiwista' },
  ],
};
