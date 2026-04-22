import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

// We use 'gemini-1.5-flash' for speed/cost, 
// or 'gemini-1.5-pro' for complex resume rewriting.
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });