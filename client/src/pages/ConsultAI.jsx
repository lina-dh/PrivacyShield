import { useState } from "react";
import api from "../services/api"; // <-- use YOUR existing axios instance

/**
 * ConsultAI
 * - This is the MVP “AI agent” page for Link Scanner.
 *
 * Backend contract:
 * ✅ POST /api/link-scanner/analyze
 * Body: { message: string, conversation: [{role, content}] }
 * Response: { success: boolean, data: <fixed schema JSON>, isMock?: boolean }
 */
export default function ConsultAI() {
  // The message the user pastes (may contain URL(s))
  const [message, setMessage] = useState("");

  // Agent memory: we store last user/assistant messages here
  // and send them to backend each request (so model has context).
  const [conversation, setConversation] = useState([]);

  // Server result (fixed JSON schema lives inside `data`)
  const [result, setResult] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Sends the message + memory to the backend.
   * Backend will:
   * - extract URLs (if any)
   * - analyze the most relevant one
   * - return JSON with fixed fields (schema prompt)
   */
  async function handleAnalyze() {
    setError("");
    setResult(null);

    const trimmed = message.trim();

    // Basic frontend validation (prevents empty requests)
    if (!trimmed) {
      setError("Paste the message you received first.");
      return;
    }

    setLoading(true);

    try {
      // Prepare the next conversation (include the new user message)
      // We do this so that the backend sees this message in "history" too.
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
      // ✅ Fixes ESLint "err defined but never used" AND helps debugging
      console.error("ConsultAI error:", err);

      // User-friendly message (don’t expose raw technical errors)
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Extract commonly used fields for rendering (safe optional chaining)
  const verdict = result?.result?.verdict;
  const riskScore = result?.result?.riskScore;
  const reasons = result?.result?.reasons || [];
  const steps = result?.advice?.twoQuickSteps || [];
  const summary = result?.advice?.summary;

  return (
    <section className="space-y-8">
      {/* Page header */}
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Consult AI</h1>
        <p className="mt-3 text-lg text-slate-600">
          Paste a suspicious message. We’ll scan links inside it and suggest
          next steps.
        </p>
      </header>

      {/* Input card (clean, not crowded) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">
          Message to check
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Paste the message here…"
          className="mt-2 w-full rounded-md border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        />

        {/* Error bubble */}
        {error && (
          <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Checking…" : "Check message"}
          </button>
        </div>

        {/* Small dev note for future (optional) */}
        <p className="mt-3 text-xs text-slate-500 text-center">
          Tip: This sends <code>{`{ message, conversation }`}</code> to the
          backend.
        </p>
      </div>

      {/* Result area: slightly “AI-y” but still clean */}
      {result && (
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Result</div>

            {/* Pill for verdict + score */}
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              {verdict ? verdict.toUpperCase() : "—"}
              {typeof riskScore === "number" ? ` · Risk ${riskScore}` : ""}
            </div>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {/* Summary + reasons */}
            <div>
              <div className="text-sm font-semibold text-slate-200">
                Summary
              </div>
              <p className="mt-2 text-sm text-slate-100">{summary || "—"}</p>

              <div className="mt-4 text-sm font-semibold text-slate-200">
                Reasons
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-100">
                {reasons.length ? (
                  reasons.map((r, i) => <li key={i}>{r}</li>)
                ) : (
                  <li>—</li>
                )}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <div className="text-sm font-semibold text-slate-200">
                Next steps
              </div>
              <ol className="mt-2 space-y-2 text-sm text-slate-100">
                {steps.slice(0, 2).map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Optional: raw JSON for demo/debug.
              Keep this hidden behind <details> so UI stays clean. */}
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
  );
}
