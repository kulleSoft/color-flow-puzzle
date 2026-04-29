import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TUBE_CAPACITY, isTubeSorted, type Tube as TubeType } from "@/lib/gameLogic";
import Bubbles from "./Bubbles";
import tubeImg from "@/assets/tube.png";

interface TubeProps {
  tube: TubeType;
  selected: boolean;
  bubbling: boolean;
  accentHsl?: string;
  onClick: () => void;
  // Pour animation props
  pouring?: {
    role: "from" | "to";
    color: string;
    /** delta from THIS tube's center to the partner's mouth, in px */
    dx: number;
    dy: number;
    /** which side to tilt toward (only for "from") */
    side?: "left" | "right";
    /** distance the stream needs to travel vertically (px) */
    streamHeight?: number;
    duration: number;
  } | null;
  /** Hide the top liquid segment (used on source while pouring) */
  hideTopSegment?: boolean;
}

const Tube = forwardRef<HTMLButtonElement, TubeProps>(function Tube(
  { tube, selected, bubbling, accentHsl = "190 100% 65%", onClick, pouring, hideTopSegment },
  ref,
) {
  const sorted = isTubeSorted(tube);
  const topColor = tube.length > 0 ? tube[tube.length - 1] : "#fff";
  const SEG_H = 30;

  const INNER_TOP_PCT = 20.5;
  const INNER_BOTTOM_PCT = 15;
  const INNER_LEFT_PCT = 40.3;
  const INNER_RIGHT_PCT = 40.3;

  const innerPct = (100 - INNER_TOP_PCT - INNER_BOTTOM_PCT) / 100;
  const tubeHeight = Math.round((TUBE_CAPACITY * SEG_H) / innerPct);
  const tubeWidth = Math.round(tubeHeight * (1024 / 1536));

  const isFrom = pouring?.role === "from";
  const tiltDeg = isFrom ? (pouring?.side === "left" ? -65 : 65) : 0;
  // Lift the source tube up & toward the destination so its mouth hovers over destination's mouth
  const liftY = isFrom ? -Math.abs(pouring?.dy ?? 0) - 20 : 0;
  const shiftX = isFrom ? (pouring?.dx ?? 0) * 0.5 : 0;

  const visibleTube = hideTopSegment && tube.length > 0 ? tube.slice(0, -1) : tube;
  const streamHeight = pouring?.streamHeight ?? 120;
  const dur = pouring?.duration ?? 0.7;

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      animate={{
        y: isFrom ? liftY : selected ? -18 : 0,
        x: shiftX,
        rotate: tiltDeg,
      }}
      transition={
        isFrom
          ? { duration: dur * 0.35, ease: "easeOut" }
          : { type: "spring", stiffness: 400, damping: 25 }
      }
      style={{
        marginLeft: -tubeWidth * 0.15,
        marginRight: -tubeWidth * 0.15,
        zIndex: isFrom ? 30 : 1,
        transformOrigin:
          pouring?.side === "left" ? "20% 80%" : "80% 80%",
      }}
      className="flex flex-col items-center focus:outline-none shrink-0 relative"
    >
      <div
        className={`relative transition-all duration-200 ${selected ? "tube-selected-glow" : ""}`}
        style={{ width: tubeWidth, height: tubeHeight }}
      >
        {/* Liquid container */}
        <div
          className="absolute overflow-hidden flex flex-col-reverse"
          style={{
            top: `${INNER_TOP_PCT}%`,
            bottom: `${INNER_BOTTOM_PCT}%`,
            left: `${INNER_LEFT_PCT}%`,
            right: `${INNER_RIGHT_PCT}%`,
            borderRadius: "0 0 50% 50% / 0 0 9.3% 9.3%",
          }}
        >
          {visibleTube.map((color, i) => (
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

        {/* Glass image overlay */}
        <img
          src={tubeImg}
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          style={{
            filter: sorted
              ? "drop-shadow(0 0 12px hsl(140 80% 55% / 0.7))"
              : selected
                ? `drop-shadow(0 0 14px hsl(${accentHsl} / 0.85))`
                : "drop-shadow(0 6px 10px rgba(0,0,0,0.45))",
          }}
          draggable={false}
        />

        {/* Pour stream — emits from the source tube's mouth (top center) */}
        <AnimatePresence>
          {isFrom && pouring && (
            <>
              {/* Wet trail / residue clinging to the tube mouth */}
              <motion.div
                key="trail"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1, 1, 0.6, 0], opacity: [0, 0.85, 0.9, 0.5, 0] }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: dur,
                  times: [0, 0.25, 0.7, 0.9, 1],
                  ease: "easeOut",
                }}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "12%",
                  width: tubeWidth * 0.12,
                  height: tubeWidth * 0.55,
                  marginLeft: -(tubeWidth * 0.12) / 2,
                  transformOrigin: "top center",
                  background: `linear-gradient(180deg, ${pouring.color} 0%, ${pouring.color} 55%, color-mix(in srgb, ${pouring.color} 60%, transparent) 100%)`,
                  borderRadius: "50% 50% 60% 60% / 30% 30% 90% 90%",
                  boxShadow: `0 0 8px ${pouring.color}, inset 0 0 4px rgba(255,255,255,0.4)`,
                  filter: "blur(0.4px)",
                  zIndex: 2,
                }}
              />
              {/* Falling droplet that detaches from the mouth */}
              <motion.div
                key="droplet"
                initial={{ y: 0, opacity: 0, scale: 0.6 }}
                animate={{
                  y: [0, tubeWidth * 0.35, tubeWidth * 0.7],
                  opacity: [0, 1, 0],
                  scale: [0.6, 1, 0.8],
                }}
                transition={{
                  duration: dur * 0.7,
                  delay: dur * 0.55,
                  ease: "easeIn",
                }}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "30%",
                  width: tubeWidth * 0.14,
                  height: tubeWidth * 0.18,
                  marginLeft: -(tubeWidth * 0.14) / 2,
                  background: `radial-gradient(ellipse at 35% 30%, color-mix(in srgb, ${pouring.color} 80%, white) 0%, ${pouring.color} 60%, color-mix(in srgb, ${pouring.color} 70%, black) 100%)`,
                  borderRadius: "50% 50% 60% 60% / 40% 40% 80% 80%",
                  boxShadow: `0 0 6px ${pouring.color}`,
                  zIndex: 3,
                }}
              />
              <motion.div
                key="stream"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: dur,
                  times: [0, 0.35, 0.75, 1],
                  ease: "easeOut",
                }}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "18%",
                  width: tubeWidth * 0.22,
                  height: streamHeight,
                  marginLeft: -(tubeWidth * 0.22) / 2,
                  transformOrigin: "top center",
                  background: `linear-gradient(180deg, ${pouring.color} 0%, ${pouring.color} 70%, color-mix(in srgb, ${pouring.color} 70%, black) 100%)`,
                  borderRadius: "40% 40% 30% 30% / 60% 60% 20% 20%",
                  boxShadow: `0 0 12px ${pouring.color}, inset 0 0 8px rgba(255,255,255,0.25)`,
                  filter: "blur(0.3px)",
                }}
              />
            </>
          )}
          {pouring?.role === "to" && (
            <>
              {/* Central splash burst */}
              <motion.div
                key="splash-burst"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1.8], opacity: [0, 0.9, 0] }}
                transition={{
                  duration: dur * 0.5,
                  delay: dur * 0.55,
                  ease: "easeOut",
                }}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "22%",
                  width: tubeWidth * 0.35,
                  height: tubeWidth * 0.18,
                  marginLeft: -(tubeWidth * 0.35) / 2,
                  background: `radial-gradient(ellipse at center, color-mix(in srgb, ${pouring.color} 80%, white) 0%, ${pouring.color} 50%, transparent 80%)`,
                  borderRadius: "50%",
                  boxShadow: `0 0 10px ${pouring.color}`,
                  filter: "blur(0.5px)",
                  zIndex: 4,
                }}
              />
              {/* Splash droplets radiating outward and upward */}
              {[
                { x: -tubeWidth * 0.22, y: -tubeWidth * 0.18, s: 0.7 },
                { x: -tubeWidth * 0.12, y: -tubeWidth * 0.28, s: 0.5 },
                { x: tubeWidth * 0.12, y: -tubeWidth * 0.28, s: 0.5 },
                { x: tubeWidth * 0.22, y: -tubeWidth * 0.18, s: 0.7 },
                { x: 0, y: -tubeWidth * 0.32, s: 0.6 },
              ].map((d, i) => (
                <motion.div
                  key={`splash-drop-${i}`}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x: [0, d.x],
                    y: [0, d.y, d.y + tubeWidth * 0.2],
                    opacity: [0, 1, 0],
                    scale: [0, d.s, d.s * 0.7],
                  }}
                  transition={{
                    duration: dur * 0.55,
                    delay: dur * 0.55 + i * 0.02,
                    ease: "easeOut",
                  }}
                  className="absolute pointer-events-none"
                  style={{
                    left: "50%",
                    top: "22%",
                    width: tubeWidth * 0.1,
                    height: tubeWidth * 0.12,
                    marginLeft: -(tubeWidth * 0.1) / 2,
                    background: `radial-gradient(ellipse at 35% 30%, color-mix(in srgb, ${pouring.color} 80%, white) 0%, ${pouring.color} 70%, color-mix(in srgb, ${pouring.color} 70%, black) 100%)`,
                    borderRadius: "50% 50% 60% 60% / 40% 40% 80% 80%",
                    boxShadow: `0 0 4px ${pouring.color}`,
                    zIndex: 4,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
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
});

export default Tube;
