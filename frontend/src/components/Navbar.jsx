import { Link } from "react-router-dom";
import Magnetic from "./Magnetic";

export default function Navbar() {
  return (
    <header
      data-testid="site-navbar"
      className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-md text-paper border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center">
          <img src="/logo-white.png" alt="One Stock Academy" className="h-10 w-auto invert" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
          <a href="/#why" data-testid="nav-link-why" className="hover:text-paper transition-colors">Why Us</a>
          <a href="/#courses" data-testid="nav-link-courses" className="hover:text-paper transition-colors">Courses</a>
          <a href="/#mentor" data-testid="nav-link-mentor" className="hover:text-paper transition-colors">Mentor</a>
          <a href="/#faq" data-testid="nav-link-faq" className="hover:text-paper transition-colors">FAQ</a>
        </nav>
        <Magnetic strength={0.3}>
          <Link
            to="/enroll"
            data-testid="nav-enroll-btn"
            className="block bg-paper text-ink font-mono text-[11px] uppercase tracking-[0.18em] px-5 py-2.5 hover:bg-white transition-colors"
          >
            Enroll Now
          </Link>
        </Magnetic>
      </div>
    </header>
  );
}
