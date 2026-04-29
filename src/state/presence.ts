import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

let activeChannel: RealtimeChannel | null = null;
let listeners = new Set<(count: number) => void>();
let lastCount = 0;

export function getPresenceCount(): number { return lastCount; }
export function onPresenceChange(fn: (count: number) => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
function setCount(n: number): void {
  lastCount = n;
  listeners.forEach((fn) => fn(n));
}

/**
 * Subscribe to a presence channel for the given location key (e.g. "p1", "p4", "finale").
 * Auto-cleanup if called again — only one channel at a time.
 */
export async function joinPresence(location: string, identity: string): Promise<void> {
  if (!supabase) return;
  await leavePresence();
  const ch = supabase.channel(`presence:${location}`, {
    config: { presence: { key: identity } },
  });
  ch.on('presence', { event: 'sync' }, () => {
    const state = ch.presenceState();
    const count = Object.keys(state).length;
    setCount(count);
  });
  await ch.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await ch.track({ joined_at: Date.now() });
    }
  });
  activeChannel = ch;
}

export async function leavePresence(): Promise<void> {
  if (!activeChannel) return;
  await activeChannel.untrack();
  await supabase!.removeChannel(activeChannel);
  activeChannel = null;
  setCount(0);
}
