import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  "Information We Collect",
  "How We Use Your Information",
  "Data Sharing & Third Parties",
  "Data Security",
  "Your Rights",
  "Contact Us",
];

export default function PrivacyPolicy() {
  return (
    <div data-testid="privacy-page" className="bg-[#050505] text-paper min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 sm:px-10 pt-36 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Legal</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-10">
          Privacy Policy
        </h1>

        {/* ================================================
            CONTENT AREA — Privacy Policy text will be placed here
            ================================================ */}
        <div data-testid="privacy-content" className="space-y-8">
          {SECTIONS.map((title, i) => (
            <section key={title}>
              <h2 className="font-display text-xl font-semibold text-white mb-3">
                {i + 1}. {title}
              </h2>
              <div className="border border-dashed border-white/20 rounded-xl p-6">
                <p className="text-paper/50 text-sm leading-relaxed">
                  Content for this section will be added here.
                </p>
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
