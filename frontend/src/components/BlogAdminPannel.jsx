import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import BlogEditor from "./BlogEditor";

const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

const EMPTY = { blog_id: null, title: "", excerpt: "", cover_image: "", content: "", status: "draft" };

const inputCls =
  "w-full bg-black/40 border border-white/10 px-4 py-3 text-paper text-sm outline-none focus:border-brand";

const iconBtn =
  "w-9 h-9 flex items-center justify-center border border-white/20 text-paper hover:border-white disabled:opacity-25 disabled:cursor-not-allowed";

/**
 * Use inside your Admin page once logged in:  <BlogAdminPanel token={token} />
 * (Paste this into your BlogAdminPannel.jsx file; keep your own filename/export.)
 */
export default function BlogAdminPanel({ token }) {
  const [blogs, setBlogs] = useState([]);
  const [draft, setDraft] = useState(null); // null = list view, object = editing
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

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

  const edit = async (id) => {
    const res = await fetch(`${API}/admin/blogs/${id}`, { headers });
    if (!res.ok) return toast.error("Could not open blog");
    setDraft((await res.json()).blog);
  };

  const save = async (status, html) => {
    if (draft.title.trim().length < 3) return toast.error("Add a title (3+ characters)");
    setSaving(true);
    try {
      const body = JSON.stringify({
        title: draft.title,
        excerpt: draft.excerpt,
        cover_image: draft.cover_image,
        content: html ?? draft.content,
        status,
      });
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
  // Saves the full order (first = shown first on the public Blog page).
  const persistOrder = async (next) => {
    setBlogs(next); // update the screen immediately
    try {
      const res = await fetch(`${API}/admin/blogs-order`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ids: next.map((b) => b.blog_id) }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order saved");
    } catch {
      toast.error("Couldn't save the order");
      load(); // fall back to what the server has
    }
  };

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= blogs.length) return;
    const next = [...blogs];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  };

  const moveToTop = (index) => {
    if (index === 0) return;
    const next = [...blogs];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    persistOrder(next);
  };

  /* ---------------- Editor view ---------------- */
  if (draft) {
    return (
      <div data-testid="blog-admin-editor" className="space-y-5">
        <button className="font-mono text-xs uppercase tracking-widest text-paper/60 hover:text-white"
                onClick={() => setDraft(null)}>
          ← Back to all blogs
        </button>

        <input className={`${inputCls} text-xl font-display`} placeholder="Blog title"
               value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />

        <textarea className={inputCls} rows={2} maxLength={400}
                  placeholder="Short summary shown on the blog card (max 400 chars)"
                  value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />

        <input className={inputCls} placeholder="Cover image URL (https://...) — optional"
               value={draft.cover_image} onChange={(e) => setDraft({ ...draft, cover_image: e.target.value })} />

        {/* key forces a fresh editor when switching between posts.
            The Post / Save draft buttons live inside the editor component. */}
        <BlogEditor
          key={draft.blog_id || "new"}
          initialContent={draft.content}
          onChange={(html) => setDraft((d) => ({ ...d, content: html }))}
          onPost={(html) => save("published", html)}
          onSaveDraft={(html) => save("draft", html)}
          postLabel={draft.status === "published" ? "Update post" : "Post blog"}
          busy={saving}
        />
      </div>
    );
  }

  /* ---------------- List view ---------------- */
  return (
    <div data-testid="blog-admin-list" className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">Blogs</h2>
        <button onClick={() => setDraft({ ...EMPTY })}
                className="bg-brand text-black px-5 py-2.5 font-mono text-xs uppercase tracking-widest">
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
                <span className={`font-mono text-sm w-8 shrink-0 ${i === 0 ? "text-brand" : "text-paper/40"}`}>
                  #{i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-white truncate">{b.title}</p>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-paper/50 mt-1">
                    <span className={b.status === "published" ? "text-brand" : ""}>{b.status}</span>
                    {" · "}{new Date(b.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest">
                <button title="Move up" aria-label="Move up" className={iconBtn}
                        disabled={i === 0} onClick={() => move(i, -1)}>▲</button>
                <button title="Move down" aria-label="Move down" className={iconBtn}
                        disabled={i === blogs.length - 1} onClick={() => move(i, 1)}>▼</button>
                <button title="Show first" disabled={i === 0} onClick={() => moveToTop(i)}
                        className="h-9 px-3 border border-white/20 text-paper hover:border-white disabled:opacity-25 disabled:cursor-not-allowed">
                  Top
                </button>
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