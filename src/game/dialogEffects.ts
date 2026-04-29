import type { GameStore } from '@/state/store';
import type { DialogEffectId } from '@/content/dialogs';

export function applyDialogEffect(s: GameStore, id: DialogEffectId): void {
  switch (id) {
    case 'helena_choose_odrzut':
    case 'helena_choose_akcept':
    case 'helena_choose_przekaz': {
      // remove the Helena hero-test form from the pool (whichever choice player made)
      const cur = s.sorting;
      if (cur) {
        const item = cur.pool[cur.idx];
        if (item?.isHeroTest) s.removeCurrentItem();
      }
      s.setFlag(`helena_chose_${id.split('_').pop()!}`, true);
      break;
    }
    case 'helena_passed_grant':
      s.setFlag('recentSurprise', true);
      setTimeout(() => s.setFlag('recentSurprise', false), 1500);
      s.addCredits(20);
      s.addItem('F-17/B', 5);
      s.setFlag('helenaPassed');
      break;
    case 'end_p1_day':
      s.closeDialog();
      s.setOverlay('none');
      s.setMode('dayEnd');
      break;
    case 'zenek_accept':
      s.setFlag('acceptedZenk');
      break;
    case 'puzzle_unlock_szwagier':
      s.collectClue('f17b', 'szwagier_unlocked');
      break;
    case 'puzzle_collect_F3':
      s.addItem('F-3', 1);
      s.collectClue('f17b', 'F-3');
      break;
    case 'puzzle_swap_F3_to_F9':
      if ((s.inventory['F-3'] ?? 0) > 0) {
        s.consumeItem('F-3');
        s.addItem('F-9', 1);
        s.collectClue('f17b', 'F-9');
      }
      break;
    case 'puzzle_collect_F9':
      s.collectClue('f17b', 'F-9-collected');
      break;
    case 'puzzle_solve_f17b':
      if ((s.inventory['F-9'] ?? 0) > 0) {
        s.consumeItem('F-9');
        s.addItem('F-17/B', 5);
        s.solvePuzzle('f17b');
        s.setFlag('f17bSolved');
        s.setFlag('helenaPassed');
        s.exitPuzzle();
        s.setOverlay('none');
        s.closeDialog();
        s.setMode('dayEnd');
      }
      break;
    case 'arbiter_offer_quest':
      s.closeDialog();
      s.setOverlay('puzzle');
      s.enterPuzzle('arbiter_wallet');
      break;
    case 'arbiter_finale_choose_collect':
    case 'arbiter_finale_choose_refuse':
      s.setFlag('finaleChose');
      s.closeDialog();
      s.setOverlay('none');
      s.setMode('finale');
      break;
  }
}
