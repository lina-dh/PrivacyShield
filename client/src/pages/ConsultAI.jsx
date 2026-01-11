import { useState } from "react";
import BackToHome from "../components/BackToHome";
import consultIcon from "../assets/consult.png";

/**
 * ConsultAI - Chat UI for safety advice
 * Using the logic from StaySafe (Q&A functionality)
 */
export default function ConsultAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const tips = [
    "Use strong, unique passwords for each account",
    "Turn on 2FA for important accounts",
    "Keep your social media private when possible",
    "Never share codes, addresses, or private photos in DMs",
    "If pressured: pause, verify, ask a trusted adult",
  ];

  function handleAsk() {
    const q = question.toLowerCase();
    if (!q.trim()) {
      setAnswer("Please write a question first! 😊");
      return;
    }
    if (q.includes("2fa") || q.includes("two factor")) {
      setAnswer(
        "Enable 2FA in account settings → security. Use authenticator apps like Google Authenticator instead of SMS when possible!"
      );
      return;
    }
    if (q.includes("private") || q.includes("public")) {
      setAnswer(
        "Set your account to Private and review who can message/follow you. Check your privacy settings regularly!"
      );
      return;
    }
    if (q.includes("link") || q.includes("url")) {
      setAnswer(
        "Never click suspicious links! Use our StaySafe scanner to check messages before clicking anything."
      );
      return;
    }
    setAnswer(
      "Safe default: pause, don't click unknown links, and verify through the official app/website. When in doubt, ask a trusted adult!"
    );
  }

  return (
    <div className="space-y-8">
      <BackToHome />

      <div className="text-center space-y-4">
        <div className="mx-auto w-fit rounded-3xl bg-white/50 backdrop-blur-md p-4 shadow-lg border border-white/40">
          <img
            src={consultIcon}
            alt="Consult AI"
            className="w-52 md:w-64 h-auto object-contain rounded-2xl"
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight pb-2 gradient-text">
          Consult AI
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          Your AI safety advisor! Ask me anything about staying safe online.
        </p>
      </div>

      {/* Safety Tips */}
      <div className="bubble-card p-6 hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-center gap-3 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#f59e0b" />
            <path
              d="M12 8 L12 12 L16 16"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h2 className="text-xl font-bold text-slate-800">
            Quick Safety Tips
          </h2>
        </div>
        <ul className="space-y-3 text-slate-700">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-purple-500 mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Interface */}
      <div className="bubble-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="robot-wave"
          >
            <circle cx="12" cy="8" r="4" fill="#a855f7" />
            <circle cx="10" cy="7" r="1" fill="white" />
            <circle cx="14" cy="7" r="1" fill="white" />
            <path
              d="M10 9 Q12 10 14 9"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <rect x="8" y="14" width="8" height="4" rx="2" fill="#a855f7" />
            <circle cx="10" cy="16" r="0.5" fill="white" />
            <circle cx="14" cy="16" r="0.5" fill="white" />
          </svg>
          <h2 className="text-xl font-bold text-slate-800">Ask Me Anything</h2>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          For scanning suspicious messages and links, use our StaySafe scanner!
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about privacy, 2FA, suspicious messages..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-200"
              onKeyPress={(e) => e.key === "Enter" && handleAsk()}
            />
            <button
              onClick={handleAsk}
              className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl btn-hover flex items-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M2 2 L14 8 L2 14 L4 8 Z" />
              </svg>
              Ask AI
            </button>
          </div>

          {answer && (
            <div className="bubble-card p-4 border-l-4 border-purple-400">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="6" r="3" fill="#a855f7" />
                  <circle cx="8" cy="5" r="0.8" fill="white" />
                  <circle cx="12" cy="5" r="0.8" fill="white" />
                  <path
                    d="M8 7 Q10 8 12 7"
                    stroke="white"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                  <rect
                    x="6"
                    y="11"
                    width="8"
                    height="4"
                    rx="2"
                    fill="#a855f7"
                  />
                  <circle cx="8" cy="13" r="0.5" fill="white" />
                  <circle cx="12" cy="13" r="0.5" fill="white" />
                </svg>
                <div>
                  <p className="font-semibold text-purple-600 text-sm mb-1">
                    AI Assistant
                  </p>
                  <p className="text-slate-700">{answer}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
