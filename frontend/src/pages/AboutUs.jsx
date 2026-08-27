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

        <div data-testid="about-content" className="space-y-14">
          <p className="text-lg sm:text-xl text-paper/80 leading-relaxed">
            One Stock Academy is the One Stop solution to all trading related worries of potential
            traders. We provide outcome oriented, high quality courses on trading, delivered by domain
            experts. Our time bound, practical dominated, well curated training sessions will help
            learners realize their trading potential to the fullest and enable them to command the
            financial market.
          </p>

          <section>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-3">Our Vision</p>
            <p className="text-paper/70 leading-relaxed">
              One Stock Academy has a vision to empower the youth of India by imparting them trading
              skills using which they can hold a strong command in financial economy and enable India
              to realize its vision to become a &ldquo;Viksit Bharat @ 2047&rdquo;.
            </p>
          </section>

          <section>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-3">Our Mission</p>
            <p className="text-paper/70 leading-relaxed">
              To realize this vision, One Stock Academy works in a mission mode wherein, it has curated
              relevant course material that will be delivered to the potential traders enrolled through
              trading experts in a time bound manner. BUNIYAAD provides quality learning and is outcome
              oriented.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
