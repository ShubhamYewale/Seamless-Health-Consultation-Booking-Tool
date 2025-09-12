

import React, { useState } from "react";
import axios from "axios";

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controls chat visibility

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        { message: input }
      );
      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Our AI service is temporarily unavailable. We’re working to restore it as soon as possible." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    // Floating button to reopen chat
    return (
      <button
        className="fixed bottom-5 right-5 bg-primary text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-lg w-80 rounded-lg overflow-hidden">
      {/* Header with close icon */}
      <div className="bg-primary text-white p-3 font-bold flex justify-between items-center">
        <span>Healify Assistance</span>
        <button onClick={() => setIsOpen(false)} className="text-white text-lg">
          ✖
        </button>
      </div>

      {/* Messages */}
      <div className="p-3 h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.sender === "user" ? "bg-blue-100" : "bg-gray-200"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400">Typing...</div>}
      </div>

      {/* Input area */}
      <div className="flex border-t">
        <input
          type="text"
          className="flex-1 p-2 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-primary text-white px-4"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
