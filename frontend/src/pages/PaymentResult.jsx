import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import Confetti from "@/components/Confetti";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function PaymentResult() {
  const [params] = useSearchParams();
  const status = params.get("status");
  const ref = params.get("ref");
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(!!ref);

  useEffect(() => {
    if (!ref) return;
    axios
      .get(`${API}/orders/${ref}`)
      .then((res) => setEnrollment(res.data.enrollment))
      .catch(() => setEnrollment(null))
      .finally(() => setLoading(false));
  }, [ref]);

  const success = status === "success" && enrollment?.status === "paid";

  return (
    <div className="bg-[#050505] text-zinc-200 min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-[#050505]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center">
          <Link to="/" data-testid="result-home-link" className="font-display text-xl font-bold tracking-tight text-white">
            One Stock Academy
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        {!loading && success && <Confetti />}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
          data-testid="payment-result-card"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3 text-zinc-500" data-testid="result-loading">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-mono text-xs uppercase tracking-[0.18em]">Checking enrollment…</span>
            </div>
          ) : success ? (
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 sm:p-12" data-testid="payment-success-panel">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-6" strokeWidth={1.5} />
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-green-500 mb-3">
                Payment verified · Enrollment confirmed
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                Welcome aboard, {enrollment.name.split(" ")[0]}.
              </h1>
              <div className="border border-white/10 bg-white/5 p-5 space-y-3 font-mono text-sm mb-8">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Reference</span>
                  <span className="text-white" data-testid="enrollment-ref">{enrollment.order_ref}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Course</span>
                  <span className="text-white text-right">{enrollment.course_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Paid</span>
                  <span className="text-white font-semibold" data-testid="enrollment-amount">{inr(enrollment.amount_inr)}</span>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                {enrollment.course_id === "online"
                  ? "Your batch schedule and student portal access details will be sent to your email shortly."
                  : "Your classroom batch details and start date will be sent to your email shortly."}
              </p>
              <Link
                to="/"
                data-testid="success-home-btn"
                className="group inline-flex items-center gap-2 bg-white text-black font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 hover:bg-zinc-200 transition-colors"
              >
                Back to home
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 sm:p-12" data-testid="payment-failed-panel">
              <XCircle className="w-12 h-12 text-red-500 mb-6" strokeWidth={1.5} />
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-red-500 mb-3">
                Payment not completed
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                No charge went through.
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                The payment could not be verified, so no enrollment was created and no money has been
                captured for a failed order. If an amount was debited, gateways typically auto-reverse
                it within a few working days.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/enroll"
                  data-testid="retry-payment-btn"
                  className="inline-flex items-center gap-2 bg-white text-black font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 hover:bg-zinc-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try again
                </Link>
                <Link
                  to="/"
                  data-testid="failed-home-btn"
                  className="inline-flex items-center gap-2 border border-white/20 text-white font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 hover:border-white transition-colors"
                >
                  Back to home
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <footer className="border-t border-white/10 py-6">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-6">
          Trading involves risk · Education only, not investment advice
        </p>
      </footer>
    </div>
  );
}
