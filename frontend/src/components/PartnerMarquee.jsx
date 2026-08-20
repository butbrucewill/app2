import Marquee from "react-fast-marquee";

const PARTNERS = [
  "Zerodha",
  "Angel One",
  "Groww",
  "Upstox",
  "Dhan",
  "ICICI Direct",
  "Kotak Securities",
  "5paisa",
];

export default function PartnerMarquee() {
  return (
    <section
      data-testid="partner-marquee"
      className="py-14 border-b border-white/10 overflow-hidden"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand text-center mb-10">
        Our Broking Partners
      </p>
      <Marquee speed={20} gradient={false} pauseOnHover>
        {PARTNERS.map((name, i) => (
          <span key={name} className="flex items-center">
            <span
              data-testid={`partner-${name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`font-display text-4xl sm:text-6xl font-bold tracking-tight mx-10 whitespace-nowrap transition-colors duration-300 hover:text-white ${
                i % 2 === 0 ? "text-white/60" : "text-transparent"
              }`}
              style={i % 2 === 1 ? { WebkitTextStroke: "1px rgba(61,155,255,0.55)" } : undefined}
            >
              {name}
            </span>
            <span className="w-2 h-2 bg-brand/60 rounded-full" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
