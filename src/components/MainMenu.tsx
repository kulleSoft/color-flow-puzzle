import { motion } from "framer-motion";
import { Play, Grid3X3, Settings, Star, Droplets } from "lucide-react";
import { getTotalStars, type Progress } from "@/lib/progress";
import { useState, useEffect } from "react";

/* Floating decorative bubbles */
interface FloatingBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const BUBBLE_COLORS = [
  "hsl(200, 80%, 55%)",   // primary blue
  "hsl(260, 60%, 55%)",   // secondary purple
  "hsl(145, 65%, 50%)",   // green
  "hsl(0, 75%, 55%)",     // red
  "hsl(45, 90%, 60%)",    // accent yellow
  "hsl(320, 60%, 55%)",   // pink
];

function generateBubbles(count: number): FloatingBubble[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 60 + Math.random() * 40,
    size: 8 + Math.random() * 24,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 5,
    color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
  }));
}

/* Mini decorative tube */
function MiniTube({ colors, delay }: { colors: string[]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col-reverse overflow-hidden rounded-b-lg"
      style={{
        width: 20,
        height: 64,
        border: "1.5px solid hsl(var(--tube-glass-border) / 0.4)",
        borderTop: "none",
        background: "hsl(var(--tube-glass) / 0.1)",
      }}
    >
      {colors.map((c, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: delay + i * 0.1 + 0.3, type: "spring", stiffness: 200 }}
          className="w-full origin-bottom"
          style={{ height: 16, backgroundColor: c, opacity: 0.8 }}
        />
      ))}
    </motion.div>
  );
}

interface MainMenuProps {
  progress: Progress;
  onPlay: () => void;
  onLevelSelect: () => void;
  onSettings: () => void;
}

export default function MainMenu({ progress, onPlay, onLevelSelect, onSettings }: MainMenuProps) {
  const totalStars = getTotalStars(progress.stars);
  const [bubbles] = useState(() => generateBubbles(14));

  // Animated water drip on the logo
  const [drip, setDrip] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      setDrip(true);
      setTimeout(() => setDrip(false), 800);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen game-gradient-bg flex flex-col items-center justify-center p-4 select-none overflow-hidden relative">
      {/* Floating bubbles background */}
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${b.x}%`,
            bottom: `${b.y}%`,
            width: b.size,
            height: b.size,
            backgroundColor: b.color,
            boxShadow: `0 0 ${b.size}px ${b.color}`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.35, 0.35, 0],
            y: [0, -200 - Math.random() * 300],
            x: [0, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center relative z-10"
      >
        {/* Logo with animated icon */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="mb-8"
        >
          <motion.div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 relative"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.25), hsl(var(--secondary) / 0.25))",
              boxShadow: "0 0 40px hsl(var(--primary) / 0.2), inset 0 1px 1px hsl(var(--tube-highlight) / 0.1)",
              border: "1px solid hsl(var(--primary) / 0.2)",
            }}
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Droplets className="text-primary" size={44} />
            {/* Drip animation */}
            {drip && (
              <motion.div
                initial={{ opacity: 0.8, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: 30, scale: 0.3 }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                className="absolute -bottom-2 w-2 h-2 rounded-full bg-primary"
              />
            )}
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
              Water Sort
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg tracking-widest uppercase">Puzzle Game</p>

          {/* Decorative mini tubes */}
          <div className="flex items-end justify-center gap-2 mt-5">
            <MiniTube colors={["hsl(0,75%,55%)", "hsl(0,75%,55%)", "hsl(200,80%,55%)"]} delay={0.4} />
            <MiniTube colors={["hsl(200,80%,55%)", "hsl(145,65%,50%)", "hsl(200,80%,55%)"]} delay={0.5} />
            <MiniTube colors={["hsl(145,65%,50%)", "hsl(0,75%,55%)", "hsl(145,65%,50%)"]} delay={0.6} />
            <MiniTube colors={[]} delay={0.7} />
          </div>

          {totalStars > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="flex items-center justify-center gap-2 mt-4"
            >
              <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/20">
                <Star size={16} className="fill-accent text-accent" />
                <span className="font-bold text-accent">{totalStars}</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-3 w-64 mx-auto">
          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onPlay}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-lg text-primary-foreground transition-all shadow-lg"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
              boxShadow: "0 8px 24px hsl(var(--primary) / 0.35)",
            }}
          >
            <Play size={22} />
            Jogar
          </motion.button>

          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLevelSelect}
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-secondary/20 text-secondary-foreground font-semibold text-base border border-secondary/30 hover:bg-secondary/30 transition-all"
          >
            <Grid3X3 size={20} />
            Níveis
          </motion.button>

          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSettings}
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-muted/40 text-muted-foreground font-semibold text-base border border-border/50 hover:text-foreground hover:bg-muted/60 transition-all"
          >
            <Settings size={20} />
            Configurações
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
