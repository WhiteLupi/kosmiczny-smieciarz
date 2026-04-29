import { useStore } from '@/state/store';
import { applyPalette } from '@/state/applyPalette';
import { biurokracja7Rules } from '@/content/sortingRules/biurokracja7';
import { hyperMartRules } from '@/content/sortingRules/hyperMart';
import { flargleBloopRules } from '@/content/sortingRules/flargleBloop';
import { stacjaKoncowaRules } from '@/content/sortingRules/stacjaKoncowa';
import { buildBiurokracja7Pool } from '@/content/pool';
import type { PlanetId, Pace } from '@/types/game';

const TABS: Array<{ id: PlanetId | 'finale'; label: string }> = [
  { id: 'p1', label: 'P1 · BIUROKRACJA-7' },
  { id: 'p2', label: 'P2 · HYPER-MART' },
  { id: 'p3', label: 'P3 · FLARGLEBLOOP-IV' },
  { id: 'p4', label: 'P4 · STACJA KOŃCOWA' },
  { id: 'finale', label: 'FINAŁ' },
];

function rulesFor(p: PlanetId, pace: Pace) {
  if (p === 'p1') return biurokracja7Rules(pace);
  if (p === 'p2') return hyperMartRules();
  if (p === 'p3') return flargleBloopRules();
  return stacjaKoncowaRules();
}

export function PlanetTabs() {
  const mode = useStore((s) => s.mode);
  const planet = useStore((s) => s.planet);
  const setPlanet = useStore((s) => s.setPlanet);
  const setMode = useStore((s) => s.setMode);
  const setOverlay = useStore((s) => s.setOverlay);
  const closeDialog = useStore((s) => s.closeDialog);
  const exitPuzzle = useStore((s) => s.exitPuzzle);
  const startSortingScene = useStore((s) => s.startSortingScene);
  const paceMode = useStore((s) => s.tweaks.paceMode);

  if (mode === 'boot' || mode === 'title') return null;
  // Dev-only: planet tabs are debug/showcase, hidden in production unless ?dev in URL
  const isDev = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('dev');
  if (!isDev) return null;

  function jump(id: PlanetId | 'finale') {
    closeDialog();
    exitPuzzle();
    setOverlay('none');
    if (id === 'finale') {
      setMode('finale');
      return;
    }
    setPlanet(id);
    applyPalette(id);
    startSortingScene({
      sceneId: id,
      pool: buildBiurokracja7Pool(),
      rules: rulesFor(id, paceMode),
    });
    setMode('sorting');
  }

  return (
    <div className="planet-tabs">
      {TABS.map((t) => (
        <div
          key={t.id}
          className={`tab ${planet === t.id || (mode === 'finale' && t.id === 'finale') ? 'active' : ''}`}
          onClick={() => jump(t.id)}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}
