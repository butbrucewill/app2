import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Blog() {
  return (
    <div data-testid="blog-page" className="bg-[#050505] text-paper min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 pt-36 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">
          Blog
        </p>

        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-10">
          The One Stock Academy Trading Journal
        </h1>

        <div data-testid="blog-content" className="space-y-14">

          <p className="text-lg sm:text-xl text-paper/80 leading-relaxed">
            Welcome to the One Stock Academy Blog — a space created for traders,
            investors, and market enthusiasts who want to understand the financial
            markets with greater clarity. From market fundamentals and technical
            analysis to trading psychology and risk management, our goal is to
            simplify complex market concepts and turn knowledge into practical
            trading skills.
          </p>

          <section>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-3">
              Trading & Market Insights
            </p>

            <p className="text-paper/70 leading-relaxed">
              Financial markets are constantly evolving. Successful trading
              requires more than simply following market movements — it requires
              understanding price action, market trends, technical indicators,
              economic events, and the factors that influence investor sentiment.
              Through our blogs, we break down important market concepts into
              simple and practical insights that traders can apply to their
              learning journey.
            </p>
          </section>

          <section>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-3">
              Technical Analysis
            </p>

            <p className="text-paper/70 leading-relaxed">
              Technical analysis plays an important role in understanding market
              behaviour. Our articles explore topics such as price action,
              candlestick patterns, support and resistance, chart patterns,
              indicators, market structure, and trading setups. The objective is
              to help learners develop a structured approach to analysing charts
              instead of making decisions based purely on emotions or assumptions.
            </p>
          </section>

          <section>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-3">
              Trading Psychology
            </p>

            <p className="text-paper/70 leading-relaxed">
              A strong trading strategy is only one part of becoming a successful
              trader. Discipline, patience, emotional control, and consistency are
              equally important. Our blog explores the psychological side of
              trading and highlights common behavioural mistakes that can affect
              decision-making in the financial markets.
            </p>
          </section>

          <section>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-3">
              Risk Management
            </p>

            <p className="text-paper/70 leading-relaxed">
              Protecting capital is one of the most important principles of
              trading. We share practical insights on position sizing,
              stop-loss management, risk-to-reward ratios, and maintaining
              discipline while managing trades. Understanding risk allows traders
              to approach the market with a long-term perspective rather than
              focusing only on individual trades.
            </p>
          </section>

          <section>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-3">
              Learn. Analyse. Trade.
            </p>

            <p className="text-paper/70 leading-relaxed">
              At One Stock Academy, we believe that trading education should be
              practical, structured, and outcome oriented. Our blog is designed
              to complement your learning journey with useful market knowledge,
              educational resources, and actionable concepts that help you become
              a more informed and disciplined market participant.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}