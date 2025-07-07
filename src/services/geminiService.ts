import { GoogleGenAI } from "@google/genai";

// Vite exposes env variables on import.meta.env, but TS may not know the type. Cast import.meta as any to access env.
const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_API_KEY });

export const getChatResponse = async (documentContext: string, question: string): Promise<string> => {
  try {
    const systemInstruction = `You are an expert assistant for analyzing documents. Your task is to answer questions based ONLY on the content of the document provided.

Follow these rules strictly:
1.  The response must be based exclusively on the text from the document context below. Do not use any external knowledge.
2.  No conversational filler must be included in the response.
3.  Response MUST ONLY include the verbatim information relevant to the question from the document context.
4.  Structure the responses with headings, sub-headings, section headings, lists.
5.  If the answer is not found in the document, you MUST respond with the exact phrase: "The answer to this question is not found in the provided document".
6.  Format the responses using Markdown format.

  
--- DOCUMENT CONTENT ---
${documentContext}
--- END OF DOCUMENT CONTENT ---
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: question,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0, // For purely factual, non-creative answers.
      },
    });
    
    return response.text ?? "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while communicating with the AI: ${error.message}`;
    }
    return "An unknown error occurred while communicating with the AI.";
  }
};
