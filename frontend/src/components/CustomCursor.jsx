import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [up, setUp] = useState(true);
  const lastY = useRef(0);
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
        if (lastY.current) setUp(e.clientY <= lastY.current);
        lastY.current = e.clientY;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  const bodyColor = up ? "#22c55e" : "#ef4444";

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none" data-testid="custom-cursor" aria-hidden="true">
      <motion.div
        className="absolute top-0 bottom-0 w-px"
        style={{ left: lineX, backgroundColor: bodyColor, opacity: 0.35 }}
      />
      <motion.div
        className="absolute w-[14px] h-9 -ml-[7px] -mt-[18px] rounded-[2px]"
        style={{
          left: lineX,
          top: lineY,
          backgroundColor: bodyColor,
          boxShadow: `0 0 18px ${bodyColor}66`,
        }}
      />
      <motion.div
        className="absolute w-[26px] h-[26px] -ml-[13px] -mt-[13px] border rounded-full"
        style={{ left: ringX, top: ringY, borderColor: `${bodyColor}55` }}
      />
    </div>
  );
}
