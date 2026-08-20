import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PHOTOS = [
  { src: "/class-3.jpg", alt: "Offline batch — live chart session at One Stock Academy" },
  { src: "/class-4.jpg", alt: "Mentors explaining price action on the classroom screen" },
  { src: "/class-1.jpg", alt: "Aman Singh Negi teaching a classroom session" },
  { src: "/class-2.jpg", alt: "Classroom session with students at One Stock Academy" },
];

export default function BannerPhotos() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI((v) => (v + 1) % PHOTOS.length), 5000);
    return () => clearInterval(iv);
  }, []);
  return (
    <>
      {PHOTOS.map((p, j) => (
        <motion.img
          key={p.src}
          src={p.src}
          alt={p.alt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={false}
          animate={{ opacity: j === i ? 1 : 0, scale: j === i ? 1 : 1.05 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}
