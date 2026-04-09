const ctx = () => {
  if (!(window as any).__audioCtx) {
    (window as any).__audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__audioCtx as AudioContext;
};

export function playPour() {
  const c = ctx();
  const duration = 0.35;
  // Bubbling noise via filtered noise
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(800, c.currentTime);
  bp.frequency.linearRampToValueAtTime(1200, c.currentTime + duration);
  bp.Q.value = 2;

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.15, c.currentTime);
  gain.gain.linearRampToValueAtTime(0, c.currentTime + duration);

  noise.connect(bp).connect(gain).connect(c.destination);
  noise.start();
  noise.stop(c.currentTime + duration);

  // Bubble blips
  for (let i = 0; i < 5; i++) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    const t = c.currentTime + i * 0.06;
    osc.frequency.setValueAtTime(400 + Math.random() * 600, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
    g.gain.setValueAtTime(0.08, t);
    g.gain.linearRampToValueAtTime(0, t + 0.05);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }
}

export function playSelect() {
  const c = ctx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.08);
  g.gain.setValueAtTime(0.06, c.currentTime);
  g.gain.linearRampToValueAtTime(0, c.currentTime + 0.1);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.1);
}

export function playWin() {
  const c = ctx();
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    const t = c.currentTime + i * 0.15;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.1, t);
    g.gain.linearRampToValueAtTime(0, t + 0.2);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  });
}
