import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BookOpen,
  Monitor,
  MapPin,
  UserCheck,
  ShieldX,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerTape from "@/components/TickerTape";
import HeroVideo from "@/components/HeroVideo";
import BannerPhotos from "@/components/BannerPhotos";
import ChartQuiz from "@/components/ChartQuiz";
import EditorialMarquee from "@/components/EditorialMarquee";
import CustomCursor from "@/components/CustomCursor";
import MentorCard from "@/components/MentorCard";
import TiltCard from "@/components/TiltCard";
import Magnetic from "@/components/Magnetic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  initial: { opacity: 0, y: 36, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
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
    a: "The curriculum, mentor, and duration are identical. Online is ₹49,990 (inclusive of GST) and delivered as live virtual classes you can join from anywhere. Offline is ₹1,99,990 (inclusive of GST) and delivered in person in a classroom setting, with face-to-face interaction and on-desk practice.",
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
    a: "One-time. You pay once at enrollment — ₹49,990 for online or ₹1,99,990 for offline, both inclusive of GST — through a secure payment gateway (UPI, cards, and netbanking accepted). There are no recurring charges.",
  },
  {
    q: "What happens after I pay?",
    a: "Your enrollment is confirmed instantly after payment verification. Online students receive their batch schedule and portal access details; offline students receive their classroom batch details and start date.",
  },
];

const PHASES = [
  "Market & Price Action Foundation",
  "Smart Money Concepts",
  "Risk & Trade Management",
  "Strategy Building & Execution",
  "Psychology, Journaling & Performance",
];

const MENTORS = [
  {
    name: "Aman Singh Negi",
    role: "Chief Academic Officer",
    bio: "Leads the online cohort experience, known for breaking down price action and market structure for beginners.",
    stat: "750k+ on Instagram",
    photo: "/mentor-aman.jpg",
    focus: "52% 58%",
  },
  {
    name: "Rajat Sharma",
    role: "Founding Director",
    bio: "Builds and leads One Stock Academy's trading community, translating market moves into content.",
    stat: "150k+ traders on Instagram",
    photo: "/mentor-rajat.jpg",
    focus: "50% 18%",
  },
  {
    name: "Rishabh Mishra",
    role: "Founding Director",
    bio: "SEBI-registered trader and the driving force behind the academy's curriculum and mentorship philosophy. Leads flagship live sessions and 1:1 strategy audits.",
    stat: "SEBI-Registered",
    photo: "/mentor-rishabh.jpg",
    focus: "50% 32%",
  },
];

const REVIEWS = [
  {
    name: "Ankit K.",
    place: "Delhi",
    quote: "Before joining, I struggled with chart reading. The concepts are explained so clearly that my confidence in analyzing the market has improved a lot.",
  },
  {
    name: "Pooja Singh",
    place: "Uttar Pradesh",
    quote: "Very useful for anyone serious about learning trading. The concepts are explained step by step and are easy to apply on live charts.",
  },
  {
    name: "Ravi Kumar",
    place: "Gurugram",
    quote: "I learned how to read charts with much more clarity. The guidance on entries, stop-loss and risk management has been extremely helpful.",
  },
  {
    name: "Arjun Singh",
    place: "Punjab",
    quote: "One of the best things about the academy is the focus on execution and discipline. It changed the way I look at trading.",
  },
];

export default function Home() {
  const [leadForm, setLeadForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    age: "",
    city: "",
    trading_experience: "beginner",
    interest: "online",
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const submitLead = async (event) => {
    event.preventDefault();
    setLeadSubmitting(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL || ""}/api/leads`, {
        ...leadForm,
        age: Number(leadForm.age),
      });
      setLeadSubmitted(true);
      toast.success("Thanks. Our team will contact you shortly.");
    } catch (error) {
      toast.error(error.response?.data?.detail?.[0]?.msg || "Please check your details and try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div className="relative bg-[#050505] text-white min-h-screen hide-native-cursor">
      <CustomCursor />
      <div className="relative z-10">
      <Navbar />

      {/* HERO */}
      <section data-testid="hero-section" className="relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 min-h-screen grid lg:grid-cols-12 gap-12 items-center py-24">
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgba(5,5,5,0.88),transparent)] pointer-events-none" />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-6"
              data-testid="hero-eyebrow"
            >
              Trading Education · Online &amp; Offline
            </motion.p>
            <h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.9)]"
              data-testid="hero-headline"
            >
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  Learn the market.
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block italic text-pop"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  Master the process.
                </motion.span>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-base sm:text-lg text-paper/60 leading-relaxed max-w-xl"
              data-testid="hero-subhead"
            >
              One Stock Academy is the one-stop solution to every trading worry — outcome-oriented,
              high-quality courses delivered by domain experts. Time-bound, practical-heavy,
              well-curated sessions that help you realise your trading potential to the fullest.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Magnetic>
                <a
                  href="https://course.onestockacademy.com"
                  data-testid="hero-enroll-btn"
                  className="group bg-paper text-ink font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 flex items-center gap-2 hover:bg-white transition-colors rounded-full"
                >
                  Enroll Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Magnetic>

              <Magnetic>
                <a
                  href="https://course.onestockacademy.com/login"
                  data-testid="hero-login-btn"
                  className="group bg-[#f6f3ed] text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-5 py-3 flex items-center justify-center rounded-full border border-paper/20 hover:bg-white transition-colors shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                >
                  Login
                </a>
              </Magnetic>

              <a
                href="#courses"
                data-testid="hero-courses-link"
                className="font-mono text-xs uppercase tracking-[0.18em] text-paper border border-paper/25 px-8 py-4 hover:border-paper hover:bg-paper/5 transition-colors rounded-full"
              >
                View Courses
              </a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative mt-6 lg:mt-0"
            data-testid="hero-mentor-photo"
          >
            <div className="absolute -inset-3 border border-brand/30 rounded-3xl pointer-events-none" />
            <HeroVideo />
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500 mt-4 text-right">
              Learn directly from the mentor
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="lg:col-span-7 flex flex-wrap gap-3"
            data-testid="hero-facts"
          >
            {[
              ["10M+", "Combined Community"],
              ["750K+", "Aman Singh Negi"],
              ["150K+", "Rajat Sharma"],
              ["SEBI", "Registered Mentorship"],
            ].map(([val, label]) => (
              <span
                key={label}
                className="inline-flex items-baseline gap-2 border border-brand/25 bg-brand/10 backdrop-blur rounded-full px-5 py-2.5"
              >
                <span className="font-display text-base font-bold text-white">{val}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-brand/90">{label}</span>
              </span>
            ))}
          </motion.div>
        </div>
        <p className="absolute bottom-5 right-6 sm:right-10 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Scroll — the market moves with you
        </p>
      </section>

      <TickerTape dark />

      <EditorialMarquee />

      {/* FEATURE BANNER */}
      <section data-testid="feature-banner" className="relative overflow-hidden border-y border-white/10">
        <BannerPhotos />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060D] via-[#04060D]/85 to-[#04060D]/35" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-36">
          <motion.div {...fadeUp} className="max-w-2xl mb-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">New-Age Trading Education</p>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.02]">
              Learn trading from practitioners the market <span className="italic text-pop">already follows</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: BookOpen, big: "5 Phases", small: "Structured Buniyaad FMP curriculum" },
              { icon: Monitor, big: "2 Formats", small: "Live online classes & in-person classroom" },
              { icon: UserCheck, big: "3 Mentors", small: "SEBI-registered founder-led teaching" },
              { icon: TrendingUp, big: "10M+", small: "Combined social community" },
            ].map((c, i) => (
              <motion.div
                key={c.big}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                data-testid={`banner-stat-${i}`}
                className="bg-brand-deep/25 backdrop-blur-xl border border-brand/25 rounded-xl p-6 hover:bg-brand-deep/35 transition-colors"
              >
                <c.icon className="w-5 h-5 text-brand mb-4" strokeWidth={1.5} />
                <p className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">{c.big}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/60 leading-relaxed">{c.small}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="flex flex-wrap items-center gap-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/80 border border-white/25 bg-black/50 backdrop-blur px-4 py-2">
              Aman Singh Negi | Chief Academic Officer
            </span>
            <Magnetic>
              <a
                href="https://course.onestockacademy.com"
                data-testid="banner-enroll-btn"
                className="group inline-flex items-center gap-2 bg-white text-black font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 hover:bg-zinc-200 transition-colors rounded-full"
              >
                Enroll Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* MENTORS */}
      <section id="mentor" data-testid="mentor-section" className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <motion.div {...fadeUp} className="max-w-2xl mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Your Mentors</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Practitioners the market <span className="italic text-pop">already follows</span>
          </h2>
        </motion.div>
        <div className="flex flex-col gap-8 max-w-4xl mx-auto" style={{ perspective: 1600 }}>
          {MENTORS.map((m, i) => (
            <MentorCard key={m.name} m={m} i={i} />
          ))}
        </div>
      </section>

      {/* WHY */}
      <section id="why" data-testid="why-section" className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <motion.div {...fadeUp} className="max-w-2xl mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Why One Stock Academy</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Built for people who want to trade <span className="italic text-pop">properly</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {VALUE_PROPS.map((v, i) => (
            <motion.div
              key={v.n}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              data-testid={`value-prop-${v.n}`}
              className={`group bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 hover:bg-white/[0.08] hover:border-white/20 transition-colors ${
                i === 0 || i === 3 ? "md:col-span-7" : "md:col-span-5"
              }`}
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-sm text-brand">Chapter {v.n}</span>
                <v.icon className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
                {v.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VISION & TRACK RECORD */}
      <section id="vision" data-testid="vision-section" className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div {...fadeUp} className="bg-black/70 md:bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-6">Founder's Vision</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
              Empower the youth of India with trading skills they can hold a strong command over the
              financial economy with — and help India realise <span className="italic text-pop">"Viksit Bharat @ 2047".</span>
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="bg-black/70 md:bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-6">Mission Mode</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
              Relevant, curated course material delivered by trading experts in a time-bound manner —
              quality learning, <span className="italic text-pop">outcome oriented.</span>
            </p>
          </motion.div>
        </div>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          data-testid="track-record"
          className="grid grid-cols-1 sm:grid-cols-3 border border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-black/70 md:bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden"
        >
          {[
            ["10M+", "Combined social community"],
            ["SEBI", "Registered founder-led mentorship"],
            ["3", "Market verticals covered"],
          ].map(([stat, label]) => (
            <div key={label} className="p-8 text-center">
              <p className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">{stat}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* COURSES */}
      <section id="courses" data-testid="courses-section" className="border-y border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Our Learning Program</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Buniyaad — the Foundation Mentorship Program
              </h2>
              <div className="flex flex-wrap gap-3 mt-6" data-testid="program-pills">
                {["Live Classes", "5-Phase Curriculum", "Online & Offline", "One-Time Fee"].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/85 border border-brand/30 bg-brand/10 rounded-full px-4 py-2"
                  >
                    <span className="w-1.5 h-1.5 bg-brand rounded-full" />
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500">
              One-time payment · No subscriptions
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            data-testid="fmp-phases"
            className="grid grid-cols-1 sm:grid-cols-5 border border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-black/70 md:bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden mb-16"
          >
            {PHASES.map((p, i) => (
              <div key={p} className="p-6" data-testid={`phase-${i + 1}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand mb-3">Phase 0{i + 1}</p>
                <p className="font-display text-lg font-bold text-white leading-snug">{p}</p>
              </div>
            ))}
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8" style={{ perspective: 1400 }}>
            <TiltCard testId="course-card-online" className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 text-white p-8 sm:p-12 group">
              <div className="flex items-center gap-3 mb-8">
                <Monitor className="w-5 h-5 text-green-500" strokeWidth={1.5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Live Virtual Classes</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Online Batch</h3>
              <p className="font-mono text-4xl sm:text-5xl font-semibold text-white mt-6 mb-1" data-testid="price-online">
                ₹49,990
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand mb-1">Inclusive of GST</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-10">One-time · Attend from anywhere</p>
              <ul className="space-y-3 text-zinc-400 text-sm mb-12">
                {[
                  ["VIP Group & Community", "private learning & trading community access"],
                  ["Live Market With Mentors", "learn during live market sessions"],
                  ["Weekly Personal Doubt Session", "dedicated time for individual questions"],
                  ["Seminar Access", "attend selected seminars at no additional fee"],
                  ["1-Year Recorded Learning Vault", "revisit sessions throughout the year"],
                  ["AI Trading Strategy & Indicator", "stated value ₹1,10,000"],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-brand mt-0.5 text-[10px]">◆</span>
                    <span><strong className="text-white font-semibold">{t}</strong> — {d}</span>
                  </li>
                ))}
              </ul>
              <Magnetic>
                <a
                  href="https://course.onestockacademy.com/new-courses/4-buniyaad-online"
                  data-testid="enroll-online-btn"
                  className="group/btn inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-white border border-white/25 px-8 py-4 hover:border-white hover:bg-white/5 transition-colors rounded-full"
                >
                  Enroll — Online
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </Magnetic>
            </TiltCard>
            <TiltCard
              testId="course-card-offline"
              className="bg-white/[0.07] backdrop-blur-2xl border border-white/15 text-white p-8 sm:p-12 relative"
            >
              <span className="absolute top-0 right-0 bg-white text-black font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2" data-testid="offline-highlight-badge">
                Classroom Experience
              </span>
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="w-5 h-5 text-green-500" strokeWidth={1.5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">In-Person Classroom</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2">Offline Batch</h3>
              <p className="font-mono text-4xl sm:text-5xl font-semibold text-white mt-6 mb-1" data-testid="price-offline">
                ₹1,99,990
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand mb-1">Inclusive of GST</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-10">One-time · In-person classroom</p>
              <ul className="space-y-3 text-zinc-400 text-sm mb-12">
                {[
                  ["Exclusive In-Person Mentorship", "face-to-face learning with mentors"],
                  ["Hybrid Model Available", "join online/live sessions whenever required"],
                  ["Daily Personal Doubt Sessions", "individual guidance every day"],
                  ["Lifetime Recorded Learning Vault", "lifetime access to recordings"],
                  ["Premium Welcome Kit", "curated onboarding experience"],
                  ["Complimentary Snacks", "included during offline sessions"],
                  ["VIP Seminar Pass", "premium seating & priority access"],
                  ["10% OFF Future Bootcamps", "Dubai · Thailand · Goa · Rishikesh"],
                  ["Lifetime Mentor Access", "book mentor appointments anytime"],
                  ["AI Trading Strategy & Indicator", "stated value ₹1,10,000"],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-brand mt-0.5 text-[10px]">◆</span>
                    <span><strong className="text-white font-semibold">{t}</strong> — {d}</span>
                  </li>
                ))}
              </ul>
              <Magnetic>
                <a
                  href="https://course.onestockacademy.com/new-courses/5-buniyaad-offline"
                  data-testid="enroll-offline-btn"
                  className="group/btn inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] bg-white text-black px-8 py-4 hover:bg-zinc-200 transition-colors rounded-full"
                >
                  Enroll — Offline
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </Magnetic>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" data-testid="reviews-section" className="border-y border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <motion.div {...fadeUp} className="max-w-2xl mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Student Reviews</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              In their own words
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={r.name}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                data-testid={`review-card-${i}`}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10"
              >
                <p className="font-display text-xl sm:text-2xl text-white leading-snug mb-8">"{r.quote}"</p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white">{r.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">{r.place}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CHART QUIZ */}
      <section id="quiz" data-testid="quiz-section" className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Test Yourself</p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Can you read this chart?
          </h2>
          <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
            Three real chart situations. Call the move, then watch what the market did — the way our
            students learn every single session.
          </p>
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <ChartQuiz />
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" data-testid="faq-section" className="border-y border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <motion.div {...fadeUp} className="mb-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Questions</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Before you enroll
            </h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <Accordion type="single" collapsible className="border-t border-white/10" data-testid="faq-accordion">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-white/10">
                  <AccordionTrigger
                    data-testid={`faq-question-${i}`}
                    className="text-left font-display text-xl sm:text-2xl font-bold text-white hover:text-zinc-300 py-6 hover:no-underline"
                  >
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent
                    data-testid={`faq-answer-${i}`}
                    className="text-zinc-400 text-sm leading-relaxed pb-6 max-w-2xl"
                  >
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" data-testid="lead-form-section" className="border-y border-white/10 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-24 items-start">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Start a conversation</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Tell us where you are in your trading journey.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mt-5 max-w-md">
                Share a few details and our team will help you find the right next step.
              </p>
            </motion.div>
            <motion.form {...fadeUp} onSubmit={submitLead} className="grid sm:grid-cols-2 gap-4" data-testid="lead-form">
              {[
                ["name", "Full name", "text", "Your name"],
                ["whatsapp", "Phone number", "tel", "+91 98765 43210"],
                ["email", "Email address", "email", "you@example.com"],
                ["age", "Age", "number", "18"],
                ["city", "City", "text", "Mumbai"],
              ].map(([name, label, type, placeholder]) => (
                <label key={name} className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</span>
                  <input
                    name={name}
                    type={type}
                    value={leadForm[name]}
                    onChange={(event) => setLeadForm({ ...leadForm, [name]: event.target.value })}
                    placeholder={placeholder}
                    required
                    min={name === "age" ? 13 : undefined}
                    max={name === "age" ? 100 : undefined}
                    className="bg-white/[0.05] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand"
                    data-testid={`lead-${name}-input`}
                  />
                </label>
              ))}
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Trading experience</span>
                <select
                  name="trading_experience"
                  value={leadForm.trading_experience}
                  onChange={(event) => setLeadForm({ ...leadForm, trading_experience: event.target.value })}
                  className="bg-[#111] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand"
                  data-testid="lead-experience-input"
                >
                  <option value="beginner">Beginner</option>
                  <option value="less-than-1-year">Less than 1 year</option>
                  <option value="1-to-3-years">1 to 3 years</option>
                  <option value="more-than-3-years">More than 3 years</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Interested in</span>
                <select
                  name="interest"
                  value={leadForm.interest}
                  onChange={(event) => setLeadForm({ ...leadForm, interest: event.target.value })}
                  className="bg-[#111] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand"
                  data-testid="lead-interest-input"
                >
                  <option value="online">Online program</option>
                  <option value="offline">Offline program</option>
                </select>
              </label>
              <button
                type="submit"
                disabled={leadSubmitting || leadSubmitted}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 bg-white text-black font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 hover:bg-zinc-200 transition-colors disabled:opacity-60"
                data-testid="lead-submit-btn"
              >
                {leadSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {leadSubmitted ? "Details received" : "Share my details"}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-testid="final-cta-section" className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <motion.div {...fadeUp} className="relative bg-white/[0.05] backdrop-blur-2xl border border-white/10 text-white p-10 sm:p-20 overflow-hidden">
          <div className="relative max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-6">Seats are batch-limited</p>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.02] mb-8">
              Stop watching the market.
              <br />
              <span className="italic text-pop">Start reading it.</span>
            </h2>
            <Magnetic>
              <a
                href="https://course.onestockacademy.com"
                data-testid="final-cta-btn"
                className="group inline-flex items-center gap-2 bg-white text-black font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 hover:bg-zinc-200 transition-colors rounded-full"
              >
                Enroll Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
