import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatArea from "../components/ChatArea";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function Dashboard() {
  // State
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);

  // Dark Mode State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const messagesEndRef = useRef(null);

  // Theme Synchronizer
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Load history from API
  const fetchConversations = async (query = "") => {
    try {
      setError(null);
      const url = query.trim()
        ? `${API_BASE_URL}/conversations?search=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/conversations`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch conversation history");
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the backend. Please check if the server is running.",
      );
    }
  };

  // Debounce search history queries
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchConversations(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Smooth scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Send message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const questionText = inputValue.trim();
    setInputValue("");
    setError(null);

    const newUserMessage = { role: "user", text: questionText };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setSelectedId(null);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });

      if (!res.ok) throw new Error("API server returned an error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer },
      ]);
      fetchConversations(searchQuery);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I encountered an error communicating with the API. Please ensure your backend configurations are correct.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Select item from history
  const handleSelectHistory = (conv) => {
    setSelectedId(conv._id);
    setMessages([
      { role: "user", text: conv.question },
      { role: "assistant", text: conv.answer },
    ]);
    setIsSidebarOpen(false);
  };

  // Delete individual Q&A
  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      if (selectedId === id) {
        setMessages([]);
        setSelectedId(null);
      }

      fetchConversations(searchQuery);
    } catch (err) {
      console.error(err);
      alert("Failed to delete the conversation");
    }
  };

  // Wipe history
  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all conversation history?"))
      return;

    try {
      const res = await fetch(`${API_BASE_URL}/conversations`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear");

      setMessages([]);
      setSelectedId(null);
      fetchConversations();
    } catch (err) {
      console.error(err);
      alert("Failed to clear history");
    }
  };

  // Start new session
  const handleNewChat = () => {
    setMessages([]);
    setSelectedId(null);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 text-gray-800 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Sidebar Component */}
      <Sidebar
        conversations={conversations}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedId={selectedId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onSelectHistory={handleSelectHistory}
        onDeleteConversation={handleDeleteConversation}
        onClearAll={handleClearAll}
        onNewChat={handleNewChat}
      />

      {/* Main Content Area */}
      <main className="relative flex flex-1 flex-col bg-gray-50 dark:bg-zinc-950">
        {/* Header Component */}
        <Header
          isDark={isDark}
          setIsDark={setIsDark}
          setIsSidebarOpen={setIsSidebarOpen}
          selectedId={selectedId}
        />

        {/* Connection Error Message Banner */}
        {error && (
          <div className="bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400 border-b border-red-100 dark:border-red-950/50">
            <div className="flex max-w-3xl mx-auto items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => fetchConversations(searchQuery)}
                className="font-bold underline ml-2 hover:no-underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Chat Content Viewport */}
        <ChatArea
          messages={messages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          messagesEndRef={messagesEndRef}
        />
      </main>
    </div>
  );
}
