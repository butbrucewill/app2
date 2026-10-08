import { useEffect } from "react";

export const SITE_URL = "https://onestockacademy.com";
export const SITE_NAME = "One Stock Academy";

export const absUrl = (u) =>
  !u ? "" : /^https?:\/\//i.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`;

/**
 * Sets <title>, meta description, canonical, robots, Open Graph, Twitter and JSON-LD
 * for the current page and restores/removes them when the page unmounts.
 * Pass `null` to do nothing (e.g. while data is still loading).
 *
 * seo = { title, description, canonical, robots, image, type, ogTitle, ogDescription,
 *         publishedTime, modifiedTime, author, section, jsonLd }
 */
export default function useSeo(seo) {
  const key = seo ? JSON.stringify(seo) : "";

  useEffect(() => {
    if (!seo) return undefined;
    const undo = [];

    const meta = (attr, name, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (el) {
        const prev = el.getAttribute("content");
        undo.push(() => el.setAttribute("content", prev ?? ""));
      } else {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
        undo.push(() => el.remove());
      }
      el.setAttribute("content", content);
    };

    if (seo.title) {
      const prevTitle = document.title;
      document.title = seo.title;
      undo.push(() => { document.title = prevTitle; });
    }

    if (seo.canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", seo.canonical);
    }

    const image = absUrl(seo.image);
    meta("name", "description", seo.description);
    meta("name", "robots", seo.robots);

    meta("property", "og:site_name", SITE_NAME);
    meta("property", "og:type", seo.type || "website");
    meta("property", "og:url", seo.canonical);
    meta("property", "og:title", seo.ogTitle || seo.title);
    meta("property", "og:description", seo.ogDescription || seo.description);
    meta("property", "og:image", image);

    meta("name", "twitter:card", image ? "summary_large_image" : "summary");
    meta("name", "twitter:title", seo.ogTitle || seo.title);
    meta("name", "twitter:description", seo.ogDescription || seo.description);
    meta("name", "twitter:image", image);

    meta("property", "article:published_time", seo.publishedTime);
    meta("property", "article:modified_time", seo.modifiedTime);
    meta("property", "article:author", seo.author);
    meta("property", "article:section", seo.section);

    if (seo.jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "1");
      script.text = JSON.stringify(seo.jsonLd);
      document.head.appendChild(script);
      undo.push(() => script.remove());
    }

    return () => undo.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}