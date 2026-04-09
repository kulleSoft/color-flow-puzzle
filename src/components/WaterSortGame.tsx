import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Undo2, SkipForward, Trophy, Star } from "lucide-react";
import { generateLevel, canPour, pour, isComplete, getStars, type Tube as TubeType } from "@/lib/gameLogic";
import { playPour, playSelect, playWin } from "@/lib/sounds";
import Tube from "./Tube";

const STORAGE_KEY = "water-sort-progress";

interface Progress {
  currentLevel: number;
  stars: Record<number, number>; // level -> best stars
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { currentLevel: 1, stars: {} };
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function WaterSortGame() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [level, setLevel] = useState(() => loadProgress().currentLevel);
  const [tubes, setTubes] = useState<TubeType[]>(() => generateLevel(loadProgress().currentLevel));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<TubeType[][]>([]);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [bubblingIdx, setBubblingIdx] = useState<number | null>(null);

  const startLevel = useCallback((lvl: number) => {
    setLevel(lvl);
    setTubes(generateLevel(lvl));
    setSelectedIdx(null);
    setHistory([]);
    setWon(false);
    setMoves(0);
    setProgress((prev) => {
      const next = { ...prev, currentLevel: lvl };
      saveProgress(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (tubes.length > 0 && isComplete(tubes) && !won) {
      setWon(true);
      playWin();
    }
  }, [tubes, won]);

  const handleTubeClick = (idx: number) => {
    if (won) return;

    if (selectedIdx === null) {
      if (tubes[idx].length > 0) {
        setSelectedIdx(idx);
        playSelect();
      }
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      if (canPour(tubes[selectedIdx], tubes[idx])) {
        setHistory((h) => [...h, tubes.map((t) => [...t])]);
        const newTubes = tubes.map((t) => [...t]);
        const [newFrom, newTo] = pour(newTubes[selectedIdx], newTubes[idx]);
        newTubes[selectedIdx] = newFrom;
        newTubes[idx] = newTo;
        setTubes(newTubes);
        setMoves((m) => m + 1);
        setBubblingIdx(idx);
        playPour();
        setTimeout(() => setBubblingIdx(null), 500);
      }
      setSelectedIdx(null);
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    setTubes(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setMoves((m) => m - 1);
    setSelectedIdx(null);
  };

  return (
    <div className="min-h-screen game-gradient-bg flex flex-col items-center justify-between p-4 select-none overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between pt-2 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Water Sort</h1>
          <p className="text-sm text-muted-foreground">Level {level} · {moves} moves</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
          >
            <Undo2 size={20} />
          </button>
          <button
            onClick={() => startLevel(level)}
            className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => startLevel(level + 1)}
            className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-2xl">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {tubes.map((tube, i) => (
            <Tube
              key={i}
              tube={tube}
              selected={selectedIdx === i}
              bubbling={bubblingIdx === i}
              onClick={() => handleTubeClick(i)}
            />
          ))}
        </div>
      </div>

      {/* Win Overlay */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-card rounded-2xl p-8 text-center shadow-2xl border border-border max-w-xs mx-4"
            >
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--game-success))]/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-[hsl(var(--game-success))]" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Level Complete!</h2>
              <div className="flex justify-center gap-1 mb-1">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + s * 0.15, type: "spring", stiffness: 400 }}
                  >
                    <Star
                      size={28}
                      className={s <= getStars(level, moves) ? "text-accent fill-accent" : "text-muted-foreground/30"}
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-muted-foreground mb-6">{moves} moves</p>
              <button
                onClick={() => startLevel(level + 1)}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:brightness-110 transition-all"
              >
                Next Level
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}
