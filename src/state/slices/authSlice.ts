import type { StateCreator } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthSlice {
  session: Session | null;
  user: User | null;
  authStatus: 'idle' | 'sending' | 'sent' | 'error';
  authError: string | null;
  showAuthModal: boolean;
  setSession: (s: Session | null) => void;
  setAuthStatus: (s: AuthSlice['authStatus'], error?: string | null) => void;
  setShowAuthModal: (show: boolean) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  session: null,
  user: null,
  authStatus: 'idle',
  authError: null,
  showAuthModal: false,
  setSession: (s) => set({ session: s, user: s?.user ?? null }),
  setAuthStatus: (s, error = null) => set({ authStatus: s, authError: error }),
  setShowAuthModal: (show) => set({ showAuthModal: show }),
});
