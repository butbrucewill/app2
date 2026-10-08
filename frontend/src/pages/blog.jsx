import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useSeo from "@/hooks/useSeo";

const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

// Constant object: the hook only re-applies when this content changes.
const BLOG_INDEX_SEO = {
  title: "Stock Market & Trading Blog | One Stock Academy",
  description:
    "Learn stock market fundamentals, technical analysis, trading psychology and risk management with practical articles from One Stock Academy.",
  robots: "index, follow",
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | error

  useSeo(BLOG_INDEX_SEO);

  useEffect(() => {
    fetch(`${API}/blogs`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setBlogs(d.blogs); setState("ready"); })
      .catch(() => setState("error"));
  }, []);

  return (
    <div data-testid="blog-page" className="bg-[#050505] text-paper min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 pt-36 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Blog</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
          The One Stock Academy Trading Journal
        </h1>
        <p className="text-lg text-paper/70 leading-relaxed max-w-3xl mb-14">
          Market fundamentals, technical analysis, trading psychology and risk management —
          simplified into practical lessons for traders and investors.
        </p>

        {state === "loading" && <p className="text-paper/60">Loading articles…</p>}
        {state === "error" && <p className="text-paper/60">Couldn't load articles. Please try again shortly.</p>}
        {state === "ready" && blogs.length === 0 && <p className="text-paper/60">New articles are coming soon.</p>}

        <div data-testid="blog-grid" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <Link
              key={b.blog_id}
              to={`/blog/${b.slug}`}
              data-testid={`blog-card-${b.slug}`}
              className="group flex flex-col border border-white/10 bg-white/[0.02] hover:border-brand/60 transition-colors"
            >
              <div className="aspect-[16/9] overflow-hidden bg-white/5">
                {b.cover_image ? (
                  <img src={b.cover_image} alt={b.cover_alt || b.title} loading="lazy"
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-paper/30">
                    One Stock Academy
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand mb-3">
                  {b.category && <>{b.category} · </>}
                  {new Date(b.published_at || b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <h2 className="font-display text-xl text-white leading-snug mb-3">{b.title}</h2>
                {b.excerpt && <p className="text-sm text-paper/60 leading-relaxed line-clamp-3 mb-5">{b.excerpt}</p>}
                <span className="mt-auto font-mono text-xs uppercase tracking-widest text-paper/80 group-hover:text-brand">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}