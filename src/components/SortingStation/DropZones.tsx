import { useDroppable } from '@dnd-kit/core';
import { useStore } from '@/state/store';
import { PLANETS } from '@/content/planets';
import type { ZoneId } from '@/types/sorting';

interface Props {
  onChoose: (id: ZoneId) => void;
  onHint: () => void;
}

const KEY_HINT: Record<ZoneId, string> = { akcept: '[1]', odrzut: '[2]', przekaz: '[3]' };

function Zone({
  id,
  icon,
  sub,
  hint,
  onChoose,
}: {
  id: ZoneId;
  icon: string;
  sub: string;
  hint: string;
  onChoose: (id: ZoneId) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`zone ${id} ${isOver ? 'hover' : ''}`}
      data-zone={id}
      onClick={() => onChoose(id)}
    >
      <div className="icn">{icon}</div>
      <div className="sub">{sub}</div>
      <div className="hint">{hint}</div>
    </div>
  );
}

export function DropZones({ onChoose, onHint }: Props) {
  const planet = useStore((s) => s.planet);
  const hintsRemaining = useStore((s) => s.sorting?.hintsRemaining ?? 0);
  const zones = PLANETS[planet].zoneLabels;
  const noHints = hintsRemaining <= 0;
  return (
    <div className="zones">
      {zones.map((z) => (
        <Zone key={z.id} id={z.id} icon={z.icon} sub={z.sub} hint={KEY_HINT[z.id]} onChoose={onChoose} />
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
        <button
          className="btn ghost"
          onClick={onHint}
          disabled={noHints}
          style={noHints ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
        >
          ? PODPOWIEDŹ ({hintsRemaining}/3)
        </button>
      </div>
    </div>
  );
}
