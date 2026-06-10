"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface ProductSummary {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: {
    S: number;
    M: number;
    L: number;
    XL: number;
    XXL: number;
  };
}

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: ProductSummary[];
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);   
  
  const { data: session } = useSession()
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    // Add user message
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
          history: messages.slice(-8),
        }),
      });

      if (session) {
        fetch("/api/chat/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "user",
            content: userMessage,
          }),
        });
      }

      const data = await res.json();

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.message ||
            "Sorry, I couldn't process your request.",
          products: data.products ?? [],
        },
      ]);
      if (session) {
        await fetch("/api/chat/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "assistant",
            content:
              data.message ||
              "Sorry, I couldn't process your request.",
          }),
        });
      }
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

  useEffect(() => {
    const loadHistory = async () => {
      if (session) {
        try {
          const res = await fetch("/api/chat/history");
          const data = await res.json();

          if (
            data.success &&
            data.messages.length > 0
          ) {
            setMessages(
              data.messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
              }))
            );
            return;
          }
        } catch {}
      }

      const savedMessages =
        localStorage.getItem("chatMessages");

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([
          {
            role: "assistant",
            content:
              "Hi! I'm your AI shopping assistant. Ask me about products, sizes, prices, or recommendations.",
          },
        ]);
      }
    };

    loadHistory();
  }, [session]);

useEffect(() => {
  if (messages.length > 0) {
    localStorage.setItem(
      "chatMessages",
      JSON.stringify(messages)
    );
  }
}, [messages]);

useEffect(() => {
  if (open) {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }
}, [messages, open]);

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
              <div key={index}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-white text-zinc-950 ml-auto"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.products.map((product) => (
                      <div
                        key={product._id}
                        className="bg-zinc-800 border border-white/10 rounded-xl p-3"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />

                        <h3 className="text-white font-semibold">
                          {product.name}
                        </h3>

                        <p className="text-zinc-400 text-sm">
                          {product.category}
                        </p>

                        <p className="text-white font-bold mt-1">
                          ৳{product.price}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(product.stock)
                            .filter(([, qty]) => qty > 0)
                            .map(([size]) => (
                              <span
                                key={size}
                                className="text-xs px-2 py-1 rounded bg-zinc-700 text-zinc-200"
                              >
                                {size}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="bg-zinc-800 text-white rounded-xl px-3 py-2 text-sm w-fit">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
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