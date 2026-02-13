import React, { useState, useEffect } from "react";
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
import { getChatList, getMessages, sendMessage, ChatListItem, Message } from "@/services/chat";

const MessagingApp: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch chat list on component mount
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const data = await getChatList();
        if (data) {
          setChatList(data);
          // Auto-select first conversation if none selected
          if (!selectedConversation && data.length > 0) {
            setSelectedConversation(data[0].user_id.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching chat list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatList();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const data = await getMessages(selectedConversation);
          if (data) {
            setMessages(data);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const newMessage = await sendMessage(selectedConversation, messageText.trim());
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        setMessageText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConv = chatList.find((c) => c.user_id.toString() === selectedConversation);

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
                <span className="text-xs md:text-sm text-gray-500">{chatList.length}</span>
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
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading conversations...
              </div>
            ) : chatList.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            ) : (
              chatList.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationSelect(conv.user_id.toString())}
                  className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conv.user_id.toString() ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="relative">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 truncate mb-2">
                        {conv.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{conv.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm md:text-base">
                    {selectedConv.name}
                  </h2>
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
            {!messages || messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.is_sender ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[85%] md:max-w-md lg:max-w-lg">
                  <div
                    className={`px-3 md:px-4 py-2 rounded-2xl ${
                      message.is_sender
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-xs md:text-sm wrap-break-word">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
            )}
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
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                className="p-1.5 md:p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendMessage}
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