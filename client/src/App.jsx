import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import HelpResources from "./pages/HelpResources";
import WarningSigns from "./pages/WarningSigns";
import StaySafe from "./pages/StaySafe";
import ConsultAI from "./pages/ConsultAI";

/**
 * App.jsx
 * - All routing lives here.
 * - Navbar stays visible for every page.
 * - Main area is centered + consistent spacing (matches your mockup).
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-soft-cyber text-slate-900 flex flex-col">
        {/* Shared navigation */}
        <Navbar />

        {/* Shared page container */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resources" element={<HelpResources />} />
            <Route path="/warnings" element={<WarningSigns />} />
            <Route path="/protect" element={<StaySafe />} />
            <Route path="/consult" element={<ConsultAI />} />
          </Routes>
        </main>

        {/* Shared footer (optional) */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-5 text-sm text-slate-500">
            BeSafe · QueenB Hackathon · PrivacyShield
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
