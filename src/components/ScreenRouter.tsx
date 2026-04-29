import { useStore } from '@/state/store';
import { BootScreen } from './BootScreen';
import { TitleScreen } from './TitleScreen';

export function ScreenRouter() {
  const mode = useStore((s) => s.mode);
  switch (mode) {
    case 'boot':
      return <BootScreen />;
    case 'title':
      return <TitleScreen />;
    case 'sorting':
      return (
        <div className="screen" style={{ padding: 40 }}>
          SORTING — implementacja w Phase 8-9
        </div>
      );
    case 'transit':
      return (
        <div className="screen" style={{ padding: 40 }}>
          TRANSIT — Phase 13
        </div>
      );
    case 'dayEnd':
      return (
        <div className="screen" style={{ padding: 40 }}>
          DAY END — Phase 13
        </div>
      );
    case 'finale':
      return (
        <div className="screen" style={{ padding: 40 }}>
          FINALE — Phase 13
        </div>
      );
  }
}
