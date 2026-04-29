import { supabase } from '@/lib/supabase';
import { useStore } from './store';
import { serialize, rehydrate, type PersistedSnapshot } from './persistence';
import { debounce } from '@/utils/debounce';
import { pushToast } from '@/components/Toast';

interface CloudSaveRow {
  snapshot: PersistedSnapshot;
  updated_at: string;
}

export type SyncStatus = 'idle' | 'pulling' | 'pushing' | 'synced' | 'error';
let syncStatus: SyncStatus = 'idle';
const listeners = new Set<(s: SyncStatus) => void>();

export function getSyncStatus(): SyncStatus { return syncStatus; }
export function onSyncStatus(fn: (s: SyncStatus) => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
function setSyncStatus(s: SyncStatus): void {
  syncStatus = s;
  listeners.forEach((fn) => fn(s));
}

export async function pullFromCloud(userId: string): Promise<CloudSaveRow | null> {
  if (!supabase) return null;
  setSyncStatus('pulling');
  const { data, error } = await supabase
    .from('saves')
    .select('snapshot, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    setSyncStatus('error');
    return null;
  }
  setSyncStatus('synced');
  if (!data) return null;
  return data as CloudSaveRow;
}

export async function pushToCloud(userId: string, snapshot: PersistedSnapshot): Promise<boolean> {
  if (!supabase) return false;
  setSyncStatus('pushing');
  const { error } = await supabase
    .from('saves')
    .upsert(
      { user_id: userId, snapshot, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  if (error) {
    setSyncStatus('error');
    return false;
  }
  setSyncStatus('synced');
  return true;
}

/** Determine if a snapshot has meaningful progress worth syncing. */
function hasProgress(snap: PersistedSnapshot): boolean {
  return (
    snap.credits > 0 ||
    !!snap.sorting ||
    !!snap.flags.helenaPassed ||
    !!snap.flags.f17bSolved ||
    Object.keys(snap.puzzle ?? {}).length > 0 ||
    Object.values(snap.inventory).some((v) => v > 0)
  );
}

/**
 * Sync on login.
 * - If remote exists → download (cloud is canonical for returning user).
 * - Else if local has progress → upload local as initial cloud save.
 * - Else noop (fresh user).
 */
export async function syncOnLogin(userId: string): Promise<'downloaded' | 'uploaded' | 'noop'> {
  const remote = await pullFromCloud(userId);
  if (remote) {
    rehydrate(remote.snapshot);
    pushToast('▸ POSTĘPY WCZYTANE Z CHMURY');
    return 'downloaded';
  }
  const local = serialize(useStore.getState());
  if (hasProgress(local)) {
    const ok = await pushToCloud(userId, local);
    if (ok) pushToast('▸ POSTĘPY ZAPISANE W CHMURZE');
    return 'uploaded';
  }
  return 'noop';
}

const debouncedCloudPush = debounce((userId: string, snap: PersistedSnapshot) => {
  void pushToCloud(userId, snap);
}, 2000);

/** Trigger debounced cloud push for current state if user is logged in. */
export function maybeScheduleCloudPush(): void {
  const s = useStore.getState();
  const uid = s.user?.id;
  if (!uid || !supabase) return;
  debouncedCloudPush(uid, serialize(s));
}
