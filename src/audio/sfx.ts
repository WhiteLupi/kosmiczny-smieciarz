export type SfxKind = 'stempel' | 'ding' | 'error' | 'page' | 'skan' | 'coin';

let actx: AudioContext | null = null;
let enabled = true;

interface AudioContextWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export function setSfxEnabled(on: boolean): void {
  enabled = on;
}

export function isSfxEnabled(): boolean {
  return enabled;
}

export function ensureAudio(): AudioContext | null {
  if (!actx) {
    try {
      const W = window as AudioContextWindow;
      const Ctor = window.AudioContext ?? W.webkitAudioContext;
      if (!Ctor) return null;
      actx = new Ctor();
    } catch {
      return null;
    }
  }
  if (actx.state === 'suspended') void actx.resume();
  return actx;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (actx && !document.hidden) void actx.resume();
  });
}

export function sfx(kind: SfxKind): void {
  if (!enabled) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const t = ctx.currentTime;

  if (kind === 'stempel') {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.start(t);
    o.stop(t + 0.15);
  } else if (kind === 'ding') {
    [523, 659, 784].forEach((f, i) => {
      const oo = ctx.createOscillator();
      const gg = ctx.createGain();
      oo.connect(gg);
      gg.connect(ctx.destination);
      oo.type = 'square';
      oo.frequency.value = f;
      gg.gain.setValueAtTime(0, t + i * 0.05);
      gg.gain.linearRampToValueAtTime(0.12, t + i * 0.05 + 0.01);
      gg.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.18);
      oo.start(t + i * 0.05);
      oo.stop(t + i * 0.05 + 0.2);
    });
  } else if (kind === 'error') {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(180, t);
    o.frequency.linearRampToValueAtTime(80, t + 0.25);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    o.start(t);
    o.stop(t + 0.3);
  } else if (kind === 'page') {
    const bn = ctx.createBufferSource();
    const b = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    }
    bn.buffer = b;
    const gg = ctx.createGain();
    gg.gain.value = 0.18;
    bn.connect(gg);
    gg.connect(ctx.destination);
    bn.start();
  } else if (kind === 'skan') {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'square';
    o.frequency.setValueAtTime(1200, t);
    o.frequency.exponentialRampToValueAtTime(1800, t + 0.08);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.start(t);
    o.stop(t + 0.1);
  } else if (kind === 'coin') {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'square';
    o.frequency.setValueAtTime(900, t);
    o.frequency.setValueAtTime(1200, t + 0.05);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.start(t);
    o.stop(t + 0.15);
  }
}
