import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, Loader2, LogOut, RefreshCcw, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("osa_admin") || "");
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async (t) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/enrollments`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setRows(res.data.enrollments);
    } catch {
      sessionStorage.removeItem("osa_admin");
      setToken("");
      setRows(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load(token);
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, { password });
      sessionStorage.setItem("osa_admin", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("osa_admin");
    setToken("");
    setRows(null);
  };

  const paid = rows?.filter((r) => r.status === "paid").length ?? 0;
  const revenue = rows?.filter((r) => r.status === "paid").reduce((s, r) => s + r.amount_inr, 0) ?? 0;

  return (
    <div className="bg-[#050505] text-zinc-200 min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-[#050505]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <Link to="/" data-testid="admin-back-link" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> One Stock Academy
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">Admin</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 sm:px-10 py-14">
        {!token ? (
          <motion.form
            onSubmit={login}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm mx-auto mt-16 border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8"
            data-testid="admin-login-form"
          >
            <Lock className="w-6 h-6 text-zinc-500 mb-5" strokeWidth={1.5} />
            <h1 className="font-display text-3xl font-bold text-white mb-2">Admin access</h1>
            <p className="text-zinc-400 text-sm mb-8">Enter the admin password to view registered students.</p>
            <input
              type="password"
              data-testid="admin-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              required
              className="w-full border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/60 rounded-none mb-4"
            />
            <button
              type="submit"
              data-testid="admin-login-btn"
              disabled={loading}
              className="w-full bg-white text-black font-mono text-xs uppercase tracking-[0.18em] px-6 py-4 hover:bg-zinc-200 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Sign in
            </button>
          </motion.form>
        ) : (
          <div data-testid="admin-dashboard">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Registered Students</p>
                <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">Enrollments</h1>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => load(token)}
                  data-testid="admin-refresh-btn"
                  className="flex items-center gap-2 border border-white/20 text-white font-mono text-[11px] uppercase tracking-[0.18em] px-5 py-3 hover:border-white transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> Refresh
                </button>
                <button
                  onClick={logout}
                  data-testid="admin-logout-btn"
                  className="flex items-center gap-2 border border-white/20 text-zinc-400 font-mono text-[11px] uppercase tracking-[0.18em] px-5 py-3 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                ["Total", rows?.length ?? 0],
                ["Paid", paid],
                ["Revenue (demo)", inr(revenue)],
              ].map(([label, val]) => (
                <div key={label} className="border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6" data-testid={`stat-${label.toLowerCase().replace(/[^a-z]/g, "-")}`}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">{label}</p>
                  <p className="font-mono text-xl sm:text-2xl font-semibold text-white">{val}</p>
                </div>
              ))}
            </div>

            {loading && !rows ? (
              <div className="flex items-center gap-3 text-zinc-500 py-16 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-mono text-xs uppercase tracking-[0.18em]">Loading…</span>
              </div>
            ) : (
              <div className="border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-x-auto">
                <table className="w-full text-sm font-mono" data-testid="admin-table">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      <th className="px-5 py-4">Reference</th>
                      <th className="px-5 py-4">Student</th>
                      <th className="px-5 py-4">Contact</th>
                      <th className="px-5 py-4">Course</th>
                      <th className="px-5 py-4 text-right">Amount</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows?.map((r) => (
                      <tr key={r.order_ref} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors" data-testid={`row-${r.order_ref}`}>
                        <td className="px-5 py-4 text-white whitespace-nowrap">{r.order_ref}</td>
                        <td className="px-5 py-4 text-white">{r.name}</td>
                        <td className="px-5 py-4 text-zinc-400">
                          <div>{r.email}</div>
                          <div className="text-zinc-600 text-xs">{r.phone}</div>
                        </td>
                        <td className="px-5 py-4 text-zinc-400 whitespace-nowrap">{r.course_id === "online" ? "Online" : "Offline"}</td>
                        <td className="px-5 py-4 text-white text-right">{inr(r.amount_inr)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 border ${
                              r.status === "paid"
                                ? "text-green-500 border-green-500/40"
                                : r.status === "failed"
                                ? "text-red-500 border-red-500/40"
                                : "text-zinc-400 border-white/15"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-zinc-500 whitespace-nowrap text-xs">
                          {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
