import Marquee from "react-fast-marquee";

const PHOTOS = [
  { src: "/class-3.jpg", caption: "Offline Batch · Live Chart Session" },
  { src: "/class-1.jpg", caption: "Classroom · Price Action Breakdown" },
  { src: "/class-4.jpg", caption: "Offline Batch · Doubt Session" },
  { src: "/class-2.jpg", caption: "Classroom · Market Structure" },
];

export default function ClassroomStrip() {
  return (
    <section
      data-testid="classroom-strip"
      className="py-12 border-y border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand text-center mb-8">
        Inside the Academy
      </p>
      <Marquee speed={22} gradient={false} pauseOnHover>
        {PHOTOS.map((p, i) => (
          <div
            key={i}
            data-testid={`classroom-photo-${i}`}
            className="relative mx-3 w-[320px] sm:w-[440px] h-[220px] sm:h-[280px] overflow-hidden border border-white/10 group"
          >
            <img
              src={p.src}
              alt={p.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/85 border border-white/20 bg-black/55 backdrop-blur px-3 py-1.5">
              {p.caption}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
