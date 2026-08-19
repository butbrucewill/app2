import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import BuyCourse from "@/pages/BuyCourse";
import PaymentResult from "@/pages/PaymentResult";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enroll" element={<BuyCourse />} />
          <Route path="/payment/result" element={<PaymentResult />} />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
