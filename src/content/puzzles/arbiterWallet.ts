import type { PuzzleScene } from '@/types/puzzle';

export const arbiterWalletPuzzle: PuzzleScene = {
  id: 'arbiter_wallet',
  title: 'SALA TRONOWA · POSZUKIWANIE PORTFELA',
  bgPalette: 'p4',
  hotspots: [
    { id: 'tron',         label: 'Tron Arbitra',                  x: 540, y: 200, w: 200, h: 280, effect: 'arbiter_inspect_throne' },
    { id: 'pompa',        label: 'Pompa Arbitra',                 x: 200, y: 380, w: 120, h: 200, effect: 'arbiter_inspect_pump' },
    { id: 'paragon',      label: 'Paragon z 1987 na podłodze',    x: 360, y: 580, w: 160, h:  80, effect: 'arbiter_collect_paragon' },
    { id: 'zdjecie',      label: 'Zdjęcie wklejone w formularzu', x: 820, y: 480, w: 140, h: 100, effect: 'arbiter_collect_zdjecie' },
    { id: 'kupon',        label: 'Kupon HyperMart na biurku',     x:1000, y: 540, w: 140, h: 100, effect: 'arbiter_collect_kupon' },
    { id: 'szuflada',     label: 'Szuflada pod tronem',           x: 580, y: 480, w: 120, h:  80, effect: 'arbiter_open_drawer' },
    { id: 'archive_door', label: 'Drzwi obok',                    x:  60, y: 200, w: 100, h: 280, effect: 'arbiter_inspect_door' },
  ],
};
