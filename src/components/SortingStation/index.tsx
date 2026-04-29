import { useEffect } from 'react';
import { useStore } from '@/state/store';
import { biurokracja7Rules } from '@/content/sortingRules/biurokracja7';
import { buildBiurokracja7Pool } from '@/content/pool';
import { TopBar } from './TopBar';
import { Workstation } from './Workstation';
import { RulesPanel } from './RulesPanel';
import { InventoryPanel } from './InventoryPanel';
import { QuestPanel } from './QuestPanel';
import { DropZones } from './DropZones';

export function SortingStation() {
  const sorting = useStore((s) => s.sorting);
  const startSortingScene = useStore((s) => s.startSortingScene);
  const paceMode = useStore((s) => s.tweaks.paceMode);

  useEffect(() => {
    if (!sorting) {
      startSortingScene({
        sceneId: 'p1',
        pool: buildBiurokracja7Pool(),
        rules: biurokracja7Rules(paceMode),
      });
    }
  }, [sorting, startSortingScene, paceMode]);

  return (
    <div className="screen sort-screen">
      <TopBar />
      <div className="midgrid">
        <Workstation>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--p-ink-dim)',
              fontSize: 18,
            }}
          >
            (formularz pojawi się w Phase 9)
          </div>
        </Workstation>
        <div className="sideCol">
          <RulesPanel />
          <InventoryPanel />
          <QuestPanel />
        </div>
      </div>
      <DropZones onChoose={() => {}} onSkip={() => {}} onHint={() => {}} />
    </div>
  );
}
