import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import PageWipe from "@/components/PageWipe";
import FloatingActions from "@/components/FloatingActions";
import Home from "@/pages/Home";
import MediaCoverage from "@/pages/MediaCoverage";
import GlobalMarket from "@/pages/GlobalMarket";
import Admin from "@/pages/Admin";
import AboutUs from "@/pages/AboutUs";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/BlogPost";
import Buniyaad from "@/pages/buniyaad";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

function SeoMetadata() {
  const location = useLocation();

  useEffect(() => {
    const siteUrl = "https://onestockacademy.com";
    const normalizedPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
    const canonicalUrl = `${siteUrl}${normalizedPath}`;
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute("href", canonicalUrl);
  }, [location.pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes location={location}>
      <Route path="/" element={<PageWipe><Home /></PageWipe>} />
      <Route path="/media-coverage" element={<PageWipe><MediaCoverage /></PageWipe>} />
      <Route path="/global-market" element={<PageWipe><GlobalMarket /></PageWipe>} />
      <Route path="/about" element={<PageWipe><AboutUs /></PageWipe>} />
      <Route path="/blog" element={<PageWipe><Blog /></PageWipe>} />
      <Route path="/blog/:slug" element={<PageWipe><BlogPost /></PageWipe>} />
      <Route path="/privacy-policy" element={<PageWipe><PrivacyPolicy /></PageWipe>} />
      <Route path="/buniyaad" element={<PageWipe><Buniyaad/></PageWipe>}/>
      <Route path="/admin" element={<PageWipe><Admin /></PageWipe>} />
      <Route path="/blog/:slug" element={<PageWipe><div style={{ color: "#fff", padding: 140 }}>ROUTE OK</div></PageWipe>} />
      {/* Catch-all: an unmatched URL shows this instead of a blank black page */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">404</p>
            <h1 className="font-display text-3xl">Page not found</h1>
            <p className="text-zinc-400 text-sm">{location.pathname}</p>
            <a href="/" className="mt-4 border border-white/30 px-5 py-3 font-mono text-xs uppercase tracking-widest">Go home</a>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    let frame;
    const raf = (t) => {
      lenis.raf(t);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <SeoMetadata />
        <AnimatedRoutes />
        <FloatingActions />
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;