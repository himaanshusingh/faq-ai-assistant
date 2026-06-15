import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import { getAIModel } from '../config/ai.js';
import { isDbConnected } from '../config/db.js';

// In-memory fallback database
const inMemoryConversations = [];

// 1. Submit Q&A
export const askQuestion = async (req, res) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    let answer = '';
    const aiModel = getAIModel();

    if (aiModel) {
      const prompt = `You are a helpful AI FAQ Assistant. Answer the following user question clearly and concisely:\n\nQuestion: ${question}\n\nAnswer:`;
      const result = await aiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      const response = await result.response;
      answer = response.text();
    } else {
      answer = `This is a mock response because the GEMINI_API_KEY is not configured on the backend. Your question was: "${question}"`;
    }

    const cleanedQuestion = question.trim();
    const cleanedAnswer = answer.trim();

    if (isDbConnected()) {
      const conversation = new Conversation({
        question: cleanedQuestion,
        answer: cleanedAnswer,
      });
      await conversation.save();
      return res.status(201).json(conversation);
    } else {
      const conversation = {
        _id: new mongoose.Types.ObjectId().toString(),
        question: cleanedQuestion,
        answer: cleanedAnswer,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryConversations.push(conversation);
      return res.status(201).json(conversation);
    }
  } catch (error) {
    console.error('Error generating AI response or saving conversation:', error);
    return res.status(500).json({ error: 'Failed to process your request. Please try again later.' });
  }
};

// 2. Get history
export const getConversations = async (req, res) => {
  const { search } = req.query;

  try {
    if (isDbConnected()) {
      let query = {};
      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query = {
          $or: [
            { question: searchRegex },
            { answer: searchRegex }
          ]
        };
      }
      const conversations = await Conversation.find(query).sort({ createdAt: -1 });
      return res.json(conversations);
    } else {
      let list = [...inMemoryConversations];
      if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        list = list.filter(c => 
          c.question.toLowerCase().includes(term) || 
          c.answer.toLowerCase().includes(term)
        );
      }
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return res.json(list);
    }
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// 3. Delete individual Q&A
export const deleteConversation = async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const deleted = await Conversation.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      return res.json({ message: 'Conversation deleted successfully' });
    } else {
      const index = inMemoryConversations.findIndex(c => c._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      inMemoryConversations.splice(index, 1);
      return res.json({ message: 'Conversation deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

// 4. Wipe history
export const clearHistory = async (req, res) => {
  try {
    if (isDbConnected()) {
      await Conversation.deleteMany({});
      return res.json({ message: 'All conversations cleared successfully' });
    } else {
      inMemoryConversations.length = 0;
      return res.json({ message: 'All conversations cleared successfully' });
    }
  } catch (error) {
    console.error('Error clearing conversations:', error);
    return res.status(500).json({ error: 'Failed to clear conversations' });
  }
};
