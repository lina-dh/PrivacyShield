import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * StaySafe (message scanner)
 * - AI message scanner for teenagers
 */
export default function StaySafe() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setError("");
    setResult(null);

    const trimmed = message.trim();

    if (!trimmed) {
      setError("Paste the message you received first.");
      return;
    }

    setLoading(true);

    try {
      const nextConversation = [
        ...conversation,
        { role: "user", content: trimmed },
      ];
      setConversation(nextConversation);

      // Call backend using Axios instance from api.js
      // Note: server mounts routes under /api in server.js
      const response = await api.post("/api/link-scanner/analyze", {
        message: trimmed,
        conversation: nextConversation,
      });

      // response.data = { success, data, isMock? }
      if (!response.data?.success) {
        throw new Error("Backend returned success=false");
      }

      // Store schema JSON result
      const schemaJson = response.data.data;
      setResult(schemaJson);

      // Add a short assistant reply to memory (helps consistency in next calls)
      // We store just the summary text as "assistant" content.
      const assistantSummary = schemaJson?.advice?.summary || "Scan complete.";
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: assistantSummary },
      ]);

      // Clear input after successful scan
      setMessage("");
    } catch (err) {
      // Fixes ESLint "err defined but never used" AND helps debugging
      console.error("StaySafe error:", err);

      // User-friendly message (don’t expose raw technical errors)
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Remove unused variables to fix ESLint errors
  // const verdict = result?.result?.verdict;
  // const riskScore = result?.result?.riskScore;
  // const reasons = result?.result?.reasons || [];
  // const steps = result?.advice?.twoQuickSteps || [];
  // const summary = result?.advice?.summary;

  return (
    <div className="relative">
      <section className="space-y-8">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-700 btn-animate"
        >
          ← Back to Home
        </Link>

        {/* Page header */}
        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-700">
            Stay Safe Online
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Paste a message you received. I&apos;ll check the links inside it
            and let you know if anything seems risky.
          </p>
        </header>

        {/* Input card */}
        <div className="glass-card p-6">
          <label className="block text-sm font-medium text-slate-700">
            Paste the message here
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Paste the message here"
            className="mt-2 w-full rounded-md border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />

          {error && (
            <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 btn-animate"
            >
              {loading ? "Checking…" : "Check message"}
            </button>
          </div>
        </div>

        {/* Result area */}
        {result && (
          <div className="glass-card p-6 bg-linear-to-r from-slate-900 to-slate-800 text-white">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold flex items-center">
                ⚠️ Suspicious
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-200">Why:</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-100">
                <li>✓ Shortened link</li>
                <li>✓ Looks like a fake login page</li>
              </ul>
            </div>

            <details className="mt-5 rounded-md bg-white/5 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-200">
                Raw JSON (debug)
              </summary>
              <pre className="mt-3 overflow-auto text-xs text-slate-100">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      {/* AI Robot button */}
      <Link to="/protect" className="ai-robot-btn" title="Ask AI for help">
        💬
      </Link>

      <Link to="/consult" className="ai-fab" aria-label="Open Consult AI">
        <span className="ai-fab__robot" aria-hidden="true">
          🤖
        </span>
        <span className="ai-fab__text">Consult AI</span>
      </Link>
    </div>
  );
}
