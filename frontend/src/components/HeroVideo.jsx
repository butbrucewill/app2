import { useState } from "react";
import { Play } from "lucide-react";

const VIDEO_ID = "hAIP2zrLQuo";

export default function HeroVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/15 group bg-black"
      data-testid="hero-video-card"
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
          title="Aman Singh Negi — One Stock Academy"
          data-testid="hero-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-[9/16] max-h-[70vh] mx-auto"
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          data-testid="hero-video-play"
          aria-label="Play video"
          className="relative block w-full text-left"
        >
          <img
            src={`https://i.ytimg.com/vi/${VIDEO_ID}/oar2.jpg`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;
            }}
            alt="Aman Singh Negi — Stop Trading, Start Learning"
            className="w-full aspect-[9/16] max-h-[70vh] object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300">
            <Play className="w-6 h-6 text-black fill-black ml-1" />
          </span>
          <span className="absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white border border-white/20 bg-black/55 backdrop-blur px-3.5 py-2 rounded-full">
            <Play className="w-3 h-3 fill-white" /> Watch · Shorts
          </span>
          <span className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/85 border border-white/20 bg-black/55 backdrop-blur px-3.5 py-2 rounded-full hidden sm:block">
            Aman Singh Negi | CAO
          </span>
        </button>
      )}
    </div>
  );
}
