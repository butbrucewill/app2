import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function VideoIntro() {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section
      data-testid="video-intro"
      className="relative overflow-hidden border-b border-white/10 bg-[#04060D]"
    >
      <video
        ref={videoRef}
        src="/promo.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-[60vh] sm:h-[78vh] object-cover"
        data-testid="intro-video"
      />
      {/* translucent theme blend */}
      <div className="absolute inset-0 bg-[#04060D]/45 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#04060D] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#04060D] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#04060D] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#04060D] to-transparent pointer-events-none" />

      {/* translucent brand mark — comes and goes */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ opacity: [0.12, 0.5, 0.12], scale: [0.985, 1, 0.985] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/logo-brand.png"
          alt=""
          className="w-60 sm:w-96 drop-shadow-[0_0_60px_rgba(61,155,255,0.45)]"
        />
      </motion.div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 whitespace-nowrap">
        Learn · Execute · Evolve
      </p>
    </section>
  );
}
