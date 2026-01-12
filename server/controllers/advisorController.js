import OpenAI from "openai";
// שימי לב: אנחנו מייבאים את הפרומפט הספציפי של היועצת
import { ADVISOR_SYSTEM_PROMPT } from '../utils/prompts/advisorPrompts.js';

export const getAdvice = async (req, res) => {
    try {
        // אנחנו מקבלים שני דברים מהלקוח:
        // 1. message: ההודעה החדשה שהמשתמשת כתבה עכשיו
        // 2. conversation: רשימה של כל ההודעות הקודמות (כדי שיהיה ל-AI זיכרון)
        const { message, conversation } = req.body;

        // בדיקה בסיסית שיש הודעה
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // --- Mock Mode (מצב דמו - אם אין מפתח אמיתי או במצב פיתוח) ---
        // זה חשוב כדי שלא נבזבז כסף בבדיקות או אם ה-API Key לא מוגדר
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_key_here')) {
            console.log("Mock Advisor responding to:", message);
            
            // דימוי של השהייה (כאילו ה-AI חושב)
            await new Promise(resolve => setTimeout(resolve, 1000));

            return res.status(200).json({
                success: true,
                response: "זהו מצב דמו (Mock): אני מבינה ששאלת על '" + message + "'. מכיוון שאין לי כרגע מפתח OpenAI תקין, אני עונה תשובה אוטומטית, אבל המערכת עובדת מצוין מבחינת המבנה!"
            });
        }

        // --- Real AI Mode (מצב אמיתי) ---
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // בניית ההיסטוריה לשיחה
        // אנחנו לוקחים את ההיסטוריה שהגיעה מהלקוח, ומוודאים שהיא מערך
        const chatHistory = conversation || []; 

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: ADVISOR_SYSTEM_PROMPT }, // המוח: ההנחיות ליועצת
                ...chatHistory, // הזיכרון: מה נאמר עד עכשיו
                { role: "user", content: message } // ההווה: השאלה החדשה
            ],
            temperature: 0.7, // יצירתיות
        });

        // החזרת התשובה לקליינט
        res.status(200).json({
            success: true,
            response: response.choices[0].message.content
        });

    } catch (error) {
        console.error("Advisor Error:", error.message);
        res.status(500).json({ error: "Failed to get advice from AI" });
    }
};