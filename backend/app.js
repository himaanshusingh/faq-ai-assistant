import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Database
connectDB();

// API Routes
app.use("/api", chatRoutes);

// Default Route
app.get("/", (req, res) => res.send("API is running..."));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
