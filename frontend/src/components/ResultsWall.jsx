import Marquee from "react-fast-marquee";
import { ImagePlus } from "lucide-react";

const SLOTS = 6;

export default function ResultsWall() {
  return (
    <div data-testid="results-wall">
      <Marquee speed={18} gradient={false} pauseOnHover>
        {Array.from({ length: SLOTS }, (_, i) => (
          <div
            key={i}
            data-testid={`result-slot-${i + 1}`}
            className="mx-3 w-52 h-72 sm:w-60 sm:h-80 border border-dashed border-brand/30 bg-brand/[0.04] flex flex-col items-center justify-center gap-3 text-center px-6"
          >
            <ImagePlus className="w-6 h-6 text-brand/50" strokeWidth={1.5} />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand/70 leading-relaxed">
              Student result
              <br />
              goes here
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-600">Slot 0{i + 1}</p>
          </div>
        ))}
      </Marquee>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 text-center mt-8 px-6">
        Real student trade journals &amp; P&amp;L — shared with consent
      </p>
    </div>
  );
}
