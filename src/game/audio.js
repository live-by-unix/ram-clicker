let ctx = null;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({ freq = 440, dur = 0.1, type = 'square', vol = 0.15, sweep = 0, delay = 0 }) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweep) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freq + sweep), t0 + dur);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise({ dur = 0.1, vol = 0.1, delay = 0 }) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const buffer = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const filter = ac.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 800;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

let muted = false;

export const audio = {
  setMuted(v) { muted = v; },
  isMuted() { return muted; },

  click() {
    if (muted) return;
    tone({ freq: 880, dur: 0.04, type: 'square', vol: 0.08, sweep: -200 });
  },

  crit() {
    if (muted) return;
    tone({ freq: 1200, dur: 0.06, type: 'square', vol: 0.12, sweep: 600 });
    tone({ freq: 1800, dur: 0.08, type: 'square', vol: 0.1, delay: 0.06 });
  },

  buy() {
    if (muted) return;
    tone({ freq: 523, dur: 0.05, type: 'triangle', vol: 0.1 });
    tone({ freq: 784, dur: 0.06, type: 'triangle', vol: 0.1, delay: 0.05 });
  },

  overclock() {
    if (muted) return;
    tone({ freq: 200, dur: 0.3, type: 'sawtooth', vol: 0.12, sweep: 1200 });
    noise({ dur: 0.2, vol: 0.05 });
  },

  ddr() {
    if (muted) return;
    [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, dur: 0.1, type: 'square', vol: 0.1, delay: i * 0.08 }));
  },

  win() {
    if (muted) return;
    [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, dur: 0.1, type: 'square', vol: 0.1, delay: i * 0.07 }));
  },

  jackpot() {
    if (muted) return;
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone({ freq: f, dur: 0.12, type: 'square', vol: 0.12, delay: i * 0.06 }));
  },

  lose() {
    if (muted) return;
    tone({ freq: 300, dur: 0.2, type: 'sawtooth', vol: 0.1, sweep: -200 });
  },

  prestige() {
    if (muted) return;
    [261, 329, 392, 523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, dur: 0.15, type: 'triangle', vol: 0.12, delay: i * 0.1 }));
  },

  event() {
    if (muted) return;
    tone({ freq: 660, dur: 0.12, type: 'sine', vol: 0.1 });
    tone({ freq: 880, dur: 0.12, type: 'sine', vol: 0.1, delay: 0.1 });
  },
};