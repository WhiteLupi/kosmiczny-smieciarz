import { useEffect } from 'react';
import { useStore } from '@/state/store';
import { applyPalette } from '@/state/applyPalette';
import { setSfxEnabled } from '@/audio/sfx';
import { signOut } from '@/auth/authActions';
import type { PlanetId, Pace, MoodId } from '@/types/game';

export function TweaksPanel() {
  const t = useStore((s) => s.tweaks);
  const setT = useStore((s) => s.setTweak);
  const planet = useStore((s) => s.planet);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const setPlanet = useStore((s) => s.setPlanet);
  const toggle = useStore((s) => s.toggleTweaksPanel);

  useEffect(() => {
    document.documentElement.style.setProperty('--crt', String(t.crtIntensity));
  }, [t.crtIntensity]);

  useEffect(() => {
    setSfxEnabled(t.sfxOn);
  }, [t.sfxOn]);

  if (mode === 'boot' || mode === 'title') return null;

  return (
    <>
      <button className="btn ghost tweaks-toggle" onClick={toggle}>⚙ TWEAKS</button>
      {t.panelVisible && (
        <div className="tweaks-panel">
          <h3 className="lblAcc">▸ TWEAKS / USTAWIENIA</h3>
          <div className="tw-row">
            <span>CRT</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={t.crtIntensity}
              onChange={(e) => setT('crtIntensity', parseFloat(e.target.value))}
            />
          </div>
          <div className="tw-row">
            <span>Paleta</span>
            <select
              value={planet}
              onChange={(e) => {
                const p = e.target.value as PlanetId;
                applyPalette(p);
                setPlanet(p);
              }}
            >
              <option value="p1">P1 · Biurokracja</option>
              <option value="p2">P2 · Hyper-Mart</option>
              <option value="p3">P3 · Flarglebloop</option>
              <option value="p4">P4 · Stacja</option>
            </select>
          </div>
          <div className="tw-row">
            <span>Tempo reguł</span>
            <select value={t.paceMode} onChange={(e) => setT('paceMode', e.target.value as Pace)}>
              <option value="fast">Szybkie (2/3/5/7)</option>
              <option value="normal">Normalne (3/6/9/12)</option>
              <option value="slow">Wolne (5/8/11/14)</option>
            </select>
          </div>
          <div className="tw-row">
            <span>Mood</span>
            <select
              value={t.moodOverride}
              onChange={(e) => setT('moodOverride', e.target.value as MoodId | 'auto')}
            >
              <option value="auto">auto</option>
              <option value="pl_normal">normal</option>
              <option value="pl_tired">tired</option>
              <option value="pl_greedy">greedy</option>
              <option value="pl_surprised">surprised</option>
              <option value="pl_panicked">panicked</option>
            </select>
          </div>
          <div className="tw-row">
            <span>SFX</span>
            <button className="tglBtn" onClick={() => setT('sfxOn', !t.sfxOn)}>
              {t.sfxOn ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="tw-row">
            <span>Tekst</span>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={t.textSpeed}
              onChange={(e) => setT('textSpeed', parseInt(e.target.value, 10))}
            />
          </div>
          <div className="tw-row" style={{ marginTop: 10 }}>
            <button className="tglBtn" onClick={() => location.reload()}>RESET GRY</button>
            <button className="tglBtn" onClick={() => setMode('finale')}>SKIP DO FINAŁU</button>
          </div>
          <AuthRow />
        </div>
      )}
    </>
  );
}

function AuthRow() {
  const user = useStore((s) => s.user);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  return (
    <div className="tw-row" style={{ marginTop: 10, borderTop: '1px dotted var(--p-frame-dk)', paddingTop: 10 }}>
      <span style={{ fontSize: 16, color: 'var(--p-ink-dim)' }}>
        {user ? `▸ ${user.email ?? 'zalogowany'}` : '▸ niezalogowany'}
      </span>
      {user ? (
        <button className="tglBtn" onClick={() => void signOut()}>WYLOGUJ</button>
      ) : (
        <button className="tglBtn" onClick={() => setShowAuthModal(true)}>ZALOGUJ</button>
      )}
    </div>
  );
}
