import { useEffect, useState } from 'react';
import { useStore } from '@/state/store';
import { sendMagicLink, signOut } from '@/auth/authActions';
import { isCloudEnabled } from '@/lib/supabase';

function flavorError(raw: string | null): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes('rate limit')) {
    return 'Poczta państwowa nie wyrabia. Limit 4 listów na godzinę. Niech Pan/Pani odczeka — albo idzie na piwo. Wróci o pełnej godzinie.';
  }
  if (lower.includes('invalid') && lower.includes('email')) {
    return 'Email niepoprawny. Pan nie ma maila? To skąd Pan nazwisko? Niech Pan wpisze coś z @ i kropką.';
  }
  if (lower.includes('signup')) {
    return 'Rejestracja zamknięta. Okienko z rejestrami zlikwidowano w 1987. Niech Pan/Pani spróbuje znów.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Łącze z chmurą zerwane. Może to drut, może to ZUS. Niech Pan/Pani sprawdzi internet i spróbuje znów.';
  }
  return `BŁĄD URZĘDU: ${raw}`;
}

export function AuthModal() {
  const show = useStore((s) => s.showAuthModal);
  const setShow = useStore((s) => s.setShowAuthModal);
  const status = useStore((s) => s.authStatus);
  const error = useStore((s) => s.authError);
  const user = useStore((s) => s.user);
  const anonNick = useStore((s) => s.anonNick);
  const setAnonNick = useStore((s) => s.setAnonNick);
  const [email, setEmail] = useState('');
  const [nickDraft, setNickDraft] = useState('');
  const [nickSaved, setNickSaved] = useState(false);

  useEffect(() => {
    if (show) {
      setNickDraft(anonNick);
      setNickSaved(false);
    }
  }, [show, anonNick]);

  if (!show) return null;

  const cloudOn = isCloudEnabled();
  const flavor = flavorError(error);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try { await sendMagicLink(email.trim()); } catch { /* state already updated */ }
  }

  function handleNickSave() {
    const trimmed = nickDraft.trim();
    if (trimmed && trimmed !== anonNick) {
      setAnonNick(trimmed);
      setNickSaved(true);
      window.setTimeout(() => setNickSaved(false), 1500);
    }
  }

  return (
    <div className="auth-overlay" onClick={() => setShow(false)}>
      <div className="auth-modal frame" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <span className="lblAcc">▸ TWÓJ PROFIL ŚMIECIARZA</span>
          <button className="auth-close" onClick={() => setShow(false)} aria-label="zamknij">×</button>
        </div>
        <div className="auth-body">
          {/* Nick edit — always visible */}
          <div className="auth-section">
            <div className="lblAcc">▸ TWOJE IMIĘ NA TABLICY</div>
            <div className="auth-form">
              <input
                type="text"
                value={nickDraft}
                onChange={(e) => setNickDraft(e.target.value)}
                className="auth-input"
                maxLength={32}
                placeholder="Śmieciarz #1234"
              />
              <button
                type="button"
                className="btn primary"
                onClick={handleNickSave}
                disabled={!nickDraft.trim() || nickDraft.trim() === anonNick}
              >
                {nickSaved ? '✓ ZAPISANO' : 'ZAPISZ'}
              </button>
            </div>
            <div className="auth-hint">
              Pod tym imieniem będziesz na liście rankingowej. Tu zmienisz, kiedy chcesz.
            </div>
          </div>

          {/* Auth section */}
          <div className="auth-divider">— KONTO —</div>

          {!cloudOn && (
            <div className="auth-warn">
              ⚠ Cloud features niedostępne (brak konfiguracji serwera). Gra działa offline.
            </div>
          )}

          {cloudOn && user && (
            <div className="auth-section">
              <div className="auth-hint" style={{ marginTop: 0 }}>
                ▸ Zalogowana jako <b style={{ color: 'var(--p-accent)' }}>{user.email}</b>. Postępy synchronizują się do chmury.
              </div>
              <button
                type="button"
                className="btn"
                style={{ marginTop: 10 }}
                onClick={() => void signOut()}
              >
                ▸ WYLOGUJ
              </button>
            </div>
          )}

          {cloudOn && !user && status !== 'sent' && (
            <>
              <div className="auth-section">
                <div className="lblAcc">▸ ZALOGUJ MAILEM (LINK MAGICZNY)</div>
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
                  Sprawdź spam folder jeśli nie widzisz w skrzynce w 60s.
                </div>
              </div>

              <div className="auth-divider">— LUB (WKRÓTCE) —</div>

              <div className="auth-section">
                <button className="btn auth-oauth" disabled title="Wkrótce — Pan jeszcze nie podpisał klauzuli z Google'em">
                  <span>G</span> ZALOGUJ Z GOOGLE <small style={{ marginLeft: 'auto', opacity: .6 }}>(wkrótce)</small>
                </button>
                <button className="btn auth-oauth" disabled title="Wkrótce — okienko OAuth było likwidowane w 1987">
                  <span>⬡</span> ZALOGUJ Z GITHUB <small style={{ marginLeft: 'auto', opacity: .6 }}>(wkrótce)</small>
                </button>
              </div>
            </>
          )}

          {cloudOn && status === 'sent' && (
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

          {flavor && <div className="auth-error">▸ {flavor}</div>}

          <div className="auth-footer">
            <button className="btn ghost" onClick={() => setShow(false)}>
              ▸ ZAMKNIJ I GRAJ DALEJ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
