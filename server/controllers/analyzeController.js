import OpenAI from "openai";

// Logic for analyzing text - handles communication with ChatGPT
export const analyzeText = async (req, res) => {
    try {
        // 1. Get user input from the request
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "No text provided" });
        }

        console.log("Analyzing text (Mock Mode):", text);

        // 2. SAFETY CHECK: If no real API key is found, return a fake response to prevent server crash
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_key_here')) {
            return res.status(200).json({
                success: true,
                analysis: "Placeholder: Once a real API Key is added, you will see actual AI results here!",
                isMock: true
            });
        }

        // 3. Connect to OpenAI and request a safety analysis
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a safety assistant. Analyze the text for danger." },
                { role: "user", content: text }
            ],
        });

        // 4. Return the AI analysis result to the frontend
        res.status(200).json({
            success: true,
            analysis: response.choices[0].message.content
        });

    } catch (error) {
        // 5. Error handling - prevents the server from stopping if the API fails
        console.error("OpenAI Error:", error.message);
        res.status(500).json({ error: "API connection failed, check your API key or network." });
    }
};