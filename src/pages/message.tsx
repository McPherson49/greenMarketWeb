"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Paperclip,
  Send,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { getMessages, sendMessage, Message as ChatMessage } from "@/services/chat";
import ApiFetcher from "@/utils/apis"; // assuming you have this like in your sample service
import { toast } from "react-toastify";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  tags?: string[];
  online?: boolean;
}

const MessagingApp: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // FETCH CONVERSATIONS
  const fetchConversations = async () => {
    try {
      const response = await ApiFetcher.get<{ data: Conversation[] }>("/chat");
      if (response?.data?.data) {
        setConversations(response.data.data);
        if (!selectedConversation && response.data.data.length > 0) {
          setSelectedConversation(response.data.data[0].id);
        }
      } else {
        toast.error("Failed to load conversations");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Error fetching conversations");
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // FETCH MESSAGES ON CONVERSATION CHANGE
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const msgs = await getMessages(selectedConversation);
      if (msgs) setMessages(msgs);
    };

    fetchMessages();
  }, [selectedConversation]);

  // AUTO SCROLL TO LATEST MESSAGE
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMsg = await sendMessage(selectedConversation, messageText.trim());
    if (newMsg) {
      setMessages((prev) => [...prev, newMsg]);
      setMessageText("");
    }
  };

  const getTagColor = (tag?: string) => {
    const colors: { [key: string]: string } = {
      Question: "bg-orange-100 text-orange-700",
      "Help wanted": "bg-teal-100 text-teal-700",
      Bug: "bg-orange-100 text-orange-700",
      Hacktoberfest: "bg-teal-100 text-teal-700",
      Request: "bg-green-100 text-green-700",
      "Follow up": "bg-gray-100 text-gray-700",
      "Some content": "bg-gray-100 text-gray-700",
    };
    return tag ? colors[tag] || "bg-gray-100 text-gray-700" : "bg-gray-100 text-gray-700";
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="flex h-screen">
      <div className="max-w-7xl mx-auto w-full flex h-screen bg-white">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - Conversations List */}
        <div
          className={`fixed inset-y-0 left-0 w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out z-50 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:z-auto`}
        >
          {/* Header */}
          <div className="p-3 md:p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                  Messages
                </h1>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <span className="text-xs md:text-sm text-gray-500">{conversations.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
                <button className="w-7 h-7 md:w-8 md:h-8 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700">
                  <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.id ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="relative">
                    <img
                      src={conv.avatar || "https://i.pravatar.cc/150?img=33"}
                      alt={conv.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                    />
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">{conv.timestamp || ""}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 truncate mb-2">{conv.lastMessage || ""}</p>
                    <div className="flex flex-wrap gap-1">
                      {conv.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv && (
            <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <button
                  className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img
                    src={selectedConv?.avatar || "https://i.pravatar.cc/150?img=33"}
                    alt={selectedConv.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                  />
                  {selectedConv.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm md:text-base">
                    {selectedConv.name}
                  </h2>
                  {selectedConv.online && <p className="text-xs text-green-600">Online</p>}
                </div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.is_sender ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-end space-x-1.5 md:space-x-2 max-w-[85%] md:max-w-md lg:max-w-lg">
                  {!message.is_sender && (
                    <Image
                      src={selectedConv?.avatar || "https://i.pravatar.cc/150?img=33"}
                      alt="Avatar"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full shrink-0"
                      width={32}
                      height={32}
                    />
                  )}
                  <div
                    className={`px-3 md:px-4 py-2 rounded-2xl ${
                      message.is_sender
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-xs md:text-sm wrap-break-word">{message.message}</p>
                  </div>
                  {message.is_sender && (
                    <Image
                      src="https://i.pravatar.cc/150?img=33"
                      alt="Your Avatar"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full shrink-0"
                      width={32}
                      height={32}
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 md:p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 md:space-x-3">
              <button className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message"
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-100 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="p-1.5 md:p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!messageText.trim()}
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingApp;
