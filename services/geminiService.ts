
import { GoogleGenAI } from "@google/genai";
import { JobCard, Machine } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMaintenance = async (jobCards: JobCard[], machines: Machine[]) => {
  if (!process.env.API_KEY) return "API Key not configured. Please check environment variables.";

  const prompt = `
    Analyze the following maintenance data for heavy machinery:
    Machines: ${JSON.stringify(machines.map(m => ({ brand: m.brand, model: m.model, hours: m.currentHours })))}
    Recent Job Cards: ${JSON.stringify(jobCards.slice(0, 5).map(j => ({ type: j.jobType, findings: j.findings, parts: j.spareParts })))}
    
    Provide a brief professional summary of the current maintenance health, top recurring issues, and a recommendation for next month's focus.
    Keep it concise and formatted in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating analysis.";
  }
};
