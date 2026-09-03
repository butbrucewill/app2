import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  MessageCircle,
  Monitor,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Magnetic from "@/components/Magnetic";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const outcomes = [
  [Users, "Client Education", "A clear learning path for new and developing traders, starting with market basics and progressing into practical analysis."],
  [Monitor, "Platform Adoption", "Dedicated MetaTrader 5 lessons help clients confidently navigate charts, orders, stop-loss, take-profit, and account information."],
  [ShieldCheck, "Risk Awareness", "Leverage, margin, position sizing, drawdown, and trading discipline are embedded before advanced strategy content."],
  [BarChart3, "Advanced Capability", "Price action, market structure, Smart Money Concepts, selected ICT principles, and structured execution models complete the journey."],
];

const modules = [
  ["01", "Forex Market Fundamentals", "6", "A clear understanding of the Forex ecosystem before placing a trade"],
  ["02", "Trade Mechanics", "10", "Fluency in pricing, pips, lots, leverage, margin, and trading costs"],
  ["03", "MetaTrader 5 Masterclass", "12", "Confidence moving from platform orientation to real order execution"],
  ["04", "Professional Risk Management", "10", "Disciplined risk, position sizing, and capital-protection habits"],
  ["05", "Price Action Foundation", "10", "The ability to read candles, levels, trends, ranges, and breakouts"],
  ["06", "Market Structure", "8", "Directional context using swings, BOS, CHoCH, MSS, and multi-timeframe analysis"],
  ["07", "Smart Money Concepts", "7", "Understanding of liquidity, inducement, order blocks, FVGs, and dealing ranges"],
  ["08", "ICT Concepts", "1", "An introduction to time-based execution and core ICT framework ideas"],
  ["09", "Advanced Strategy & Execution", "6", "A repeatable framework for analysis, execution, and a personal trading plan"],
];

const brokerBenefits = [
  ["Client Onboarding", "A structured education path for new clients, before and after they start trading on your platform"],
  ["Platform Familiarity", "Dedicated MT5 lessons lower the barrier around charts, orders, SL/TP, and account information"],
  ["Trading Literacy", "A shared vocabulary across pairs, pips, spread, leverage, margin, price action, and structure"],
  ["Risk Awareness", "Risk management is taught before advanced strategy, reinforcing responsible trading habits"],
  ["Client Engagement", "A 70-lesson progression builds a longer relationship than a single introductory tutorial"],
  ["Brand Authority", "Deliverable as a fully broker-branded educational experience with consistent visual identity"],
];

const included = [
  [BookOpen, "70 Video Lessons", "Structured, concise lessons, approximately 6–8 minutes each."],
  [FileText, "Course Workbook", "A companion guide with lesson summaries, terminology, and key takeaways."],
  [Monitor, "MT5 Quick-Start Guide", "A reference guide for platform navigation, order types, and basic trade management."],
  [ShieldCheck, "Risk Management Toolkit", "A risk checklist, position-sizing framework, and trading risk rules."],
  [FileText, "Trading Journal Template", "A simple framework for recording setups, execution, and post-trade review."],
  [Sparkles, "Trading Plan Template", "A repeatable framework covering instruments, sessions, entries, exits, and risk limits."],
  [CheckCircle2, "Module Assessments", "Short knowledge checks that reinforce concepts and improve course completion."],
  [Award, "Completion Certificate", "An optional branded certificate for learners who finish the program."],
];

const expoPhotos = [
  { src: "/_MG_4313.JPG (1).jpeg", alt: "OneStock Academy receiving recognition at Money Expo" },
  { src: "/_MG_4485.JPG.jpeg", alt: "OneStock Academy team engaging with investors at Money Expo" },
  { src: "/_MG_3483.JPG.jpeg", alt: "OneStock Academy connecting with learners at Money Expo" },
  { src: "/_MG_4160.JPG.jpeg", alt: "OneStock Academy market education discussion at Money Expo" },
];

const steps = [
  ["01", "Scope & Brand Alignment", "Confirm brand guidelines, approved terminology, platform details, and required disclosures."],
  ["02", "Curriculum Lock", "Approve the full 70-lesson title list and sequence before production begins."],
  ["03", "Script & Visual Development", "Build concise scripts, chart examples, MT5 demonstrations, and lesson assets."],
  ["04", "Production", "Record and edit all 70 lessons to a consistent visual and audio standard."],
  ["05", "Review & Revisions", "Structured review against the approved curriculum and your brand and compliance requirements."],
  ["06", "Final Delivery", "Receive the complete video library and supporting education assets in your agreed formats."],
];

const CUSTOM_BATCH_WHATSAPP = "https://wa.me/919599037181?text=Hello%20OneStock%20Academy%2C%20I%20would%20like%20to%20discuss%20a%20custom%20Global%20Market%20batch%20for%20my%20broker%20or%20team.";

export default function GlobalMarket() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.10),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f4f5f7_34%,#fafafa_100%)] text-slate-900">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.08),transparent_35%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
            <motion.div {...fadeUp}>
              <p className="mb-5 inline-flex rounded-full border border-slate-300 bg-white/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-700 shadow-sm backdrop-blur-sm">OneStock Academy · Broker Education Program</p>
              <h1 className="max-w-3xl bg-gradient-to-r from-black via-slate-800 to-slate-500 bg-clip-text font-display text-5xl font-bold leading-[1.05] tracking-tight text-transparent sm:text-6xl lg:text-7xl">Master the Market. From First Principles to Professional Execution.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600">A structured 70-lesson learning journey that takes traders from Forex fundamentals to advanced market analysis, Smart Money Concepts, ICT, and practical execution, built for brokers who want to give their clients a world-class education experience.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Magnetic><a href="https://course.onestockacademy.com/new-courses/6-global-market" className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white shadow-[0_18px_35px_rgba(0,0,0,0.18)] transition hover:bg-slate-800">Enroll Now <ArrowRight size={15} /></a></Magnetic>
                <Magnetic><a href={CUSTOM_BATCH_WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-900 shadow-sm transition hover:border-slate-900 hover:bg-slate-50"><MessageCircle size={15} /> Discuss a Custom Batch</a></Magnetic>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">70 Video Lessons · 6–8 Minutes Each · Broker-Ready B2B Licensing</span>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.12 }} className="grid grid-cols-2 gap-3 sm:gap-5">
              {expoPhotos.slice(0, 3).map((photo, index) => <img key={photo.src} src={photo.src} alt={photo.alt} className={`w-full rounded-[24px] border border-white/80 object-cover shadow-[0_18px_45px_rgba(15,23,42,0.12)] ${index === 0 ? "col-span-2 h-64" : "h-40"}`} />)}
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
          <motion.div {...fadeUp} className="max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-700">Why Structured Education Wins</p><h2 className="mt-4 bg-gradient-to-r from-black via-slate-800 to-slate-500 bg-clip-text font-display text-4xl font-bold text-transparent sm:text-5xl">This isn’t a video library. It’s a curriculum.</h2><p className="mt-5 text-base leading-relaxed text-slate-600">Most trading content is scattered: random videos, disconnected tips, and no real progression. OneStock Academy follows a deliberate sequence: understand the market, understand the trade, learn the platform, control risk, read price, analyze structure, study liquidity, SMC and ICT, then execute a defined framework.</p></motion.div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{outcomes.map(([Icon, title, text]) => <motion.article key={title} {...fadeUp} className="rounded-[26px] border border-slate-200 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900"><Icon size={22} /></div><h3 className="font-display text-2xl font-bold text-slate-900">{title}</h3><p className="mt-4 text-sm leading-relaxed text-slate-600">{text}</p></motion.article>)}</div>
  </section>

  <section className="bg-black py-24 text-white"><div className="mx-auto max-w-7xl px-6 sm:px-10"><motion.div {...fadeUp} className="mb-12 max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#d7b66d]">The Program Architecture</p><h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Nine modules. One deliberate beginner-to-advanced progression.</h2><p className="mt-5 text-slate-300">70 lessons designed to build understanding in the right order, with responsible risk awareness introduced before advanced strategy.</p></motion.div><div className="overflow-hidden rounded-[26px] border border-white/15"><div className="hidden grid-cols-[0.6fr_1.8fr_0.5fr_2fr] gap-4 border-b border-white/15 bg-white/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#d7b66d] md:grid"><span>Module</span><span>Focus</span><span>Lessons</span><span>What Clients Gain</span></div>{modules.map(([number, title, count, gain]) => <div key={number} className="grid gap-2 border-b border-white/10 px-6 py-5 last:border-0 md:grid-cols-[0.6fr_1.8fr_0.5fr_2fr] md:gap-4"><span className="font-mono text-xs text-[#d7b66d]">{number}</span><span className="font-display text-lg font-bold">{title}</span><span className="font-mono text-sm text-slate-300">{count}</span><span className="text-sm leading-relaxed text-slate-300">{gain}</span></div>)}</div><p className="mt-8 max-w-4xl text-sm leading-relaxed text-slate-300"><strong className="text-white">Lesson standard:</strong> Every video follows the same rhythm: concept, example, practical application, common mistake, and key takeaways. Lessons use diagrams, MT5 screen demonstrations, and real-chart examples. All content is education-first, with no guaranteed-return, guaranteed-win-rate, or income claims.</p></div></section>
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10"><motion.div {...fadeUp} className="mb-12 max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-700">Built for Brokers, Not Just Traders</p><h2 className="mt-4 bg-gradient-to-r from-black via-slate-800 to-slate-500 bg-clip-text font-display text-4xl font-bold text-transparent sm:text-5xl">Turn education into a strategic client asset.</h2></motion.div><div className="grid gap-px overflow-hidden rounded-[26px] border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">{brokerBenefits.map(([title, text]) => <div key={title} className="bg-white p-7"><h3 className="font-display text-xl font-bold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p></div>)}</div></section>

        <section className="bg-slate-100/80 py-24"><div className="mx-auto max-w-7xl px-6 sm:px-10"><motion.div {...fadeUp} className="mb-12 max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-700">What’s Included</p><h2 className="mt-4 bg-gradient-to-r from-black via-slate-800 to-slate-500 bg-clip-text font-display text-4xl font-bold text-transparent sm:text-5xl">Everything needed for a complete learning experience.</h2></motion.div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{included.map(([Icon, title, text]) => <motion.article key={title} {...fadeUp} className="rounded-[24px] border border-white bg-white/80 p-6 shadow-sm"><Icon className="text-slate-900" size={22} /><h3 className="mt-5 font-display text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p></motion.article>)}</div><p className="mt-10 max-w-4xl text-sm leading-relaxed text-slate-600"><strong className="text-slate-900">Optional production layer:</strong> Broker-specific branding, platform screenshots, broker terminology, approved disclosures, and localized voiceover or subtitles can be incorporated to fit your market and compliance requirements.</p></div></section>

        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10"><div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]"><motion.div {...fadeUp}><p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-700">OneStock at Money Expo</p><h2 className="mt-4 bg-gradient-to-r from-black via-slate-800 to-slate-500 bg-clip-text font-display text-4xl font-bold text-transparent sm:text-5xl">Education that meets the market in the real world.</h2><p className="mt-5 text-base leading-relaxed text-slate-600">Our Money Expo presence reflects the same education-first standard built into this program: practical conversations, accessible explanations, and a stronger culture of responsible market learning.</p></motion.div><div className="grid grid-cols-2 gap-4">{expoPhotos.map((photo) => <img key={photo.src} src={photo.src} alt={photo.alt} className="h-48 w-full rounded-[22px] border border-slate-200 object-cover shadow-sm sm:h-60" />)}</div></div></section>

        <section className="bg-black py-24 text-white"><div className="mx-auto max-w-7xl px-6 sm:px-10"><motion.div {...fadeUp} className="mb-12 max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#d7b66d]">From Approval to Delivery</p><h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">A clear production path with no mystery.</h2></motion.div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{steps.map(([number, title, text]) => <motion.article key={number} {...fadeUp} className="rounded-[24px] border border-white/15 bg-white/[0.05] p-6"><span className="font-mono text-sm text-[#d7b66d]">{number}</span><h3 className="mt-5 font-display text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{text}</p></motion.article>)}</div></div></section>

        <section id="contact" className="mx-auto max-w-5xl px-6 py-24 sm:px-10"><motion.div {...fadeUp} className="rounded-[32px] bg-[linear-gradient(135deg,#000000,#1b1b1b)] p-8 text-center text-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] sm:p-14"><p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#d7b66d]">Ready to Give Your Clients a Real Education?</p><h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Learn the market. Build your own understanding.</h2><p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-300">Whether you’re building a client onboarding funnel, strengthening platform adoption, or positioning your brand as an authority in trader education, OneStock Academy’s 70-lesson program can be delivered as a fully licensed, broker-branded asset tailored to your market.</p><a href={CUSTOM_BATCH_WHATSAPP} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d7b66d] px-7 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-black transition hover:bg-[#f0c96c]">Contact Us for a Custom Proposal <ArrowRight size={15} /></a></motion.div></section>

        <section className="mx-auto max-w-5xl px-6 pb-24 sm:px-10"><p className="text-xs leading-relaxed text-slate-500"><strong className="text-slate-700">Educational Disclaimer:</strong> This program is intended for educational purposes only. It does not constitute investment, financial, legal, or tax advice, and it does not guarantee profits or trading performance. Forex and leveraged trading involve substantial risk, and learners should consider whether such activity is appropriate for their circumstances. Broker-specific disclosures, risk warnings, and compliance language should be reviewed and approved by the relevant compliance team before client distribution.</p></section>
      </main>
      <Footer />
    </div>
  );
}
