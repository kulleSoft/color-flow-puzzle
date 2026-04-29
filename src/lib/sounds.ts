import pourSoundUrl from "@/assets/pour.mp3";

const ctx = () => {
  if (!(window as any).__audioCtx) {
    (window as any).__audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__audioCtx as AudioContext;
};

export function playPour() {
  try {
    const audio = new Audio(pourSoundUrl);
    audio.volume = 0.7;
    audio.play().catch(() => {});
  } catch {}
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
