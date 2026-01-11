import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * consult AI
 * - No backend here (static tips)
 * - Keeps it simple and teen-friendly
 */
export default function ConsultAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const tips = [
    "Use strong, unique passwords for each account.",
    "Turn on 2FA for important accounts.",
    "Keep accounts private when possible.",
    "Never share verification codes or private photos in DMs.",
    "If you feel pressure: pause, verify, ask a trusted adult.",
  ];

  function handleAsk() {
    const q = question.trim().toLowerCase();
    if (!q) return setAnswer("Write a question first 💗");

    if (q.includes("2fa"))
      return setAnswer(
        "Enable 2FA in Settings → Security. Prefer an authenticator app if possible."
      );
    if (q.includes("private") || q.includes("public"))
      return setAnswer(
        "Set your account to Private and review who can message/follow you."
      );
    if (q.includes("password"))
      return setAnswer(
        "Use a unique password for every app. A password manager can help."
      );
    if (q.includes("link") || q.includes("url"))
      return setAnswer(
        "Don’t click unknown links. Use Consult AI to scan messages first."
      );

    return setAnswer(
      "Safe default: pause, don’t click unknown links, verify in the official app/site."
    );
  }

  return (
    <div className="relative">
      <section className="space-y-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-700 btn-animate"
        >
          ← Back to Home
        </Link>

        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Consult AI
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Essential tips and chat for protecting yourself online.
          </p>
        </header>

        <div className="glass-card p-6">
          <div className="text-xl font-semibold text-slate-900">
            Safety checklist
          </div>
          <ul className="mt-4 space-y-2 text-slate-700">
            {tips.map((t, i) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6">
          <div className="text-xl font-semibold text-slate-900">
            Ask a safety question
          </div>
          <p className="mt-2 text-sm text-slate-600">
            For scanning real messages and links, use{" "}
            <span className="font-medium">StaySafe</span>.
          </p>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a safety question (no links)"
              className="w-full rounded-md border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />

            <button
              onClick={handleAsk}
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 btn-animate"
            >
              Ask
            </button>
          </div>

          {answer && (
            <div className="mt-4 rounded-md border border-slate-200 bg-white/70 p-4 text-sm text-slate-800">
              {answer}
            </div>
          )}
        </div>
      </section>

      <Link to="/consult" className="ai-fab" aria-label="Open Consult AI">
        <span className="ai-fab__robot" aria-hidden="true">
          🤖
        </span>
        <span className="ai-fab__text">Consult AI</span>
      </Link>
    </div>
  );
}
