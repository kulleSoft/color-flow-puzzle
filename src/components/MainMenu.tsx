import { motion } from "framer-motion";
import { Play, Settings, Trophy, CalendarDays, ShoppingCart, Palette, Gift, LogOut } from "lucide-react";
import { getTotalStars, type Progress } from "@/lib/progress";
import { useState } from "react";
import { toast } from "sonner";
import gameBg from "@/assets/game-bg.png";

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
  "hsl(190, 100%, 60%)",
  "hsl(320, 80%, 60%)",
  "hsl(45, 100%, 60%)",
  "hsl(275, 80%, 65%)",
];

function generateBubbles(count: number): FloatingBubble[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 60 + Math.random() * 40,
    size: 6 + Math.random() * 18,
    duration: 7 + Math.random() * 7,
    delay: Math.random() * 5,
    color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
  }));
}

interface MainMenuProps {
  progress: Progress;
  onPlay: () => void;
  onLevelSelect: () => void;
  onSettings: () => void;
}

export default function MainMenu({ progress, onPlay, onLevelSelect, onSettings }: MainMenuProps) {
  const totalStars = getTotalStars(progress.stars);
  const [bubbles] = useState(() => generateBubbles(12));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 select-none overflow-hidden relative"
      style={{
        backgroundImage: `linear-gradient(180deg, hsl(260 50% 12% / 0.55) 0%, hsl(280 55% 18% / 0.65) 60%, hsl(320 50% 22% / 0.75) 100%), url(${gameBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Floating bubbles */}
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
            opacity: [0, 0.4, 0.4, 0],
            y: [0, -220 - Math.random() * 260],
            x: [0, (Math.random() - 0.5) * 50],
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="w-full max-w-md flex flex-col gap-4 relative z-10"
      >
        {totalStars > 0 && (
          <div className="flex justify-center mb-1">
            <div className="menu-neon-circle px-4 py-1.5 flex items-center gap-2">
              <span className="neon-text-cyan font-bold text-sm">⭐ {totalStars}</span>
            </div>
          </div>
        )}

        {/* JOGAR - botão grande */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onPlay}
          className="menu-neon-frame-lg py-5 px-6 flex items-center justify-center gap-5"
        >
          <div className="menu-neon-circle w-14 h-14 flex items-center justify-center">
            <Play className="neon-icon-cyan ml-0.5" size={28} strokeWidth={2.5} fill="currentColor" />
          </div>
          <span className="neon-text-cyan text-3xl font-bold tracking-wider">JOGAR</span>
        </motion.button>

        {/* Linha 2: Conquistas + Configurações */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onLevelSelect}
            className="menu-neon-frame py-3 px-4 flex items-center justify-center gap-2.5"
          >
            <Trophy className="neon-icon-cyan" size={22} strokeWidth={2.2} />
            <span className="neon-text-cyan text-sm font-bold tracking-wide">NÍVEIS</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onSettings}
            className="menu-neon-frame py-3 px-4 flex items-center justify-center gap-2.5"
          >
            <Settings className="neon-icon-cyan" size={22} strokeWidth={2.2} />
            <span className="neon-text-cyan text-sm font-bold tracking-wide">CONFIG.</span>
          </motion.button>
        </div>

        {/* Linha 3: Diário (largura total) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="menu-neon-frame py-3 px-4 flex items-center justify-center gap-2.5"
        >
          <CalendarDays className="neon-icon-cyan" size={22} strokeWidth={2.2} />
          <span className="neon-text-cyan text-sm font-bold tracking-wide">DIÁRIO</span>
        </motion.button>

        {/* Linha 4: 4 botões circulares */}
        <div className="grid grid-cols-4 gap-3 mt-1">
          {[
            { icon: ShoppingCart, label: "LOJA" },
            { icon: Palette, label: "TEMAS" },
            { icon: Gift, label: "PRÊMIOS" },
            { icon: LogOut, label: "SAIR" },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="menu-neon-circle w-14 h-14 flex items-center justify-center">
                <item.icon className="neon-icon-cyan" size={24} strokeWidth={2.2} />
              </div>
              <span className="neon-text-cyan text-[10px] font-bold tracking-wider">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
