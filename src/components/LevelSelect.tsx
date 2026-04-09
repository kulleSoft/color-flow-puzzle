import { motion } from "framer-motion";
import { ArrowLeft, Star, Lock } from "lucide-react";
import { getMaxUnlockedLevel, type Progress } from "@/lib/progress";

interface LevelSelectProps {
  progress: Progress;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const TOTAL_LEVELS = 30;

export default function LevelSelect({ progress, onSelectLevel, onBack }: LevelSelectProps) {
  const maxUnlocked = getMaxUnlockedLevel(progress.stars);

  return (
    <div className="min-h-screen game-gradient-bg flex flex-col items-center p-4 select-none">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center gap-3 pt-2 pb-6">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Selecionar Nível</h1>
      </div>

      {/* Level Grid */}
      <div className="w-full max-w-lg grid grid-cols-5 gap-3">
        {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((lvl) => {
          const unlocked = lvl <= maxUnlocked;
          const stars = progress.stars[lvl] || 0;

          return (
            <motion.button
              key={lvl}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: lvl * 0.02, type: "spring", stiffness: 300 }}
              onClick={() => unlocked && onSelectLevel(lvl)}
              disabled={!unlocked}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-lg font-bold transition-all ${
                unlocked
                  ? "bg-card border border-border hover:border-primary/50 hover:bg-card/80 text-foreground cursor-pointer"
                  : "bg-muted/30 border border-border/30 text-muted-foreground/40 cursor-not-allowed"
              }`}
            >
              {unlocked ? (
                <>
                  <span>{lvl}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        size={10}
                        className={s <= stars ? "text-accent fill-accent" : "text-muted-foreground/20"}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Lock size={18} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
