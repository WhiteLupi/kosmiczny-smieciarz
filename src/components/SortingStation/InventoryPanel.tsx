import { useStore } from '@/state/store';

export function InventoryPanel() {
  const inv = useStore((s) => s.inventory);
  const entries = Object.entries(inv).filter(([, v]) => v > 0);
  return (
    <div className="frame" style={{ padding: '10px 12px' }}>
      <div className="lblAcc" style={{ marginBottom: 6 }}>▸ INVENTORY</div>
      <div className="invRow">
        {entries.length === 0
          ? <span className="chip" style={{ opacity: 0.5 }}>— pusto —</span>
          : entries.map(([k, v]) => (
              <span key={k} className="chip"><b>{v}</b>{k}</span>
            ))}
      </div>
    </div>
  );
}
