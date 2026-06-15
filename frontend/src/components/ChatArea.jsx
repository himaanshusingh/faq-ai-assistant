const SUGGESTIONS = [
  "What is the difference between SQL and NoSQL?",
  "How does client-server architecture work?",
  "Explain React state management in simple terms.",
  "Give me a quick boilerplate for an Express server.",
];

export default function ChatArea({
  messages,
  inputValue,
  setInputValue,
  isLoading,
  onSendMessage,
  messagesEndRef,
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages list / Welcome screen */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            // Onboarding Welcome View
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-5xl mb-4">✨</span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome to AI FAQ Assistant
              </h2>
              <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-zinc-400">
                Ask any question about programming, systems design, general
                concepts, or simple tasks. Your chat history is saved securely
                in MongoDB.
              </p>

              {/* Suggestions Cards */}
              <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(suggestion)}
                    className="rounded-xl border border-gray-200 bg-white p-4 text-left text-sm font-medium transition-all hover:border-indigo-500 hover:bg-indigo-50/20 active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-600 dark:hover:bg-zinc-800/40"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Conversation Exchanges
            <div className="space-y-6 pb-4">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex w-full items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {/* Avatar for AI */}
                    {!isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        🤖
                      </div>
                    )}

                    {/* Bubble body */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                        isUser
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white text-gray-800 dark:bg-zinc-900 dark:text-zinc-100 rounded-tl-none border border-gray-100 dark:border-zinc-800/80"
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </div>
                    </div>

                    {/* Avatar for User */}
                    {isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300">
                        👤
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing bounce dots for AI loading state */}
              {isLoading && (
                <div className="flex w-full items-start gap-3 justify-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    🤖
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white border border-gray-100 p-4 shadow-xs dark:bg-zinc-900 dark:border-zinc-800/80">
                    <div className="flex gap-1.5 items-center justify-center py-1 px-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-zinc-500 [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-zinc-500 [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-zinc-500"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message input bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <form onSubmit={onSendMessage} className="mx-auto max-w-3xl">
          <div className="relative flex items-center rounded-2xl border border-gray-200 bg-white shadow-xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-indigo-600 dark:focus-within:ring-indigo-950/40">
            <input
              type="text"
              id="question-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your question..."
              disabled={isLoading}
              className="w-full bg-transparent py-4 pl-4 pr-14 text-sm outline-none placeholder:text-gray-400 disabled:opacity-50 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              id="send-btn"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 rounded-xl bg-indigo-600 p-2.5 text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:scale-100 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
              aria-label="Send Message"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-gray-400 dark:text-zinc-500">
            Powered by Gemini 1.5 Flash API. Chats are saved locally in MongoDB.
          </p>
        </form>
      </div>
    </div>
  );
}
