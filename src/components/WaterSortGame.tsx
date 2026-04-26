import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Undo2, Trophy, Star, Home, Lightbulb, Plus } from "lucide-react";
import { generateLevel, canPour, pour, isComplete, getStars, type Tube as TubeType } from "@/lib/gameLogic";
import { playPour, playSelect, playWin } from "@/lib/sounds";
import { saveProgress, type Progress } from "@/lib/progress";
import Tube from "./Tube";
import gameBg from "@/assets/game-bg.png";

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

  const addExtraTube = () => {
    setHistory((h) => [...h, tubes.map((t) => [...t])]);
    setTubes((t) => [...t, []]);
  };

  const currentStars = getStars(level, moves);

  return (
    <div className="min-h-screen neon-bg flex flex-col items-center p-4 select-none overflow-hidden relative">
      {/* Decorative palm-like silhouettes */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3"
          style={{ background: "radial-gradient(ellipse at bottom left, hsl(280 60% 10% / 0.8), transparent 60%)" }} />
        <div className="absolute bottom-0 right-0 w-1/3 h-2/3"
          style={{ background: "radial-gradient(ellipse at bottom right, hsl(280 60% 10% / 0.8), transparent 60%)" }} />
      </div>

      {/* Header */}
      <div className="w-full max-w-lg flex items-start justify-between pt-2 pb-4 relative z-10">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onBackToMenu}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(220 80% 45%))",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 12px hsl(var(--primary) / 0.4)",
          }}
        >
          <Home size={22} />
        </motion.button>

        <div className="flex flex-col items-center gap-2">
          <div
            className="px-6 py-2 rounded-full border-2"
            style={{
              background: "hsl(260 50% 15% / 0.7)",
              borderColor: "hsl(var(--primary) / 0.4)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), 0 0 16px hsl(var(--primary) / 0.2)",
            }}
          >
            <span className="font-bold text-foreground tracking-wider">NÍVEL {level}</span>
          </div>

          {/* Stars bar */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full border"
            style={{
              background: "hsl(260 50% 15% / 0.6)",
              borderColor: "hsl(var(--accent) / 0.3)",
            }}
          >
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                size={16}
                className={s <= currentStars ? "text-accent fill-accent" : "text-muted-foreground/40"}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => startLevel(level)}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg relative"
            style={{
              background: "linear-gradient(135deg, hsl(200 80% 55%), hsl(220 80% 45%))",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 12px hsl(var(--primary) / 0.4)",
            }}
          >
            <RotateCcw size={20} />
          </motion.button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-2xl relative z-10">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-2">
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

      {/* Floor reflection */}
      <div className="absolute bottom-24 left-0 right-0 h-32 neon-floor pointer-events-none" />

      {/* Bottom action buttons */}
      <div className="w-full max-w-lg flex items-center justify-around pb-4 pt-4 relative z-10">
        <ActionButton icon={<Plus size={26} />} label="Tubo extra" onClick={addExtraTube} />
        <ActionButton icon={<Lightbulb size={26} />} label="Dica" onClick={() => {}} />
        <ActionButton
          icon={<Undo2 size={26} />}
          label="Desfazer"
          onClick={undo}
          disabled={history.length === 0}
        />
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
              <h2 className="text-2xl font-bold text-foreground mb-2">Nível Completo!</h2>
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
              <p className="text-muted-foreground mb-6">{moves} movimentos</p>
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
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1.5 disabled:opacity-40"
    >
      <div className="circle-btn w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground">
        {icon}
      </div>
      <span className="text-xs font-semibold text-foreground/90">{label}</span>
    </motion.button>
  );
}
