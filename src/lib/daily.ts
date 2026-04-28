const DAILY_KEY = "water-sort-daily";

export interface DailyState {
  /** Map of "YYYY-MM-DD" => stars earned */
  completed: Record<string, number>;
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadDaily(): DailyState {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completed: {} };
}

export function saveDaily(s: DailyState) {
  localStorage.setItem(DAILY_KEY, JSON.stringify(s));
}

export function markDailyCompleted(dateKey: string, stars: number) {
  const s = loadDaily();
  s.completed[dateKey] = Math.max(s.completed[dateKey] || 0, stars);
  saveDaily(s);
}

export function isDailyCompleted(dateKey: string): boolean {
  return !!loadDaily().completed[dateKey];
}

/** Deterministic level number from a date string (range 5-25 for variety). */
export function getDailyLevel(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return 5 + (hash % 21); // 5..25
}
