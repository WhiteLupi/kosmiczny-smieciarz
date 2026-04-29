import type { DialogTree } from '@/types/dialog';
import { helenaTestDialog } from './helenaTest';
import { zenekDialog } from './zenek';

export const DIALOGS: Record<string, DialogTree> = {
  helena_test: helenaTestDialog,
  zenek: zenekDialog,
};

export type DialogEffectId =
  // Helena hero test
  | 'helena_choose_odrzut'
  | 'helena_choose_akcept'
  | 'helena_choose_przekaz'
  | 'helena_passed_grant'
  | 'end_p1_day'
  // Zenek
  | 'zenek_accept'
  // F-17/B puzzle (Phase 12)
  | 'puzzle_unlock_szwagier'
  | 'puzzle_collect_F3'
  | 'puzzle_swap_F3_to_F9'
  | 'puzzle_collect_F9'
  | 'puzzle_solve_f17b'
  // Arbiter sequence (Phase 14)
  | 'arbiter_offer_quest'
  | 'arbiter_finale_choose_collect'
  | 'arbiter_finale_choose_refuse';
