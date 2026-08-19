import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

export default function Navbar() {
  return (
    <header
      data-testid="site-navbar"
      className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-ink/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2.5">
          <span className="w-8 h-8 bg-ink text-paper flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            One Stock Academy
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          <a href="/#why" data-testid="nav-link-why" className="hover:text-ink transition-colors">Why Us</a>
          <a href="/#courses" data-testid="nav-link-courses" className="hover:text-ink transition-colors">Courses</a>
          <a href="/#mentor" data-testid="nav-link-mentor" className="hover:text-ink transition-colors">Mentor</a>
          <a href="/#faq" data-testid="nav-link-faq" className="hover:text-ink transition-colors">FAQ</a>
        </nav>
        <Link
          to="/enroll"
          data-testid="nav-enroll-btn"
          className="bg-bull text-white font-mono text-[11px] uppercase tracking-[0.18em] px-5 py-2.5 hover:bg-ink transition-colors"
        >
          Enroll Now
        </Link>
      </div>
    </header>
  );
}
