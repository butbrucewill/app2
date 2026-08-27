import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutUs() {
  return (
    <div data-testid="about-page" className="bg-[#050505] text-paper min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 sm:px-10 pt-36 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">About Us</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-10">
          The story behind One Stock Academy
        </h1>

        {/* ================================================
            CONTENT AREA — About Us text will be placed here
            ================================================ */}
        <div
          data-testid="about-content"
          className="border border-dashed border-white/20 rounded-xl p-10 text-center"
        >
          <p className="text-paper/50 text-sm leading-relaxed">
            About Us content will be added here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
