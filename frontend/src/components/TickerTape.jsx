import Marquee from "react-fast-marquee";

const TICKS = [
  { s: "NIFTY 50", p: "24,812.75", c: "+0.42%", up: true },
  { s: "BANKNIFTY", p: "51,243.10", c: "-0.18%", up: false },
  { s: "SENSEX", p: "81,506.09", c: "+0.37%", up: true },
  { s: "RELIANCE", p: "2,945.60", c: "+1.12%", up: true },
  { s: "HDFCBANK", p: "1,642.35", c: "-0.54%", up: false },
  { s: "INFY", p: "1,872.90", c: "+0.86%", up: true },
  { s: "TCS", p: "4,112.15", c: "-0.21%", up: false },
  { s: "TATAMOTORS", p: "978.40", c: "+1.64%", up: true },
  { s: "USDINR", p: "83.94", c: "+0.05%", up: true },
  { s: "GOLD", p: "71,850", c: "+0.29%", up: true },
];

export default function TickerTape({ dark = false }) {
  return (
    <div
      aria-hidden="true"
      data-testid="ticker-tape"
      className={`border-y border-ink/10 py-2.5 overflow-hidden ${
        dark ? "bg-black/70 backdrop-blur text-paper" : "bg-paper-deep/60 text-ink"
      }`}
    >
      <Marquee speed={40} gradient={false} pauseOnHover>
        <span className="font-mono text-[11px] uppercase tracking-wider mr-4 opacity-50">
          Illustrative prices ·
        </span>
        {TICKS.map((t) => (
          <span key={t.s} className="font-mono text-[11px] uppercase tracking-wider mx-5 whitespace-nowrap">
            <span className="opacity-70">{t.s}</span>{" "}
            <span className="font-medium">{t.p}</span>{" "}
            <span className={t.up ? (dark ? "text-paper" : "text-ink") : dark ? "text-paper/50" : "text-ink/40"}>
              {t.up ? "▲" : "▼"} {t.c}
            </span>
            <span className="opacity-30 ml-5">·</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
