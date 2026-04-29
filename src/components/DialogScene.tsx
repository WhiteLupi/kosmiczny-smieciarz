import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/state/store';
import { DIALOGS, type DialogEffectId } from '@/content/dialogs';
import { sfx } from '@/audio/sfx';
import { PixelPortrait } from './PixelPortrait';
import type { DialogChoice } from '@/types/dialog';

interface Props {
  onEffect: (id: DialogEffectId) => void;
}

export function DialogScene({ onEffect }: Props) {
  const dialog = useStore((s) => s.dialog);
  const setDialogNode = useStore((s) => s.setDialogNode);
  const closeDialog = useStore((s) => s.closeDialog);
  const setOverlay = useStore((s) => s.setOverlay);
  const inventory = useStore((s) => s.inventory);
  const textSpeed = useStore((s) => s.tweaks.textSpeed);
  const [visibleText, setVisibleText] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const tree = dialog ? DIALOGS[dialog.treeId] : null;
  const node = tree && dialog ? tree.nodes[dialog.nodeId] : null;

  useEffect(() => {
    if (!node) return undefined;
    sfx('page');
    setVisibleText('');
    setShowChoices(false);
    let i = 0;
    const speed = 1000 / Math.max(8, textSpeed);
    const id = window.setInterval(() => {
      i++;
      setVisibleText(node.txt.slice(0, i));
      if (i >= node.txt.length) {
        if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        intervalRef.current = null;
        setShowChoices(true);
      }
    }, speed);
    intervalRef.current = id;
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [dialog?.treeId, dialog?.nodeId, node?.txt, textSpeed, node]);

  function skipTyping() {
    if (intervalRef.current !== null && node) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      setVisibleText(node.txt);
      setShowChoices(true);
    }
  }

  function pick(c: DialogChoice) {
    sfx('skan');
    if (c.effect) onEffect(c.effect as DialogEffectId);
    if (c.go) {
      setDialogNode(c.go);
    } else {
      closeDialog();
      // If a puzzle is active, return to puzzle overlay; otherwise no overlay.
      const active = useStore.getState().activePuzzleId;
      setOverlay(active ? 'puzzle' : 'none');
    }
  }

  // keyboard 1-4 for choices
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (!node || !showChoices) return;
      const idx = parseInt(ev.key, 10);
      if (Number.isNaN(idx) || idx < 1) return;
      const filtered = node.choices.filter((c) =>
        !c.requires || (inventory[c.requires.itemId] ?? 0) >= c.requires.count,
      );
      const c = filtered[idx - 1];
      if (c) pick(c);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [node, showChoices, inventory]);

  if (!tree || !node) return null;

  const visibleChoices = node.choices.filter(
    (c) => !c.requires || (inventory[c.requires.itemId] ?? 0) >= c.requires.count,
  );

  return (
    <div className={`dialog-overlay ${tree.hero ? 'heroine' : ''}`}>
      <div className="dialogBox">
        <PixelPortrait face={tree.portrait} size={140} className="npcPortrait" />
        <div>
          <div className="who">{tree.who}</div>
          <div className="txt" onClick={skipTyping}>{visibleText}</div>
          {showChoices && (
            <div className="choices">
              {visibleChoices.map((c, i) => (
                <div key={i} className="choice" onClick={() => pick(c)}>
                  <span className="k">[{i + 1}]</span>{c.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
