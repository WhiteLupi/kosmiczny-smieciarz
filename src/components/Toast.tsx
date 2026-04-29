import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
}

let listeners: Array<(t: ToastMessage) => void> = [];
let nextId = 0;

export function pushToast(text: string): void {
  const t: ToastMessage = { id: ++nextId, text };
  listeners.forEach((fn) => fn(t));
}

export function ToastHost() {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => {
    function onPush(t: ToastMessage) {
      setItems((prev) => [...prev, t]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 2800);
    }
    listeners.push(onPush);
    return () => {
      listeners = listeners.filter((x) => x !== onPush);
    };
  }, []);

  return (
    <>
      {items.map((t) => (
        <div key={t.id} className="toast">{t.text}</div>
      ))}
    </>
  );
}
