import { supabase } from '@/lib/supabase';
import { useStore } from '@/state/store';

export async function sendMagicLink(email: string): Promise<void> {
  if (!supabase) throw new Error('Cloud features wyłączone (brak konfiguracji)');
  const s = useStore.getState();
  s.setAuthStatus('sending');
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) {
    s.setAuthStatus('error', error.message);
    throw error;
  }
  s.setAuthStatus('sent');
}

export async function signInWithProvider(provider: 'google' | 'github'): Promise<void> {
  if (!supabase) throw new Error('Cloud features wyłączone');
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin },
  });
  if (error) {
    useStore.getState().setAuthStatus('error', error.message);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
  useStore.getState().setSession(null);
}

/**
 * Initialize auth listener. Call once on app boot.
 * No-op when supabase client missing.
 */
export function initAuth(): void {
  if (!supabase) return;
  let prevUserId: string | null = null;

  void supabase.auth.getSession().then(({ data }) => {
    useStore.getState().setSession(data.session);
    const uid = data.session?.user.id ?? null;
    if (uid) {
      prevUserId = uid;
      void import('@/state/cloudSync').then((m) => m.syncOnLogin(uid));
    }
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    useStore.getState().setSession(session);
    const newUid = session?.user.id ?? null;
    if (newUid && newUid !== prevUserId) {
      prevUserId = newUid;
      void import('@/state/cloudSync').then((m) => m.syncOnLogin(newUid));
    } else if (!newUid) {
      prevUserId = null;
    }
  });
}
