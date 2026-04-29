import { Stage } from './components/Stage';
import { ScreenRouter } from './components/ScreenRouter';
import { DialogScene } from './components/DialogScene';
import { PuzzleSceneHost } from './components/PuzzleScene';
import { PlanetTabs } from './components/PlanetTabs';
import { TweaksPanel } from './components/TweaksPanel';
import { SettingsHotkeys } from './components/SettingsHotkeys';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthModal } from './components/AuthModal';
import { PresenceIndicator } from './components/PresenceIndicator';
import { useStore } from './state/store';
import { applyDialogEffect } from './game/dialogEffects';

export default function App() {
  const overlay = useStore((s) => s.overlay);
  return (
    <Stage>
      <ErrorBoundary>
        <ScreenRouter />
        {overlay === 'puzzle' && <PuzzleSceneHost />}
        {overlay === 'dialog' && (
          <DialogScene onEffect={(id) => applyDialogEffect(useStore.getState(), id)} />
        )}
        <PlanetTabs />
        <TweaksPanel />
        <AuthModal />
        <PresenceIndicator />
        <SettingsHotkeys />
      </ErrorBoundary>
    </Stage>
  );
}
