import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * StaySafe (The Link Scanner)
 * - Scans messages for malicious URLs.
 * - Connects to: POST /api/link-scanner/analyze
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

      const response = await api.post("/api/link-scanner/analyze", {
        message: trimmed,
        conversation: nextConversation,
      });

      if (!response.data?.success) {
        throw new Error("Backend returned success=false");
      }

      const schemaJson = response.data.data;
      setResult(schemaJson);

      const assistantSummary = schemaJson?.advice?.summary || "Scan complete.";
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: assistantSummary },
      ]);

      setMessage("");
    } catch (err) {
      console.error("Scanner error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // חילוץ נתונים
  const verdict = result?.result?.verdict || "UNKNOWN"; 
  const reasons = result?.result?.reasons || [];
  const summary = result?.advice?.summary;
  
  // עיצוב דינמי
  const isSafe = verdict.toLowerCase() === "safe";
  
  // תיקון: חיבור מחרוזות פשוט כדי למנוע שגיאות Parsing
  const baseClasses = "glass-card p-6 text-white shadow-lg animate-in zoom-in-95 duration-300 ";
  const colorClasses = isSafe 
    ? "bg-gradient-to-r from-emerald-600 to-teal-600" 
    : "bg-gradient-to-r from-rose-600 to-pink-700";
    
  const finalClass = baseClasses + colorClasses;

  const icon = isSafe ? "✅" : "⚠️";
  const titleText = isSafe ? "Likely Safe" : "Suspicious / Risky";

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
          <h1 className="text-4xl font-semibold tracking-tight text-slate-700">
            Link Scanner 🔍
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Paste a suspicious message below. I&apos;ll check if it&apos;s safe.
          </p>
        </header>

        {/* Input Area */}
        <div className="glass-card p-6">
          <label className="block text-sm font-medium text-slate-700">
            Paste the message here
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="e.g: Hey, look at this weird photo: http://bit.ly/..."
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
              {loading ? "Scanning..." : "Check message"}
            </button>
          </div>
        </div>

        {/* Result Area */}
        {result && (
          <div className={finalClass}>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold flex items-center gap-2">
                <span>{icon}</span> {titleText}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold text-white/90 uppercase tracking-wide opacity-80">
                Analysis:
              </div>
              <p className="mt-1 text-lg font-medium">
                {summary}
              </p>

              {reasons.length > 0 && (
                <div className="mt-4 bg-black/20 rounded-lg p-4">
                  <div className="text-sm font-semibold mb-2">Why?</div>
                  <ul className="space-y-1 text-sm text-white/90">
                    {reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span>•</span> {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <details className="mt-5 rounded-md bg-black/10 p-2">
              <summary className="cursor-pointer text-xs font-semibold text-white/70 hover:text-white">
                View Raw Data (Debug)
              </summary>
              <pre className="mt-3 overflow-auto text-xs text-white/80 p-2">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>
    </div>
  );
}