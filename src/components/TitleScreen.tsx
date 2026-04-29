import { useEffect, useMemo } from 'react';
import { useStore } from '@/state/store';
import { ensureAudio } from '@/audio/sfx';

interface Star {
  left: number;
  top: number;
  delay: number;
}

export function TitleScreen() {
  const setMode = useStore((s) => s.setMode);

  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 60 }, () => ({
        left: Math.random() * 1280,
        top: Math.random() * 800,
        delay: Math.random() * 3,
      })),
    [],
  );

  useEffect(() => {
    function start() {
      ensureAudio();
      setMode('sorting');
    }
    function onKey() { start(); }
    function onClick() { start(); }
    window.addEventListener('keydown', onKey, { once: true });
    window.addEventListener('click', onClick, { once: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
    };
  }, [setMode]);

  return (
    <div className="screen title-screen">
      <div className="title-stars">
        {stars.map((s, i) => (
          <i key={i} style={{ left: s.left, top: s.top, animationDelay: `${s.delay}s` }} />
        ))}
      </div>
      <div className="title-logo">
        KOSMICZNY
        <br />
        ŚMIECIARZ
      </div>
      <div className="title-sub">— parodia hero complexu w grach —</div>
      <div className="title-press">▸ PRESS ANY KEY TO START ZBIERANIE ◂</div>
      <div className="title-cr">(c) 1993 BRONOSOFT · VGA · 640×400 · SOUND BLASTER DETECTED</div>
    </div>
  );
}
