import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let aiModel = null;

if (apiKey) {
  try {
    const ai = new GoogleGenerativeAI(apiKey);
    aiModel = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('Gemini AI client initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Gemini AI client:', error);
  }
} else {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Chat will use fallback responses.');
}

export const getAIModel = () => aiModel;
