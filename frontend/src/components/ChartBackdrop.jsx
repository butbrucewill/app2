import { useEffect, useMemo, useRef } from "react";

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

export default function ChartBackdrop() {
  const ref = useRef(null);

  const candles = useMemo(() => {
    const rnd = mulberry32(42);
    let price = 100;
    return Array.from({ length: COUNT }, () => {
      const o = price;
      price = Math.max(40, Math.min(180, price + (rnd() - 0.45) * 8));
      const c = price;
      return { o, c, h: Math.max(o, c) + rnd() * 5, l: Math.min(o, c) - rnd() * 5 };
    });
  }, []);

  useEffect(() => {
    let raf;
    const update = () => {
      if (!ref.current) return;
      const maxX = Math.max(W - window.innerWidth, 0);
      ref.current.style.transform = `translate3d(${-scrollState.p * maxX}px, ${-scrollState.p * 80}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
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
            return (
              <g key={i} opacity="0.55">
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
