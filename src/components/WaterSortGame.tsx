import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Undo2, Trophy, Star, Home, Lightbulb, Plus, SkipForward, Coins } from "lucide-react";
import { generateLevel, canPour, pour, isComplete, getStars, type Tube as TubeType } from "@/lib/gameLogic";
import { playPour, playSelect, playWin } from "@/lib/sounds";
import { saveProgress, type Progress } from "@/lib/progress";
import { getActiveTheme } from "@/lib/themes";
import gameBg from "@/assets/game-bg.png";
import { addCoins, coinsForStars, consumeItem, loadInventory, type Inventory } from "@/lib/economy";
import { toast } from "sonner";
import Tube from "./Tube";

interface WaterSortGameProps {
  initialLevel: number;
  progress: Progress;
  soundEnabled: boolean;
  onUpdateProgress: (p: Progress) => void;
  onBackToMenu: () => void;
}

export default function WaterSortGame({ initialLevel, progress, soundEnabled, onUpdateProgress, onBackToMenu }: WaterSortGameProps) {
  const theme = useMemo(() => getActiveTheme(), [initialLevel]);
  const [level, setLevel] = useState(initialLevel);
  const [tubes, setTubes] = useState<TubeType[]>(() => generateLevel(initialLevel, theme.palette));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<TubeType[][]>([]);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [bubblingIdx, setBubblingIdx] = useState<number | null>(null);
  const [inventory, setInventory] = useState<Inventory>(() => loadInventory());
  const [coinsEarned, setCoinsEarned] = useState(0);

  const startLevel = useCallback((lvl: number) => {
    setLevel(lvl);
    setTubes(generateLevel(lvl, theme.palette));
    setSelectedIdx(null);
    setHistory([]);
    setWon(false);
    setMoves(0);
    setCoinsEarned(0);
    setInventory(loadInventory());
    const next = { ...progress, currentLevel: lvl };
    saveProgress(next);
    onUpdateProgress(next);
  }, [progress, onUpdateProgress, theme.palette]);

  useEffect(() => {
    if (tubes.length > 0 && isComplete(tubes) && !won) {
      setWon(true);
      if (soundEnabled) playWin();
      const earned = getStars(level, moves);
      const best = Math.max(progress.stars[level] || 0, earned);
      const reward = coinsForStars(earned);
      setCoinsEarned(reward);
      if (reward > 0) addCoins(reward);
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
    if (!consumeItem("undo")) {
      toast.error("Sem desfazeres! Compre na loja 🛒");
      return;
    }
    setInventory(loadInventory());
    setTubes(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setMoves((m) => m - 1);
    setSelectedIdx(null);
  };

  const addExtraTube = () => {
    if (!consumeItem("extraTube")) {
      toast.error("Sem tubos extras! Compre na loja 🛒");
      return;
    }
    setInventory(loadInventory());
    setHistory((h) => [...h, tubes.map((t) => [...t])]);
    setTubes((t) => [...t, []]);
  };

  const useHint = () => {
    if (!consumeItem("hint")) {
      toast.error("Sem dicas! Compre na loja 🛒");
      return;
    }
    setInventory(loadInventory());
    // Find a valid pour and highlight the source tube
    for (let i = 0; i < tubes.length; i++) {
      for (let j = 0; j < tubes.length; j++) {
        if (i !== j && canPour(tubes[i], tubes[j])) {
          setSelectedIdx(i);
          toast.info(`💡 Tente mover do tubo ${i + 1} para o tubo ${j + 1}`);
          return;
        }
      }
    }
    toast.warning("Nenhuma jogada disponível 😬");
  };

  const skipLevel = () => {
    if (!consumeItem("skip")) {
      toast.error("Sem pulos! Compre na loja 🛒");
      return;
    }
    setInventory(loadInventory());
    toast.success("Nível pulado ⏭️");
    startLevel(level + 1);
  };

  const currentStars = getStars(level, moves);

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 select-none overflow-hidden relative"
      style={{
        background: theme.background,
      }}
    >
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
          className="neon-icon-btn w-12 h-12 rounded-2xl flex items-center justify-center text-[hsl(190_100%_70%)]"
        >
          <Home size={22} strokeWidth={2.5} />
        </motion.button>

        <div className="flex flex-col items-center gap-2">
          <div className="level-plaque px-8 py-2 relative">
            <span className="font-extrabold text-white tracking-widest text-lg drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
              NÍVEL {level}
            </span>
          </div>

          {/* Stars bar */}
          <div className="stars-plaque flex items-center gap-2 px-4 py-1">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                size={18}
                className={
                  s <= currentStars
                    ? "text-[hsl(45_100%_60%)] fill-[hsl(45_100%_60%)] drop-shadow-[0_0_6px_rgba(255,200,0,0.8)]"
                    : "text-white/20 fill-white/10"
                }
              />
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => startLevel(level)}
          className="neon-icon-btn w-12 h-12 rounded-2xl flex items-center justify-center text-[hsl(190_100%_70%)]"
        >
          <RotateCcw size={20} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-2xl relative z-10">
        <div className="flex flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 md:gap-x-3 lg:gap-x-4 px-2">
          {tubes.map((tube, i) => (
            <Tube
              key={i}
              tube={tube}
              selected={selectedIdx === i}
              bubbling={bubblingIdx === i}
              accentHsl={theme.accentHsl}
              onClick={() => handleTubeClick(i)}
            />
          ))}
        </div>
      </div>


      {/* Bottom action buttons */}
      <div className="w-full max-w-lg flex items-center justify-around pb-4 pt-4 relative z-10">
        <ActionButton
          icon={<Plus size={28} strokeWidth={3} />}
          label="TUBO EXTRA"
          badge={inventory.extraTube}
          color="cyan"
          onClick={addExtraTube}
          disabled={inventory.extraTube <= 0}
        />
        <ActionButton
          icon={<Lightbulb size={28} strokeWidth={2.5} />}
          label="DICA"
          badge={inventory.hint}
          color="yellow"
          onClick={useHint}
          disabled={inventory.hint <= 0}
        />
        <ActionButton
          icon={<SkipForward size={28} strokeWidth={2.5} />}
          label="PULAR"
          badge={inventory.skip}
          color="yellow"
          onClick={skipLevel}
          disabled={inventory.skip <= 0}
        />
        <ActionButton
          icon={<Undo2 size={28} strokeWidth={3} />}
          label="DESFAZER"
          badge={inventory.undo}
          color="pink"
          onClick={undo}
          disabled={history.length === 0 || inventory.undo <= 0}
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
              <p className="text-muted-foreground mb-3">{moves} movimentos</p>
              {coinsEarned > 0 && (
                <motion.div
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 350 }}
                  className="flex items-center justify-center gap-2 mb-5 px-3 py-2 rounded-xl bg-[hsl(45_100%_60%)]/15 border border-[hsl(45_100%_60%)]/40"
                >
                  <Coins className="text-[hsl(45_100%_60%)]" size={20} />
                  <span className="text-[hsl(45_100%_70%)] font-bold">+{coinsEarned} moedas</span>
                </motion.div>
              )}
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
  badge,
  color = "cyan",
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  color?: "cyan" | "yellow" | "pink";
  onClick: () => void;
  disabled?: boolean;
}) {
  const colorMap = {
    cyan: "text-[hsl(190_100%_70%)]",
    yellow: "text-[hsl(45_100%_65%)]",
    pink: "text-[hsl(320_100%_75%)]",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1.5 disabled:opacity-40"
    >
      <div className={`action-btn-frame w-16 h-16 flex items-center justify-center relative ${colorMap[color]}`}>
        <span style={{ filter: "drop-shadow(0 0 6px currentColor)" }}>{icon}</span>
        {badge !== undefined && (
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-b from-[hsl(260_60%_35%)] to-[hsl(260_70%_20%)] border-2 border-[hsl(45_80%_55%)] flex items-center justify-center text-white text-xs font-bold shadow-lg">
            {badge}
          </div>
        )}
      </div>
      <span className="text-[10px] font-bold text-white tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{label}</span>
    </motion.button>
  );
}
