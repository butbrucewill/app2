import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, MapPin, ShieldCheck, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import TiltCard from "@/components/TiltCard";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COURSES = {
  online: {
    id: "online",
    name: "Online Batch",
    format: "Live Virtual Classes",
    price: 49000,
    icon: Monitor,
    points: ["Attend live from anywhere", "Full structured curriculum", "Portal access + batch schedule"],
  },
  offline: {
    id: "offline",
    name: "Offline Batch",
    format: "In-Person Classroom",
    price: 99000,
    icon: MapPin,
    points: ["Face-to-face classroom sessions", "On-desk live market practice", "Direct mentor access"],
  },
};

const inr = (n) => "₹" + n.toLocaleString("en-IN");

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BuyCourse() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initial = params.get("course") === "offline" ? "offline" : "online";
  const [courseId, setCourseId] = useState(initial);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [demoOrder, setDemoOrder] = useState(null);
  const course = COURSES[courseId];
  const orderSummary = useMemo(() => ({ total: course.price }), [course]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const verifyAndRoute = async (payload) => {
    try {
      const res = await axios.post(`${API}/payments/verify`, payload);
      if (res.data.status === "success") {
        navigate(`/payment/result?status=success&ref=${payload.order_ref}`);
      } else {
        navigate(`/payment/result?status=failed&ref=${payload.order_ref}`);
      }
    } catch {
      navigate(`/payment/result?status=failed&ref=${payload.order_ref}`);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in your name, email, and phone.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/orders`, {
        course_id: courseId,
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      const order = res.data;

      if (order.demo) {
        setDemoOrder(order);
        setLoading(false);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Could not load the payment gateway. Please try again.");
        setLoading(false);
        return;
      }
      const rzp = new window.Razorpay({
        key: order.razorpay_key_id,
        amount: order.amount_paise,
        currency: order.currency,
        name: "One Stock Academy",
        description: order.course.name,
        order_id: order.razorpay_order_id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#166534" },
        handler: (resp) => {
          verifyAndRoute({
            order_ref: order.order_ref,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info("Payment was not completed. Your seat is not booked yet.");
          },
        },
      });
      rzp.on("payment.failed", () => {
        navigate(`/payment/result?status=failed&ref=${order.order_ref}`);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not start payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] text-zinc-200 min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-[#050505]/90 backdrop-blur" data-testid="enroll-header">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <Link to="/" data-testid="enroll-back-link" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> One Stock Academy
          </Link>
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <Lock className="w-3.5 h-3.5" /> Secure checkout
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 sm:px-10 py-14 sm:py-20">
        <div className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500 mb-3">Enrollment</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white" data-testid="enroll-title">
            Choose your batch
          </h1>
        </div>

        <form onSubmit={handlePay} className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="grid sm:grid-cols-2 gap-4" style={{ perspective: 1200 }} data-testid="course-selector">
              {Object.values(COURSES).map((c) => (
                <TiltCard
                  key={c.id}
                  testId={`select-course-${c.id}`}
                  onClick={() => setCourseId(c.id)}
                  className={`text-left border p-6 transition-colors cursor-pointer ${
                    courseId === c.id
                      ? "border-white/60 bg-white/10 backdrop-blur-xl"
                      : "border-white/10 bg-white/[0.03] hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <c.icon className={`w-5 h-5 ${courseId === c.id ? "text-white" : "text-zinc-500"}`} strokeWidth={1.5} />
                    <span
                      className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                        courseId === c.id ? "border-white" : "border-zinc-600"
                      }`}
                    >
                      {courseId === c.id && <span className="w-2 h-2 bg-white rounded-full" />}
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold text-white">{c.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 mt-1">{c.format}</p>
                  <p className="font-mono text-xl font-semibold mt-4 text-white">
                    {inr(c.price)}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {c.points.map((p) => (
                      <li key={p} className="text-sm text-zinc-400 flex gap-2">
                        <span className="text-green-500">—</span> {p}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              ))}
            </div>

            <div className="border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8" data-testid="student-details-form">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-6">Your details</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">Full name</span>
                  <input
                    data-testid="input-name"
                    value={form.name}
                    onChange={set("name")}
                    required
                    placeholder="Your full name"
                    className="mt-2 w-full border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/60 rounded-none"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">Phone</span>
                  <input
                    data-testid="input-phone"
                    value={form.phone}
                    onChange={set("phone")}
                    required
                    type="tel"
                    placeholder="10-digit mobile"
                    className="mt-2 w-full border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/60 rounded-none"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">Email</span>
                  <input
                    data-testid="input-email"
                    value={form.email}
                    onChange={set("email")}
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/60 rounded-none"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-white/[0.05] backdrop-blur-xl text-white p-6 sm:p-8 sticky top-8" data-testid="order-summary">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-6">Order summary</p>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-display text-2xl font-medium">{course.name}</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 mb-8">{course.format}</p>
              <div className="border-t border-white/10 pt-6 space-y-3 font-mono text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Course fee</span>
                  <span data-testid="summary-fee">{inr(orderSummary.total)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Billing</span>
                  <span>One-time</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-white font-semibold" data-testid="summary-total">{inr(orderSummary.total)}</span>
                </div>
              </div>
              <button
                type="submit"
                data-testid="pay-now-btn"
                disabled={loading}
                className="mt-8 w-full bg-white text-black font-mono text-xs uppercase tracking-[0.18em] px-6 py-4 hover:bg-zinc-200 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {loading ? "Preparing payment…" : `Pay ${inr(orderSummary.total)}`}
              </button>
              <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-zinc-500 font-mono">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                You will complete payment on the secure gateway page (UPI, cards, netbanking). Enrollment is
                confirmed only after payment verification.
              </p>
            </div>
          </div>
        </form>
      </main>

      <AnimatePresence>
        {demoOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-6"
            data-testid="demo-checkout-modal"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-[#0a0a0a] border border-white/10 max-w-md w-full p-8"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Demo mode — gateway keys pending</p>
              <h2 className="font-display text-3xl font-bold text-white mb-2">Simulated hosted checkout</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Razorpay keys from Apex IT Solutions are not configured yet, so this is a simulation of the
                hosted payment page. The server-side verification step runs exactly as it will in production.
              </p>
              <div className="border border-white/10 bg-white/5 p-4 mb-6 font-mono text-sm flex justify-between">
                <span className="text-zinc-400">{demoOrder.course.name}</span>
                <span className="font-medium text-white">{inr(demoOrder.amount_paise / 100)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  data-testid="demo-pay-success-btn"
                  onClick={() => verifyAndRoute({ order_ref: demoOrder.order_ref, demo_outcome: "success" })}
                  className="flex-1 bg-white text-black font-mono text-xs uppercase tracking-[0.18em] px-4 py-3.5 hover:bg-zinc-200 transition-colors"
                >
                  Simulate success
                </button>
                <button
                  data-testid="demo-pay-fail-btn"
                  onClick={() => verifyAndRoute({ order_ref: demoOrder.order_ref, demo_outcome: "failure" })}
                  className="flex-1 border border-white/20 text-white font-mono text-xs uppercase tracking-[0.18em] px-4 py-3.5 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  Simulate failure
                </button>
              </div>
              <button
                data-testid="demo-checkout-close-btn"
                onClick={() => setDemoOrder(null)}
                className="mt-4 w-full font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
