import { useState } from 'react';
import { useStore } from '@/state/store';
import { sendMagicLink, signInWithProvider } from '@/auth/authActions';
import { isCloudEnabled } from '@/lib/supabase';

export function AuthModal() {
  const show = useStore((s) => s.showAuthModal);
  const setShow = useStore((s) => s.setShowAuthModal);
  const status = useStore((s) => s.authStatus);
  const error = useStore((s) => s.authError);
  const [email, setEmail] = useState('');

  if (!show) return null;

  const cloudOn = isCloudEnabled();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try { await sendMagicLink(email.trim()); } catch { /* state already updated */ }
  }

  return (
    <div className="auth-overlay" onClick={() => setShow(false)}>
      <div className="auth-modal frame" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <span className="lblAcc">▸ ZALOGUJ ŻEBY ZACHOWAĆ NUMEREK</span>
          <button className="auth-close" onClick={() => setShow(false)} aria-label="zamknij">×</button>
        </div>
        <div className="auth-body">
          {!cloudOn && (
            <div className="auth-warn">
              ⚠ Cloud features niedostępne (brak konfiguracji serwera). Gra działa offline.
            </div>
          )}

          {cloudOn && status !== 'sent' && (
            <>
              <div className="auth-section">
                <div className="lblAcc">▸ E-MAIL (LINK MAGICZNY)</div>
                <form onSubmit={handleMagicLink} className="auth-form">
                  <input
                    type="email"
                    placeholder="kasia@srodowisko.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    required
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    className="btn primary"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'WYSYŁAM...' : '▸ WYŚLIJ LINK'}
                  </button>
                </form>
                <div className="auth-hint">
                  Klikniesz w link w mailu i jesteś zalogowana. Bez hasła do zapamiętania.
                </div>
              </div>

              <div className="auth-divider">— LUB —</div>

              <div className="auth-section">
                <button className="btn auth-oauth" onClick={() => signInWithProvider('google')}>
                  <span>G</span> ZALOGUJ Z GOOGLE
                </button>
                <button className="btn auth-oauth" onClick={() => signInWithProvider('github')}>
                  <span>⬡</span> ZALOGUJ Z GITHUB
                </button>
              </div>
            </>
          )}

          {status === 'sent' && (
            <div className="auth-section">
              <div className="auth-success">
                ✓ LINK WYSŁANY
                <div className="auth-hint">
                  Sprawdź {email}. Klikniesz w link i wracasz tu zalogowana.
                  Sprawdź spam jeśli nie widzisz w 30s.
                </div>
              </div>
            </div>
          )}

          {error && <div className="auth-error">▸ BŁĄD: {error}</div>}

          <div className="auth-footer">
            <button className="btn ghost" onClick={() => setShow(false)}>
              ▸ KONTYNUUJ ANONIMOWO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
