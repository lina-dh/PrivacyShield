import { useState } from "react";
import BackToHome from "../components/BackToHome";
import api from "../services/api";
import staySafeIcon from "../assets/staysafe.png";

/**
 * StaySafe - Message/Link Scanner
 * Using the logic from ConsultAI (API integration for scanning)
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
      setError("Please paste the message you received first! 📝");
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
      setError("Something went wrong. Please try again! 🔄");
    } finally {
      setLoading(false);
    }
  }

  const verdict = result?.result?.verdict;
  const riskScore = result?.result?.riskScore;
  const reasons = result?.result?.reasons || [];
  const steps = result?.advice?.twoQuickSteps || [];
  const summary = result?.advice?.summary;

  return (
    <div className="space-y-8">
      <BackToHome />

      <div className="text-center space-y-4">
        <div className="mx-auto w-fit rounded-3xl bg-white/50 backdrop-blur-md p-4 shadow-lg border border-white/40">
          <img
            src={staySafeIcon}
            alt="StaySafe Scanner"
            className="w-52 md:w-64 h-auto object-contain rounded-2xl"
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight pb-2 gradient-text">
          StaySafe Scanner
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          Paste suspicious messages here. Our AI will scan for dangerous links
          and help keep you safe!
        </p>
      </div>

      {/* Scanner Input */}
      <div className="bubble-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#a855f7" strokeWidth="2" />
            <path
              d="m21 21-4.35-4.35"
              stroke="#a855f7"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h2 className="text-xl font-bold text-slate-800">Message Scanner</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="stay-safe-message"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Paste the suspicious message here:
            </label>
            <textarea
              id="stay-safe-message"
              name="message"
              aria-label="Suspicious message input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Paste the message here... 📋"
              className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-200 resize-none"
            />
          </div>

          {error && (
            <div className="bubble-card p-4 border-l-4 border-red-400 bg-red-500/10">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#ef4444">
                  <path d="M8 1 L15 13 L1 13 Z" />
                  <circle cx="8" cy="11" r="1" fill="white" />
                  <rect x="7" y="6" width="2" height="3" fill="white" rx="1" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-8 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl btn-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="animate-spin"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="37.7"
                      strokeDashoffset="37.7"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        dur="1s"
                        values="37.7;0"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                  Scanning...
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="m13 13 2 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Scan Message
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bubble-card p-6 border-l-4 border-purple-400">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              <h3 className="text-xl font-bold text-slate-800">Scan Results</h3>
            </div>

            <div className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800">
              {verdict ? verdict.toUpperCase() : "UNKNOWN"}
              {typeof riskScore === "number" ? ` • Risk ${riskScore}` : ""}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-purple-700 mb-2">
                  Summary
                </h4>
                <p className="text-slate-700">
                  {summary || "No summary available"}
                </p>
              </div>

              {reasons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-purple-700 mb-2">
                    Why this might be risky:
                  </h4>
                  <ul className="space-y-1 text-slate-700">
                    {reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {steps.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-purple-700 mb-2">
                  What to do next:
                </h4>
                <ol className="space-y-2 text-slate-700">
                  {steps.slice(0, 2).map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <details className="mt-6 bubble-card p-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <rect
                  x="2"
                  y="3"
                  width="12"
                  height="10"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <circle cx="8" cy="6" r="1" />
                <rect x="6" y="8" width="4" height="1" rx="0.5" />
                <rect x="6" y="10" width="3" height="1" rx="0.5" />
              </svg>
              Technical Details (Debug Info)
            </summary>
            <pre className="mt-3 overflow-auto text-xs text-slate-600 bg-slate-100 p-3 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
