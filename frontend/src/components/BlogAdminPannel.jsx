import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BlogEditor from "./BlogEditor";

const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

const todayStr = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  blog_id: null,
  title: "", h1: "", slug: "", excerpt: "",
  category: "", tags: "", author: "One Stock Academy", published_at: todayStr(), updated_at: "",
  cover_image: "", cover_alt: "",
  meta_title: "", meta_description: "", focus_keyword: "", secondary_keywords: "",
  canonical_url: "", index_status: "index", schema_type: "BlogPosting",
  og_title: "", og_description: "", og_image: "",
  content: "", status: "draft",
};

// Turns whatever the API returns (null / "" / missing fields on old posts) into a safe form state.
const normalize = (b) => {
  const out = { ...EMPTY };
  Object.keys(EMPTY).forEach((k) => { if (b[k] !== undefined && b[k] !== null) out[k] = b[k]; });
  out.blog_id = b.blog_id;
  out.author = b.author || EMPTY.author;
  out.index_status = b.index_status || "index";
  out.schema_type = b.schema_type || "BlogPosting";
  out.published_at = String(b.published_at || b.created_at || EMPTY.published_at).slice(0, 10);
  return out;
};

const slugify = (t) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);

const inputCls =
  "w-full bg-black/40 border border-white/10 px-4 py-3 text-paper text-sm outline-none focus:border-brand";
const iconBtn =
  "w-9 h-9 flex items-center justify-center border border-white/20 text-paper hover:border-white disabled:opacity-25 disabled:cursor-not-allowed";

function Section({ title, hint, children }) {
  return (
    <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6 space-y-4">
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">{title}</h3>
        {hint && <p className="text-xs text-paper/50 mt-1">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, counter, children }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60">{label}</span>
        {counter}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-paper/40 mt-1">{hint}</span>}
    </label>
  );
}

const Counter = ({ value, max }) => (
  <span className={`font-mono text-[10px] ${value.length > max ? "text-red-400" : value.length ? "text-green-400" : "text-paper/30"}`}>
    {value.length}/{max}
  </span>
);

/** URL box + "Upload" button (uses POST /api/admin/upload) + preview */
function ImageInput({ value, onChange, token, placeholder }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Upload failed");
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className={inputCls} placeholder={placeholder || "https://… or upload"} value={value}
               onChange={(e) => onChange(e.target.value)} />
        <button type="button" disabled={busy} onClick={() => fileRef.current?.click()}
                className="shrink-0 border border-white/20 px-4 font-mono text-[11px] uppercase tracking-widest text-paper hover:border-white disabled:opacity-50">
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
               onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      {value && <img src={value} alt="" className="h-24 border border-white/10 object-cover" />}
    </div>
  );
}

/**
 * Use inside your Admin page once logged in:  <BlogAdminPanel token={token} />
 * (Paste into your BlogAdminPanel.jsx; keep your own filename / default export.)
 */
export default function BlogAdminPanel({ token }) {
  const [blogs, setBlogs] = useState([]);
  const [draft, setDraft] = useState(null); // null = list view, object = editing
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/blogs`, { headers });
      if (!res.ok) throw new Error();
      setBlogs((await res.json()).blogs);
    } catch {
      toast.error("Could not load blogs");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const startNew = () => { setSlugTouched(false); setDraft({ ...EMPTY, published_at: todayStr() }); };

  const edit = async (id) => {
    const res = await fetch(`${API}/admin/blogs/${id}`, { headers });
    if (!res.ok) return toast.error("Could not open blog");
    setSlugTouched(true); // never auto-change the slug of an existing post
    setDraft(normalize((await res.json()).blog));
  };

  const onTitle = (v) =>
    setDraft((d) => ({ ...d, title: v, ...(!slugTouched && !d.blog_id ? { slug: slugify(v) } : {}) }));

  const save = async (status, html) => {
    if (draft.title.trim().length < 3) return toast.error("Add a title (3+ characters)");
    setSaving(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { blog_id, updated_at, ...fields } = draft;
      const body = JSON.stringify({ ...fields, content: html ?? draft.content, status });
      const res = await fetch(
        draft.blog_id ? `${API}/admin/blogs/${draft.blog_id}` : `${API}/admin/blogs`,
        { method: draft.blog_id ? "PUT" : "POST", headers, body }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.detail === "string" ? err.detail : "Save failed");
      }
      toast.success(status === "published" ? "Blog published" : "Draft saved");
      setDraft(null);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this blog permanently?")) return;
    const res = await fetch(`${API}/admin/blogs/${id}`, { method: "DELETE", headers });
    if (res.ok) { toast.success("Deleted"); load(); } else toast.error("Delete failed");
  };

  /* ---------------- Ordering ---------------- */
  const persistOrder = async (next) => {
    setBlogs(next);
    try {
      const res = await fetch(`${API}/admin/blogs-order`, {
        method: "PUT", headers, body: JSON.stringify({ ids: next.map((b) => b.blog_id) }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order saved");
    } catch {
      toast.error("Couldn't save the order");
      load();
    }
  };
  const move = (i, dir) => {
    const t = i + dir;
    if (t < 0 || t >= blogs.length) return;
    const next = [...blogs];
    [next[i], next[t]] = [next[t], next[i]];
    persistOrder(next);
  };
  const moveToTop = (i) => {
    if (i === 0) return;
    const next = [...blogs];
    const [item] = next.splice(i, 1);
    next.unshift(item);
    persistOrder(next);
  };

  /* ---------------- Editor view ---------------- */
  if (draft) {
    const isNew = !draft.blog_id;
    return (
      <div data-testid="blog-admin-editor" className="space-y-6">
        <button className="font-mono text-xs uppercase tracking-widest text-paper/60 hover:text-white"
                onClick={() => setDraft(null)}>
          ← Back to all blogs
        </button>

        <Section title="1 · Basics">
          <Field label="Blog title">
            <input className={`${inputCls} text-lg font-display`} placeholder="Best Stock Trading Courses for Beginners"
                   value={draft.title} onChange={(e) => onTitle(e.target.value)} />
          </Field>

          <Field label="H1 (page heading)" hint="Optional. Leave empty to use the blog title. The page has exactly one H1; use H2/H3 inside the content.">
            <input className={inputCls} value={draft.h1} onChange={(e) => set("h1", e.target.value)} />
          </Field>

          <Field label="URL slug" hint={isNew
            ? "Auto-filled from the title. Edit it for a cleaner URL."
            : "⚠ Changing the slug changes the live URL; old links and shares will stop working."}>
            <div className="flex items-center">
              <span className="px-3 py-3 border border-r-0 border-white/10 bg-white/5 text-paper/50 text-sm">/blog/</span>
              <input className={inputCls} value={draft.slug}
                     onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }}
                     placeholder="best-stock-trading-courses-for-beginners" />
            </div>
          </Field>

          <Field label="Short summary (card + fallback description)" counter={<Counter value={draft.excerpt} max={400} />}>
            <textarea className={inputCls} rows={2} maxLength={400} value={draft.excerpt}
                      onChange={(e) => set("excerpt", e.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <input className={inputCls} placeholder="Stock Market / Trading" value={draft.category}
                     onChange={(e) => set("category", e.target.value)} />
            </Field>
            <Field label="Tags (comma separated)">
              <input className={inputCls} placeholder="Trading, Beginners" value={draft.tags}
                     onChange={(e) => set("tags", e.target.value)} />
            </Field>
            <Field label="Author">
              <input className={inputCls} value={draft.author} onChange={(e) => set("author", e.target.value)} />
            </Field>
            <Field label="Publish date" hint={draft.updated_at
              ? `Last updated: ${new Date(draft.updated_at).toLocaleString()} (automatic)`
              : "Update date is set automatically on every save."}>
              <input type="date" className={inputCls} value={draft.published_at}
                     onChange={(e) => set("published_at", e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="2 · Featured image">
          <Field label="Image (upload or URL)">
            <ImageInput value={draft.cover_image} onChange={(v) => set("cover_image", v)} token={token} />
          </Field>
          <Field label="Image alt text" hint="Describe the image, e.g. “Stock trading course for beginners”.">
            <input className={inputCls} value={draft.cover_alt} onChange={(e) => set("cover_alt", e.target.value)} />
          </Field>
        </Section>

        <Section title="3 · SEO" hint="What Google shows in search results.">
          <Field label="Meta title" counter={<Counter value={draft.meta_title} max={60} />}
                 hint="Empty = “<title> | One Stock Academy”.">
            <input className={inputCls} value={draft.meta_title} onChange={(e) => set("meta_title", e.target.value)}
                   placeholder="Best Stock Trading Courses for Beginners | OneStock Academy" />
          </Field>
          <Field label="Meta description" counter={<Counter value={draft.meta_description} max={155} />}
                 hint="Empty = the short summary.">
            <textarea className={inputCls} rows={3} value={draft.meta_description}
                      onChange={(e) => set("meta_description", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Focus keyword">
              <input className={inputCls} value={draft.focus_keyword} onChange={(e) => set("focus_keyword", e.target.value)} />
            </Field>
            <Field label="Secondary keywords (comma separated)">
              <input className={inputCls} value={draft.secondary_keywords} onChange={(e) => set("secondary_keywords", e.target.value)} />
            </Field>
            <Field label="Canonical URL" hint="Optional. Empty = this post's own URL.">
              <input className={inputCls} placeholder="https://…" value={draft.canonical_url}
                     onChange={(e) => set("canonical_url", e.target.value)} />
            </Field>
            <Field label="Search engine visibility" hint="Noindex hides it from Google and removes it from the sitemap.">
              <select className={inputCls} value={draft.index_status} onChange={(e) => set("index_status", e.target.value)}>
                <option value="index">Index (default)</option>
                <option value="noindex">Noindex</option>
              </select>
            </Field>
            <Field label="Schema type">
              <select className={inputCls} value={draft.schema_type} onChange={(e) => set("schema_type", e.target.value)}>
                <option value="BlogPosting">BlogPosting</option>
                <option value="Article">Article</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="4 · Social sharing (Open Graph)" hint="Empty fields fall back to the meta title, description and featured image.">
          <Field label="OG title">
            <input className={inputCls} value={draft.og_title} onChange={(e) => set("og_title", e.target.value)} />
          </Field>
          <Field label="OG description">
            <textarea className={inputCls} rows={2} value={draft.og_description}
                      onChange={(e) => set("og_description", e.target.value)} />
          </Field>
          <Field label="OG image (1200×630 recommended)">
            <ImageInput value={draft.og_image} onChange={(v) => set("og_image", v)} token={token} />
          </Field>
        </Section>

        <Section title="5 · Content" hint="Use H2/H3 for sections. The title above is the page's H1.">
          {/* key forces a fresh editor when switching between posts */}
          <BlogEditor
            key={draft.blog_id || "new"}
            initialContent={draft.content}
            onChange={(html) => set("content", html)}
            onPost={(html) => save("published", html)}
            onSaveDraft={(html) => save("draft", html)}
            postLabel={draft.status === "published" ? "Update post" : "Post blog"}
            busy={saving}
          />
        </Section>
      </div>
    );
  }

  /* ---------------- List view ---------------- */
  return (
    <div data-testid="blog-admin-list" className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">Blogs</h2>
        <button onClick={startNew} className="bg-brand text-black px-5 py-2.5 font-mono text-xs uppercase tracking-widest">
          + New blog
        </button>
      </div>

      {blogs.length > 1 && (
        <p className="text-sm text-paper/50">
          This order is the order on the public Blog page: <span className="text-white">#1 is shown first</span>.
          Use the arrows or “Top” to rearrange. New posts start at #1.
        </p>
      )}

      {loading ? (
        <p className="text-paper/60">Loading…</p>
      ) : blogs.length === 0 ? (
        <p className="text-paper/60">No blogs yet. Write your first one.</p>
      ) : (
        <ul className="divide-y divide-white/10 border border-white/10">
          {blogs.map((b, i) => (
            <li key={b.blog_id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className={`font-mono text-sm w-8 shrink-0 ${i === 0 ? "text-brand" : "text-paper/40"}`}>#{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-white truncate">{b.title}</p>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-paper/50 mt-1">
                    <span className={b.status === "published" ? "text-brand" : ""}>{b.status}</span>
                    {b.index_status === "noindex" && <span className="text-amber-400"> · noindex</span>}
                    {" · "}{new Date(b.published_at || b.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest">
                <button title="Move up" aria-label="Move up" className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)}>▲</button>
                <button title="Move down" aria-label="Move down" className={iconBtn} disabled={i === blogs.length - 1} onClick={() => move(i, 1)}>▼</button>
                <button title="Show first" disabled={i === 0} onClick={() => moveToTop(i)}
                        className="h-9 px-3 border border-white/20 text-paper hover:border-white disabled:opacity-25 disabled:cursor-not-allowed">Top</button>
                {b.status === "published" && (
                  <a href={`/blog/${b.slug}`} target="_blank" rel="noreferrer"
                     className="h-9 px-3 flex items-center border border-white/20 text-paper">View</a>
                )}
                <button onClick={() => edit(b.blog_id)} className="h-9 px-3 border border-white/20 text-paper">Edit</button>
                <button onClick={() => remove(b.blog_id)} className="h-9 px-3 border border-red-500/40 text-red-400">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}