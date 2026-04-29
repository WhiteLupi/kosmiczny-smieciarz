import { useEffect } from 'react';
import { useStore } from '@/state/store';

export function SettingsHotkeys() {
  const setT = useStore((s) => s.setTweak);
  const t = useStore((s) => s.tweaks);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'F1') {
        ev.preventDefault();
        setT('crtIntensity', t.crtIntensity > 0 ? 0 : 0.2);
      }
      if (ev.key === 'm' || ev.key === 'M') {
        setT('sfxOn', !t.sfxOn);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [t.crtIntensity, t.sfxOn, setT]);

  return null;
}
