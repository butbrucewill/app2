import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MONEY_EXPO_CARDS = [
  {
    title: "Best Trading School",
    subtitle: "Award Recognition",
    year: "2025",
    featured: true,
    hideCaption: false,
    image:
      "/_MG_4313.JPG (1).jpeg",
    text: "One Stock Academy won the award for Best Trading School at the Money Expo, recognising our commitment to practical, disciplined trading education.",
  },
  {
    title: "Investor Confidence",
    subtitle: "Live Market Dialogue",
    year: "2025",
    featured: true,
    hideCaption: false,
    image:
      "/_MG_4485.JPG.jpeg",
    text: "The academy engaged with serious learners and investors at the expo, sharing how structured market education can build long-term trading discipline.",
  },
  {
    title: "Financial Awareness",
    subtitle: "Community Connect",
    year: "2025",
    featured: false,
    hideCaption: false,
    image:
      "/_MG_3483.JPG.jpeg",
    text: "Our team created a strong educational footprint by helping attendees understand the importance of process, risk management, and psychology in trading.",
  },
  {
    title: "Mentorship Spotlight",
    subtitle: "Expert Interaction",
    year: "2025",
    featured: false,
    hideCaption: true,
    image:
      "/_MG_3447.JPG.jpeg",
    text: "The event created a platform for founders and mentors to speak directly with students about market readiness, chart analysis, and real-world execution.",
  },
  {
    title: "Skill Building",
    subtitle: "Workshop Session",
    year: "2025",
    featured: false,
    hideCaption: false,
    image:
      "/_MG_3742.JPG.jpeg",
    text: "Attendees explored practical learning models, showing how trading education can move from theory into consistent execution and risk control.",
  },
  {
    title: "Awareness Drive",
    subtitle: "Youth Education",
    year: "2025",
    featured: false,
    hideCaption: true,
    image:
      "/_MG_4141.JPG.jpeg",
    text: "The academy's presence highlighted the need for structured courses that empower young learners to build skills without relying on random tips or shortcuts.",
  },
  {
    title: "Market Education",
    subtitle: "Panel Discussion",
    year: "2025",
    featured: false,
    hideCaption: false,
    image:
      "/_MG_4145.JPG.jpeg",
    text: "Our experts participated in meaningful conversations around learning systems, public education, and creating a healthier market mindset.",
  },
  {
    title: "Student Growth",
    subtitle: "Audience Engagement",
    year: "2025",
    featured: false,
    hideCaption: true,
    image:
      "/_MG_4160.JPG.jpeg",
    text: "The event allowed students to connect with real mentors, understand the roadmap, and see how formal guidance accelerates disciplined growth.",
  },
  {
    title: "Brand Presence",
    subtitle: "Expo Showcase",
    year: "2025",
    featured: false,
    hideCaption: false,
    image:
      "/_MG_4188.JPG.jpeg",
    text: "One Stock Academy stood out at the expo as a brand focused on education-led building, practical support, and trading maturity over hype.",
  },
  {
    title: "Future of Trading",
    subtitle: "Innovation Talk",
    year: "2025",
    featured: false,
    hideCaption: false,
    image:
      "/_MG_1050.JPG.jpeg",
    text: "The conversations reinforced our belief that the future of trading education is structured, ethical, and designed for long-term skills rather than quick wins.",
  },
];

const FUTURE_EVENTS = [
  { title: "Investor Webinar", date: "Upcoming", tag: "Education" },
  { title: "Trading Bootcamp", date: "Upcoming", tag: "Workshop" },
  { title: "Market Masterclass", date: "Planned", tag: "Live Session" },
  { title: "Community Meetup", date: "Planned", tag: "Networking" },
];

const fadeUp = {
  initial: { opacity: 0, y: 36, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
};

const tabs = [
  { id: "all", label: "All Media Coverage" },
  { id: "money-expo", label: "Money Expo" },
  { id: "future-events", label: "Future Events" },
];

export default function MediaCoverage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState("");

  const handleVideoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (selectedVideo) {
      URL.revokeObjectURL(selectedVideo);
    }

    setSelectedVideo(URL.createObjectURL(file));
  };

  const visibleCards = useMemo(() => {
    if (activeTab === "money-expo") return MONEY_EXPO_CARDS;
    if (activeTab === "future-events") return FUTURE_EVENTS;
    return [...MONEY_EXPO_CARDS, ...FUTURE_EVENTS.map((event) => ({
      ...event,
      subtitle: event.tag,
      year: event.date,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      text: `${event.title} is planned for future community engagement and educational visibility as we continue expanding our media footprint.`,
    }))];
  }, [activeTab]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <motion.div {...fadeUp} className="max-w-3xl mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-5">
            Media Coverage
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.02] text-white">
            Recognition, events, and milestones that reflect our journey.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed">
            We keep key moments, event highlights, and achievements in one place so future coverage can be added with ease.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mb-12 border border-white/10 bg-white/[0.02] p-2 sm:p-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.02)] backdrop-blur-sm"
        >
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative overflow-hidden rounded-full px-4 sm:px-6 py-3 text-left transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span className="relative z-10 block font-mono text-[9px] uppercase tracking-[0.24em] sm:text-[10px]">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === "money-expo" && (
          <>
            <section className="mb-16">
              <motion.div {...fadeUp} className="mb-8 flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-3">Money Expo</p>
                  <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
                    The event that defined our presence
                  </h2>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  10 highlights
                </span>
              </motion.div>

              <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-6 mb-8">
                <motion.article {...fadeUp} className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03]">
                  <img src={MONEY_EXPO_CARDS[0].image} alt={MONEY_EXPO_CARDS[0].title} className="h-[420px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-[#050505]/30" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-brand">{MONEY_EXPO_CARDS[0].year}</span>
                    <h3 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                      {MONEY_EXPO_CARDS[0].title}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-300">
                      {MONEY_EXPO_CARDS[0].text}
                    </p>
                  </div>
                </motion.article>

                <motion.div {...fadeUp} className="flex flex-col justify-between rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand mb-4">Featured Story</p>
                    <h3 className="font-display text-3xl font-bold text-white leading-tight">
                      A milestone moment for One Stock Academy.
                    </h3>
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-zinc-400">
                    Winning Best Trading School at the Money Expo reflected the academy’s focus on practical education, disciplined learning, and empowering the next generation of traders.
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Award win</span>
                  </div>
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {MONEY_EXPO_CARDS.slice(1).map((event, index) => (
                  <motion.article
                    key={`${event.title}-${index}`}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: index * 0.05 }}
                    className={`group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] backdrop-blur-xl ${
                      index < 1 ? "md:col-span-1" : ""
                    }`}
                  >
                    <div className={`relative overflow-hidden ${event.hideCaption ? "h-[360px]" : "h-[300px]"}`}>
                      <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-[#050505]/20" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-brand">
                        {event.year}
                      </div>
                    </div>

                    {!event.hideCaption && (
                      <div className="p-4 sm:p-5">
                        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 mb-2">
                          {event.subtitle}
                        </p>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                          {event.title}
                        </h3>
                        <p className="mt-3 text-xs leading-relaxed text-zinc-400">{event.text}</p>
                      </div>
                    )}
                  </motion.article>
                ))}
              </div>
            </section>

            <motion.section
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="mb-20 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-8"
            >
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
                <div className="rounded-[22px] border border-dashed border-brand/40 bg-[#0d0d0d] p-4">
                  {selectedVideo ? (
                    <video
                      src={selectedVideo}
                      controls
                      playsInline
                      className="h-[320px] w-full rounded-[18px] object-cover bg-black"
                    />
                  ) : (
                    <div className="flex h-[320px] items-center justify-center rounded-[18px] bg-gradient-to-br from-brand/10 via-black to-[#111] text-center">
                      <div className="max-w-sm px-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand mb-3">Video Upload</p>
                        <h3 className="font-display text-3xl font-bold text-white">Money Expo Highlight Reel</h3>
                        <p className="mt-4 text-sm text-zinc-400">
                          Upload the event video here to display the official footage and winner moment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Featured Video</p>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                    Add the award moment and expo coverage here.
                  </h3>
                  <p className="mt-5 text-zinc-400 leading-relaxed">
                    This section is kept separate so the Money Expo story can have its own highlight reel while the rest of the media archive remains organised.
                  </p>

                  <label className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white text-black px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition hover:bg-zinc-200">
                    {selectedVideo ? "Change Video" : "Upload Video"}
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                  </label>
                </div>
              </div>
            </motion.section>
          </>
        )}

        {activeTab === "future-events" && (
          <motion.section {...fadeUp} className="mb-20 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {FUTURE_EVENTS.map((event, index) => (
              <article
                key={`${event.title}-${index}`}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand mb-3">{event.date}</p>
                <h3 className="font-display text-2xl font-bold text-white leading-snug">{event.title}</h3>
                <span className="mt-5 inline-block rounded-full border border-white/15 bg-black/30 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-300">
                  {event.tag}
                </span>
                <p className="mt-5 text-sm text-zinc-400 leading-relaxed">
                  This upcoming event slot is ready for a new media story, award update, or campaign highlight.
                </p>
              </article>
            ))}
          </motion.section>
        )}

        {activeTab === "all" && (
          <section className="mb-20">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleCards.map((event, index) => (
                <motion.article
                  key={`${event.title}-${index}`}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.04 }}
                  className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                >
                  <div className="relative h-72 sm:h-80 overflow-hidden">
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-[#050505]/10 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-brand">
                      {event.year}
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 mb-2">
                      {event.subtitle || "Event Coverage"}
                    </p>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                      {event.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-zinc-400">{event.text}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="rounded-[28px] border border-white/10 bg-black/30 p-8 sm:p-10"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">
            Media Archive
          </p>
          <p className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
            Add more stories, award moments, and future event coverage whenever the next milestone arrives.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
