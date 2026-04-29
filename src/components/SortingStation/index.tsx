import { useCallback, useEffect, useRef } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useStore } from '@/state/store';
import { biurokracja7Rules } from '@/content/sortingRules/biurokracja7';
import { buildBiurokracja7Pool } from '@/content/pool';
import { evaluateItem, ruleUnlocksTriggered } from '@/game/sortingEngine';
import { sfx } from '@/audio/sfx';
import type { SortingItem, ZoneId } from '@/types/sorting';
import { TopBar } from './TopBar';
import { Workstation } from './Workstation';
import { RulesPanel } from './RulesPanel';
import { InventoryPanel } from './InventoryPanel';
import { QuestPanel } from './QuestPanel';
import { DropZones } from './DropZones';
import { DraggableCard } from './DraggableCard';
import { ToastHost, pushToast } from '../Toast';

function flashElement(id: 'flashOk' | 'flashErr') {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('show');
  // force reflow
  void el.offsetWidth;
  el.classList.add('show');
}

export function SortingStation() {
  const sorting = useStore((s) => s.sorting);
  const startSortingScene = useStore((s) => s.startSortingScene);
  const resolveSort = useStore((s) => s.resolveSort);
  const unlockRule = useStore((s) => s.unlockRule);
  const insertItemAtCurrent = useStore((s) => s.insertItemAtCurrent);
  const setHeroTestDone = useStore((s) => s.setHeroTestDone);
  const addItem = useStore((s) => s.addItem);
  const addCredits = useStore((s) => s.addCredits);
  const setFlag = useStore((s) => s.setFlag);
  const openDialog = useStore((s) => s.openDialog);
  const setOverlay = useStore((s) => s.setOverlay);
  const enterPuzzle = useStore((s) => s.enterPuzzle);
  const paceMode = useStore((s) => s.tweaks.paceMode);
  const overlay = useStore((s) => s.overlay);
  const flags = useStore((s) => s.flags);
  const moodResetRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sorting) {
      startSortingScene({
        sceneId: 'p1',
        pool: buildBiurokracja7Pool(),
        rules: biurokracja7Rules(paceMode),
      });
    }
  }, [sorting, startSortingScene, paceMode]);

  const choose = useCallback(
    (zone: ZoneId) => {
      const s = useStore.getState();
      const cur = s.sorting;
      if (!cur) return;
      const item = cur.pool[cur.idx];
      if (!item) return;

      const { expected } = evaluateItem(item, cur.rules, cur.unlocked);
      const correct = expected === zone;

      if (correct) {
        sfx('stempel');
        window.setTimeout(() => sfx('ding'), 120);
        flashElement('flashOk');
        addCredits(2);
        if (Math.random() < 0.22) {
          addItem('butelki KBK-3', 1);
          pushToast('+ BUTELKA KBK-3 (dla Zenka)');
        }
      } else {
        sfx('error');
        flashElement('flashErr');
        setFlag('recentPanic', true);
        if (moodResetRef.current) window.clearTimeout(moodResetRef.current);
        moodResetRef.current = window.setTimeout(() => setFlag('recentPanic', false), 900);
        pushToast(`✗ Zła strefa. Poprawnie: ${expected.toUpperCase()}`);
      }

      resolveSort(zone, expected);

      // After resolveSort we need fresh state for trigger checks
      const post = useStore.getState();
      const postSorting = post.sorting;
      if (!postSorting) return;

      // Rule evolution
      const triggered = ruleUnlocksTriggered(postSorting.rules, postSorting.unlocked, postSorting.correct);
      triggered.forEach((r) => {
        unlockRule(r.id);
        const headline = r.text.split('.')[0] ?? r.text;
        pushToast(`★ NOWA REGUŁA: ${headline}`);
        sfx('ding');
      });

      // Helena hero test trigger — need post-trigger unlocked set, simulate by adding triggered ids
      const willHaveR5 =
        postSorting.unlocked.has('r5') || triggered.some((r) => r.id === 'r5');
      if (!postSorting.heroTestDone && willHaveR5 && postSorting.correct >= 6) {
        window.setTimeout(() => triggerHeroTest(), 400);
        return;
      }

      // Zenek dialog trigger — at item idx 5 (after sorting the 5th item), if not yet shown
      if (postSorting.idx === 5 && !post.flags.zenekShown) {
        post.setFlag('zenekShown');
        window.setTimeout(() => {
          useStore.getState().openDialog('zenek', 'z_start');
          useStore.getState().setOverlay('dialog');
        }, 500);
      }
    },
    [resolveSort, unlockRule, addItem, addCredits, setFlag],
  );

  const triggerHeroTest = useCallback(() => {
    const helenaForm: SortingItem = {
      id: 'helena_test',
      numer: 'F-17/B',
      pieczatka: 'niebieska',
      stempel: 'mokry',
      obywatel: 'Ziemianin',
      data: 'nieparzysta',
      osoba: 'Helena Kowalczyk (okienko 7)',
      dataStr: '17.04.2026',
      sprawa: 'WNIOSEK O TEST PANA',
      okienko: 12,
      isHeroTest: true,
    };
    insertItemAtCurrent(helenaForm);
    setHeroTestDone();
    openDialog('helena_test', 'h_start');
    setOverlay('dialog');
  }, [insertItemAtCurrent, setHeroTestDone, openDialog, setOverlay]);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      if (!e.over) return;
      const id = e.over.id;
      if (id === 'akcept' || id === 'odrzut' || id === 'przekaz') choose(id);
    },
    [choose],
  );

  // keyboard 1/2/3 (only when no overlay)
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (overlay !== 'none') return;
      if (ev.key === '1') choose('akcept');
      else if (ev.key === '2') choose('odrzut');
      else if (ev.key === '3') choose('przekaz');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, overlay]);

  const skip = useCallback(() => {
    const cur = useStore.getState().sorting;
    if (!cur) return;
    const item = cur.pool[cur.idx];
    if (!item) return;
    const { expected } = evaluateItem(item, cur.rules, cur.unlocked);
    choose(expected);
  }, [choose]);

  const hint = useCallback(() => {
    const cur = useStore.getState().sorting;
    if (!cur) return;
    const item = cur.pool[cur.idx];
    if (!item) return;
    const { expected } = evaluateItem(item, cur.rules, cur.unlocked);
    pushToast(`PODPOWIEDŹ: poprawnie = ${expected.toUpperCase()}`);
  }, []);

  const openF17BPuzzle = useCallback(() => {
    if (flags.helenaPassed || flags.f17bSolved) return;
    enterPuzzle('f17b');
    setOverlay('puzzle');
  }, [enterPuzzle, setOverlay, flags.helenaPassed, flags.f17bSolved]);

  // End-of-pool → dayEnd
  useEffect(() => {
    if (sorting && sorting.idx >= sorting.pool.length) {
      const t = window.setTimeout(() => useStore.getState().setMode('dayEnd'), 350);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [sorting]);

  const item = sorting ? sorting.pool[sorting.idx] : undefined;

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="screen sort-screen">
        <TopBar />
        <div className="midgrid">
          <Workstation>{item ? <DraggableCard item={item} /> : null}</Workstation>
          <div className="sideCol">
            <RulesPanel />
            <InventoryPanel />
            <QuestPanel onOpenPuzzle={openF17BPuzzle} />
          </div>
        </div>
        <DropZones onChoose={choose} onSkip={skip} onHint={hint} />
        <ToastHost />
      </div>
    </DndContext>
  );
}
