const WALLET_KEY = "water-sort-wallet";
const INVENTORY_KEY = "water-sort-inventory";
const NOADS_KEY = "water-sort-noads";

export type ItemId = "hint" | "extraTube" | "undo" | "skip";

export interface Inventory {
  hint: number;
  extraTube: number;
  undo: number;
  skip: number;
}

const DEFAULT_INVENTORY: Inventory = { hint: 1, extraTube: 2, undo: 2, skip: 0 };

export function loadCoins(): number {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (raw) return Math.max(0, parseInt(raw, 10) || 0);
  } catch {}
  return 200; // starter coins
}

export function saveCoins(n: number) {
  localStorage.setItem(WALLET_KEY, String(Math.max(0, Math.floor(n))));
}

export function addCoins(n: number): number {
  const next = loadCoins() + n;
  saveCoins(next);
  return next;
}

export function spendCoins(n: number): boolean {
  const cur = loadCoins();
  if (cur < n) return false;
  saveCoins(cur - n);
  return true;
}

export function loadInventory(): Inventory {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (raw) return { ...DEFAULT_INVENTORY, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_INVENTORY };
}

export function saveInventory(inv: Inventory) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
}

export function addItems(id: ItemId, qty: number) {
  const inv = loadInventory();
  inv[id] = (inv[id] || 0) + qty;
  saveInventory(inv);
}

export function consumeItem(id: ItemId): boolean {
  const inv = loadInventory();
  if ((inv[id] || 0) <= 0) return false;
  inv[id] -= 1;
  saveInventory(inv);
  return true;
}

export function isNoAds(): boolean {
  try {
    const raw = localStorage.getItem(NOADS_KEY);
    if (!raw) return false;
    return parseInt(raw, 10) > Date.now();
  } catch {
    return false;
  }
}

export function activateNoAds(days: number) {
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(NOADS_KEY, String(until));
}

export function noAdsExpiry(): number | null {
  try {
    const raw = localStorage.getItem(NOADS_KEY);
    if (!raw) return null;
    const v = parseInt(raw, 10);
    return v > Date.now() ? v : null;
  } catch {
    return null;
  }
}

/** Coins reward for completing a level with given stars. */
export function coinsForStars(stars: number): number {
  return [0, 20, 40, 75][stars] ?? 0;
}
