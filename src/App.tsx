import { Stage } from './components/Stage';
import { ScreenRouter } from './components/ScreenRouter';
import { DialogScene } from './components/DialogScene';
import { PuzzleSceneHost } from './components/PuzzleScene';
import { useStore } from './state/store';
import { applyDialogEffect } from './game/dialogEffects';

export default function App() {
  const overlay = useStore((s) => s.overlay);
  return (
    <Stage>
      <ScreenRouter />
      {overlay === 'puzzle' && <PuzzleSceneHost />}
      {overlay === 'dialog' && (
        <DialogScene onEffect={(id) => applyDialogEffect(useStore.getState(), id)} />
      )}
    </Stage>
  );
}
