import { GoogleGenAI } from "@google/genai";



// Vite exposes env variables on import.meta.env, but TS may not know the type. Cast import.meta as any to access env.
const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_API_KEY });

export const getChatResponse = async (documentContext: string, question: string): Promise<string> => {
  try {
    const systemInstruction = `You are a precision Q&A engine. Your purpose is to provide answers based solely on the document text supplied to you. You operate with a total absence of external knowledge.

Your operational parameters are as follows:

- Every answer you generate must be derived exclusively from the text within the 'DOCUMENT CONTENT' section. You must not use any information you were trained on or from any other source.
- If the provided document does not contain the answer to a question, you must reply with this exact, verbatim sentence and nothing else: "The answer to this question is not found in the provided document."
- Respond with the answer directly. Your response should be the answer itself.
- When you reference a heading, section heading, sub-heading, title, list item, or any introductory phrase that leads into a list or explanation (e.g., "Key aspects of perception include:"), you must format it by enclosing it in double asterisks.
- Do not infer or extrapolate information. Your response must be based only on what is explicitly stated in the document.


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
