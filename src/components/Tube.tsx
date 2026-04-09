import { motion } from "framer-motion";
import { TUBE_CAPACITY, isTubeSorted, type Tube as TubeType } from "@/lib/gameLogic";

interface TubeProps {
  tube: TubeType;
  selected: boolean;
  onClick: () => void;
}

export default function Tube({ tube, selected, onClick }: TubeProps) {
  const sorted = isTubeSorted(tube);

  return (
    <motion.button
      onClick={onClick}
      animate={{ y: selected ? -14 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex flex-col-reverse items-center focus:outline-none"
    >
      <div
        className={`relative w-12 sm:w-14 tube-glass tube-highlight flex flex-col-reverse overflow-hidden transition-all duration-200 ${
          sorted ? "ring-2 ring-[hsl(var(--game-success))]" : ""
        }`}
        style={{ height: `${TUBE_CAPACITY * 28 + 8}px` }}
      >
        {tube.map((color, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.05 }}
            className="w-full origin-bottom"
            style={{
              height: 28,
              backgroundColor: color,
              opacity: sorted ? 0.9 : 0.85,
            }}
          />
        ))}
        {/* Glass shine */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, transparent 70%)"
        }} />
      </div>
      {/* Tube rim */}
      <div className="w-14 sm:w-16 h-1.5 rounded-t-sm" style={{
        background: "hsl(var(--tube-glass-border) / 0.5)"
      }} />
    </motion.button>
  );
}
