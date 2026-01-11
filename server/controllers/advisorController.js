import OpenAI from "openai";
// שימי לב: אנחנו מייבאים את הפרומפט הספציפי של היועצת מהמיקום החדש
import { ADVISOR_SYSTEM_PROMPT } from "../utils/prompts/advisorPrompts.js";

export const getAdvice = async (req, res) => {
  try {
    const { message, conversation } = req.body;

    // בדיקה בסיסית שיש הודעה
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // --- Mock Mode (מצב דמו - עובד גם בלי כסף) ---
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY.includes("your_key_here")
    ) {
      console.log("Mock Advisor responding to:", message);
      return res.status(200).json({
        success: true,
        isMock: true,
        response:
          "זהו מצב דמו: אני יועצת הבטיחות BeSafe. כרגע אני במצב פיתוח, אבל זיהיתי ששאלת על: " +
          message,
      });
    }

    // --- Real AI Mode ---
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // בניית ההיסטוריה - כדי שהיא תזכור מה דיברנו קודם
    // (אם אין היסטוריה, נתחיל רשימה ריקה)
    const chatHistory = conversation || [];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: ADVISOR_SYSTEM_PROMPT }, // המוח של היועצת
        ...chatHistory, // הזיכרון
        { role: "user", content: message }, // השאלה החדשה
      ],
      temperature: 0.7, // יצירתיות מאוזנת (לא רובוטי מדי, לא הוזה מדי)
    });

    // החזרת התשובה לקליינט
    res.status(200).json({
      success: true,
      response: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Advisor Error:", error.message);
    res.status(500).json({ error: "Failed to get advice from AI" });
  }
};
