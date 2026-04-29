import { useStore } from '@/state/store';
import { selectMood } from '@/state/selectors';
import { PixelPortrait } from '../PixelPortrait';
import { PLANETS } from '@/content/planets';

export function TopBar() {
  const planet = useStore((s) => s.planet);
  const credits = useStore((s) => s.credits);
  const sorting = useStore((s) => s.sorting);
  const mood = useStore(selectMood);
  const meta = PLANETS[planet];
  const correct = sorting?.correct ?? 0;
  const quota = sorting?.pool.length ?? 15;

  return (
    <div className="topbar">
      <PixelPortrait face={mood} size={56} className="portrait" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div className="lblAcc">{meta.name}</div>
        <div className="vtS">{meta.sub}</div>
      </div>
      <div className="stat">
        <div className="k">Kontyngent</div>
        <div className="v">
          {correct}/{quota}
        </div>
      </div>
      <div className="stat">
        <div className="k">Kredyty</div>
        <div className="v">{credits} ₢</div>
      </div>
    </div>
  );
}
