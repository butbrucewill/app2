import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Magnetic from "./Magnetic";

const LINKS = [
  { label: "Why Us", href: "/#why" },
  { label: "Mentors", href: "/#mentor" },
  { label: "Vision", href: "/#vision" },
  { label: "Courses", href: "/#courses" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
    <header
      data-testid="site-navbar"
      className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-md text-paper border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center">
          <img src="/logo-brand.png" alt="One Stock Academy" className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
          <a href="/#why" data-testid="nav-link-why" className="hover:text-paper transition-colors">Why Us</a>
          <a href="/#courses" data-testid="nav-link-courses" className="hover:text-paper transition-colors">Courses</a>
          <a href="/#mentor" data-testid="nav-link-mentor" className="hover:text-paper transition-colors">Mentor</a>
          <a href="/#faq" data-testid="nav-link-faq" className="hover:text-paper transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Magnetic strength={0.3}>
            <Link
              to="/enroll"
              data-testid="nav-enroll-btn"
              className="block bg-paper text-ink font-mono text-[11px] uppercase tracking-[0.18em] px-5 py-2.5 hover:bg-white transition-colors rounded-full"
            >
              Enroll Now
            </Link>
          </Magnetic>
          <button
            data-testid="mobile-menu-btn"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden w-10 h-10 border border-white/20 flex items-center justify-center text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

    </header>

    <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-[#050505] md:hidden flex flex-col"
          >
            <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
              <img src="/logo-brand.png" alt="One Stock Academy" className="h-10 w-auto" />
              <button
                data-testid="mobile-menu-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 border border-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  data-testid={`mobile-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-4xl font-bold text-white py-3 border-b border-white/5 hover:text-zinc-400 transition-colors flex items-baseline gap-4"
                >
                  <span className="font-mono text-xs text-brand/70">0{i + 1}</span>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-8 border-t border-white/10"
            >
              <Link
                to="/enroll"
                data-testid="mobile-menu-enroll-btn"
                onClick={() => setOpen(false)}
                className="block text-center bg-white text-black font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 rounded-full"
              >
                Enroll Now
              </Link>
            </motion.div>
          </motion.div>
        )}
    </AnimatePresence>
    </>
  );
}
