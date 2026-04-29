import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement HTMLCanvasElement.prototype.getContext —
// stub it so PixelPortrait's useEffect doesn't throw during tests.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function () {
    return {
      clearRect: () => {},
      fillRect: () => {},
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;
  } as typeof HTMLCanvasElement.prototype.getContext;
}
