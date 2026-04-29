import { useEffect, useState } from 'react';
import { useStore } from '@/state/store';
import { dayEndCalc } from '@/game/dayEndCalc';
import { sfx } from '@/audio/sfx';

export function DayEndScreen() {
  const sorting = useStore((s) => s.sorting);
  const flags = useStore((s) => s.flags);
  const setMode = useStore((s) => s.setMode);
  const correct = sorting?.correct ?? 0;
  const errors = sorting?.errors ?? 0;
  const calc = dayEndCalc(correct, !!flags.helenaPassed);

  const [pay, setPay] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let p = 0;
    let b = 0;
    const id = window.setInterval(() => {
      if (p < calc.pay) {
        p += 2;
        sfx('coin');
        setPay(p);
      } else if (b < calc.bonus) {
        b += 4;
        sfx('coin');
        setBonus(b);
      } else {
        setTotal(calc.total);
        window.clearInterval(id);
      }
    }, 90);
    return () => window.clearInterval(id);
  }, [calc.pay, calc.bonus, calc.total]);

  return (
    <div className="screen dayend-screen">
      <div className="endCard frame">
        <h2>▸ KONIEC DNIA ROBOCZEGO ◂</h2>
        <div className="endRow"><span className="k">Poprawne sortowania</span><span className="v">{correct}</span></div>
        <div className="endRow"><span className="k">Błędy</span><span className="v">{errors}</span></div>
        <div className="endRow"><span className="k">Wypłata (2 ₢ / szt.)</span><span className="v">{pay} ₢</span></div>
        <div className="endRow"><span className="k">Premia za quest Heleny</span><span className="v">{bonus} ₢</span></div>
        <div className="endRow total"><span className="k">RAZEM</span><span className="v">{total} ₢</span></div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="btn primary" onClick={() => setMode('transit')}>
            ▸ LECĘ NA STACJĘ KOŃCOWĄ ◂
          </button>
        </div>
      </div>
    </div>
  );
}
