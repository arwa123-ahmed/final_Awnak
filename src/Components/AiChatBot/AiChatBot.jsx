import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import axios from "axios";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "اهلا بيك 👋 كيف فيني ساعدك؟",
    },
  ]);
  const [input, setInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // نجيب تاريخ المحادثة لما يفتح الشات
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // نجيب التاريخ من الباك
  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/chatbot/history", {
        headers: {
          Authorization: Bearer ${localStorage.getItem("token")},
        },
      });

      if (response.data?.history?.length > 0) {
        const historyMessages = [];
        response.data.history.forEach((msg) => {
          historyMessages.push({ role: "user", content: msg.question });
          historyMessages.push({ role: "assistant", content: msg.answer });
        });

        setMessages([
          { role: "assistant", content: "اهلا بيك 👋 كيف فيني ساعدك؟" },
          ...historyMessages,
        ]);
      }
    } catch (error) {
      console.log("No history found");
    }
  };

  // SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/chatbot",
        { message: userMessage },
        {
          headers: {
            Authorization: Bearer ${localStorage.getItem("token")},
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data?.reply ?? "ما قدرت أجيب رد 😅",
        },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "صار خطأ بالاتصال بالسيرفر 😅",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 z-50 w-16 h-16 rounded-full shadow-2xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="fixed bottom-28 left-8 z-50 w-96 h-[550px] rounded-2xl shadow-2xl overflow-hidden bg-white border"
          >
            {/* Header */}
            <div className="bg-green-500 px-5 py-4 text-white flex items-center gap-3">
              <Bot className="w-6 h-6" />
              <h3 className="font-bold text-base">مساعد عونك</h3>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                      msg.role === "user" ? "bg-blue-500" : "bg-green-500"
                    }`}
                  >
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div
                    className={`px-4 py-2 rounded-xl max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 items-center">
                  <Bot className="w-8 h-8 text-green-500" />
                  <Loader2 className="animate-spin" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="اكتب رسالتك..."
                className="flex-1 p-2 border rounded-lg focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-green-500 text-white px-4 rounded-lg"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;