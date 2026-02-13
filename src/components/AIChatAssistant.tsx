import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { FaComments, FaTimes, FaPaperPlane, FaLeaf } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! 🌱 I'm your GreenMarket AI Assistant. I can help you with farm products, organic foods, planting tips, seasonal recommendations, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState<string[]>([]);
  const [buttonPosition, setButtonPosition] = useState<"left" | "right">(
    "right",
  );
  const [buttonTop, setButtonTop] = useState(
    typeof window !== "undefined" ? window.innerHeight - 120 : 600,
  );
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0, startTop: 0 });

  // Pool of agriculture-related questions
  const questionPool = [
    "What organic products do you recommend?",
    "Tell me about seasonal vegetables",
    "How to start organic farming?",
    "Best fertilizers for tomatoes",
    "What are the benefits of crop rotation?",
    "How to control pests naturally?",
    "Best time to plant carrots?",
    "What is composting and how does it help?",
    "How much water do tomatoes need?",
    "What are companion plants?",
    "How to improve soil quality?",
    "What vegetables grow in winter?",
    "Best organic pesticides available?",
    "How to start a vegetable garden?",
    "What is hydroponics farming?",
    "Benefits of mulching in gardens?",
    "How to grow herbs indoors?",
    "What are heirloom seeds?",
    "Best crops for small farms?",
    "How to preserve harvested vegetables?",
    "How does GreenMarket escrow work?",
    "Why should I use escrow on GreenMarket?",
    "How do I sell on GreenMarket?",
    "How do I buy safely on GreenMarket?",
    "What is GreenMarket about?",
    "Is GreenMarket really free to join?",
    "Where can I download the GreenMarket app?",
    "How can I earn money with referrals?",
    "Tell me about the referral program",
    "How do I get more buyers for my products?",
    "What are Premium Services on GreenMarket?",
    "How to post an ad on GreenMarket?",
    "Safety tips for buying on GreenMarket?",
    "How to become a verified seller?",
    "Can I withdraw my referral earnings?",
    "How much can I earn from referrals?",
    "What makes GreenMarket different?",
    "How does the community feature work?",
    "Tips for selling like a pro?",
    "How to contact buyers on GreenMarket?",
  ];

  // Generate random quick questions when chat opens
  useEffect(() => {
    if (isOpen) {
      const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
      setQuickQuestions(shuffled.slice(0, 4));
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      startTop: buttonTop,
    };
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!buttonRef.current) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      startTop: buttonTop,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !buttonRef.current) return;

      // Calculate vertical movement (NOT inverted)
      const deltaY = e.clientY - dragStartPos.current.y;
      const newTop = dragStartPos.current.startTop + deltaY;

      // Constrain within screen bounds (with padding)
      const minTop = 80;
      const maxTop = window.innerHeight - 100;
      const constrainedTop = Math.max(minTop, Math.min(maxTop, newTop));

      setButtonTop(constrainedTop);

      // Determine which side based on mouse X position
      const screenMiddle = window.innerWidth / 2;
      if (e.clientX < screenMiddle) {
        setButtonPosition("left");
      } else {
        setButtonPosition("right");
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !buttonRef.current) return;

      const touch = e.touches[0];

      // Calculate vertical movement (NOT inverted)
      const deltaY = touch.clientY - dragStartPos.current.y;
      const newTop = dragStartPos.current.startTop + deltaY;

      // Constrain within screen bounds (with padding)
      const minTop = 80;
      const maxTop = window.innerHeight - 100;
      const constrainedTop = Math.max(minTop, Math.min(maxTop, newTop));

      setButtonTop(constrainedTop);

      // Determine which side based on touch X position
      const screenMiddle = window.innerWidth / 2;
      if (touch.clientX < screenMiddle) {
        setButtonPosition("left");
      } else {
        setButtonPosition("right");
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, buttonTop]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          errorData.error || `Server responded with ${response.status}`,
        );
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment. 🌿",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleButtonClick = () => {
    if (!isDragging) {
      setIsOpen(true);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          ref={buttonRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleButtonClick}
          style={{
            top: `${buttonTop}px`,
            ...(buttonPosition === "right"
              ? { right: "24px", left: "auto" }
              : { left: "24px", right: "auto" }),
          }}
          className={`fixed z-[9999] bg-gradient-to-r from-[#39B54A] to-emerald-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 group ${
            isDragging
              ? "cursor-grabbing scale-110 shadow-green-500/60"
              : "cursor-grab hover:scale-110 hover:shadow-green-500/50"
          }`}
          aria-label="Open AI Chat Assistant"
        >
          <div className="relative pointer-events-none">
            <FaComments className="text-2xl" />
            {!isDragging && (
              <>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></span>
              </>
            )}
          </div>
          {!isDragging && (
            <span
              className={`absolute ${
                buttonPosition === "right" ? "right-16" : "left-16"
              } top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block`}
            >
              Need farming help? Ask me! 🌱
            </span>
          )}
        </button>
      )}

      {/* Backdrop Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] md:hidden" />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="fixed z-[9999]
            /* Mobile: Full screen centered */
            inset-4 sm:inset-6
            /* Desktop: Bottom right */
            md:bottom-6 md:right-6 md:top-auto md:left-auto
            md:w-[380px] md:h-[600px]
            /* Mobile: Max dimensions */
            max-w-[500px] max-h-[700px]
            /* Center on mobile */
            mx-auto md:mx-0
            bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-green-200"
        >
          {/* Header */}
          <div className="bg-[#39B54A] from-green-500 to-emerald-600 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <Image
                  alt="Greenmarket Logo"
                  src="/assets/GMAIA.png"
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">GreenMarket AI</h3>
                <p className="text-xs text-green-100">
                  Your Agricultural Expert
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50/30 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#39B54A] to-emerald-600 text-white rounded-br-sm"
                      : "bg-white border border-green-200 text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-1">
                      <FaLeaf className="text-green-600 text-xs" />
                      <span className="text-xs font-semibold text-green-600">
                        GreenMarket AI
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.role === "user"
                        ? "text-green-100"
                        : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-green-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                      <span
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                    </div>
                    <span className="text-xs text-gray-500">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-green-100 bg-green-50/50 shrink-0">
              <p className="text-xs text-gray-600 mb-2 font-semibold">
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-green-200 bg-white shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about farming, products, tips..."
                className="flex-1 resize-none border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm max-h-24"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-[#39B54A] to-emerald-600 text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                aria-label="Send message"
              >
                <FaPaperPlane className="text-lg" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by AI • Agricultural Expert 🌿
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
