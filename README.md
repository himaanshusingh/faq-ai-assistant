# AI-Powered FAQ Assistant

A simple, modern, AI-powered FAQ chatbot that answers user questions, stores conversation history in MongoDB, and supports search and dark mode.

This project was built as part of the Technical Assessment for the AI Engineer Developer Intern role.

---

## Tech Stack
- **Frontend**: React.js (Vite) styled with **Tailwind CSS v4**
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **AI Integration**: Gemini 1.5 Flash API (free tier)

---

## Features
1. **Interactive Chat UI**: A clean, responsive chat dashboard to enter questions and view AI answers.
2. **Conversation History**: All Q&A pairs and timestamps are saved in MongoDB and listed in the sidebar.
3. **Search Filters (Bonus)**: Easily search past conversations by keywords (queries both questions and answers).
4. **Dark Mode (Bonus)**: Fully implemented toggle syncs with OS preferences and persists via LocalStorage.
5. **Docker Containerization (Bonus)**: Fully containerized using Multi-Stage Dockerfiles and Docker Compose.

---

## Project Structure
```text
ai-assistant/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── ai.js           # Gemini SDK setup
│   │   │   └── db.js           # MongoDB connection setup
│   │   ├── controllers/
│   │   │   └── chatController.js # API Controller logic
│   │   ├── models/
│   │   │   └── Conversation.js # Mongoose schema model
│   │   ├── routes/
│   │   │   └── chatRoutes.js   # API Endpoint routes
│   │   └── server.js           # Entry express server
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatArea.jsx    # Chat bubble render & input
│   │   │   ├── Header.jsx      # Theme toggle & status bar
│   │   │   └── Sidebar.jsx     # Q&A history panel & search
│   │   ├── pages/
│   │   │   └── Dashboard.jsx   # State hub layout page
│   │   ├── App.jsx             # Root React entry
│   │   ├── index.css           # Tailwind v4 import rules
│   │   └── main.jsx
│   ├── index.html
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
```
├── README.md
└── demo_script.md              # 3-4 minutes demo presentation script
```

---

## Setup & Installation

You can run this project either **locally** or using **Docker**.

### Prerequisites
1. **Node.js** (v18+) and **npm** installed (if running locally).
2. **MongoDB** instance running locally or a MongoDB Atlas URI (if running locally).
3. **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/). It is completely free to create.

---

### Option A: Running with Docker (Recommended)

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Run the application:
   ```bash
   docker-compose up --build
   ```
4. Access the applications:
   - **Frontend**: `http://localhost:3000`
   - **Backend**: `http://localhost:5000`
   - **MongoDB**: `mongodb://localhost:27017`

---

### Option B: Running Locally

#### 1. Setup Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template and configure it:
   ```bash
   cp .env.example .env
   ```
   *Add your `GEMINI_API_KEY` and update the `MONGO_URI` if your local MongoDB instance runs on a different port or server.*
4. Start the backend:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

#### 2. Setup Frontend
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will be running on `http://localhost:3000`.*

---

## API Endpoints

### `POST /api/chat`
Sends a question to the backend, retrieves the AI response from Gemini, saves the record to MongoDB, and returns the created document.
- **Request Body**: `{ "question": "What is SQL?" }`
- **Response**:
  ```json
  {
    "_id": "648f...",
    "question": "What is SQL?",
    "answer": "SQL (Structured Query Language) is standard language for managing database...",
    "createdAt": "2026-06-15T12:00:00.000Z",
    "updatedAt": "2026-06-15T12:00:00.000Z"
  }
  ```

### `GET /api/conversations`
Fetches conversation history sorted by newest first.
- **Optional Query Params**: `?search=term` (searches within questions and answers).

### `DELETE /api/conversations/:id`
Deletes a specific conversation by ID.

### `DELETE /api/conversations`
Clears the entire conversation history database.
