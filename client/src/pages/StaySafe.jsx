import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * StaySafe (The Link Scanner)
 * - Scans messages for malicious URLs.
 */
export default function StaySafe() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // נשאר בשימוש להצגת שגיאות
  const [isReported, setIsReported] = useState(false);

  // --- פונקציית הסריקה ---
  async function handleAnalyze() {
    setError(""); // איפוס שגיאה
    setResult(null);
    setIsReported(false);

    const trimmed = message.trim();
    if (!trimmed) {
      setError("נא להזין הודעה או לינק לסריקה.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/link-scanner/analyze", { message: trimmed });
      if (!response.data?.success) throw new Error("Backend error");
      setResult(response.data.data);
    } catch (err) {
      console.error(err);
      setError("משהו השתבש בחיבור לשרת. נסי שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  }

  // --- פונקציית הדיווח ---
  async function handleReport() {
    if (!result || isReported) return;
    const urlToReport = result.input?.url;

    if (!urlToReport) {
      alert("לא נמצא לינק לדיווח.");
      return;
    }

    try {
      await api.post("/api/link-scanner/report", {
        url: urlToReport,
        isMalicious: true
      });
      setIsReported(true);
      alert("תודה! הדיווח שלך התקבל והמערכת למדה ממנו. 🧠🛡️");
    } catch (err) {
      console.error(err);
      alert("שגיאה בשליחת הדיווח.");
    }
  }

  // לוגיקה לעיצוב
  const verdict = result?.result?.verdict || "UNKNOWN";
  const reasons = result?.result?.reasons || [];
  const summary = result?.advice?.summary;
  const isSafe = verdict.toLowerCase() === "safe";

  const finalClass = `glass-card p-6 text-white shadow-lg animate-in zoom-in-95 duration-300 ${
    isSafe ? "bg-gradient-to-r from-emerald-600 to-teal-600" : "bg-gradient-to-r from-rose-600 to-pink-700"
  }`;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-800">← חזרה לבית</Link>

      <header className="text-center">
        <h1 className="text-4xl font-bold text-slate-700">סורק לינקים חכם 🔍</h1>
        <p className="mt-2 text-slate-600">הדביקי הודעה חשודה ונבדוק אם היא בטוחה</p>
      </header>

      {/* אזור הקלט */}
      <div className="glass-card p-6 space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="למשל: היי, תראה את התמונה הזאת: http://bit.ly/..."
          className="w-full rounded-lg border border-slate-200 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-300"
        />
        
        {/* הצגת שגיאה במידה ויש - זה פותר את שגיאת ה-Linter על המשתנה error */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? "סורק..." : "בדוק הודעה"}
        </button>
      </div>

      {/* אזור התוצאות והדיווח */}
      {result && (
        <div className="space-y-6">
          <div className={finalClass}>
            <div className="text-2xl font-bold">{isSafe ? "✅ נראה בטוח" : "⚠️ לינק חשוד מאוד"}</div>
            <p className="mt-4 text-lg">{summary}</p>
            {reasons.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm bg-black/10 p-4 rounded-lg">
                {reasons.map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
            )}
          </div>

          {/* חלונית הדיווח שתמיד מופיעה מתחת לתוצאה */}
          <div className="glass-card p-8 border-2 border-dashed border-slate-200 text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-800" dir="rtl">רוצה לדווח על לינק חשוד?</h3>
            <p className="text-slate-600" dir="rtl">הדיווח שלך יתרום לקהילה ויהפוך את ה-AI שלנו לחכם יותר בזמן אמת.</p>
            <button
              onClick={handleReport}
              disabled={isReported}
              className={`px-10 py-4 rounded-full font-black text-lg shadow-xl transition-all transform hover:scale-110 ${
                isReported ? "bg-slate-300 text-slate-500 cursor-default" : "bg-rose-600 text-white animate-pulse"
              }`}
            >
              {isReported ? "הדיווח התקבל! ✅" : "🚨 דווח כלינק זדוני"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}