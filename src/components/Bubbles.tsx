import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  x: number;
  size: number;
  delay: number;
}

interface BubblesProps {
  color: string;
  active: boolean;
}

let bubbleId = 0;

export default function Bubbles({ color, active }: BubblesProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    if (!active) {
      setBubbles([]);
      return;
    }
    const newBubbles: Bubble[] = Array.from({ length: 6 }, () => ({
      id: ++bubbleId,
      x: 15 + Math.random() * 70,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.2,
    }));
    setBubbles(newBubbles);
    const timer = setTimeout(() => setBubbles([]), 600);
    return () => clearTimeout(timer);
  }, [active]);

  if (bubbles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -60, scale: 1 }}
          transition={{ duration: 0.5, delay: b.delay, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            bottom: "20%",
            width: b.size,
            height: b.size,
            backgroundColor: color,
            boxShadow: `0 0 4px ${color}`,
          }}
        />
      ))}
    </div>
  );
}
