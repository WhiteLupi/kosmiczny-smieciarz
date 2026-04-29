import { Stage } from './components/Stage';

export default function App() {
  return (
    <Stage>
      <div className="screen" style={{ padding: 40 }}>
        <div className="lblAcc">▸ KOSMICZNY ŚMIECIARZ — Phase 1 verify</div>
        <div style={{ marginTop: 16, fontSize: 22 }}>Stage 1280×800 letterboxed. CRT scanlines + vignette overlay.</div>
        <div className="frame" style={{ marginTop: 24, maxWidth: 480 }}>
          <div className="lblAcc">FRAME (chunky bevel)</div>
          <div style={{ marginTop: 8, fontSize: 22 }}>Lorem ipsum biuro PRL.</div>
        </div>
        <div className="frame paper" style={{ marginTop: 16, maxWidth: 360, padding: 14 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: '#2a2a22' }}>FORMULARZ F-17/B</div>
          <div style={{ fontSize: 20, color: '#2a2a22', marginTop: 8 }}>kremowy papier · pixel art</div>
        </div>
        <button className="btn primary" style={{ marginTop: 20 }}>▸ TEST BTN ◂</button>
      </div>
    </Stage>
  );
}
