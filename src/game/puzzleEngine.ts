import type { GameStore } from '@/state/store';
import { pushToast } from '@/components/Toast';

const DIALOG_START_NODES: Record<string, string> = {
  helena_quest: 'q_start',
  stroz: 's_start',
  szwagier: 'sz_start',
  okienko12: 'o_start',
  archiwista: 'a_start',
  arbiter_intro: 'i_start',
  arbiter_drawer_locked: 'd_locked',
  arbiter_finale: 'f_start',
};

export function applyHotspotEffect(s: GameStore, puzzleId: string, hotspotId: string, effect: string): void {
  s.unlockHotspot(puzzleId, hotspotId);

  if (effect.startsWith('open_dialog:')) {
    const tree = effect.split(':')[1] ?? '';
    const startNode = DIALOG_START_NODES[tree] ?? 'start';
    s.openDialog(tree, startNode);
    s.setOverlay('dialog');
    return;
  }

  if (effect === 'flavor_gazety') {
    pushToast('GAZETY: same nekrologi i prognozy pogody. Zenek pewnie tu szpera.');
    return;
  }

  if (effect === 'arbiter_inspect_throne') {
    pushToast('Tron Arbitra. Wygląda na ciężki.');
    return;
  }
  if (effect === 'arbiter_inspect_pump') {
    pushToast('Pompa Arbitra pompuje. Co? Niewiadomo.');
    return;
  }
  if (effect === 'arbiter_collect_paragon') {
    if (!s.puzzleProgress[puzzleId]?.collectedClues.has('paragon')) {
      s.collectClue(puzzleId, 'paragon');
      s.addItem('paragon_1987', 1);
      pushToast('+ PARAGON Z 1987 (Arbiter widocznie lubi herbatę)');
    }
    return;
  }
  if (effect === 'arbiter_collect_zdjecie') {
    if (!s.puzzleProgress[puzzleId]?.collectedClues.has('zdjecie')) {
      s.collectClue(puzzleId, 'zdjecie');
      s.addItem('zdjecie_arbiter_helena', 1);
      pushToast('+ ZDJĘCIE: Arbiter i Helena? Romans?');
    }
    return;
  }
  if (effect === 'arbiter_collect_kupon') {
    if (!s.puzzleProgress[puzzleId]?.collectedClues.has('kupon')) {
      s.collectClue(puzzleId, 'kupon');
      s.addItem('kupon_hypermart', 1);
      pushToast('+ KUPON HYPER-MART (Arbiter robił zakupy)');
    }
    return;
  }
  if (effect === 'arbiter_inspect_door') {
    pushToast('Drzwi prowadzą gdzie indziej.');
    return;
  }
  if (effect === 'arbiter_open_drawer') {
    const cur = s.puzzleProgress[puzzleId];
    if (cur && cur.collectedClues.size >= 3) {
      s.addItem('portfel_arbitra', 1);
      s.solvePuzzle(puzzleId);
      s.exitPuzzle();
      s.setOverlay('dialog');
      s.openDialog('arbiter_finale', 'f_start');
    } else {
      s.openDialog('arbiter_drawer_locked', 'd_locked');
      s.setOverlay('dialog');
    }
    return;
  }
}
