const STORAGE_KEY = "water-sort-progress";
const SETTINGS_KEY = "water-sort-settings";

export interface Progress {
  currentLevel: number;
  stars: Record<number, number>;
}

export interface Settings {
  soundEnabled: boolean;
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { currentLevel: 1, stars: {} };
}

export function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { soundEnabled: true };
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function getTotalStars(stars: Record<number, number>): number {
  return Object.values(stars).reduce((a, b) => a + b, 0);
}

export function getMaxUnlockedLevel(stars: Record<number, number>): number {
  const completed = Object.keys(stars).map(Number);
  return completed.length > 0 ? Math.max(...completed) + 1 : 1;
}
