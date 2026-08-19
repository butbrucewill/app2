import { motion } from "framer-motion";

const CANDLES = [
  { o: 42, c: 58, h: 66, l: 36 },
  { o: 58, c: 50, h: 64, l: 44 },
  { o: 50, c: 66, h: 72, l: 47 },
  { o: 66, c: 60, h: 74, l: 55 },
  { o: 60, c: 74, h: 80, l: 57 },
  { o: 74, c: 68, h: 79, l: 62 },
  { o: 68, c: 82, h: 88, l: 64 },
  { o: 82, c: 76, h: 86, l: 70 },
  { o: 76, c: 90, h: 95, l: 73 },
  { o: 90, c: 84, h: 94, l: 79 },
  { o: 84, c: 96, h: 102, l: 81 },
  { o: 96, c: 108, h: 114, l: 92 },
];

export default function CandlestickChart() {
  const W = 560;
  const H = 300;
  const bw = W / CANDLES.length;
  const max = 120;
  const y = (v) => H - (v / max) * H;

  return (
    <div
      data-testid="hero-candlestick-chart"
      className="relative chart-grid-bg bg-white border border-ink/10 p-6 sm:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">OSA / Method</p>
          <p className="font-mono text-sm font-medium text-ink mt-1">
            108.40 <span className="text-chart-green text-xs">▲ +12.5%</span>
          </p>
        </div>
        <div className="flex gap-4 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-chart-green inline-block" /> Bullish
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-chart-red inline-block" /> Bearish
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Illustrative candlestick chart">
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={W}
            y1={H * f}
            y2={H * f}
            stroke="rgba(11,16,33,0.08)"
            strokeDasharray="3 5"
          />
        ))}
        {CANDLES.map((cd, i) => {
          const up = cd.c >= cd.o;
          const color = up ? "#16A34A" : "#DC2626";
          const x = i * bw + bw / 2;
          const bodyY = y(Math.max(cd.o, cd.c));
          const bodyH = Math.max(Math.abs(y(cd.o) - y(cd.c)), 3);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.09, duration: 0.5, ease: "easeOut" }}
              style={{ transformOrigin: `${x}px ${y(cd.l)}px` }}
            >
              <line x1={x} x2={x} y1={y(cd.h)} y2={y(cd.l)} stroke={color} strokeWidth="1.5" />
              <rect x={x - bw * 0.28} y={bodyY} width={bw * 0.56} height={bodyH} fill={up ? color : "none"} stroke={color} strokeWidth="1.5" />
            </motion.g>
          );
        })}
        <motion.path
          d={`M ${CANDLES.map((cd, i) => `${i * bw + bw / 2},${y((cd.o + cd.c) / 2)}`).join(" L ")}`}
          fill="none"
          stroke="#D97706"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 1.4, ease: "easeInOut" }}
        />
      </svg>
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mt-6">
        Skill compounds like price — one session at a time. Chart is illustrative.
      </p>
    </div>
  );
}
