import { useStore } from '@/state/store';
import { BootScreen } from './BootScreen';
import { TitleScreen } from './TitleScreen';
import { SortingStation } from './SortingStation';
import { DayEndScreen } from './DayEndScreen';
import { TransitScreen } from './TransitScreen';
import { FinaleScreen } from './FinaleScreen';

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
      return <TransitScreen />;
    case 'dayEnd':
      return <DayEndScreen />;
    case 'finale':
      return <FinaleScreen />;
  }
}
