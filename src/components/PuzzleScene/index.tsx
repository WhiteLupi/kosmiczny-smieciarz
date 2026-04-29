import { useStore } from '@/state/store';
import { f17bPuzzle } from '@/content/puzzles/formularzF17B';
import { arbiterWalletPuzzle } from '@/content/puzzles/arbiterWallet';
import { Hotspot } from './Hotspot';
import { applyHotspotEffect } from '@/game/puzzleEngine';
import type { PuzzleScene } from '@/types/puzzle';

const PUZZLES: Record<string, PuzzleScene> = {
  f17b: f17bPuzzle,
  arbiter_wallet: arbiterWalletPuzzle,
};

export function PuzzleSceneHost() {
  const id = useStore((s) => s.activePuzzleId);
  const exitPuzzle = useStore((s) => s.exitPuzzle);
  const setOverlay = useStore((s) => s.setOverlay);
  if (!id) return null;
  const puzzle = PUZZLES[id];
  if (!puzzle) return null;

  return (
    <div className={`puzzle-scene puzzle-${puzzle.id}`}>
      <div className="puzzle-bg" />
      <div className="puzzle-title">▸ {puzzle.title} ◂</div>
      {puzzle.hotspots.map((h) => (
        <Hotspot
          key={h.id}
          hotspot={h}
          onClick={() => applyHotspotEffect(useStore.getState(), puzzle.id, h.id, h.effect)}
        />
      ))}
      <button
        className="btn ghost puzzle-back"
        onClick={() => {
          exitPuzzle();
          setOverlay('none');
        }}
      >
        ◂ WRÓĆ
      </button>
    </div>
  );
}
