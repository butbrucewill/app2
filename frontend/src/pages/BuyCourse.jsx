import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, MapPin, ShieldCheck, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    <div className="paper-noise bg-paper min-h-screen flex flex-col">
      <header className="border-b border-ink/10 bg-paper/95" data-testid="enroll-header">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <Link to="/" data-testid="enroll-back-link" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" /> One Stock Academy
          </Link>
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            <Lock className="w-3.5 h-3.5" /> Secure checkout
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 sm:px-10 py-14 sm:py-20">
        <div className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bull mb-3">Enrollment</p>
          <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink" data-testid="enroll-title">
            Choose your batch
          </h1>
        </div>

        <form onSubmit={handlePay} className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="grid sm:grid-cols-2 gap-4" data-testid="course-selector">
              {Object.values(COURSES).map((c) => (
                <button
                  type="button"
                  key={c.id}
                  data-testid={`select-course-${c.id}`}
                  onClick={() => setCourseId(c.id)}
                  className={`text-left border p-6 transition-colors ${
                    courseId === c.id
                      ? "border-bull bg-white"
                      : "border-ink/15 bg-transparent hover:border-ink/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <c.icon className={`w-5 h-5 ${courseId === c.id ? "text-bull" : "text-ink/40"}`} strokeWidth={1.5} />
                    <span
                      className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                        courseId === c.id ? "border-bull" : "border-ink/30"
                      }`}
                    >
                      {courseId === c.id && <span className="w-2 h-2 bg-bull rounded-full" />}
                    </span>
                  </div>
                  <p className="font-display text-2xl font-medium text-ink">{c.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted mt-1">{c.format}</p>
                  <p className={`font-mono text-xl font-medium mt-4 ${c.id === "offline" ? "text-gold" : "text-ink"}`}>
                    {inr(c.price)}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {c.points.map((p) => (
                      <li key={p} className="text-sm text-ink/60 flex gap-2">
                        <span className="text-chart-green">—</span> {p}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <div className="border border-ink/15 bg-white p-6 sm:p-8" data-testid="student-details-form">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted mb-6">Your details</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Full name</span>
                  <input
                    data-testid="input-name"
                    value={form.name}
                    onChange={set("name")}
                    required
                    placeholder="Your full name"
                    className="mt-2 w-full border border-ink/20 bg-paper px-4 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-bull rounded-none"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Phone</span>
                  <input
                    data-testid="input-phone"
                    value={form.phone}
                    onChange={set("phone")}
                    required
                    type="tel"
                    placeholder="10-digit mobile"
                    className="mt-2 w-full border border-ink/20 bg-paper px-4 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-bull rounded-none"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Email</span>
                  <input
                    data-testid="input-email"
                    value={form.email}
                    onChange={set("email")}
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full border border-ink/20 bg-paper px-4 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-bull rounded-none"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-ink/15 bg-ink text-paper p-6 sm:p-8 sticky top-8" data-testid="order-summary">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50 mb-6">Order summary</p>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-display text-2xl font-medium">{course.name}</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50 mb-8">{course.format}</p>
              <div className="border-t border-paper/15 pt-6 space-y-3 font-mono text-sm">
                <div className="flex justify-between text-paper/70">
                  <span>Course fee</span>
                  <span data-testid="summary-fee">{inr(orderSummary.total)}</span>
                </div>
                <div className="flex justify-between text-paper/70">
                  <span>Billing</span>
                  <span>One-time</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-paper/15">
                  <span>Total</span>
                  <span className="text-gold font-medium" data-testid="summary-total">{inr(orderSummary.total)}</span>
                </div>
              </div>
              <button
                type="submit"
                data-testid="pay-now-btn"
                disabled={loading}
                className="mt-8 w-full bg-paper text-ink font-mono text-xs uppercase tracking-[0.18em] px-6 py-4 hover:bg-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {loading ? "Preparing payment…" : `Pay ${inr(orderSummary.total)}`}
              </button>
              <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-paper/50 font-mono">
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
              className="bg-white border border-ink/15 max-w-md w-full p-8"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Demo mode — gateway keys pending</p>
              <h2 className="font-display text-3xl font-medium text-ink mb-2">Simulated hosted checkout</h2>
              <p className="text-ink/70 text-sm leading-relaxed mb-6">
                Razorpay keys from Apex IT Solutions are not configured yet, so this is a simulation of the
                hosted payment page. The server-side verification step runs exactly as it will in production.
              </p>
              <div className="border border-ink/10 bg-paper p-4 mb-6 font-mono text-sm flex justify-between">
                <span className="text-ink/60">{demoOrder.course.name}</span>
                <span className="font-medium text-ink">{inr(demoOrder.amount_paise / 100)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  data-testid="demo-pay-success-btn"
                  onClick={() => verifyAndRoute({ order_ref: demoOrder.order_ref, demo_outcome: "success" })}
                  className="flex-1 bg-bull text-white font-mono text-xs uppercase tracking-[0.18em] px-4 py-3.5 hover:bg-ink transition-colors"
                >
                  Simulate success
                </button>
                <button
                  data-testid="demo-pay-fail-btn"
                  onClick={() => verifyAndRoute({ order_ref: demoOrder.order_ref, demo_outcome: "failure" })}
                  className="flex-1 border border-ink/20 text-ink font-mono text-xs uppercase tracking-[0.18em] px-4 py-3.5 hover:border-chart-red hover:text-chart-red transition-colors"
                >
                  Simulate failure
                </button>
              </div>
              <button
                data-testid="demo-checkout-close-btn"
                onClick={() => setDemoOrder(null)}
                className="mt-4 w-full font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted hover:text-ink transition-colors"
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
