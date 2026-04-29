import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const KEY = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined;

/**
 * Cloud client. Null gdy env vars nie ustawione → cloud features nieaktywne,
 * gra działa offline-first (localStorage only). Po dodaniu env vars + redeploy → cloud on.
 */
export const supabase: SupabaseClient | null =
  URL && KEY
    ? createClient(URL, KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true, // magic link callback handling
          flowType: 'pkce', // bezpieczniejsze niż implicit dla SPA
          storageKey: 'kosmiczny-smieciarz-auth',
        },
      })
    : null;

export function isCloudEnabled(): boolean {
  return supabase !== null;
}
