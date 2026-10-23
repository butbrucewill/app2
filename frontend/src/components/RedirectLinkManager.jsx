import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

// Pages / sections the admin can attach a link to. Edit these lists to match your site.
const PAGES = ["Home page", "Blog page", "Enrollment page", "Course page", "Contact page"];
const SECTIONS = ["Hero banner", "Navbar", "Footer", "Blog sidebar", "Inside blog post", "Popup"];

const EMPTY = {
  link_id: null,
  title: "",
  slug: "",
  destination_url: "",
  page: PAGES[0],
  section: SECTIONS[0],
  button_label: "",
  is_active: true,
};

const slugify = (t) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

const compact = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : String(n);

const inputCls =
  "w-full bg-black/40 border border-white/10 px-4 py-3 text-paper text-sm outline-none focus:border-brand";

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

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-paper/40 mt-1">{hint}</span>}
    </label>
  );
}

const isValidUrl = (u) => {
  try {
    const p = new URL(u);
    return p.protocol === "http:" || p.protocol === "https:";
  } catch {
    return false;
  }
};

/** Use inside Admin once logged in:  <RedirectLinkManager token={token} /> */
export default function RedirectLinkManager({ token }) {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/links`, { headers });
      if (!res.ok) throw new Error();
      setLinks((await res.json()).links);
    } catch {
      toast.error("Could not load links");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const reset = () => { setForm(EMPTY); setSlugTouched(false); };

  const onTitle = (v) =>
    setForm((f) => ({ ...f, title: v, ...(!slugTouched && !f.link_id ? { slug: slugify(v) } : {}) }));

  const startEdit = (l) => {
    setSlugTouched(true);
    setForm({ ...EMPTY, ...l });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (form.title.trim().length < 2) return toast.error("Add a link title");
    if (!form.slug) return toast.error("Add a short URL slug");
    if (!isValidUrl(form.destination_url)) return toast.error("Destination must start with http:// or https://");
    setSaving(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { link_id, clicks, created_at, updated_at, ...fields } = form;
      const res = await fetch(
        form.link_id ? `${API}/admin/links/${form.link_id}` : `${API}/admin/links`,
        { method: form.link_id ? "PUT" : "POST", headers, body: JSON.stringify(fields) }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.detail === "string" ? err.detail : "Save failed");
      }
      toast.success(form.link_id ? "Link updated" : "Link created");
      reset();
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (l) => {
    const next = !l.is_active;
    setLinks((arr) => arr.map((x) => (x.link_id === l.link_id ? { ...x, is_active: next } : x)));
    const res = await fetch(`${API}/admin/links/${l.link_id}`, {
      method: "PUT", headers, body: JSON.stringify({ is_active: next }),
    });
    if (!res.ok) { toast.error("Could not update"); load(); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this link permanently? The short URL will stop working.")) return;
    const res = await fetch(`${API}/admin/links/${id}`, { method: "DELETE", headers });
    if (res.ok) { toast.success("Deleted"); if (form.link_id === id) reset(); load(); }
    else toast.error("Delete failed");
  };

  const copy = async (slug) => {
    try {
      await navigator.clipboard.writeText(`${origin}/go/${slug}`);
      toast.success("Short link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const total = links.length;
  const active = links.filter((l) => l.is_active).length;
  const clicks = links.reduce((s, l) => s + (l.clicks || 0), 0);

  return (
    <div data-testid="link-admin" className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[["Total links", total], ["Active links", active], ["Total clicks", compact(clicks)]].map(([label, val]) => (
          <div key={label} className="border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">{label}</p>
            <p className="font-mono text-xl sm:text-3xl font-semibold text-white">{val}</p>
          </div>
        ))}
      </div>

      {/* Form card */}
      <Section
        title={form.link_id ? "Edit link" : "Create a link"}
        hint="Visitors open /go/your-slug and are redirected to the destination. Clicks are counted."
      >
        <Field label="Link title">
          <input className={inputCls} placeholder="Free Webinar" value={form.title}
                 onChange={(e) => onTitle(e.target.value)} />
        </Field>

        <Field label="Short URL slug"
               hint={form.link_id ? "⚠ Changing the slug breaks links already shared." : "Auto-filled from the title."}>
          <div className="flex items-center">
            <span className="px-3 py-3 border border-r-0 border-white/10 bg-white/5 text-paper/50 text-sm">/go/</span>
            <input className={inputCls} placeholder="free-webinar" value={form.slug}
                   onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
          </div>
        </Field>

        <Field label="Destination URL">
          <input className={inputCls} placeholder="https://example.com/register" value={form.destination_url}
                 onChange={(e) => set("destination_url", e.target.value.trim())} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Website page">
            <select className={inputCls} value={form.page} onChange={(e) => set("page", e.target.value)}>
              {PAGES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Section">
            <select className={inputCls} value={form.section} onChange={(e) => set("section", e.target.value)}>
              {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Button label">
          <input className={inputCls} placeholder="Register Now" value={form.button_label}
                 onChange={(e) => set("button_label", e.target.value)} />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer text-sm text-paper">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)}
                 className="w-4 h-4 accent-white" />
          Publish link immediately
        </label>

        <div className="flex justify-end gap-3 pt-2">
          {(form.link_id || form.title || form.slug || form.destination_url) && (
            <button type="button" onClick={reset}
                    className="border border-white/20 text-paper px-5 py-2.5 font-mono text-xs uppercase tracking-widest hover:border-white">
              {form.link_id ? "Cancel edit" : "Clear"}
            </button>
          )}
          <button type="button" disabled={saving} onClick={save}
                  className="bg-brand text-black px-5 py-2.5 font-mono text-xs uppercase tracking-widest disabled:opacity-50">
            {saving ? "Saving…" : form.link_id ? "Update link" : "Create link"}
          </button>
        </div>
      </Section>

      {/* List */}
      <Section title="All links">
        {loading ? (
          <p className="text-paper/60">Loading…</p>
        ) : links.length === 0 ? (
          <p className="text-paper/60">No links yet. Create your first one above.</p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {links.map((l) => (
              <li key={l.link_id} className="border border-white/10 bg-black/30 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white truncate">{l.title}</p>
                    <button type="button" onClick={() => copy(l.slug)}
                            title="Copy short link"
                            className="font-mono text-[11px] text-brand hover:underline truncate max-w-full">
                      /go/{l.slug}
                    </button>
                  </div>
                  <span className={`shrink-0 text-[10px] font-mono uppercase tracking-[0.15em] px-2.5 py-1 border ${
                    l.is_active ? "text-green-500 border-green-500/40" : "text-zinc-400 border-white/15"}`}>
                    {l.is_active ? "Active" : "Off"}
                  </span>
                </div>

                <p className="text-xs text-paper/50 truncate">→ {l.destination_url}</p>

                <p className="font-mono text-[10px] uppercase tracking-widest text-paper/50">
                  {l.page} · {l.section}
                  {l.button_label && <> · “{l.button_label}”</>}
                  {" · "}{compact(l.clicks || 0)} clicks
                </p>

                <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-widest pt-1">
                  <button onClick={() => toggle(l)} className="h-9 px-3 border border-white/20 text-paper hover:border-white">
                    {l.is_active ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => startEdit(l)} className="h-9 px-3 border border-white/20 text-paper hover:border-white">Edit</button>
                  <button onClick={() => remove(l.link_id)} className="h-9 px-3 border border-red-500/40 text-red-400">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}