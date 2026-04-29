import { useEffect, useState } from 'react';
import { useStore } from '@/state/store';
import { joinPresence, leavePresence, onPresenceChange } from '@/state/presence';
import { isCloudEnabled } from '@/lib/supabase';

/**
 * Shows "👥 X innych Śmieciarzy" in the corner when ≥1 other player is on
 * the same screen via Supabase Realtime presence.
 */
export function PresenceIndicator() {
  const mode = useStore((s) => s.mode);
  const planet = useStore((s) => s.planet);
  const anonNick = useStore((s) => s.anonNick);
  const userId = useStore((s) => s.user?.id ?? null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const off = onPresenceChange(setCount);
    return off;
  }, []);

  useEffect(() => {
    if (!isCloudEnabled()) return;
    if (mode === 'boot' || mode === 'title') {
      void leavePresence();
      return;
    }
    const location = mode === 'sorting' ? planet : mode;
    const identity = userId ?? anonNick.replace(/\s+/g, '_');
    void joinPresence(location, identity);
    return () => {
      void leavePresence();
    };
  }, [mode, planet, userId, anonNick]);

  // In sorting mode TopBar shows it inline; corner indicator is only for non-sorting screens
  if (mode === 'sorting' || mode === 'boot' || mode === 'title') return null;
  if (count <= 1) return null;
  const others = count - 1;
  return (
    <div className="presence-indicator">
      👥 {others} {others === 1 ? 'inny Śmieciarz' : 'innych Śmieciarzy'} {labelFor(mode, planet)}
    </div>
  );
}

function labelFor(mode: string, planet: string): string {
  if (mode === 'sorting') {
    if (planet === 'p1') return 'przy taśmie';
    if (planet === 'p2') return 'w kasie';
    if (planet === 'p3') return 'wśród żółtości';
    if (planet === 'p4') return 'w sali tronowej';
  }
  if (mode === 'finale') return 'przy okienku 12';
  if (mode === 'transit') return 'w drodze';
  if (mode === 'dayEnd') return 'przy wypłacie';
  return '';
}
