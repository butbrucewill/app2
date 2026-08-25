import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CHIPS = ["What is Buniyaad?", "Online vs Offline?", "What are the fees?"];

// Self-contained fixed-answer assistant — no backend API needed.
const CHAT_FAQ = [
  [["buniyaad", "curriculum", "syllabus", "phase", "what do you teach", "what will i learn"],
   "Buniyaad is our Foundation Mentorship Program with 5 phases: Market & Price Action Foundation, Smart Money Concepts, Risk & Trade Management, Strategy Building & Execution, and Psychology, Journaling & Performance.", false],
  [["fee", "price", "cost", "charge", "payment", "subscription"],
   "Online batch is ₹49,990 and Offline classroom is ₹1,99,990 — both one-time payments, inclusive of GST, with no recurring charges.", false],
  [["difference", "which batch", "online vs", "online or offline", "compare"],
   "Both formats teach the same Buniyaad curriculum with the same mentors. Online is live virtual classes from anywhere (₹49,990); Offline is in-person classroom learning with daily doubt sessions and premium perks (₹1,99,990).", false],
  [["online"],
   "The Online batch is ₹49,990 (incl. GST) — live virtual classes, VIP community, weekly personal doubt sessions, seminar access, and a 1-year recorded learning vault plus our AI trading strategy.", false],
  [["offline", "classroom", "in-person", "in person"],
   "The Offline batch is ₹1,99,990 (incl. GST) — in-person mentorship, hybrid online access, daily doubt sessions, lifetime learning vault, welcome kit, VIP seminar pass, and 10% off future bootcamps.", false],
  [["mentor", "teacher", "aman", "rajat", "rishabh", "who teaches", "sebi", "trainer"],
   "Your mentors are Aman Singh Negi (Chief Academic Officer, 750k+ on Instagram), Rajat Sharma (Founding Director, 150k+ traders on Instagram), and Rishabh Mishra (Founding Director, SEBI-registered).", false],
  [["tip", "signal", "calls", "recommendation", "which stock", "what to buy", "jackpot"],
   "We never give stock tips, signals, or buy/sell calls — Buniyaad teaches you to build your own trading process so you never depend on anyone's calls.", false],
  [["guarantee", "profit", "returns", "rich", "sure shot", "sureshot"],
   "No honest educator can guarantee profits — trading involves real risk of loss. What we commit to is a complete, disciplined process: skills, risk management, and psychology.", false],
  [["enroll", "join", "register", "admission", "how to start", "get started", "sign up"],
   "Click any Enroll button on this page — it takes you to our course portal where you choose Online (₹49,990) or Offline (₹1,99,990) and complete payment securely. Your access details reach you right after enrollment.", false],
  [["beginner", "experience", "new to", "fresher", "no knowledge", "start from scratch"],
   "No experience needed — Buniyaad starts from the absolute basics and builds up phase by phase. Beginners fit right in.", false],
  [["duration", "how long", "timing", "batch date", "schedule", "when does", "next batch", "batch", "start date"],
   "Batch schedules and dates are shared with enrolled students directly. For upcoming batch dates, please contact us through the Chat With Us form and the team will confirm.", true],
  [["refund", "cancel", "money back"],
   "For refunds or cancellations, please contact us through the Chat With Us form — our team will reach out and help you personally.", true],
  [["contact", "talk to", "human", "team", "call me", "support"],
   "Sure — leave your name, email, and WhatsApp number in the Chat With Us form and our team will reach out to you.", true],
  [["hi", "hello", "hey", "namaste"],
   "Hello! I can help with the Buniyaad program, fees, mentors, formats, and enrollment. What would you like to know?", false],
];

const CHAT_FALLBACK =
  "That's beyond what I can answer here — please contact us using the Chat With Us form and our team will reach out to you personally.";

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const CHAT_PATTERNS = CHAT_FAQ.map(([keywords, reply, handoff]) => [
  keywords.map((k) => new RegExp(`\\b${escapeRe(k)}${k.includes(" ") ? "" : "(?:e?s)?"}\\b`, "i")),
  reply,
  handoff,
]);

function chatAnswer(message) {
  const text = message.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const [patterns, reply, handoff] of CHAT_PATTERNS) {
    const score = patterns.filter((p) => p.test(text)).length;
    if (score > bestScore) {
      best = { reply, handoff };
      bestScore = score;
    }
  }
  return best || { reply: CHAT_FALLBACK, handoff: true };
}

function LeadModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", city: "", interest: "online" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await axios.post(`${API}/leads`, form);
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.detail?.[0]?.msg || "Could not submit — please check the details and try again.");
    }
    setBusy(false);
  };

  const inputCls =
    "w-full bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand rounded-lg";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5"
          data-testid="whatsapp-lead-modal"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/15 rounded-2xl p-8"
          >
            <button
              data-testid="lead-modal-close-btn"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {done ? (
              <div className="text-center py-8" data-testid="lead-success">
                <span className="inline-flex w-12 h-12 rounded-full border border-green-500/40 bg-green-500/10 items-center justify-center mb-5">
                  <Send className="w-5 h-5 text-green-500" />
                </span>
                <h2 className="font-display text-3xl font-bold text-white mb-3">You&rsquo;re on the list.</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Our team will reach out to you shortly with program details and batch information.
                </p>
              </div>
            ) : (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand mb-2">Chat With Us</p>
                <h2 className="font-display text-3xl font-bold text-white mb-6">Talk to our team</h2>
                <form onSubmit={submit} className="space-y-4" data-testid="lead-form">
                  <input data-testid="lead-name-input" value={form.name} onChange={set("name")} required placeholder="Full Name" className={inputCls} />
                  <input data-testid="lead-email-input" type="email" value={form.email} onChange={set("email")} required placeholder="Email" className={inputCls} />
                  <div className="flex gap-3">
                    <span className="flex items-center px-3 border border-white/15 bg-white/5 font-mono text-xs text-zinc-400">IN +91</span>
                    <input data-testid="lead-whatsapp-input" type="tel" value={form.whatsapp} onChange={set("whatsapp")} required placeholder="WhatsApp Number" className={inputCls} />
                  </div>
                  <input data-testid="lead-city-input" value={form.city} onChange={set("city")} required placeholder="City" className={inputCls} />
                  <select
                    data-testid="lead-interest-select"
                    value={form.interest}
                    onChange={set("interest")}
                    className="w-full bg-white/5 border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand rounded-none [&>option]:bg-[#0a0a0a]"
                  >
                    <option value="online">Interested in — Online Batch (₹49,990)</option>
                    <option value="offline">Interested in — Offline Batch (₹1,99,990)</option>
                  </select>
                  <button
                    type="submit"
                    data-testid="lead-submit-btn"
                    disabled={busy}
                    className="w-full bg-brand-deep text-white font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 hover:bg-brand transition-colors disabled:opacity-60 flex items-center justify-center gap-2 rounded-xl"
                  >
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit
                  </button>
                  <p className="text-[10px] text-zinc-600 leading-relaxed text-center">
                    By submitting, you allow One Stock Academy to contact you via call or email
                    with program updates.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! I'm the One Stock Academy assistant. Ask me about the Buniyaad program, mentors, fees, or how enrollment works.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "assistant", text: "" }]);
    await new Promise((r) => setTimeout(r, 550));
    const ans = chatAnswer(msg);
    setMessages((m) => {
      const c = [...m];
      c[c.length - 1] = { role: "assistant", text: ans.reply, handoff: ans.handoff };
      return c;
    });
    setBusy(false);
  };

  return (
    <>
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />
      <div className="fixed bottom-5 right-5 z-[85] flex flex-col items-end gap-3">
        <motion.button
          data-testid="chat-toggle-btn"
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open chat assistant"
          className="w-14 h-14 bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.25)]"
        >
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-[85] w-[calc(100vw-40px)] max-w-sm h-[480px] flex flex-col bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-white">OSA Assistant</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-500">Ask about courses, mentors, fees</p>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" data-testid="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                      m.role === "user"
                        ? "bg-white text-black"
                        : "bg-white/[0.06] border border-white/10 text-zinc-200"
                    }`}
                  >
                    {m.text || (busy && i === messages.length - 1 ? "…" : "")}
                    {m.role === "assistant" && m.handoff && m.text && (
                      <button
                        data-testid="chat-handoff-btn"
                        onClick={() => setLeadOpen(true)}
                        className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-brand border border-brand/40 bg-brand/10 px-4 py-2.5 rounded-full hover:bg-brand hover:text-black transition-colors"
                      >
                        Talk to the team →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  data-testid={`chat-chip-${c.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  onClick={() => send(c)}
                  disabled={busy}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] border border-white/15 text-zinc-400 px-3 py-1.5 rounded-full hover:border-white/50 hover:text-white transition-colors disabled:opacity-50"
                >
                  {c}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 p-4 border-t border-white/10"
            >
              <input
                data-testid="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                className="flex-1 bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/50 rounded-full"
              />
              <button
                type="submit"
                data-testid="chat-send-btn"
                disabled={busy}
                className="w-11 h-11 bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-50 rounded-full"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
