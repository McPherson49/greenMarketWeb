import React, { useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Phone,
  Paperclip,
  Send,
  Menu,
  X,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  tags: string[];
  online?: boolean;
}

const MessagingApp: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>("2");
  const [messageText, setMessageText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Elmer Laverty",
      avatar: "https://i.pravatar.cc/150?img=12",
      lastMessage: "Haha oh man 🔥",
      timestamp: "12m",
      tags: ["Question", "Help wanted"],
    },
    {
      id: "2",
      name: "Florencio Dorrance",
      avatar: "https://i.pravatar.cc/150?img=13",
      lastMessage: "woohoooo",
      timestamp: "24m",
      tags: ["Some content"],
      online: true,
    },
    {
      id: "3",
      name: "Lavern Laboy",
      avatar: "https://i.pravatar.cc/150?img=14",
      lastMessage: "Haha that's terrifying 😅",
      timestamp: "1h",
      tags: ["Bug", "Hacktoberfest"],
    },
    {
      id: "4",
      name: "Titus Kitamura",
      avatar: "https://i.pravatar.cc/150?img=15",
      lastMessage: "omg, this is amazing",
      timestamp: "5h",
      tags: ["Question", "Some content"],
    },
    {
      id: "5",
      name: "Geoffrey Mott",
      avatar: "https://i.pravatar.cc/150?img=16",
      lastMessage: "aww 😊",
      timestamp: "2d",
      tags: ["Request"],
    },
    {
      id: "6",
      name: "Alfonzo Schuessler",
      avatar: "https://i.pravatar.cc/150?img=17",
      lastMessage: "perfect!",
      timestamp: "1m",
      tags: ["Follow up"],
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      text: "omg, this is amazing",
      sender: "other",
      timestamp: "10:30 AM",
    },
    { id: "2", text: "perfect! ✅", sender: "other", timestamp: "10:31 AM" },
    {
      id: "3",
      text: "Wow, this is really epic",
      sender: "other",
      timestamp: "10:32 AM",
    },
    { id: "4", text: "How are you?", sender: "user", timestamp: "10:35 AM" },
    {
      id: "5",
      text: "just ideas for next time",
      sender: "other",
      timestamp: "10:36 AM",
    },
    {
      id: "6",
      text: "I'll be there in 2 mins ⏰",
      sender: "other",
      timestamp: "10:37 AM",
    },
    { id: "7", text: "woohoooo", sender: "user", timestamp: "10:38 AM" },
    { id: "8", text: "Haha oh man", sender: "user", timestamp: "10:39 AM" },
    {
      id: "9",
      text: "Haha that's terrifying 😅",
      sender: "user",
      timestamp: "10:40 AM",
    },
    { id: "10", text: "aww", sender: "other", timestamp: "10:41 AM" },
    {
      id: "11",
      text: "omg, this is amazing",
      sender: "other",
      timestamp: "10:42 AM",
    },
    { id: "12", text: "woohoooo 🔥", sender: "other", timestamp: "10:43 AM" },
  ];

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      Question: "bg-orange-100 text-orange-700",
      "Help wanted": "bg-teal-100 text-teal-700",
      Bug: "bg-orange-100 text-orange-700",
      Hacktoberfest: "bg-teal-100 text-teal-700",
      Request: "bg-green-100 text-green-700",
      "Follow up": "bg-gray-100 text-gray-700",
      "Some content": "bg-gray-100 text-gray-700",
    };
    return colors[tag] || "bg-gray-100 text-gray-700";
  };

  const handleConversationSelect = (convId: string) => {
    setSelectedConversation(convId);
    setIsSidebarOpen(false);
  };

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
                <span className="text-xs md:text-sm text-gray-500">12</span>
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
                onClick={() => handleConversationSelect(conv.id)}
                className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.id ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="relative">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                    />
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {conv.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {conv.timestamp}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 truncate mb-2">
                      {conv.lastMessage}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {conv.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(
                            tag
                          )}`}
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
          {/* Chat Header */}
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
                    src={selectedConv.avatar}
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
                  {selectedConv.online && (
                    <p className="text-xs text-green-600">Online</p>
                  )}
                </div>
              </div>
              {/* <button className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1.5 md:py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-medium text-sm md:text-base">Call</span>
              </button> */}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-end space-x-1.5 md:space-x-2 max-w-[85%] md:max-w-md lg:max-w-lg">
                  {message.sender === "other" && (
                    <img
                      src={selectedConv?.avatar}
                      alt="Avatar"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                    />
                  )}
                  <div
                    className={`px-3 md:px-4 py-2 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-xs md:text-sm break-words">
                      {message.text}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <img
                      src="https://i.pravatar.cc/150?img=33"
                      alt="Your Avatar"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 md:p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 md:space-x-3">
              <button className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message"
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-100 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                className="p-1.5 md:p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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