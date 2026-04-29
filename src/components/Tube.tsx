import { forwardRef, useMemo } from "react";
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
  pouring?: {
    role: "from" | "to";
    color: string;
    dx: number;
    dy: number;
    side?: "left" | "right";
    streamHeight?: number;
    duration: number;
  } | null;
  hideTopSegment?: boolean;
}

// Simple hex/rgb darken & lighten without color-mix (cheaper, no runtime parser cost on GPU layers).
function shade(hex: string, amt: number) {
  // amt: -1 (black) .. 1 (white)
  if (!hex.startsWith("#") || hex.length !== 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = (c: number) =>
    Math.max(0, Math.min(255, Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt))));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
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
  const liftY = isFrom ? -Math.abs(pouring?.dy ?? 0) - 20 : 0;
  const shiftX = isFrom ? (pouring?.dx ?? 0) * 0.5 : 0;

  const visibleTube = hideTopSegment && tube.length > 0 ? tube.slice(0, -1) : tube;
  const streamHeight = pouring?.streamHeight ?? 120;
  const dur = pouring?.duration ?? 0.7;

  // Pre-compute pour colors (avoid color-mix runtime each frame)
  const pourColors = useMemo(() => {
    if (!pouring) return null;
    const c = pouring.color;
    return {
      base: c,
      light: shade(c, 0.35),
      dark: shade(c, -0.35),
      transparent: c + "00",
    };
  }, [pouring?.color]);

  // Pre-compute liquid segment gradients (memoized)
  const segmentBgs = useMemo(
    () => visibleTube.map((c) => `linear-gradient(180deg, ${c} 0%, ${c} 60%, ${shade(c, -0.3)} 100%)`),
    [visibleTube.join("|")],
  );

  // Glass shadow: switch to a cheaper box-shadow on the wrapper instead of drop-shadow filter on <img>
  const wrapperShadow = sorted
    ? "0 0 12px hsl(140 80% 55% / 0.7)"
    : selected
      ? `0 0 14px hsl(${accentHsl} / 0.85)`
      : "0 6px 10px rgba(0,0,0,0.45)";

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
        transformOrigin: pouring?.side === "left" ? "20% 80%" : "80% 80%",
        willChange: pouring ? "transform" : "auto",
      }}
      className="flex flex-col items-center focus:outline-none shrink-0 relative"
    >
      <div
        className="relative"
        style={{
          width: tubeWidth,
          height: tubeHeight,
          filter: `drop-shadow(${wrapperShadow})`,
        }}
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
              className="w-full origin-bottom"
              style={{
                height: SEG_H,
                background: segmentBgs[i],
              }}
            />
          ))}
          <Bubbles color={topColor} active={bubbling} />
        </div>

        {/* Glass image overlay (no filter — shadow moved to wrapper) */}
        <img
          src={tubeImg}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          draggable={false}
        />

        {/* Pour FX */}
        <AnimatePresence>
          {isFrom && pouring && pourColors && (
            <>
              {/* Stream */}
              <motion.div
                key="stream"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur, times: [0, 0.35, 0.75, 1], ease: "easeOut" }}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "18%",
                  width: tubeWidth * 0.22,
                  height: streamHeight,
                  marginLeft: -(tubeWidth * 0.22) / 2,
                  transformOrigin: "top center",
                  background: `linear-gradient(180deg, ${pourColors.base} 0%, ${pourColors.base} 70%, ${pourColors.dark} 100%)`,
                  borderRadius: "40% 40% 30% 30% / 60% 60% 20% 20%",
                  willChange: "transform, opacity",
                }}
              />
              {/* Wet trail */}
              <motion.div
                key="trail"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 0.85, 0.7, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur, times: [0, 0.25, 0.7, 1], ease: "easeOut" }}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "12%",
                  width: tubeWidth * 0.12,
                  height: tubeWidth * 0.55,
                  marginLeft: -(tubeWidth * 0.12) / 2,
                  transformOrigin: "top center",
                  background: `linear-gradient(180deg, ${pourColors.base} 0%, ${pourColors.base} 55%, ${pourColors.transparent} 100%)`,
                  borderRadius: "50% 50% 60% 60% / 30% 30% 90% 90%",
                  willChange: "transform, opacity",
                }}
              />
            </>
          )}
          {pouring?.role === "to" && pourColors && (
            <motion.div
              key="splash-burst"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1.8], opacity: [0, 0.9, 0] }}
              transition={{ duration: dur * 0.5, delay: dur * 0.55, ease: "easeOut" }}
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "22%",
                width: tubeWidth * 0.35,
                height: tubeWidth * 0.18,
                marginLeft: -(tubeWidth * 0.35) / 2,
                background: `radial-gradient(ellipse at center, ${pourColors.light} 0%, ${pourColors.base} 50%, transparent 80%)`,
                borderRadius: "50%",
                willChange: "transform, opacity",
              }}
            />
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
        }}
      />
    </motion.button>
  );
});

export default Tube;
