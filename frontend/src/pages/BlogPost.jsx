import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import { ArrowLeft, Link2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogExtensions } from "@/components/BlogExtension";
import useSeo, { SITE_URL, SITE_NAME, absUrl } from "@/hooks/useSeo";

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

// Builds every SEO tag + the JSON-LD schema from the blog's admin fields.
function buildSeo(blog) {
  if (!blog) return null;
  const url = blog.canonical_url || `${SITE_URL}/blog/${blog.slug}`;
  const title = blog.meta_title || `${blog.title} | ${SITE_NAME}`;
  const description = blog.meta_description || blog.excerpt || "";
  const image = absUrl(blog.og_image || blog.cover_image);
  const published = blog.published_at || blog.created_at;
  const modified = blog.updated_at || published;
  const keywords = [...new Set(
    [blog.focus_keyword, ...(blog.secondary_keywords || "").split(","), ...(blog.tags || "").split(",")]
      .map((k) => (k || "").trim()).filter(Boolean)
  )].join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": blog.schema_type || "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: (blog.h1 || blog.title).slice(0, 110),
    description,
    ...(image ? { image: [image] } : {}),
    author: { "@type": "Person", name: blog.author || SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-brand.png` },
    },
    datePublished: published,
    dateModified: modified,
    ...(keywords ? { keywords } : {}),
    ...(blog.category ? { articleSection: blog.category } : {}),
  };

  return {
    title,
    description,
    canonical: url,
    robots: (blog.index_status || "index") === "noindex" ? "noindex, follow" : "index, follow",
    image,
    type: "article",
    ogTitle: blog.og_title || title,
    ogDescription: blog.og_description || description,
    publishedTime: published,
    modifiedTime: modified,
    author: blog.author || SITE_NAME,
    section: blog.category,
    jsonLd,
  };
}

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [more, setMore] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | notfound

  const seo = useMemo(() => buildSeo(blog), [blog]);
  useSeo(seo);

  useEffect(() => {
    setState("loading");
    setBlog(null);
    window.scrollTo(0, 0);

    fetch(`${API}/blogs/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setBlog(d.blog); setState("ready"); })
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

  const published = blog && (blog.published_at || blog.created_at);
  const showUpdated =
    blog && blog.updated_at && published &&
    new Date(blog.updated_at) - new Date(published) > 24 * 3600 * 1000;

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
            <header className="mb-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-5">
                {blog.category && <>{blog.category} · </>}
                {fmtDate(published)} · {readingTime(blog.content)} min read
              </p>
              {/* The ONLY h1 on the page */}
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                {blog.h1 || blog.title}
              </h1>
              {blog.excerpt && (
                <p className="text-xl text-paper/70 leading-relaxed">{blog.excerpt}</p>
              )}
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
                By {blog.author || SITE_NAME}
                {showUpdated && <> · Updated {fmtDate(blog.updated_at)}</>}
              </p>
            </header>

            {blog.cover_image && (
              <img
                src={blog.cover_image}
                alt={blog.cover_alt || blog.title}
                className="w-full aspect-[16/9] object-cover border border-white/10 mb-12"
              />
            )}

            <BlogContent key={blog.blog_id + blog.updated_at} html={blog.content} />

            {blog.tags && (
              <p className="mt-10 flex flex-wrap gap-2">
                {blog.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                  <span key={t} className="border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-paper/60">
                    {t}
                  </span>
                ))}
              </p>
            )}

            <footer className="mt-12 pt-6 border-t border-white/10">
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
                    {fmtDate(b.published_at || b.created_at, "short")}
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