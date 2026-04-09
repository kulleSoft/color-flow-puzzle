import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Undo2, SkipForward, Trophy, Star, Home } from "lucide-react";
import { generateLevel, canPour, pour, isComplete, getStars, type Tube as TubeType } from "@/lib/gameLogic";
import { playPour, playSelect, playWin } from "@/lib/sounds";
import { saveProgress, getTotalStars, type Progress } from "@/lib/progress";
import Tube from "./Tube";

interface WaterSortGameProps {
  initialLevel: number;
  progress: Progress;
  soundEnabled: boolean;
  onUpdateProgress: (p: Progress) => void;
  onBackToMenu: () => void;
}

export default function WaterSortGame({ initialLevel, progress, soundEnabled, onUpdateProgress, onBackToMenu }: WaterSortGameProps) {
  const [level, setLevel] = useState(initialLevel);
  const [tubes, setTubes] = useState<TubeType[]>(() => generateLevel(initialLevel));
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
    const next = { ...progress, currentLevel: lvl };
    saveProgress(next);
    onUpdateProgress(next);
  }, [progress, onUpdateProgress]);

  useEffect(() => {
    if (tubes.length > 0 && isComplete(tubes) && !won) {
      setWon(true);
      if (soundEnabled) playWin();
      const earned = getStars(level, moves);
      const best = Math.max(progress.stars[level] || 0, earned);
      const next = { ...progress, stars: { ...progress.stars, [level]: best } };
      saveProgress(next);
      onUpdateProgress(next);
    }
  }, [tubes, won, level, moves, soundEnabled, progress, onUpdateProgress]);

  const handleTubeClick = (idx: number) => {
    if (won) return;
    if (selectedIdx === null) {
      if (tubes[idx].length > 0) {
        setSelectedIdx(idx);
        if (soundEnabled) playSelect();
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
        if (soundEnabled) playPour();
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

  const totalStars = getTotalStars(progress.stars);

  return (
    <div className="min-h-screen game-gradient-bg flex flex-col items-center justify-between p-4 select-none overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
          >
            <Home size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Level {level}</h1>
            <p className="text-sm text-muted-foreground">
              {moves} moves · <Star size={12} className="inline text-accent fill-accent mb-0.5" /> {totalStars}
            </p>
          </div>
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
              <div className="flex gap-2">
                <button
                  onClick={onBackToMenu}
                  className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:text-foreground transition-all"
                >
                  Menu
                </button>
                <button
                  onClick={() => startLevel(level + 1)}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:brightness-110 transition-all"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-8" />
    </div>
  );
}
