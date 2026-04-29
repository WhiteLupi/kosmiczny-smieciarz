import { useEffect, useRef, type ReactNode } from 'react';

export function Stage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function rescale() {
      const el = ref.current;
      if (!el) return;
      const k = Math.min(window.innerWidth / 1280, window.innerHeight / 800);
      el.style.transform = `scale(${k})`;
    }
    rescale();
    window.addEventListener('resize', rescale);
    return () => window.removeEventListener('resize', rescale);
  }, []);

  return (
    <div className="stage-wrap">
      <div ref={ref} id="stage" className="stage">
        {children}
      </div>
    </div>
  );
}
