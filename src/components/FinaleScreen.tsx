import { useEffect, useState } from 'react';
import { useStore } from '@/state/store';
import { PixelPortrait } from './PixelPortrait';
import { isCloudEnabled } from '@/lib/supabase';
import {
  submitRun,
  getTopRuns,
  getHelenaStats,
  type RunRow,
  type HelenaStats,
} from '@/state/leaderboard';

export function FinaleScreen() {
  const [showHelena, setShowHelena] = useState(false);
  const [topRuns, setTopRuns] = useState<RunRow[] | null>(null);
  const [helenaStats, setHelenaStats] = useState<HelenaStats | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sorting = useStore((s) => s.sorting);
  const flags = useStore((s) => s.flags);
  const user = useStore((s) => s.user);
  const gameStartedAt = useStore((s) => s.gameStartedAt);
  const anonNick = useStore((s) => s.anonNick);
  const puzzleProgress = useStore((s) => s.puzzleProgress);

  // 6s delay → Helena slide-in
  useEffect(() => {
    const t = window.setTimeout(() => setShowHelena(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  // Submit run + fetch leaderboard once
  useEffect(() => {
    if (submitted || !isCloudEnabled()) return;
    setSubmitted(true);

    const correct = sorting?.correct ?? 0;
    const errors = sorting?.errors ?? 0;
    const timeSeconds = gameStartedAt
      ? Math.max(0, Math.round((Date.now() - gameStartedAt) / 1000))
      : 0;
    const endingChoice: 'collect' | 'refuse' = flags.finaleChose ? 'collect' : 'refuse';
    const arbiterClues = puzzleProgress.arbiter_wallet?.collectedClues.size ?? 0;
    const displayName = user?.email ? user.email.split('@')[0] ?? anonNick : anonNick;

    void (async () => {
      await submitRun({
        userId: user?.id ?? null,
        displayName: displayName.slice(0, 40),
        correct,
        errors,
        timeSeconds,
        endingChoice,
        helenaPassed: !!flags.helenaPassed,
        f17bSolved: !!flags.f17bSolved,
        arbiterClues,
      });
      const [top, stats] = await Promise.all([getTopRuns(10), getHelenaStats()]);
      setTopRuns(top);
      setHelenaStats(stats);
    })();
  }, [submitted, sorting, flags, user, gameStartedAt, anonNick, puzzleProgress]);

  return (
    <div className="screen finale-screen">
      <div className="finale-konie">KONIEC.</div>
      <div className="finale-num">00847</div>
      <div className="finale-bot">
        Gratulacje.<br />
        Nie jesteś wybrańcem. Jesteś śmieciarzem.<br /><br />
        <span style={{ color: '#5a5a5a' }}>
          (serio. to koniec. nie czekaj na post-credits — to nie jest gra Marvela.)
        </span>
      </div>

      {topRuns && topRuns.length > 0 && (
        <div className="finale-leaderboard frame">
          <div className="lblAcc" style={{ marginBottom: 8 }}>▸ TOP 10 NAJSZYBSZYCH ŚMIECIARZY</div>
          <table className="finale-lb-table">
            <thead>
              <tr><th>#</th><th>NICK</th><th>CZAS</th><th>BŁĘDY</th><th>HELENA</th></tr>
            </thead>
            <tbody>
              {topRuns.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{r.display_name}</td>
                  <td>{formatTime(r.time_seconds)}</td>
                  <td>{r.errors}</td>
                  <td>{r.helena_passed ? '✓' : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {helenaStats && helenaStats.total > 0 && (
            <div className="finale-helena-stats">
              ▸ {helenaStats.passed} graczy zdało test Heleny · {helenaStats.failed} oblało · razem {helenaStats.total}
            </div>
          )}
        </div>
      )}

      <div className={`finale-helena ${showHelena ? 'up' : ''}`}>
        <PixelPortrait face="helena" size={64} className="finale-helena-portrait" />
        <div className="bubble">
          Pan jeszcze tu? Ja już kończę dniówkę. Niech pan zamknie.{' '}
          <b style={{ color: '#8a2a2a' }}>Numerek pan ma?</b>
        </div>
      </div>
    </div>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
