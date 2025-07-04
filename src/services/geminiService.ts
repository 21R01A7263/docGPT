import { GoogleGenAI } from "@google/genai";



// Vite exposes env variables on import.meta.env, but TS may not know the type. Cast import.meta as any to access env.
const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_API_KEY });

export const getChatResponse = async (documentContext: string, question: string): Promise<string> => {
  try {
    const systemInstruction = `You are an expert assistant for analyzing documents. Your task is to answer questions based ONLY on the content of the document provided.

Follow these rules strictly:
1.  Your answers must be based *exclusively* on the text from the document context below. Do not use any external knowledge.
2.  If the answer is not found in the document, you MUST respond with the exact phrase: "The answer to this question is not found in the provided document." Do not add any other words.
3.  Do not speculate or infer information not explicitly stated.
4.  Be direct. Respond only with the specific information or answer requested. Do NOT include conversational filler like "Based on the document...", "The document mentions...", or "According to the text...". Just provide the answer directly.
5.  When you quote headings, subheadings, or section titles from the document in your answer, wrap them in double asterisks for emphasis. For example, if the document has a section titled "Project Goals", your response should format it as **Project Goals**.
6.  Use numbers for lists or steps in your answers, like 1, 2, 3, etc.
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
