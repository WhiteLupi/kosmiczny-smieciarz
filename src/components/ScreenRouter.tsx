import { useStore } from '@/state/store';
import { BootScreen } from './BootScreen';
import { TitleScreen } from './TitleScreen';
import { SortingStation } from './SortingStation';

export function ScreenRouter() {
  const mode = useStore((s) => s.mode);
  switch (mode) {
    case 'boot':
      return <BootScreen />;
    case 'title':
      return <TitleScreen />;
    case 'sorting':
      return <SortingStation />;
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
