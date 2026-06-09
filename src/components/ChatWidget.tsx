"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI shopping assistant. Ask me about products, sizes, prices, or recommendations.",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response ||
            "Sorry, I couldn't process your request.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white text-zinc-950 shadow-xl font-bold hover:scale-105 transition"
      >
        AI
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[550px] bg-zinc-900 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">

          <div className="p-4 border-b border-white/10">
            <h2 className="text-white font-semibold">
              AI Shopping Assistant
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-white text-zinc-950 ml-auto"
                    : "bg-zinc-800 text-white"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="bg-zinc-800 text-white rounded-xl px-3 py-2 text-sm w-fit">
                Thinking...
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask about products..."
              className="flex-1 bg-zinc-800 text-white rounded-xl px-3 py-2 outline-none"
            />

            <button
              onClick={sendMessage}
              className="px-4 rounded-xl bg-white text-zinc-950 font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}