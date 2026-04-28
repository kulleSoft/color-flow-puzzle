export type Color = string;
export type Tube = Color[];

const DEFAULT_COLORS = [
  '#ef4444', '#3b82f6', '#22c55e', '#eab308',
  '#a855f7', '#f97316', '#ec4899', '#06b6d4',
  '#8b5cf6', '#14b8a6', '#f43f5e', '#84cc16',
];

export const TUBE_CAPACITY = 4;

export function generateLevel(level: number, palette?: Color[]): Tube[] {
  const numColors = Math.min(3 + Math.floor(level / 2), 12);
  const numTubes = numColors + 2;
  const source = palette && palette.length >= numColors ? palette : DEFAULT_COLORS;
  const colors = source.slice(0, numColors);

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

/** Returns 1-3 stars based on moves relative to the optimal (numColors) */
export function getStars(level: number, moves: number): number {
  const numColors = Math.min(3 + Math.floor(level / 2), 12);
  const optimal = numColors; // theoretical minimum ~1 pour per color
  if (moves <= optimal) return 3;
  if (moves <= optimal * 2) return 2;
  return 1;
}
