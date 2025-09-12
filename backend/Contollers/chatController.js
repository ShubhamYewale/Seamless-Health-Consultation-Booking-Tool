import genAI from "../Config/geminiConfig.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Select the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Send the prompt
    const result = await model.generateContent(
      `You are a helpful medical assistant for Healify app. User says: ${message}`
    );

    // Extract the text response
    const reply = result.response.text();

    res.json({ reply });

  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
