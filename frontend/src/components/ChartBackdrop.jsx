import { useEffect, useRef, useState } from "react";

export const scrollState = { p: 0 };

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COUNT = 260;
const STEP = 14;
const W = COUNT * STEP;
const H = 800;
const TICK_MS = 2600;

function nextCandle(prevClose, rnd) {
  const o = prevClose;
  const c = Math.max(40, Math.min(180, o + (rnd() - 0.45) * 8));
  return { o, c, h: Math.max(o, c) + rnd() * 5, l: Math.min(o, c) - rnd() * 5 };
}

export default function ChartBackdrop() {
  const ref = useRef(null);
  const rndRef = useRef(mulberry32(42));
  const lastTick = useRef(performance.now());
  const [candles, setCandles] = useState(() => {
    const rnd = mulberry32(42);
    let price = 100;
    return Array.from({ length: COUNT }, () => {
      const cd = nextCandle(price, rnd);
      price = cd.c;
      return cd;
    });
  });

  useEffect(() => {
    const iv = setInterval(() => {
      lastTick.current = performance.now();
      setCandles((prev) => [...prev.slice(1), nextCandle(prev[prev.length - 1].c, rndRef.current)]);
    }, TICK_MS);

    let raf;
    const loop = () => {
      if (ref.current) {
        const maxX = Math.max(W - window.innerWidth, 0);
        const glide = Math.min((performance.now() - lastTick.current) / TICK_MS, 1) * STEP;
        ref.current.style.transform = `translate3d(${-scrollState.p * maxX - glide}px, ${-scrollState.p * 80}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", loop);
    return () => {
      clearInterval(iv);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", loop);
    };
  }, []);

  const y = (v) => H - ((v - 30) / 170) * H;

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#04060D]"
      data-testid="chart-backdrop"
      aria-hidden="true"
    >
      <div ref={ref} className="absolute top-0 left-0 h-full will-change-transform" style={{ width: W }}>
        <svg
          width={W}
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <pattern id="chart-dots" width="28" height="80" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.3" fill="#2E4E8F" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#chart-dots)" opacity="0.35" />
          {candles.map((cd, i) => {
            const up = cd.c >= cd.o;
            const col = up ? "#3D9BFF" : "#0070F0";
            const x = i * STEP + 3;
            const bodyY = y(Math.max(cd.o, cd.c));
            const bodyH = Math.max(Math.abs(y(cd.o) - y(cd.c)), 5);
            const isLast = i === candles.length - 1;
            return (
              <g key={i} opacity={isLast ? 0.9 : 0.55}>
                <line x1={x + 4} x2={x + 4} y1={y(cd.h)} y2={y(cd.l)} stroke={col} strokeWidth="1.5" />
                <rect x={x} y={bodyY} width="8" height={bodyH} fill={col} rx="1" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
