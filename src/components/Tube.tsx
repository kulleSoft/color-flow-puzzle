import { motion } from "framer-motion";
import { TUBE_CAPACITY, isTubeSorted, type Tube as TubeType } from "@/lib/gameLogic";
import Bubbles from "./Bubbles";
import tubeImg from "@/assets/tube.png";

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

  // Inner liquid area sits inside the glass image.
  // The image has some transparent padding around the tube; these percentages
  // approximate the inner walls of the glass for the liquid mask.
  const INNER_TOP_PCT = 16; // % from top where liquid can start
  const INNER_BOTTOM_PCT = 6; // % from bottom (rounded base)
  const INNER_LEFT_PCT = 26;
  const INNER_RIGHT_PCT = 26;

  const tubeHeight = TUBE_CAPACITY * SEG_H + 24;
  const tubeWidth = Math.round(tubeHeight * 0.32);

  return (
    <motion.button
      onClick={onClick}
      animate={{ y: selected ? -18 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex flex-col items-center focus:outline-none"
    >
      <div
        className={`relative transition-all duration-200 ${selected ? "tube-selected-glow" : ""}`}
        style={{ width: tubeWidth, height: tubeHeight }}
      >
        {/* Liquid container — clipped to inner tube shape */}
        <div
          className="absolute overflow-hidden flex flex-col-reverse"
          style={{
            top: `${INNER_TOP_PCT}%`,
            bottom: `${INNER_BOTTOM_PCT}%`,
            left: `${INNER_LEFT_PCT}%`,
            right: `${INNER_RIGHT_PCT}%`,
            borderRadius: "2px 2px 999px 999px / 2px 2px 60px 60px",
          }}
        >
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
            />
          ))}
          <Bubbles color={topColor} active={bubbling} />
        </div>

        {/* Glass image overlay (on top of liquid for realistic refraction) */}
        <img
          src={tubeImg}
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          style={{
            filter: sorted
              ? "drop-shadow(0 0 12px hsl(140 80% 55% / 0.7))"
              : selected
                ? "drop-shadow(0 0 14px hsl(190 100% 65% / 0.85))"
                : "drop-shadow(0 6px 10px rgba(0,0,0,0.45))",
          }}
          draggable={false}
        />
      </div>
      {/* Reflection */}
      <div
        className="h-2 mt-0.5 rounded-full opacity-40"
        style={{
          width: tubeWidth * 0.7,
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
    </motion.button>
  );
}
