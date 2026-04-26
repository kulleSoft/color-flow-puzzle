import { motion } from "framer-motion";
import { TUBE_CAPACITY, isTubeSorted, type Tube as TubeType } from "@/lib/gameLogic";
import Bubbles from "./Bubbles";

interface TubeProps {
  tube: TubeType;
  selected: boolean;
  bubbling: boolean;
  onClick: () => void;
}

export default function Tube({ tube, selected, bubbling, onClick }: TubeProps) {
  const sorted = isTubeSorted(tube);
  const topColor = tube.length > 0 ? tube[tube.length - 1] : "#fff";
  const SEG_H = 30;

  return (
    <motion.button
      onClick={onClick}
      animate={{ y: selected ? -18 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex flex-col items-center focus:outline-none"
    >
      <div
        className={`relative w-14 sm:w-16 tube-capsule flex flex-col-reverse overflow-hidden transition-all duration-200 ${
          sorted ? "tube-sorted" : ""
        } ${selected ? "tube-glow" : ""}`}
        style={{ height: `${TUBE_CAPACITY * SEG_H + 16}px` }}
      >
        {/* Liquid segments */}
        <div className="flex flex-col-reverse w-full" style={{ paddingBottom: 4 }}>
          {tube.map((color, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.04 }}
              className="w-full origin-bottom relative"
              style={{
                height: SEG_H,
                background: `linear-gradient(180deg, ${color} 0%, ${color} 60%, color-mix(in srgb, ${color} 75%, black) 100%)`,
              }}
            >
              {/* liquid sheen */}
              <div
                className="absolute left-1 top-0.5 w-1.5 h-2/3 rounded-full"
                style={{ background: "rgba(255,255,255,0.35)", filter: "blur(1px)" }}
              />
            </motion.div>
          ))}
        </div>

        <Bubbles color={topColor} active={bubbling} />

        {/* Glass shine left */}
        <div
          className="absolute left-1.5 top-3 bottom-3 w-1.5 rounded-full pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0.05))" }}
        />
        {/* Glass shine right edge */}
        <div
          className="absolute right-1 top-4 bottom-4 w-0.5 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.15)" }}
        />
      </div>
      {/* Reflection */}
      <div
        className="w-14 sm:w-16 h-2 mt-0.5 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
    </motion.button>
  );
}
