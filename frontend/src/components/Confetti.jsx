import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#0B1021", "#333A52", "#9CA3AF", "#D4D4D4"];

export default function Confetti({ count = 80 }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 700,
        y: 320 + Math.random() * 520,
        r: Math.random() * 720 - 360,
        d: 1.7 + Math.random() * 1.5,
        delay: Math.random() * 0.2,
        s: 4 + Math.random() * 7,
        c: COLORS[i % COLORS.length],
      })),
    [count]
  );

  return (
    <div
      aria-hidden="true"
      data-testid="success-confetti"
      className="fixed inset-0 z-[80] pointer-events-none overflow-hidden"
    >
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-28 block"
          style={{ width: p.s, height: p.s * 0.6, backgroundColor: p.c }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.r, opacity: [1, 1, 1, 0] }}
          transition={{ duration: p.d, delay: p.delay, ease: [0.15, 0.6, 0.45, 1] }}
        />
      ))}
    </div>
  );
}
