// This function handles the actual logic of analyzing text
export const analyzeText = (req, res) => {
    
    // Extract the "text" field from the incoming request body
    const { text } = req.body;

    // Log the message to the server console to verify it arrived
    console.log("Chef received text for analysis:", text);

    // Basic validation: Check if text actually exists
    if (!text) {
        return res.status(400).json({ 
            error: "No text provided to the chef!" 
        });
    }

    // Success response: This is where the ChatGPT call will happen later
    res.status(200).json({
        message: "The brain is working! I received your text.",
        dataReceived: text
    });
};