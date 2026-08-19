import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState({ p: "24,812.75", up: true });
  const last = useRef(24812.75);
  const throttle = useRef(0);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const lineX = useSpring(x, { stiffness: 500, damping: 40 });
  const lineY = useSpring(y, { stiffness: 500, damping: 40 });
  const ringX = useSpring(x, { stiffness: 160, damping: 20 });
  const ringY = useSpring(y, { stiffness: 160, damping: 20 });

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const now = performance.now();
      if (now - throttle.current > 120) {
        throttle.current = now;
        const p = 23800 + (1 - e.clientY / window.innerHeight) * 1400;
        setLabel({
          p: p.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          up: p >= last.current,
        });
        last.current = p;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] pointer-events-none mix-blend-difference" data-testid="custom-cursor" aria-hidden="true">
        <motion.div className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: lineX }} />
        <motion.div className="absolute left-0 right-0 h-px bg-white/20" style={{ top: lineY }} />
        <motion.div
          className="absolute w-8 h-8 -ml-4 -mt-4 border border-white/50 rounded-full"
          style={{ left: ringX, top: ringY }}
        />
        <motion.div className="absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-white" style={{ left: lineX, top: lineY }} />
      </div>
      <motion.div
        className="fixed z-[70] pointer-events-none ml-4 mt-3 font-mono text-[10px] tracking-wider whitespace-nowrap"
        style={{ left: lineX, top: lineY }}
        aria-hidden="true"
      >
        <span className="text-white/60">OSA </span>
        <span className={label.up ? "text-green-500" : "text-red-500"}>
          {label.p} {label.up ? "▲" : "▼"}
        </span>
      </motion.div>
    </>
  );
}
