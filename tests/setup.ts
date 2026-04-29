import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement HTMLCanvasElement.prototype.getContext —
// stub it so PixelPortrait's useEffect doesn't throw during tests.
if (typeof HTMLCanvasElement !== 'undefined') {
  const stub2d = {
    clearRect: () => {},
    fillRect: () => {},
    fillStyle: '',
  };
  HTMLCanvasElement.prototype.getContext = (() => stub2d) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
