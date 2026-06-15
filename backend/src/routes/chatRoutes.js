import express from "express";
import {
  askQuestion,
  getConversations,
  deleteConversation,
  clearHistory,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", askQuestion);
router.get("/conversations", getConversations);
router.delete("/conversations/:id", deleteConversation);
router.delete("/conversations", clearHistory);

export default router;
