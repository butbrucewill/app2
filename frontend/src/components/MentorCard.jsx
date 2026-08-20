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
      className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/25 transition-colors overflow-hidden rounded-2xl"
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
              fill={j % 3 === 0 ? "#0070F0" : "#3D9BFF"}
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

      <div className="flex flex-col md:flex-row" style={{ transformStyle: "preserve-3d" }}>
        {/* large portrait panel */}
        <div className="relative md:w-2/5 h-72 md:h-auto md:min-h-[340px] overflow-hidden shrink-0" style={{ transform: "translateZ(35px)" }}>
          {m.photo ? (
            <img
              src={m.photo}
              alt={m.name}
              data-testid={`mentor-photo-${i}`}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
              style={{ objectPosition: m.focus || "50% 30%" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="font-display text-7xl font-bold text-white/80">{initials}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-4 left-4 bg-black/70 backdrop-blur border border-white/15 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400 px-3 py-1.5">
            Mentor No. 0{i + 1}
          </span>
        </div>

        {/* details */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center" style={{ transform: "translateZ(50px)" }}>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500 mb-4">One Stock Academy</p>
          <p className="font-display text-3xl sm:text-4xl font-bold text-white mb-1" data-testid={`mentor-name-${i}`}>{m.name}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-5">{m.role}</p>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">{m.bio}</p>
          <div className="inline-flex items-center gap-2 self-start border border-green-500/30 bg-green-500/5 px-4 py-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-green-500">{m.stat}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
