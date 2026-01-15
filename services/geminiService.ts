import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Helper to get a random question from Gemini
export const generateTriviaQuestion = async (): Promise<Question> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Schema definition for strict JSON output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING, enum: ["text", "video"] },
        prompt: { type: Type.STRING },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING } 
        },
        correctAnswerIndex: { type: Type.INTEGER },
        youtubeId: { type: Type.STRING, nullable: true },
        startTime: { type: Type.INTEGER, nullable: true },
        endTime: { type: Type.INTEGER, nullable: true },
      },
      required: ["id", "type", "prompt", "options", "correctAnswerIndex"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a difficult trivia question for a board game. 
      
      50% chance it is a 'text' question.
      50% chance it is a 'video' question.
      
      If it is a 'video' question:
      - It must be about a famous movie scene, music video, or historical event.
      - Provide a real, valid YouTube Video ID (e.g., 'dQw4w9WgXcQ') in 'youtubeId'.
      - Set 'startTime' and 'endTime' to a relevant 10-15 second clip.
      - The prompt should ask "What happens next?" or "What song is this?" based on the clip.
      
      If 'text', leave youtubeId null.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const rawData = JSON.parse(text);

    // Sanitize the output to ensure it matches our TS types strictly
    if (rawData.type === 'video') {
       return {
         ...rawData,
         type: 'video',
         youtubeId: rawData.youtubeId || 'dQw4w9WgXcQ', // Fallback Rick Roll if ID missing
         startTime: rawData.startTime || 0,
         endTime: rawData.endTime || 10
       } as Question;
    }

    return {
        ...rawData,
        type: 'text'
    } as Question;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback static question
    return {
      id: "fallback-1",
      type: "text",
      prompt: "Who wrote the code for the Apollo Guidance Computer?",
      options: ["Margaret Hamilton", "Grace Hopper", "Ada Lovelace", "Katherine Johnson"],
      correctAnswerIndex: 0
    };
  }
};