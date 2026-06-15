import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ question: 'text', answer: 'text' });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
