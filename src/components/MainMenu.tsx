import { motion } from "framer-motion";
import { Play, Grid3X3, Settings, Star, Droplets } from "lucide-react";
import { getTotalStars, type Progress } from "@/lib/progress";

interface MainMenuProps {
  progress: Progress;
  onPlay: () => void;
  onLevelSelect: () => void;
  onSettings: () => void;
}

export default function MainMenu({ progress, onPlay, onLevelSelect, onSettings }: MainMenuProps) {
  const totalStars = getTotalStars(progress.stars);

  return (
    <div className="min-h-screen game-gradient-bg flex flex-col items-center justify-center p-4 select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Droplets className="text-primary" size={40} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Water Sort</h1>
          <p className="text-muted-foreground mt-2 text-lg">Puzzle Game</p>
          {totalStars > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-3 text-accent">
              <Star size={16} className="fill-accent" />
              <span className="font-semibold">{totalStars}</span>
            </div>
          )}
        </motion.div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-3 w-64 mx-auto">
          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onPlay}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:brightness-110 transition-all shadow-lg"
          >
            <Play size={22} />
            Jogar
          </motion.button>

          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onLevelSelect}
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-base hover:brightness-110 transition-all"
          >
            <Grid3X3 size={20} />
            Níveis
          </motion.button>

          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={onSettings}
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-muted/60 text-muted-foreground font-semibold text-base hover:text-foreground hover:bg-muted transition-all"
          >
            <Settings size={20} />
            Configurações
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
