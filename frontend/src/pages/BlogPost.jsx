import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import { ArrowLeft, Link2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogExtensions } from "@/components/BlogExtension";

import "@/components/BlogEditor.css";
import "@/components/BlogReader.css";

const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

const fmtDate = (iso, month = "long") =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month, year: "numeric" });

const readingTime = (html = "") => {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// Read-only TipTap: renders the admin's HTML with the same schema as the editor,
// so image alignment / width / text-wrap look exactly like they did while writing.
function BlogContent({ html }) {
  const editor = useEditor({
    extensions: getBlogExtensions({ editable: false }),
    content: html,
    editable: false,
    editorProps: { attributes: { class: "blog-editor-content blog-reader" } },
  });
  return <EditorContent editor={editor} />;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [more, setMore] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | notfound

  useEffect(() => {
    setState("loading");
    setBlog(null);
    window.scrollTo(0, 0);

    fetch(`${API}/blogs/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setBlog(d.blog);
        setState("ready");
        document.title = `${d.blog.title} | One Stock Academy`;
      })
      .catch(() => setState("notfound"));

    fetch(`${API}/blogs`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setMore(d.blogs.filter((b) => b.slug !== slug).slice(0, 3)))
      .catch(() => setMore([]));
  }, [slug]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <div data-testid="blog-post-page" className="bg-[#050505] text-paper min-h-screen">
      <Navbar />

      {/* ---------- Article ---------- */}
      <main className="max-w-3xl mx-auto px-6 sm:px-10 pt-36 pb-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All articles
        </Link>

        {state === "loading" && <p className="mt-12 text-paper/60">Loading article…</p>}

        {state === "notfound" && (
          <div className="mt-12" data-testid="blog-not-found">
            <h1 className="font-display text-3xl text-white mb-3">Article not found</h1>
            <p className="text-paper/60">It may have been moved or unpublished.</p>
          </div>
        )}

        {state === "ready" && blog && (
          <article className="mt-10" data-testid="blog-article">
            {/* Header */}
            <header className="mb-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-5">
                {fmtDate(blog.created_at)} · {readingTime(blog.content)} min read
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="text-xl text-paper/70 leading-relaxed">{blog.excerpt}</p>
              )}
            </header>

            {blog.cover_image && (
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full aspect-[16/9] object-cover border border-white/10 mb-12"
              />
            )}

            {/* Body (key remounts the reader when navigating between posts) */}
            <BlogContent key={blog.blog_id + blog.updated_at} html={blog.content} />

            {/* Footer */}
            <footer className="mt-16 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
                  One Stock Academy
                </span>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/80 hover:border-white hover:text-white transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" /> Copy link
                </button>
              </div>
              <p className="text-xs text-paper/40 leading-relaxed">
                Trading involves substantial risk of loss. One Stock Academy provides education only —
                nothing here is investment advice or a promise of returns.
              </p>
            </footer>
          </article>
        )}
      </main>

      {/* ---------- More articles ---------- */}
      {state === "ready" && more.length > 0 && (
        <section className="border-t border-white/10 bg-white/[0.02]" data-testid="blog-more">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-8">
              More articles
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((b) => (
                <Link
                  key={b.blog_id}
                  to={`/blog/${b.slug}`}
                  className="group border border-white/10 bg-white/[0.02] hover:border-brand/60 transition-colors p-6 flex flex-col"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50 mb-3">
                    {fmtDate(b.created_at, "short")}
                  </p>
                  <h3 className="font-display text-lg text-white leading-snug mb-3">{b.title}</h3>
                  {b.excerpt && (
                    <p className="text-sm text-paper/60 line-clamp-2 mb-4">{b.excerpt}</p>
                  )}
                  <span className="mt-auto font-mono text-xs uppercase tracking-widest text-paper/80 group-hover:text-brand">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}