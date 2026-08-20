import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, RotateCcw, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const H = 260;
const y = (v) => H - ((v - 20) / 130) * H;
const BW = 26;

const ROUNDS = [
  {
    title: "The ceiling test",
    level: 102,
    levelLabel: "Resistance",
    setup: [
      [45, 58], [58, 54], [54, 68], [68, 63], [63, 78], [78, 74], [74, 88], [88, 84], [84, 96], [96, 93],
    ],
    outcome: [[93, 106], [106, 114], [114, 121]],
    answer: "breakout",
    lesson:
      "Price kept making higher lows into a flat ceiling — pressure was building upward. Repeated taps on resistance with rising lows often precede a breakout.",
  },
  {
    title: "The tired rally",
    setup: [
      [40, 55], [53, 64], [62, 71], [69, 77], [75, 81], [79, 84], [82, 86], [84, 88],
    ],
    outcome: [[88, 79], [79, 68], [68, 56]],
    answer: "breakdown",
    lesson:
      "Higher highs, but each candle weaker than the last — momentum was fading. A rally that climbs on shrinking strength is fragile and often breaks down.",
  },
  {
    title: "The defended floor",
    level: 44,
    levelLabel: "Support",
    setup: [
      [70, 58], [58, 49], [52, 46, 38], [46, 52], [55, 47, 39], [47, 54],
    ],
    outcome: [[54, 65], [65, 76], [76, 86]],
    answer: "breakout",
    lesson:
      "Two long lower wicks at the same level — buyers defended it twice. That absorption at support is what often fuels the next move up.",
  },
];

function Candles({ data, startIndex = 0, animate = false }) {
  return data.map((cd, i) => {
    const [o, c, l] = cd;
    const h = cd[3] !== undefined ? cd[2] : Math.max(o, c) + 6;
    const low = cd[3] !== undefined ? cd[3] : Math.min(o, c) - 6;
    const up = c >= o;
    const col = up ? "#3D9BFF" : "#0070F0";
    const x = (startIndex + i) * BW + 8;
    const bodyY = y(Math.max(o, c));
    const bodyH = Math.max(Math.abs(y(o) - y(c)), 5);
    return (
      <motion.g
        key={`${startIndex}-${i}`}
        initial={animate ? { opacity: 0, scaleY: 0 } : false}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: i * 0.15, duration: 0.4, ease: "easeOut" }}
        style={{ transformOrigin: `${x}px ${y(low)}px` }}
      >
        <line x1={x + 5} x2={x + 5} y1={y(h)} y2={y(low)} stroke={col} strokeWidth="1.5" />
        <rect x={x} y={bodyY} width="10" height={bodyH} fill={col} rx="1.5" />
      </motion.g>
    );
  });
}

export default function ChartQuiz() {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const r = ROUNDS[round];
  const totalW = (r.setup.length + r.outcome.length) * BW + 40;

  const pick = (choice) => {
    if (picked) return;
    setPicked(choice);
    if (choice === r.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (round + 1 >= ROUNDS.length) {
      setDone(true);
    } else {
      setRound(round + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setRound(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div
      className="max-w-3xl mx-auto border border-white/10 bg-black/60 backdrop-blur-xl p-6 sm:p-10"
      data-testid="chart-quiz"
    >
      {!done ? (
        <>
          <div className="flex items-center justify-between mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
              Read the market · Round {round + 1} of {ROUNDS.length}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500" data-testid="quiz-score">
              Score {score}/{ROUNDS.length}
            </p>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6">{r.title}</h3>

          <div className="border border-white/10 bg-[#04060D] mb-6 overflow-hidden">
            <svg viewBox={`0 0 ${totalW} ${H}`} className="w-full h-auto" data-testid="quiz-chart">
              {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1="0" x2={totalW} y1={H * f} y2={H * f} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" />
              ))}
              {r.level && (
                <>
                  <line x1="0" x2={totalW} y1={y(r.level)} y2={y(r.level)} stroke="#3D9BFF" strokeWidth="1" strokeDasharray="6 5" opacity="0.7" />
                  <text x={totalW - 8} y={y(r.level) - 6} textAnchor="end" fill="#3D9BFF" fontSize="10" fontFamily="JetBrains Mono, monospace" opacity="0.8">
                    {r.levelLabel}
                  </text>
                </>
              )}
              <Candles data={r.setup} />
              {picked && <Candles data={r.outcome} startIndex={r.setup.length} animate />}
            </svg>
          </div>

          {!picked ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                data-testid="quiz-breakout-btn"
                onClick={() => pick("breakout")}
                className="group flex items-center justify-center gap-2 border border-brand/40 bg-brand/10 text-brand font-mono text-xs uppercase tracking-[0.18em] px-6 py-4 hover:bg-brand hover:text-black transition-colors"
              >
                <TrendingUp className="w-4 h-4" /> Breakout
              </button>
              <button
                data-testid="quiz-breakdown-btn"
                onClick={() => pick("breakdown")}
                className="group flex items-center justify-center gap-2 border border-white/20 text-white font-mono text-xs uppercase tracking-[0.18em] px-6 py-4 hover:bg-white hover:text-black transition-colors"
              >
                <TrendingDown className="w-4 h-4" /> Breakdown
              </button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                data-testid="quiz-result"
              >
                <div className="flex items-start gap-3 mb-6">
                  {picked === r.answer ? (
                    <CheckCircle2 className="w-6 h-6 text-brand shrink-0 mt-0.5" strokeWidth={1.5} />
                  ) : (
                    <XCircle className="w-6 h-6 text-zinc-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                  )}
                  <div>
                    <p className="font-display text-xl font-bold text-white mb-1">
                      {picked === r.answer ? "Clean read." : "Not quite — watch what happened."}
                    </p>
                    <p className="text-zinc-400 text-sm leading-relaxed">{r.lesson}</p>
                  </div>
                </div>
                <button
                  data-testid="quiz-next-btn"
                  onClick={next}
                  className="w-full bg-white text-black font-mono text-xs uppercase tracking-[0.18em] px-6 py-4 hover:bg-zinc-200 transition-colors"
                >
                  {round + 1 >= ROUNDS.length ? "See your score" : "Next chart"}
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
          data-testid="quiz-final"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand mb-4">Your read</p>
          <p className="font-display text-6xl font-bold text-white mb-4">{score}/{ROUNDS.length}</p>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
            {score === ROUNDS.length
              ? "Sharp eyes. Imagine reading live markets like this every session — that's the Buniyaad training ground."
              : "Reading charts is a trained skill, not a talent. This is exactly what we drill, live, every session of Buniyaad."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/enroll"
              data-testid="quiz-enroll-btn"
              className="group inline-flex items-center gap-2 bg-brand-deep text-white font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 hover:bg-brand transition-colors"
            >
              Learn it for real <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              data-testid="quiz-restart-btn"
              onClick={restart}
              className="inline-flex items-center gap-2 border border-white/20 text-white font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 hover:border-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Play again
            </button>
          </div>
        </motion.div>
      )}
      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-600 mt-6 text-center">
        Illustrative patterns for learning · Not a prediction of any real security
      </p>
    </div>
  );
}
