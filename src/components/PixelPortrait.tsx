import { useEffect, useRef } from 'react';
import { FACES, PIXEL_PALETTE, type FaceId } from '@/content/npcs';

type Props = { face: FaceId; size?: number; className?: string };

export function PixelPortrait({ face, size = 56, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 16, 16);
    const grid = FACES[face];
    for (let y = 0; y < 16; y++) {
      const row = grid[y] ?? '';
      for (let x = 0; x < 16; x++) {
        const ch = row[x] ?? '.';
        const col = PIXEL_PALETTE[ch];
        if (col) {
          ctx.fillStyle = col;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [face]);

  return (
    <canvas
      ref={ref}
      width={16}
      height={16}
      className={className}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    />
  );
}
