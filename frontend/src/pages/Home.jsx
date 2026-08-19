import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Monitor,
  MapPin,
  UserCheck,
  ShieldX,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerTape from "@/components/TickerTape";
import HeroScene from "@/components/HeroScene";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const VALUE_PROPS = [
  {
    n: "01",
    icon: BookOpen,
    title: "A structured curriculum, start to finish",
    body: "No random YouTube rabbit holes. One sequenced path: market basics, chart reading, risk management, position sizing, and trading psychology — each layer building on the last.",
  },
  {
    n: "02",
    icon: Monitor,
    title: "Two formats, same rigour",
    body: "Attend live from anywhere with the online batch, or sit in the classroom with the offline batch. Identical curriculum, identical mentor attention.",
  },
  {
    n: "03",
    icon: UserCheck,
    title: "Practitioner mentors",
    body: "Learn from traders who actually trade. Every concept is taught against live market context, with real trades reviewed — including the losing ones.",
  },
  {
    n: "04",
    icon: ShieldX,
    title: "No tips. No signals. Ever.",
    body: "We will never sell you a stock tip or a telegram signal. We teach you to build your own process so you never need to depend on anyone's calls again.",
  },
];

const FAQS = [
  {
    q: "Do I need any prior trading experience?",
    a: "None at all. The curriculum starts from the absolute basics — what a stock is, how exchanges work, how to read a chart — and builds up systematically. Beginners and people who have dabbled but lack a process both fit in.",
  },
  {
    q: "What is the difference between the online and offline batches?",
    a: "The curriculum, mentor, and duration are identical. Online is ₹49,000 and delivered as live virtual classes you can join from anywhere. Offline is ₹99,000 and delivered in person in a classroom setting, with face-to-face interaction and on-desk practice.",
  },
  {
    q: "Do you give stock tips or trading signals?",
    a: "No — and we never will. Our entire philosophy is that depending on someone else's calls keeps you dependent forever. We teach you to analyse, plan, size, and manage your own trades.",
  },
  {
    q: "Will this course guarantee I become profitable?",
    a: "No honest educator can guarantee trading profits, and we won't pretend to. Trading involves real risk of loss. What we commit to is teaching you a complete, disciplined process — skills, risk management, and psychology — the same foundations serious traders rely on.",
  },
  {
    q: "Is the fee a one-time payment or a subscription?",
    a: "One-time. You pay once at enrollment — ₹49,000 for online or ₹99,000 for offline — through a secure payment gateway (UPI, cards, and netbanking accepted). There are no recurring charges.",
  },
  {
    q: "What happens after I pay?",
    a: "Your enrollment is confirmed instantly after payment verification. Online students receive their batch schedule and portal access details; offline students receive their classroom batch details and start date.",
  },
];

export default function Home() {
  return (
    <div className="paper-noise bg-paper min-h-screen">
      <Navbar />

      {/* HERO */}
      <section data-testid="hero-section" className="relative bg-ink text-paper overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-ink/50 via-transparent to-ink" />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_35%,#0B1021_100%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 min-h-[92vh] flex flex-col justify-center py-24">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50 mb-6"
              data-testid="hero-eyebrow"
            >
              Trading Education · Online &amp; Offline
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter leading-[0.95] text-paper"
              data-testid="hero-headline"
            >
              Learn the market.
              <br />
              <span className="italic text-paper/50">Master the process.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-base sm:text-lg text-paper/60 leading-relaxed max-w-xl"
              data-testid="hero-subhead"
            >
              One Stock Academy teaches you to trade with structure — a complete curriculum,
              practitioner mentors, and an uncompromising focus on risk. No tips, no signals,
              no shortcuts. Just skill, built one session at a time.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/enroll"
                data-testid="hero-enroll-btn"
                className="group bg-paper text-ink font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 flex items-center gap-2 hover:bg-white transition-colors"
              >
                Enroll Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#courses"
                data-testid="hero-courses-link"
                className="font-mono text-xs uppercase tracking-[0.18em] text-paper border border-paper/25 px-8 py-4 hover:border-paper hover:bg-paper/5 transition-colors"
              >
                View Courses
              </a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex flex-wrap gap-x-10 gap-y-4 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/40"
            data-testid="hero-facts"
          >
            <span>Live Classes</span>
            <span className="text-paper/15">/</span>
            <span>One-Time Fee</span>
            <span className="text-paper/15">/</span>
            <span>Beginner Friendly</span>
          </motion.div>
        </div>
        <p className="absolute bottom-5 right-6 sm:right-10 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/30">
          Live 3D render · move your cursor
        </p>
      </section>

      <TickerTape dark />

      {/* WHY */}
      <section id="why" data-testid="why-section" className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <motion.div {...fadeUp} className="max-w-2xl mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bull mb-4">Why One Stock Academy</p>
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink leading-tight">
            Built for people who want to trade <span className="italic">properly</span>
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 border-t border-l border-ink/10">
          {VALUE_PROPS.map((v, i) => (
            <motion.div
              key={v.n}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              data-testid={`value-prop-${v.n}`}
              className="group border-b border-r border-ink/10 p-8 sm:p-12 hover:bg-white transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-sm text-gold">{v.n}</span>
                <v.icon className="w-6 h-6 text-ink/30 group-hover:text-bull transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-4">
                {v.title}
              </h3>
              <p className="text-ink/70 leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" data-testid="courses-section" className="bg-paper-deep/50 border-y border-ink/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bull mb-4">Courses &amp; Pricing</p>
              <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink leading-tight">
                One curriculum. Two ways to learn it.
              </h2>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
              One-time payment · No subscriptions
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
            <motion.div {...fadeUp} data-testid="course-card-online" className="bg-white p-8 sm:p-12 group hover:bg-paper transition-colors">
              <div className="flex items-center gap-3 mb-8">
                <Monitor className="w-5 h-5 text-bull" strokeWidth={1.5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">Live Virtual Classes</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink mb-2">Online Batch</h3>
              <p className="font-mono text-4xl sm:text-5xl font-medium text-ink mt-6 mb-2" data-testid="price-online">
                ₹49,000
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-10">One-time · Attend from anywhere</p>
              <ul className="space-y-3 text-ink/70 mb-12">
                {["Live interactive virtual classes", "Full structured curriculum", "Doubt-clearing with practitioner mentors", "Batch schedule + student portal access"].map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="text-chart-green mt-1">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/enroll?course=online"
                data-testid="enroll-online-btn"
                className="group/btn inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink border border-ink/20 px-8 py-4 hover:border-bull hover:text-bull transition-colors"
              >
                Enroll — Online
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              data-testid="course-card-offline"
              className="bg-ink text-paper p-8 sm:p-12 relative"
            >
              <span className="absolute top-0 right-0 bg-gold text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2" data-testid="offline-highlight-badge">
                Classroom Experience
              </span>
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="w-5 h-5 text-gold" strokeWidth={1.5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">In-Person Classroom</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-medium tracking-tight mb-2">Offline Batch</h3>
              <p className="font-mono text-4xl sm:text-5xl font-medium text-gold mt-6 mb-2" data-testid="price-offline">
                ₹99,000
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50 mb-10">One-time · In-person classroom</p>
              <ul className="space-y-3 text-paper/70 mb-12">
                {["Face-to-face classroom sessions", "On-desk practice with live market context", "Direct mentor access in the room", "Full structured curriculum + batch details"].map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="text-gold mt-1">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/enroll?course=offline"
                data-testid="enroll-offline-btn"
                className="group/btn inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] bg-gold text-ink px-8 py-4 hover:bg-paper transition-colors"
              >
                Enroll — Offline
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MENTOR */}
      <section id="mentor" data-testid="mentor-section" className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div {...fadeUp} className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-gold/40 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1601655781320-205e34c94eb1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjB0ZWFjaGVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg3MTI2NzU1fDA&ixlib=rb-4.1.0&q=85"
                alt="Founder and lead mentor of One Stock Academy"
                data-testid="mentor-photo"
                className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="lg:col-span-7 lg:pl-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bull mb-4">Your Mentor</p>
            <blockquote className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ink leading-tight mb-10" data-testid="mentor-quote">
              "I don't teach people what to buy. I teach them how to <span className="italic text-gold">think</span> — so the market stops being a gamble and starts being a craft."
            </blockquote>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink mb-2" data-testid="mentor-name">
              Founder &amp; Lead Mentor
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-8">
              [ Mentor name &amp; photo to be added ]
            </p>
            <div className="space-y-5 text-ink/70 leading-relaxed max-w-xl">
              <p>
                One Stock Academy was founded by an active market practitioner who spent years learning
                the hard way — through real positions, real drawdowns, and real discipline — before
                teaching a single class.
              </p>
              <p>
                That experience shapes everything here: lessons are taught against live market context,
                losing trades are reviewed as openly as winning ones, and risk management is treated
                as the core skill rather than a footnote.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" data-testid="faq-section" className="bg-paper-deep/50 border-y border-ink/10">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <motion.div {...fadeUp} className="mb-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bull mb-4">Questions</p>
            <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink">
              Before you enroll
            </h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <Accordion type="single" collapsible className="border-t border-ink/10" data-testid="faq-accordion">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-ink/10">
                  <AccordionTrigger
                    data-testid={`faq-question-${i}`}
                    className="text-left font-display text-xl sm:text-2xl font-medium text-ink hover:text-bull py-6 hover:no-underline"
                  >
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent
                    data-testid={`faq-answer-${i}`}
                    className="text-ink/70 leading-relaxed pb-6 max-w-2xl"
                  >
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-testid="final-cta-section" className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <motion.div {...fadeUp} className="relative bg-ink text-paper p-10 sm:p-20 chart-grid-bg overflow-hidden">
          <div className="absolute inset-0 bg-ink/95" />
          <div className="relative max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold mb-6">Seats are batch-limited</p>
            <h2 className="font-display text-4xl sm:text-6xl font-medium tracking-tight leading-[1.02] mb-8">
              Stop watching the market.
              <br />
              <span className="italic text-paper/70">Start reading it.</span>
            </h2>
            <Link
              to="/enroll"
              data-testid="final-cta-btn"
              className="group inline-flex items-center gap-2 bg-paper text-ink font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 hover:bg-white transition-colors"
            >
              Enroll Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
