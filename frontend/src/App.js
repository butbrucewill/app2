import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import PageWipe from "@/components/PageWipe";
import Home from "@/pages/Home";
import BuyCourse from "@/pages/BuyCourse";
import PaymentResult from "@/pages/PaymentResult";
import Admin from "@/pages/Admin";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWipe><Home /></PageWipe>} />
        <Route path="/enroll" element={<PageWipe><BuyCourse /></PageWipe>} />
        <Route path="/payment/result" element={<PageWipe><PaymentResult /></PageWipe>} />
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
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
