import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import PageWipe from "@/components/PageWipe";
import FloatingActions from "@/components/FloatingActions";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWipe><Home /></PageWipe>} />
        <Route path="/admin" element={<PageWipe><Admin /></PageWipe>} />
      </Routes>
    </AnimatePresence>
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
        <AnimatedRoutes />
        <FloatingActions />
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
