import type { PuzzleHotspot } from '@/types/puzzle';

interface Props {
  hotspot: PuzzleHotspot;
  onClick: (id: string) => void;
}

export function Hotspot({ hotspot, onClick }: Props) {
  return (
    <div
      className="hotspot"
      style={{ left: hotspot.x, top: hotspot.y, width: hotspot.w, height: hotspot.h }}
      onClick={() => onClick(hotspot.id)}
      title={hotspot.label}
    >
      <div className="hotspot-label">{hotspot.label}</div>
    </div>
  );
}
