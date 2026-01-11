import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FloatingAI from "./components/FloatingAI";

// Pages
import HomePage from "./pages/HomePage";
import HelpResources from "./pages/HelpResources";
import WarningSigns from "./pages/WarningSigns";
import StaySafe from "./pages/StaySafe";
import ConsultAI from "./pages/ConsultAI";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resources" element={<HelpResources />} />
            <Route path="/warnings" element={<WarningSigns />} />
            <Route path="/protect" element={<StaySafe />} />
            <Route path="/consult" element={<ConsultAI />} />
          </Routes>
        </main>

        <footer className="text-center py-8 mt-8">
          <span className="text-slate-600 font-medium">
            BeSafe • QueenB Hackathon 2026
          </span>
        </footer>
        <FloatingAI />
      </div>
    </BrowserRouter>
  );
}
