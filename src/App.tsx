import { Stage } from './components/Stage';
import { ScreenRouter } from './components/ScreenRouter';
import { DialogScene } from './components/DialogScene';
import { useStore } from './state/store';
import { applyDialogEffect } from './game/dialogEffects';

export default function App() {
  const overlay = useStore((s) => s.overlay);
  return (
    <Stage>
      <ScreenRouter />
      {overlay === 'dialog' && (
        <DialogScene onEffect={(id) => applyDialogEffect(useStore.getState(), id)} />
      )}
    </Stage>
  );
}
