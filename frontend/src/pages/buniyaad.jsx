
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Monitor } from "lucide-react";

export default function Buniyaad() {
  return (
    <div
      data-testid="buniyaad-page"
      className="bg-[#050505] text-paper min-h-screen"
    >
      <Navbar />

      <section
        id="courses"
        data-testid="courses-section"
        className="border-y border-white/10 bg-black/40"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">

          {/* Header */}
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">
              Our Learning Program
            </p>

            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Buniyaad — the Foundation Mentorship Program
            </h2>

            <div
              className="flex flex-wrap gap-3 mt-6"
              data-testid="program-pills"
            >
              {[
                "Live Classes",
                "5-Phase Curriculum",
                "Online & Offline",
                "One-Time Fee",
              ].map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/85 border border-brand/30 bg-brand/10 rounded-full px-4 py-2"
                >
                  <span className="w-1.5 h-1.5 bg-brand rounded-full" />
                  {pill}
                </span>
              ))}
            </div>

            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 mt-6">
              One-time payment · No subscriptions
            </p>
          </div>

          {/* ================= ONLINE COURSE ================= */}
          <div className="mb-20">
            <div className="mb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand mb-3">
                Online Course
              </p>

              <h3 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Learn From Anywhere
              </h3>

              <p className="text-zinc-500 mt-3 max-w-2xl">
                Join live virtual classes and learn directly from mentors
                without being limited by location.
              </p>
            </div>

            {/* Online Card */}
            <div
              data-testid="course-card-online"
              className="bg-white/[0.05] border border-white/10 text-white p-8 sm:p-12"
            >
              <div className="flex items-center gap-3 mb-8">
                <Monitor
                  className="w-5 h-5 text-green-500"
                  strokeWidth={1.5}
                />

                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Live Virtual Classes
                </span>
              </div>

              <h4 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Online Batch
              </h4>

              <p
                className="font-mono text-4xl sm:text-5xl font-semibold text-white mt-6 mb-1"
                data-testid="price-online"
              >
                ₹49,990
              </p>

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand mb-1">
                Inclusive of GST
              </p>

              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-10">
                One-time · Attend from anywhere
              </p>

              <ul className="space-y-3 text-zinc-400 text-sm">
                {[
                  [
                    "VIP Group & Community",
                    "private learning & trading community access",
                  ],
                  [
                    "Live Market With Mentors",
                    "learn during live market sessions",
                  ],
                  [
                    "Weekly Personal Doubt Session",
                    "dedicated time for individual questions",
                  ],
                  [
                    "Seminar Access",
                    "attend selected seminars at no additional fee",
                  ],
                  [
                    "1-Year Recorded Learning Vault",
                    "revisit sessions throughout the year",
                  ],
                  [
                    "AI Trading Strategy & Indicator",
                    "stated value ₹1,10,000",
                  ],
                ].map(([title, description]) => (
                  <li key={title} className="flex gap-3">
                    <span className="text-brand mt-0.5 text-[10px]">
                      ◆
                    </span>

                    <span>
                      <strong className="text-white font-semibold">
                        {title}
                      </strong>{" "}
                      — {description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ================= OFFLINE COURSE ================= */}
          <div>
            <div className="mb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand mb-3">
                Offline Course
              </p>

              <h3 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Experience Classroom Mentorship
              </h3>

              <p className="text-zinc-500 mt-3 max-w-2xl">
                Get face-to-face mentorship, personal guidance and a complete
                classroom learning experience.
              </p>
            </div>

            {/* Offline Card */}
            <div
              data-testid="course-card-offline"
              className="bg-white/[0.07] border border-white/15 text-white p-8 sm:p-12 relative"
            >
              <span
                className="absolute top-0 right-0 bg-white text-black font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2"
                data-testid="offline-highlight-badge"
              >
                Classroom Experience
              </span>

              <div className="flex items-center gap-3 mb-8">
                <MapPin
                  className="w-5 h-5 text-green-500"
                  strokeWidth={1.5}
                />

                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  In-Person Classroom
                </span>
              </div>

              <h4 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Offline Batch
              </h4>

              <p
                className="font-mono text-4xl sm:text-5xl font-semibold text-white mt-6 mb-1"
                data-testid="price-offline"
              >
                ₹1,99,990
              </p>

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand mb-1">
                Inclusive of GST
              </p>

              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-10">
                One-time · In-person classroom
              </p>

              <ul className="space-y-3 text-zinc-400 text-sm">
                {[
                  [
                    "Exclusive In-Person Mentorship",
                    "face-to-face learning with mentors",
                  ],
                  [
                    "Hybrid Model Available",
                    "join online/live sessions whenever required",
                  ],
                  [
                    "Daily Personal Doubt Sessions",
                    "individual guidance every day",
                  ],
                  [
                    "Lifetime Recorded Learning Vault",
                    "lifetime access to recordings",
                  ],
                  [
                    "Premium Welcome Kit",
                    "curated onboarding experience",
                  ],
                  [
                    "Complimentary Snacks",
                    "included during offline sessions",
                  ],
                  [
                    "VIP Seminar Pass",
                    "premium seating & priority access",
                  ],
                  [
                    "10% OFF Future Bootcamps",
                    "Dubai · Thailand · Goa · Rishikesh",
                  ],
                  [
                    "Lifetime Mentor Access",
                    "book mentor appointments anytime",
                  ],
                  [
                    "AI Trading Strategy & Indicator",
                    "stated value ₹1,10,000",
                  ],
                ].map(([title, description]) => (
                  <li key={title} className="flex gap-3">
                    <span className="text-brand mt-0.5 text-[10px]">
                      ◆
                    </span>

                    <span>
                      <strong className="text-white font-semibold">
                        {title}
                      </strong>{" "}
                      — {description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

