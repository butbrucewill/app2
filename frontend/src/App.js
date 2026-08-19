import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import PageWipe from "@/components/PageWipe";
import Home from "@/pages/Home";
import BuyCourse from "@/pages/BuyCourse";
import PaymentResult from "@/pages/PaymentResult";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWipe><Home /></PageWipe>} />
        <Route path="/enroll" element={<PageWipe><BuyCourse /></PageWipe>} />
        <Route path="/payment/result" element={<PageWipe><PaymentResult /></PageWipe>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
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
