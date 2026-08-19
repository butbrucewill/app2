import Marquee from "react-fast-marquee";

const WORDS = ["Structure", "Process", "Risk Management", "Discipline", "Patience"];

export default function EditorialMarquee() {
  return (
    <div
      aria-hidden="true"
      data-testid="editorial-marquee"
      className="py-10 sm:py-16 overflow-hidden select-none"
    >
      <Marquee speed={18} gradient={false}>
        {WORDS.map((w, i) => (
          <span key={w} className="flex items-center">
            <span
              className={`font-display font-bold text-[16vw] sm:text-[9vw] leading-none tracking-tight mx-6 whitespace-nowrap ${
                i % 2 === 0 ? "text-white/90" : "text-transparent"
              }`}
              style={i % 2 === 1 ? { WebkitTextStroke: "1px rgba(255,255,255,0.3)" } : undefined}
            >
              {w}
            </span>
            <span className="font-display text-[6vw] sm:text-[3.5vw] text-green-500/70 mx-2">·</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
