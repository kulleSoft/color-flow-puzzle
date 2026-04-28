// Central theme system: each theme defines the liquid color palette and the
// game background gradient. Persisted in localStorage by `Themes.tsx`.

export interface GameTheme {
  id: string;
  name: string;
  /** 12 colors used for the liquid segments (gameLogic uses up to 12). */
  palette: string[];
  /** CSS background applied behind the game board (overrides the default image). */
  background: string;
  /** Glow/accent hue (HSL string) used for selected/sorted tube effects. */
  accentHsl: string;
}

export const THEMES: Record<string, GameTheme> = {
  neon: {
    id: "neon",
    name: "Neon",
    palette: [
      "#ff2bd6", "#00f0ff", "#ffea00", "#7c3aed",
      "#39ff14", "#ff6b00", "#ff0055", "#00b3ff",
      "#bf00ff", "#00ffa3", "#ff8800", "#f5ff00",
    ],
    background:
      "radial-gradient(ellipse 80% 50% at 50% 110%, hsl(330 90% 45% / 0.65), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 20% 30%, hsl(270 80% 40% / 0.7), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 80% 20%, hsl(195 90% 35% / 0.7), transparent 60%)," +
      "linear-gradient(180deg, hsl(260 60% 10%) 0%, hsl(285 60% 16%) 50%, hsl(320 60% 22%) 100%)",
    accentHsl: "320 100% 65%",
  },
  ocean: {
    id: "ocean",
    name: "Oceano",
    palette: [
      "#0077be", "#00a8cc", "#7fdbda", "#005f73",
      "#0a9396", "#94d2bd", "#1e6091", "#48cae4",
      "#03045e", "#0096c7", "#caf0f8", "#023e8a",
    ],
    background:
      "radial-gradient(ellipse 80% 50% at 50% 110%, hsl(195 80% 35% / 0.7), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 20% 30%, hsl(210 70% 25% / 0.75), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 80% 20%, hsl(185 75% 30% / 0.65), transparent 60%)," +
      "linear-gradient(180deg, hsl(220 70% 8%) 0%, hsl(205 70% 14%) 50%, hsl(190 70% 20%) 100%)",
    accentHsl: "190 100% 65%",
  },
  sunset: {
    id: "sunset",
    name: "Pôr do Sol",
    palette: [
      "#ff6b6b", "#ffa500", "#ffd700", "#ff4757",
      "#ff7f50", "#ffb142", "#e55039", "#fa8231",
      "#eb3b5a", "#fd9644", "#f7b731", "#eb2f06",
    ],
    background:
      "radial-gradient(ellipse 80% 50% at 50% 110%, hsl(20 90% 45% / 0.7), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 20% 30%, hsl(345 80% 35% / 0.7), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 80% 20%, hsl(40 90% 45% / 0.6), transparent 60%)," +
      "linear-gradient(180deg, hsl(340 60% 12%) 0%, hsl(15 65% 20%) 50%, hsl(35 75% 28%) 100%)",
    accentHsl: "30 100% 60%",
  },
  forest: {
    id: "forest",
    name: "Floresta",
    palette: [
      "#2d6a4f", "#74c69d", "#b7e4c7", "#1b4332",
      "#52b788", "#95d5b2", "#40916c", "#081c15",
      "#d8f3dc", "#588157", "#3a5a40", "#a3b18a",
    ],
    background:
      "radial-gradient(ellipse 80% 50% at 50% 110%, hsl(140 60% 25% / 0.7), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 20% 30%, hsl(120 50% 18% / 0.75), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 80% 20%, hsl(160 55% 22% / 0.65), transparent 60%)," +
      "linear-gradient(180deg, hsl(150 50% 8%) 0%, hsl(140 45% 14%) 50%, hsl(125 45% 20%) 100%)",
    accentHsl: "140 80% 55%",
  },
  candy: {
    id: "candy",
    name: "Doce",
    palette: [
      "#ff85a1", "#ffb3c6", "#ffc8dd", "#ff70a6",
      "#ffafcc", "#cdb4db", "#a2d2ff", "#bde0fe",
      "#ff99c8", "#fcf6bd", "#d0f4de", "#ffd6a5",
    ],
    background:
      "radial-gradient(ellipse 80% 50% at 50% 110%, hsl(330 80% 60% / 0.55), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 20% 30%, hsl(290 60% 50% / 0.55), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 80% 20%, hsl(210 70% 60% / 0.5), transparent 60%)," +
      "linear-gradient(180deg, hsl(310 50% 18%) 0%, hsl(330 55% 26%) 50%, hsl(345 60% 32%) 100%)",
    accentHsl: "330 100% 75%",
  },
  galaxy: {
    id: "galaxy",
    name: "Galáxia",
    palette: [
      "#7209b7", "#f72585", "#4cc9f0", "#3a0ca3",
      "#b5179e", "#4361ee", "#560bad", "#f15bb5",
      "#9d4edd", "#00f5d4", "#fee440", "#480ca8",
    ],
    background:
      "radial-gradient(ellipse 80% 50% at 50% 110%, hsl(280 90% 35% / 0.7), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 20% 30%, hsl(250 80% 25% / 0.75), transparent 60%)," +
      "radial-gradient(ellipse 60% 40% at 80% 20%, hsl(320 80% 30% / 0.65), transparent 60%)," +
      "linear-gradient(180deg, hsl(260 70% 6%) 0%, hsl(275 65% 12%) 50%, hsl(295 65% 18%) 100%)",
    accentHsl: "280 100% 70%",
  },
};

const STORAGE_KEY = "selected-theme";

export function getActiveTheme(): GameTheme {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    if (id && THEMES[id]) return THEMES[id];
  } catch {}
  return THEMES.neon;
}

export function setActiveTheme(id: string) {
  if (THEMES[id]) localStorage.setItem(STORAGE_KEY, id);
}
