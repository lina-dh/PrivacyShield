import { useState } from "react";
import api from "../services/api";

/**
 * ConsultAI (The Advisor)
 * - Allows users to ask general safety questions.
 * - Connects to: POST /api/advisor/ask
 */
export default function ConsultAI() {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]); 
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (!question.trim()) {
      setError("Please write a question first.");
      return;
    }
    setError("");
    setAnswer("");
    setLoading(true);

    try {
      const nextConversation = [
        ...conversation,
        { role: "user", content: question }
      ];

      // שימי לב: זה הנתיב של היועצת
      const response = await api.post("/api/advisor/ask", {
        message: question,
        conversation: nextConversation 
      });

      if (response.data.success) {
        const aiResponse = response.data.response;
        setAnswer(aiResponse);
        setConversation([
            ...nextConversation,
            { role: "assistant", content: aiResponse }
        ]);
      } else {
        setError("The advisor could not understand that. Try again?");
      }

    } catch (err) {
      console.error("Advisor Error:", err);
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-purple-900">
          BeSafe Advisor 👩‍💻
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Ask me anything about digital safety, privacy, or setting up your accounts.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold text-slate-800">Ask a Question</div>
        
        <div className="mt-4 flex flex-col gap-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="e.g., How do I enable 2FA on Instagram? Is this password strong enough?"
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
          />

          {error && (
             <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
               {error}
             </div>
          )}

          <button
            onClick={handleAsk}
            disabled={loading}
            className="self-end rounded-md bg-purple-600 px-6 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors btn-animate"
          >
            {loading ? "Thinking..." : "Ask Advisor"}
          </button>
        </div>

        {answer && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-sm font-bold text-purple-900 mb-2">BeSafe Advisor says:</div>
            <div className="rounded-lg border border-purple-100 bg-purple-50 p-4 text-slate-800 leading-relaxed whitespace-pre-line">
              {answer}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}