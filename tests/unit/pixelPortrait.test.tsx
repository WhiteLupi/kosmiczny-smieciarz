import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PixelPortrait } from '@/components/PixelPortrait';
import { FACES } from '@/content/npcs';

describe('PixelPortrait', () => {
  it('renders a canvas for every face id', () => {
    for (const face of Object.keys(FACES) as Array<keyof typeof FACES>) {
      const { container } = render(<PixelPortrait face={face} size={32} />);
      const c = container.querySelector('canvas');
      expect(c).toBeTruthy();
      expect(c?.width).toBe(16);
      expect(c?.height).toBe(16);
    }
  });

  it('every face grid is 16 rows of 16 chars', () => {
    for (const [name, grid] of Object.entries(FACES)) {
      expect(grid.length, `${name} rows`).toBe(16);
      grid.forEach((row, i) => {
        expect(row.length, `${name} row ${i}`).toBe(16);
      });
    }
  });
});
