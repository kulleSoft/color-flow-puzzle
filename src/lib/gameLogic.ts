export type Color = string;
export type Tube = Color[];

const COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#eab308', // yellow
  '#a855f7', // purple
  '#f97316', // orange
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#f43f5e', // rose
  '#84cc16', // lime
];

export const TUBE_CAPACITY = 4;

export function generateLevel(level: number): Tube[] {
  const numColors = Math.min(3 + Math.floor(level / 2), 12);
  const numTubes = numColors + 2;
  const colors = COLORS.slice(0, numColors);

  // Create all segments
  const segments: Color[] = [];
  for (const c of colors) {
    for (let i = 0; i < TUBE_CAPACITY; i++) segments.push(c);
  }

  // Shuffle
  for (let i = segments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [segments[i], segments[j]] = [segments[j], segments[i]];
  }

  const tubes: Tube[] = [];
  let idx = 0;
  for (let i = 0; i < numColors; i++) {
    tubes.push(segments.slice(idx, idx + TUBE_CAPACITY));
    idx += TUBE_CAPACITY;
  }
  // Empty tubes
  for (let i = 0; i < numTubes - numColors; i++) {
    tubes.push([]);
  }

  return tubes;
}

export function canPour(from: Tube, to: Tube): boolean {
  if (from.length === 0) return false;
  if (to.length >= TUBE_CAPACITY) return false;
  if (to.length === 0) return true;
  return from[from.length - 1] === to[to.length - 1];
}

export function pour(from: Tube, to: Tube): [Tube, Tube] {
  const newFrom = [...from];
  const newTo = [...to];
  const color = newFrom[newFrom.length - 1];

  while (
    newFrom.length > 0 &&
    newTo.length < TUBE_CAPACITY &&
    newFrom[newFrom.length - 1] === color
  ) {
    newTo.push(newFrom.pop()!);
  }

  return [newFrom, newTo];
}

export function isComplete(tubes: Tube[]): boolean {
  return tubes.every(
    (t) =>
      t.length === 0 ||
      (t.length === TUBE_CAPACITY && t.every((c) => c === t[0]))
  );
}

export function isTubeSorted(tube: Tube): boolean {
  return tube.length === TUBE_CAPACITY && tube.every((c) => c === tube[0]);
}
