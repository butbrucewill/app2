import { TrendingUp } from "lucide-react";
import TickerTape from "./TickerTape";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-ink text-paper">
      <TickerTape dark />
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 bg-paper text-ink flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">One Stock Academy</span>
            </div>
            <p className="text-sm text-paper/60 leading-relaxed">
              Trading education, online and in the classroom. Process over predictions, skill over shortcuts.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-4">Navigate</p>
            <div className="flex flex-col gap-2.5 text-sm text-paper/70">
              <a href="/#why" className="hover:text-paper transition-colors">Why One Stock Academy</a>
              <a href="/#courses" className="hover:text-paper transition-colors">Courses &amp; Pricing</a>
              <a href="/#mentor" className="hover:text-paper transition-colors">Your Mentor</a>
              <a href="/enroll" className="hover:text-paper transition-colors">Enroll</a>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-4">Risk Disclosure</p>
            <p data-testid="risk-disclosure" className="font-mono text-[11px] leading-relaxed text-paper/50">
              Trading and investing in securities markets involve substantial risk of loss. One Stock Academy
              provides education only — nothing on this site or in our classes is investment advice, a
              recommendation, or a promise of returns. We do not provide stock tips or trading signals. Past
              performance of any strategy taught does not guarantee future results. Please trade only with
              capital you can afford to lose and consult a SEBI-registered investment adviser for advice
              specific to your situation.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-paper/10 flex flex-col sm:flex-row justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">
          <span>© {new Date().getFullYear()} One Stock Academy</span>
          <span>Education · Not investment advice</span>
        </div>
      </div>
    </footer>
  );
}
