
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert RTO (Regional Transport Office) Consultant in India. 
Your primary task is to provide accurate, structured, and up-to-date document checklists and procedural guidance.

IMPORTANT FORMATTING RULES:
- DO NOT use markdown formatting.
- DO NOT use asterisks (*) or double asterisks (**) for bolding or emphasis.
- DO NOT use asterisks for bullet points. Use plain numbers (1., 2.) or simple dashes (-) if needed.
- Provide answers in clean, readable plain text with clear spacing between sections.
- Use standard capitalization for emphasis instead of symbols.

When providing document checklists:
1. Categorize documents clearly (e.g., Proof of Identity, Proof of Address).
2. Distinguish between mandatory and optional documents.
3. Mention specific forms (e.g., Form 20, Form 21, Form 29, Form 30).
4. Mention if physical presence is required or if it's an online (Faceless) service.

Focus on:
- Driving License (DL): Learner's, Permanent, Renewal, Duplicate, International Permit.
- Vehicle Registration (RC): New Registration, Ownership Transfer, HP Termination, Fitness, NOC.
- Permits and Taxes: Commercial permits, Green tax, Road tax.

Always check for the latest government notifications using your search tool. If procedures vary significantly by state, mention it. Provide direct links to official Parivahan or State Transport portals where possible.
`;

export class RTOGeminiService {
  private ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  async getAssistantResponse(prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
          tools: [{ googleSearch: {} }] 
        }
      });

      let text = response.text || "I'm sorry, I couldn't process that request.";
      text = text.replace(/\*/g, '');
      
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      return { text, grounding };
    } catch (error) {
      console.error("Gemini Error:", error);
      return { 
        text: "An error occurred while connecting to the RTO AI Consultant. Please try again later.", 
        grounding: [] 
      };
    }
  }

  async verifyIdentityDocument(type: 'aadhaar' | 'pan', id: string) {
    const prompt = `Perform a structural and format verification for an Indian ${type.toUpperCase()} card. 
    ID to verify: ${id}. 
    Return a JSON response with:
    - isValid: boolean (true if format is correct)
    - remarks: string (brief technical reason for the result)
    - status: string (e.g., "AUTHENTICATED" or "REJECTED")`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: { type: Type.BOOLEAN },
              remarks: { type: Type.STRING },
              status: { type: Type.STRING }
            },
            required: ["isValid", "remarks", "status"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      return { isValid: false, remarks: "Verification service timed out. Please check document format.", status: "SERVICE_ERROR" };
    }
  }

  async generateMockTestExplanation(question: string, userAnswer: string, correctAnswer: string) {
    const prompt = `Explain why the correct answer to "${question}" is "${correctAnswer}". The user chose "${userAnswer}". Provide a brief, educational explanation of the traffic rule involved. DO NOT use asterisks or markdown.`;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a traffic safety instructor. Provide concise and clear explanations of traffic rules in plain text without any symbols or markdown.",
        }
      });
      let text = response.text || "No explanation available.";
      return text.replace(/\*/g, '');
    } catch (error) {
      return "Could not load explanation.";
    }
  }
}

export const rtoService = new RTOGeminiService();
