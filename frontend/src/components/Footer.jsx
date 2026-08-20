import { Instagram, Youtube, Twitter, Phone, Mail, MapPin } from "lucide-react";
import TickerTape from "./TickerTape";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#050505] text-paper border-t border-white/10">
      <TickerTape dark />
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <img src="/logo-white.png" alt="One Stock Academy" className="h-11 w-auto invert" />
            </div>
            <p className="text-sm text-paper/60 leading-relaxed mb-6">
              The one-stop solution to every trading worry — outcome-oriented, high-quality
              courses delivered by domain experts, online and in the classroom.
            </p>
            <div className="flex gap-3">
              <a href="#" data-testid="social-instagram" aria-label="Instagram" className="w-9 h-9 border border-white/15 flex items-center justify-center text-paper/60 hover:text-white hover:border-white/40 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" data-testid="social-youtube" aria-label="YouTube" className="w-9 h-9 border border-white/15 flex items-center justify-center text-paper/60 hover:text-white hover:border-white/40 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" data-testid="social-twitter" aria-label="Twitter / X" className="w-9 h-9 border border-white/15 flex items-center justify-center text-paper/60 hover:text-white hover:border-white/40 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-4">Explore</p>
            <div className="flex flex-col gap-2.5 text-sm text-paper/70">
              <a href="/#why" className="hover:text-paper transition-colors">Why One Stock Academy</a>
              <a href="/#mentor" className="hover:text-paper transition-colors">Mentors</a>
              <a href="/#vision" className="hover:text-paper transition-colors">Vision &amp; Mission</a>
              <a href="/#courses" className="hover:text-paper transition-colors">Buniyaad Program</a>
              <a href="/#reviews" className="hover:text-paper transition-colors">Student Reviews</a>
              <a href="/#faq" className="hover:text-paper transition-colors">FAQ</a>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-4">Program</p>
            <div className="flex flex-col gap-2.5 text-sm text-paper/70">
              <a href="/enroll?course=online" className="hover:text-paper transition-colors">
                Buniyaad — Online <span className="font-mono text-xs text-paper/40">₹49,000</span>
              </a>
              <a href="/enroll?course=offline" className="hover:text-paper transition-colors">
                Buniyaad — Offline <span className="font-mono text-xs text-paper/40">₹99,000</span>
              </a>
              <a href="/enroll" className="hover:text-paper transition-colors">Enroll Now</a>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-4">Reach Us</p>
            <div className="flex flex-col gap-2.5 text-sm text-paper/70">
              <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-paper/40" /> Number being added</span>
              <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-paper/40" /> Email being added</span>
              <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-paper/40" /> Classroom address coming soon</span>
              <span className="flex items-center gap-2 text-paper/50 text-xs mt-2">Or use the chat assistant &amp; WhatsApp button on screen</span>
            </div>
          </div>
        </div>
        <div className="mt-14 border border-white/10 bg-white/[0.03] p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-3">Risk Disclosure</p>
          <p data-testid="risk-disclosure" className="font-mono text-[11px] leading-relaxed text-paper/50">
            Trading and investing in securities markets involve substantial risk of loss. One Stock Academy
            provides education only — nothing on this site or in our classes is investment advice, a
            recommendation, or a promise of returns. We do not provide stock tips or trading signals. Past
            performance of any strategy taught does not guarantee future results. Please trade only with
            capital you can afford to lose and consult a SEBI-registered investment adviser for advice
            specific to your situation.
          </p>
        </div>
        <div className="mt-14 overflow-hidden select-none" aria-hidden="true">
          <p className="font-display font-bold text-[12vw] leading-[0.85] tracking-tight text-white/[0.05] whitespace-nowrap text-center">
            One Stock Academy
          </p>
        </div>
        <div className="mt-12 pt-6 border-t border-paper/10 flex flex-col sm:flex-row justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">
          <span>© {new Date().getFullYear()} One Stock Academy</span>
          <span>Education · Not investment advice</span>
        </div>
      </div>
    </footer>
  );
}
