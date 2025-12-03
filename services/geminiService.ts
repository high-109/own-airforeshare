import { GoogleGenAI } from "@google/genai";
import { ItemType, AiEnhanceResult } from '../types';

const getClient = () => {
  // Safely check for process.env to avoid ReferenceError in browser environments
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeContent = async (text: string): Promise<AiEnhanceResult | null> => {
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Analyze the following text. 
        1. Identify if it is primarily 'CODE', a 'LINK', or plain 'TEXT'.
        2. If it is TEXT and longer than 300 characters, provide a 1-sentence summary.
        3. If it is CODE, format it if possible (but return the original mostly intact).
        4. If it is TEXT, clean up any messy whitespace.
        
        Return JSON ONLY:
        {
          "type": "TEXT" | "LINK" | "CODE",
          "formattedContent": "string",
          "summary": "string or null"
        }

        Input Text:
        ${text.substring(0, 5000)}
      `,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    const result = JSON.parse(responseText);
    return {
      type: (result.type as ItemType) || ItemType.TEXT,
      formattedContent: result.formattedContent || text,
      summary: result.summary,
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback basic detection
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(text);
    return {
      type: isUrl ? ItemType.LINK : ItemType.TEXT,
      formattedContent: text,
      summary: undefined
    };
  }
};