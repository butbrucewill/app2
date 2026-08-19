import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

const BG_CANDLES = [30, 55, 42, 70, 58, 85, 66, 92, 78, 100];

export default function MentorCard({ m, i }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [11, -11]), { stiffness: 140, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-13, 13]), { stiffness: 140, damping: 16 });
  const glareX = useTransform(mx, (v) => v * 100);
  const glareY = useTransform(my, (v) => v * 100);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.16), transparent 55%)`;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const initials = m.name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <motion.div
      ref={ref}
      data-testid={`mentor-card-${i}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
      className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/25 transition-colors p-8 overflow-hidden"
    >
      {/* deep background chart layer */}
      <div className="absolute inset-0 opacity-[0.13] pointer-events-none" style={{ transform: "translateZ(-40px)" }}>
        <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="none">
          {BG_CANDLES.map((v, j) => (
            <rect
              key={j}
              x={10 + j * 19}
              y={110 - v}
              width="8"
              height={v * 0.8}
              fill={j % 3 === 0 ? "#ef4444" : "#22c55e"}
            />
          ))}
        </svg>
      </div>

      {/* holographic glare */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
        style={{ background: glare }}
      />

      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500 mb-8">
          <span>One Stock Academy</span>
          <span>Mentor No. 0{i + 1}</span>
        </div>

        {/* floating portrait medallion */}
        <motion.div
          className="relative mx-auto w-28 h-28 mb-8"
          style={{ transform: "translateZ(55px)" }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        >
          <div className="absolute -inset-2 rounded-full border border-white/10" />
          <div className="absolute -inset-2 rounded-full border-t border-green-500/40 animate-[spin_8s_linear_infinite]" />
          <div className="w-28 h-28 rounded-full bg-black border border-white/25 overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)]">
            {m.photo ? (
              <img
                src={m.photo}
                alt={m.name}
                data-testid={`mentor-photo-${i}`}
                className="w-full h-full object-cover object-[45%_62%] grayscale hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center font-display text-4xl font-bold text-white">{initials}</span>
            )}
          </div>
        </motion.div>

        <div className="text-center" style={{ transform: "translateZ(45px)" }}>
          <p className="font-display text-2xl font-bold text-white mb-1" data-testid={`mentor-name-${i}`}>{m.name}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-5">{m.role}</p>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6 min-h-[60px]">{m.bio}</p>
          <div className="inline-flex items-center gap-2 border border-green-500/30 bg-green-500/5 px-4 py-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-green-500">{m.stat}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
