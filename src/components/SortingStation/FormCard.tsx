import type { SortingItem } from '@/types/sorting';

const STAMP_TEXT: Record<string, string> = {
  niebieska: 'MIN. SPRAW WEW.',
  czarna: 'URZ. GŁ.',
  czerwona: 'ARCH. ŚW.',
};

export function FormCard({ item }: { item: SortingItem }) {
  return (
    <div className="paper">
      <div className="hdr">
        <div className="no">FORMULARZ {item.numer}</div>
        <div className="dz">dz. {item.dataStr}</div>
      </div>
      <div className="photo" />
      <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, letterSpacing: 1, marginTop: 4 }}>
        SPRAWA: {item.sprawa.toUpperCase()}
      </h3>
      <div className="cardrow"><span>Obywatel</span><b>{item.osoba}</b></div>
      <div className="cardrow"><span>Pochodzenie</span><b>{item.obywatel}</b></div>
      <div className="cardrow"><span>Data</span><b>{item.dataStr} ({item.data})</b></div>
      <div className="cardrow"><span>Pieczątka</span><b>{item.pieczatka}</b></div>
      <div className="cardrow"><span>Stempel</span><b>{item.stempel}</b></div>
      <div className="cardrow"><span>Okienko wer.</span><b>{item.okienko}</b></div>
      <div className="cardfooter"><span>podpis: ..............</span><span>egz. A</span></div>
      <div className={`stamp ${item.pieczatka} ${item.stempel}`}>{STAMP_TEXT[item.pieczatka]}</div>
    </div>
  );
}
