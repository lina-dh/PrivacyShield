import { useState, useRef, useEffect } from "react";
import api from "../services/api";

/**
 * ConsultAI (Chat Interface)
 * רכיב המאפשר שיחה רציפה עם יועצת הבטיחות.
 * מדמה ממשק צ'אט (כמו וואטסאפ) עם היסטוריה.
 */
export default function ConsultAI() {
  // State: שומר את מה שהמשתמש מקליד כרגע בתיבת הטקסט
  const [currentInput, setCurrentInput] = useState("");
  
  // State: שומר את כל היסטוריית השיחה (מערך של הודעות)
  // דוגמה למבנה: [{ role: 'user', content: 'היי' }, { role: 'assistant', content: 'שלום!' }]
  const [messages, setMessages] = useState([]);
  
  // State: האם אנחנו מחכים לתשובה?
  const [loading, setLoading] = useState(false);
  
  // Ref: הפניה לסוף הצ'אט כדי שנוכל לגלול למטה אוטומטית כשיש הודעה חדשה
  const messagesEndRef = useRef(null);

  // פונקציה שגוללת למטה אוטומטית בכל פעם שההודעות משתנות
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]); // רץ כשנוספת הודעה או כשהסטטוס טעינה משתנה

  async function handleAsk() {
    // 1. בדיקה שהמשתמש לא מנסה לשלוח הודעה ריקה
    if (!currentInput.trim()) return;

    // 2. יצירת אובייקט ההודעה החדשה של המשתמש
    const newUserMessage = { role: "user", content: currentInput };

    // 3. עדכון ה-UI *מיד* (כדי שהמשתמש יראה את ההודעה שלו עולה למסך)
    // אנחנו יוצרים מערך חדש המכיל את כל מה שהיה קודם + ההודעה החדשה
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    // 4. ניקוי שדה הקלט
    setCurrentInput("");
    setLoading(true);

    try {
      // 5. שליחת הבקשה לשרת
      // אנחנו שולחים את ההודעה החדשה (message)
      // ואת *ההיסטוריה הקודמת* (messages) כדי שהבוט ידע על מה דיברנו קודם
      const response = await api.post("/api/advisor/ask", {
        message: newUserMessage.content,
        conversation: messages // שולחים את ההיסטוריה *לפני* ההודעה הנוכחית (או כולל, תלוי איך השרת בנוי. כאן שלחנו את הישנה והשרת יצרף)
      });

      if (response.data.success) {
        // 6. קבלת התשובה והוספתה לצ'אט
        const aiResponseContent = response.data.response;
        const newAiMessage = { role: "assistant", content: aiResponseContent };

        // עדכון המערך שוב: ההיסטוריה + תשובת ה-AI
        setMessages((prev) => [...prev, newAiMessage]);
      } else {
        // טיפול במקרה שהשרת מחזיר שגיאה לוגית
        setMessages((prev) => [
            ...prev, 
            { role: "assistant", content: "סליחה, הייתה בעיה בהבנת השאלה. נסי שוב?" }
        ]);
      }

    } catch (err) {
      console.error("Advisor Error:", err);
      // הודעת שגיאה ידידותית בתוך הצ'אט
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "אופס, יש בעיית תקשורת. בדקי את האינטרנט שלך." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // טיפול בלחיצה על Enter כדי לשלוח
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // מניעת ירידת שורה
      handleAsk();
    }
  };

  return (
    <section className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto p-4">
      {/* כותרת */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-purple-900">
          BeSafe Advisor 👩‍💻
        </h1>
        <p className="text-slate-600">
          היועצת האישית שלך לבטיחות ברשת. אפשר לשאול הכל!
        </p>
      </header>

      {/* אזור הצ'אט - המקום בו ההודעות מופיעות */}
      <div className="flex-1 overflow-y-auto p-4 bg-white border border-slate-200 rounded-xl shadow-sm mb-4 space-y-4">
        
        {/* הודעת פתיחה דיפולטיבית אם אין הודעות */}
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            <p>היי! אני כאן לעזור. תוכלי לשאול אותי:</p>
            <ul className="mt-2 text-sm list-disc list-inside">
                <li>איך אני מחזקת את הסיסמה שלי?</li>
                <li>מישהו מציק לי באינסטגרם, מה עושים?</li>
                <li>איך בודקים אם הקישור הזה מסוכן?</li>
            </ul>
          </div>
        )}

        {/* לולאה שרצה על כל ההודעות ומציירת אותן */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              dir="rtl"
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-br-none' // עיצוב למשתמש (סגול כהה)
                  : 'bg-purple-50 text-slate-800 border border-purple-100 rounded-bl-none' // עיצוב ל-AI (בהיר)
                }`}
            >
              {msg.role === 'assistant' && <strong className="block mb-1 text-purple-900 font-semibold">BeSafe Advisor</strong>}
              {msg.content}
            </div>
          </div>
        ))}

        {/* אינדיקציה שהבוט מקליד */}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-slate-100 text-slate-500 rounded-2xl px-4 py-3 text-sm animate-pulse">
                מקלידה... 💬
             </div>
          </div>
        )}
        
        {/* אלמנט בלתי נראה כדי לגלול אליו */}
        <div ref={messagesEndRef} />
      </div>

      {/* אזור הקלט - איפה שכותבים */}
      <div className="flex gap-2">
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          dir="rtl"
          placeholder="כתבי כאן את השאלה שלך..."
          className="flex-1 resize-none rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          rows={1}
          style={{ minHeight: '50px' }} // גובה התחלתי
        />
        <button
          onClick={handleAsk}
          disabled={loading || !currentInput.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? "..." : "שלח"}
        </button>
      </div>
    </section>
  );
}