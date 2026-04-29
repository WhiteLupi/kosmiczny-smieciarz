import type { ReactNode } from 'react';
import { useStore } from '@/state/store';
import { PLANETS } from '@/content/planets';

interface Props { children?: ReactNode; }

export function Workstation({ children }: Props) {
  const sorting = useStore((s) => s.sorting);
  const planet = useStore((s) => s.planet);
  const total = sorting?.pool.length ?? 0;
  const idx = sorting?.idx ?? 0;
  return (
    <div className="workstation frame inset">
      <div className="belt" />
      <div className="beltLabel lblAcc">{PLANETS[planet].beltLabel}</div>
      <div className="beltCounter">PRZEDMIOT {Math.min(idx + 1, total)}/{total}</div>
      <div id="cardSlot">{children}</div>
      <div className="flash ok" id="flashOk" />
      <div className="flash err" id="flashErr" />
    </div>
  );
}
