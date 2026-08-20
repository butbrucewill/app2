import Marquee from "react-fast-marquee";

const PARTNERS = [
  { name: "Zerodha", logo: "/partners/zerodha.png" },
  { name: "Angel One", logo: "/partners/angelone.png" },
  { name: "Groww", logo: "/partners/groww.png" },
  { name: "Upstox", logo: "/partners/upstox.png" },
  { name: "Dhan", logo: "/partners/dhan.png" },
  { name: "ICICI Direct", logo: "/partners/icicidirect.png" },
  { name: "Kotak Securities", logo: "/partners/kotak.png" },
  { name: "5paisa", logo: "/partners/5paisa.png" },
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
      <Marquee speed={22} gradient={false} pauseOnHover>
        {PARTNERS.map((p) => (
          <div
            key={p.name}
            data-testid={`partner-${p.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="mx-3 sm:mx-4 flex items-center gap-3.5 bg-[#F2EDE4] rounded-2xl px-7 h-20 sm:h-24 hover:bg-white transition-colors duration-300"
          >
            <img
              src={p.logo}
              alt={`${p.name} logo`}
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
            />
            <span className="font-sans font-semibold text-lg sm:text-xl text-[#1a1a2e] whitespace-nowrap tracking-tight">
              {p.name}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
