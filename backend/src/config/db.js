import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGO_URI =
    `${process.env.MONGO_URI}/faq-assistant` ||
    "mongodb://localhost:27017/faq-assistant";
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error(
      "MongoDB connection error. Server will run with in-memory storage fallback:",
      err.message,
    );
  }
};

export const isDbConnected = () => mongoose.connection.readyState === 1;
