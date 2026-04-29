import { useEffect, useMemo } from 'react';
import { useStore } from '@/state/store';
import { applyPalette } from '@/state/applyPalette';

interface Star {
  left: number;
  top: number;
  delay: number;
}

export function TransitScreen() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 80 }, () => ({
        left: 200 + Math.random() * 1000,
        top: Math.random() * 800,
        delay: Math.random() * 2.5,
      })),
    [],
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      // After P1 transit → switch to P4 (Stacja Końcowa) palette + open Arbiter intro
      const s = useStore.getState();
      s.setPlanet('p4');
      applyPalette('p4');
      // Stay in 'sorting' mode as background; Arbiter dialog overlays
      s.setMode('sorting');
      s.openDialog('arbiter_intro', 'i_start');
      s.setOverlay('dialog');
    }, 2800);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="screen transit-screen">
      <div className="transit-stars">
        {stars.map((s, i) => (
          <i key={i} style={{ left: s.left, top: s.top, animationDelay: `${s.delay}s` }} />
        ))}
      </div>
      <div className="transit-ship" />
      <div className="transit-caption">Lecę na STACJĘ KOŃCOWĄ...</div>
    </div>
  );
}
