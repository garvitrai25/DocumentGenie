import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateChatResponse(
  userQuery: string,
  documentChunks: string[],
  chatHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare context from document chunks
    const context = documentChunks.length > 0 
      ? `Based on the following document content:\n\n${documentChunks.join("\n\n")}\n\n`
      : "";

    // Prepare chat history
    const historyContext = chatHistory.length > 0
      ? `Previous conversation:\n${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join("\n")}\n\n`
      : "";

    const prompt = `${historyContext}${context}User question: ${userQuery}

Please provide a helpful and accurate response based on the document content provided. If the question cannot be answered from the document content, politely explain that the information is not available in the provided documents.`;

    return response.text || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI response. Please try again later.");
  }
}

export async function summarizeDocument(text: string): Promise<string> {
  try {
    const prompt = `Please provide a concise summary of the following document content, highlighting the key points and main themes:\n\n${text}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text || "Summary could not be generated.";
  } catch (error) {
    console.error("Document summarization error:", error);
    throw new Error("Failed to summarize document.");
  }
}
