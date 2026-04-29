import { useEffect, useState } from 'react';
import { useStore } from '@/state/store';
import { ensureAudio } from '@/audio/sfx';

const BOOT_LINES = [
  'LOADING ASSETS .......... OK',
  'LOADING AUDIO ........... OK',
  'DETECTING VGA ........... OK (640x400)',
  'CHECKING MEMORY ......... 47/48 MB',
];

export function BootScreen() {
  const setMode = useStore((s) => s.setMode);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const lines = BOOT_LINES.slice(0, visibleCount);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    function step() {
      if (cancelled) return;
      i++;
      setVisibleCount(i);
      if (i < BOOT_LINES.length) {
        setTimeout(step, 380);
      } else {
        setShowPrompt(true);
      }
    }
    const t = setTimeout(step, 380);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!showPrompt) return;
    function onKey(e: KeyboardEvent) {
      if (['t', 'T', 'y', 'Y', 'Enter', ' '].includes(e.key)) {
        ensureAudio();
        setMode('title');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showPrompt, setMode]);

  return (
    <div className="screen boot-screen">
      <div className="row">KOSMICZNY_SMIECIARZ.EXE v1.02</div>
      <div className="row">(c) 1993 BRONOSOFT INTERACTIVE</div>
      <div className="row">─────────────────────────────</div>
      {lines.map((l, i) => (
        <div key={i} className="row">{l}</div>
      ))}
      {showPrompt && (
        <div className="row" style={{ marginTop: 8 }}>
          WARNING: Insufficient memory.&nbsp;&nbsp;Continue? [T/N] <span className="cur">&nbsp;</span>
        </div>
      )}
    </div>
  );
}
