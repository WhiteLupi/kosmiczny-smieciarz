import { describe, it, expect } from 'vitest';
import { sfx, setSfxEnabled, isSfxEnabled } from '@/audio/sfx';

describe('sfx', () => {
  it('toggles enabled flag', () => {
    setSfxEnabled(false);
    expect(isSfxEnabled()).toBe(false);
    setSfxEnabled(true);
    expect(isSfxEnabled()).toBe(true);
  });

  it('does not throw when AudioContext unavailable', () => {
    setSfxEnabled(false);
    expect(() => sfx('stempel')).not.toThrow();
    expect(() => sfx('ding')).not.toThrow();
    expect(() => sfx('error')).not.toThrow();
    expect(() => sfx('page')).not.toThrow();
    expect(() => sfx('skan')).not.toThrow();
    expect(() => sfx('coin')).not.toThrow();
    setSfxEnabled(true);
  });
});
