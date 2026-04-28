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

  // Inner liquid area — measured pixel-perfect from the glass image (1024x1536).
  // Straight inner walls: x 40.3%→59.7% (until y≈79%). Rim opening: y≈20.5%.
  // Base curve spans y 79%→85%; we use an elliptical clip to fit that curve.
  const INNER_TOP_PCT = 20.5;
  const INNER_BOTTOM_PCT = 15; // liquid bottom at 85% of image height
  const INNER_LEFT_PCT = 40.3;
  const INNER_RIGHT_PCT = 40.3; // 100 - 59.7
  // Ellipse height at the base: 2 × (85% − 79%) = 12% of image height
  const BASE_ELLIPSE_PCT = 12;

  // Match the image's native aspect ratio (1024/1536 ≈ 0.667) so inner %s stay accurate.
  // Sized so 4 segments of SEG_H fill the inner liquid area exactly.
  const innerPct = (100 - INNER_TOP_PCT - INNER_BOTTOM_PCT) / 100;
  const tubeHeight = Math.round((TUBE_CAPACITY * SEG_H) / innerPct);
  const tubeWidth = Math.round(tubeHeight * (1024 / 1536));

  return (
    <motion.button
      onClick={onClick}
      animate={{ y: selected ? -18 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex flex-col items-center focus:outline-none"
      style={{ marginLeft: -tubeWidth * 0.22, marginRight: -tubeWidth * 0.22 }}
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
            // Base elliptical curve: horizontal radius 50% of width, vertical radius ≈9.3% of container height
            // (6% of image height / 64.5% container height). Top is straight (no radius).
            borderRadius: "0 0 50% 50% / 0 0 9.3% 9.3%",
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
