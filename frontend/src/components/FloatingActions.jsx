import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CHIPS = ["What is Buniyaad?", "Online vs Offline?", "What are the fees?"];

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
    "w-full bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand rounded-none";

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
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/15 p-8"
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
                <h2 className="font-display text-3xl font-bold text-white mb-3">You're on the list.</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Our team will reach out to you on WhatsApp shortly with program details and batch information.
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
                    <option value="online">Interested in — Online Batch (₹49,000)</option>
                    <option value="offline">Interested in — Offline Batch (₹99,000)</option>
                  </select>
                  <button
                    type="submit"
                    data-testid="lead-submit-btn"
                    disabled={busy}
                    className="w-full bg-brand-deep text-white font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 hover:bg-brand transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit
                  </button>
                  <p className="text-[10px] text-zinc-600 leading-relaxed text-center">
                    By submitting, you allow One Stock Academy to contact you via WhatsApp, call, or email
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
  const sessionId = useRef("web-" + Math.random().toString(36).slice(2, 10));
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
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId.current, message: msg }),
      });
      if (!res.ok || !res.body) throw new Error("chat failed");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop();
        for (const p of parts) {
          if (!p.startsWith("data: ")) continue;
          const data = p.slice(6);
          if (data === "[DONE]") continue;
          try {
            const { t } = JSON.parse(data);
            setMessages((m) => {
              const c = [...m];
              c[c.length - 1] = { role: "assistant", text: c[c.length - 1].text + t };
              return c;
            });
          } catch {}
        }
      }
    } catch {
      setMessages((m) => {
        const c = [...m];
        c[c.length - 1] = { role: "assistant", text: "Something went wrong — please try again." };
        return c;
      });
    }
    setBusy(false);
  };

  return (
    <>
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />
      <div className="fixed bottom-5 right-5 z-[85] flex flex-col items-end gap-3">
        <motion.button
          data-testid="whatsapp-btn"
          onClick={() => setLeadOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Chat with us on WhatsApp"
          className="w-12 h-12 rounded-full bg-[#25D366] text-black flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.35)]"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91a9.85 9.85 0 0 0-2.9-7.01A9.83 9.83 0 0 0 12.04 2m0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23m4.52-6.16c-.25-.13-1.47-.72-1.7-.8-.22-.09-.39-.13-.55.12-.17.25-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.43-.14-.01-.31-.01-.47-.01-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28" />
          </svg>
        </motion.button>
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
            className="fixed bottom-24 right-5 z-[85] w-[calc(100vw-40px)] max-w-sm h-[480px] flex flex-col bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/15 shadow-2xl"
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
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-white text-black"
                        : "bg-white/[0.06] border border-white/10 text-zinc-200"
                    }`}
                  >
                    {m.text || (busy && i === messages.length - 1 ? "…" : "")}
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
                  className="font-mono text-[10px] uppercase tracking-[0.12em] border border-white/15 text-zinc-400 px-3 py-1.5 hover:border-white/50 hover:text-white transition-colors disabled:opacity-50"
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
                className="flex-1 bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/50 rounded-none"
              />
              <button
                type="submit"
                data-testid="chat-send-btn"
                disabled={busy}
                className="w-11 h-11 bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-50"
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
