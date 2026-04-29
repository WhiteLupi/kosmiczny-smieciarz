import { useEffect, useState } from 'react';
import { PixelPortrait } from './PixelPortrait';

export function FinaleScreen() {
  const [showHelena, setShowHelena] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShowHelena(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="screen finale-screen">
      <div className="finale-konie">KONIEC.</div>
      <div className="finale-num">00847</div>
      <div className="finale-bot">
        Gratulacje.<br />
        Nie jesteś wybrańcem. Jesteś śmieciarzem.<br /><br />
        <span style={{ color: '#5a5a5a' }}>
          (serio. to koniec. nie czekaj na post-credits — to nie jest gra Marvela.)
        </span>
      </div>
      <div className={`finale-helena ${showHelena ? 'up' : ''}`}>
        <PixelPortrait face="helena" size={64} className="finale-helena-portrait" />
        <div className="bubble">
          Pan jeszcze tu? Ja już kończę dniówkę. Niech pan zamknie.{' '}
          <b style={{ color: '#8a2a2a' }}>Numerek pan ma?</b>
        </div>
      </div>
    </div>
  );
}
