import { useStore } from '@/state/store';
import { PLANETS } from '@/content/planets';

interface Props {
  onOpenPuzzle?: () => void;
}

export function QuestPanel({ onOpenPuzzle }: Props) {
  const planet = useStore((s) => s.planet);
  const flags = useStore((s) => s.flags);
  const showPuzzleBtn = planet === 'p1' && !flags.helenaPassed && !flags.f17bSolved;

  return (
    <div className="frame" style={{ padding: '10px 12px' }}>
      <div className="lblAcc" style={{ marginBottom: 6 }}>▸ AKTYWNY QUEST</div>
      <div className="vtS">{PLANETS[planet].questText}</div>
      {showPuzzleBtn && onOpenPuzzle && (
        <button className="btn primary" style={{ marginTop: 8 }} onClick={onOpenPuzzle}>
          ▸ ROZWIĄŻ ZAGADKĘ F-17/B
        </button>
      )}
    </div>
  );
}
