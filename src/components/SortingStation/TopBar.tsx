import { useEffect, useState } from 'react';
import { useStore } from '@/state/store';
import { selectMood } from '@/state/selectors';
import { onPresenceChange, getPresenceCount } from '@/state/presence';
import { PixelPortrait } from '../PixelPortrait';
import { PLANETS } from '@/content/planets';

function presenceLabel(planet: string, others: number): string {
  if (others <= 0) return '';
  const word = others === 1 ? 'inny Śmieciarz' : 'innych Śmieciarzy';
  const place =
    planet === 'p1' ? 'przy taśmie' :
    planet === 'p2' ? 'w kasie' :
    planet === 'p3' ? 'wśród żółtości' :
    planet === 'p4' ? 'w sali tronowej' : '';
  return `👥 ${others} ${word} ${place}`.trim();
}

export function TopBar() {
  const planet = useStore((s) => s.planet);
  const credits = useStore((s) => s.credits);
  const sorting = useStore((s) => s.sorting);
  const user = useStore((s) => s.user);
  const anonNick = useStore((s) => s.anonNick);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  const mood = useStore(selectMood);
  const meta = PLANETS[planet];
  const correct = sorting?.correct ?? 0;
  const quota = sorting?.pool.length ?? 15;
  const [presenceCount, setPresenceCount] = useState(getPresenceCount());

  useEffect(() => onPresenceChange(setPresenceCount), []);
  const others = Math.max(0, presenceCount - 1);
  const presence = presenceLabel(planet, others);
  const displayName = user?.email ? (user.email.split('@')[0] ?? anonNick) : anonNick;

  return (
    <div className="topbar">
      <button
        className="profile-btn"
        onClick={() => setShowAuthModal(true)}
        title="Twój profil — kliknij żeby zmienić imię lub się zalogować"
        aria-label="Otwórz profil"
      >
        <PixelPortrait face={mood} size={56} className="portrait" />
        <span className="profile-info">
          <span className="profile-nick">{displayName}</span>
          <span className="profile-sub">
            {user ? '▸ zalogowany' : '▸ klik = profil/login'}
          </span>
        </span>
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div className="lblAcc">{meta.name}</div>
        <div className="vtS">{meta.sub}</div>
        {presence && <div className="topbar-presence">{presence}</div>}
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
