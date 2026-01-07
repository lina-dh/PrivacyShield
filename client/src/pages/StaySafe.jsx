import { useState } from "react";

/**
 * StaySafe
 * - “How to keep myself safe online” page.
 * - Includes static guidance + a small mini Q&A (NOT the real scanner).
 * - Why mini Q&A: adds engagement without requiring backend calls here.
 */
export default function StaySafe() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const tips = [
    "Use strong, unique passwords.",
    "Turn on 2FA for important accounts.",
    "Keep your account private if possible.",
    "Do not share codes, addresses, or private photos in DMs.",
    "If pressured: pause, verify, ask an adult/trusted friend.",
  ];

  function handleAsk() {
    // Very simple “rule-based” answer (safe for MVP).
    // Later you could connect this to AI too, if needed.
    const q = question.toLowerCase();
    if (!q.trim()) {
      setAnswer("Write a question first.");
      return;
    }
    if (q.includes("2fa") || q.includes("two factor")) {
      setAnswer(
        "Enable 2FA in account settings → security. Prefer authenticator apps."
      );
      return;
    }
    if (q.includes("private") || q.includes("public")) {
      setAnswer(
        "If unsure, set the account to Private and review who can message/follow you."
      );
      return;
    }
    if (q.includes("link") || q.includes("url")) {
      setAnswer(
        "Avoid unknown links. Use Consult AI to scan messages before clicking."
      );
      return;
    }
    setAnswer(
      "Safe default: pause, don’t click unknown links, and verify through the official app/site."
    );
  }

  return (
    <section className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          How to Stay Safe Online
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Simple steps that reduce risk fast.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold">Checklist</div>
        <ul className="mt-4 space-y-2 text-slate-700">
          {tips.map((t, i) => (
            <li key={i}>• {t}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold">Ask a quick question</div>
        <p className="mt-2 text-sm text-slate-600">
          For scanning real messages and links, use{" "}
          <span className="font-medium">Consult AI</span>.
        </p>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about privacy, 2FA, suspicious messages..."
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />

          <button
            onClick={handleAsk}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Ask
          </button>
        </div>

        {answer && (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {answer}
          </div>
        )}
      </div>
    </section>
  );
}
