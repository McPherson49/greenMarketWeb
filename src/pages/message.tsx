"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Paperclip, Send, Menu, X } from "lucide-react";
import { useRouter } from "next/router";
import {
  getChatList,
  getMessages,
  sendMessage,
  sendMediaMessage,
  Message as ChatMessage,
  ChatListItem,
} from "@/services/chat";
import { toast } from "react-toastify";
import Link from "next/link";

// ── AVATAR COMPONENT ──
const Avatar = ({
  src,
  name,
  className = "w-11 h-11",
}: {
  src: string;
  name: string;
  className?: string;
}) => {
  const [failed, setFailed] = useState(false);

  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-green-500",
    "bg-teal-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const colorIndex =
    name?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  const bgColor = colors[colorIndex] || "bg-gray-400";

  if (failed || !src) {
    return (
      <div
        className={`${className} ${bgColor} rounded-full flex items-center justify-center shrink-0`}
      >
        <span className="text-white font-semibold text-xs">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className={`${className} rounded-full object-cover shrink-0`}
    />
  );
};

// ── MAIN COMPONENT ──
const MessagingApp: React.FC = () => {
  const router = useRouter();
  const { chat: chatIdFromQuery } = router.query;

  const [conversations, setConversations] = useState<ChatListItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [selectedReceiverId, setSelectedReceiverId] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── FETCH CONVERSATIONS ──
  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const list = await getChatList();
      if (list) {
        setConversations(list);

        const targetId = chatIdFromQuery as string | null;

        if (targetId) {
          const exists = list.find(
            (c) => String(c.user_id) === String(targetId),
          );
          if (exists) {
            setSelectedConversation(String(exists.id));
            setSelectedReceiverId(String(exists.user_id));
          } else {
            setSelectedReceiverId(String(targetId));
            setSelectedConversation("");
            toast.info(
              "Send a message to start a conversation with this seller.",
            );
          }
        } else if (list.length > 0) {
          setSelectedConversation(String(list[0].id));
          setSelectedReceiverId(String(list[0].user_id));
        }
      }
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchConversations();
  }, [router.isReady, chatIdFromQuery]);

  // ── FETCH MESSAGES ──
  useEffect(() => {
    if (!selectedReceiverId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const msgs = await getMessages(selectedReceiverId);
        setMessages(msgs || []);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedReceiverId]);

  // ── AUTO SCROLL ──
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // ── SEND TEXT ──
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedReceiverId || sendingMessage) return;

    setSendingMessage(true);
    const text = messageText.trim();
    setMessageText("");

    const newMsg = await sendMessage(selectedReceiverId, text);
    if (newMsg) {
      setMessages((prev) => [...prev, newMsg]);

      if (!selectedConversation) {
        const list = await getChatList();
        if (list) {
          setConversations(list);
          const newConv = list.find(
            (c) => String(c.user_id) === String(selectedReceiverId),
          );
          if (newConv) setSelectedConversation(String(newConv.id));
        }
      }
    }
    setSendingMessage(false);
  };

  // ── SEND MEDIA ──
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedReceiverId) return;

    const newMsg = await sendMediaMessage(selectedReceiverId, file);
    if (newMsg) setMessages((prev) => [...prev, newMsg]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── SELECT CONVERSATION ──
  const handleSelectConversation = (conv: ChatListItem) => {
    setSelectedConversation(String(conv.id));
    setSelectedReceiverId(String(conv.user_id));
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const selectedConv = conversations.find(
    (c) => String(c.id) === selectedConversation,
  );

  return (
    <div
      className="flex overflow-hidden rounded-lg mb-40 border border-gray-200"
      style={{ height: "calc(100vh - 220px)" }}
    >
      <div className="max-w-7xl mx-auto w-full flex bg-white overflow-hidden">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── LEFT SIDEBAR ── */}
        <div
          className={`fixed inset-y-0 left-0 w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:translate-x-0 md:z-auto md:h-full`}
        >
          {/* Sidebar Header */}
          <div className="p-3 md:p-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">
                  Messages
                </h1>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-400">
                  {conversations.length}
                </span>
              </div>
              <button
                className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#39B54A]"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="flex flex-col gap-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 animate-pulse"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                <p className="text-sm text-center">No conversations yet.</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === String(conv.id)
                      ? "bg-green-50 border-l-4 border-l-[#39B54A]"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={conv.avatar}
                      name={conv.name}
                      className="w-11 h-11"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">
                          {conv.time || ""}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conv.message || ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT: CHAT AREA ── */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Chat Header */}
          <div className="p-3 md:p-4 border-b border-gray-200 flex items-center shrink-0">
            <button
              className="md:hidden p-1 text-gray-500 hover:text-gray-700 mr-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {selectedConv ? (
              <div className="flex items-center gap-3">
                <Avatar
                  src={selectedConv.avatar}
                  name={selectedConv.name}
                  className="w-9 h-9"
                />
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm md:text-base">
                    {selectedConv.name}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {selectedConv.date || ""}
                  </p>
                </div>
              </div>
            ) : selectedReceiverId ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-gray-500 text-xs font-bold">NEW</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm md:text-base">
                    New Conversation
                  </h2>
                  <p className="text-xs text-[#39B54A]">
                    Send a message to start
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Select a conversation</p>
            )}
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 space-y-3"
          >
            {!selectedReceiverId ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Send className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium">No conversation selected</p>
                <p className="text-xs mt-1">
                  Choose a conversation or chat a seller
                </p>
              </div>
            ) : loadingMessages ? (
              <div className="flex flex-col gap-4 pt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}
                  >
                    <div
                      className={`h-9 rounded-2xl bg-gray-200 ${i % 2 === 0 ? "w-52" : "w-36"}`}
                    />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-sm">No messages yet. Say hello! 👋</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_sender ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {!message.is_sender && (
                      <Avatar
                        src={selectedConv?.avatar || ""}
                        name={selectedConv?.name || "?"}
                        className="w-7 h-7"
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      {/* Media - image */}
                      {message.media_url && message.media_type === "image" && (
                        <img
                          src={message.media_url}
                          alt="media"
                          className="rounded-xl max-w-xs max-h-60 object-cover"
                        />
                      )}
                      {/* Media - file */}
                      {message.media_url && message.media_type === "file" && (
                        <Link
                          href={message.media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline text-blue-500"
                        >
                          📎 Download file
                        </Link>
                      )}
                      {/* Text bubble */}
                      {message.message && (
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            message.is_sender
                              ? "bg-[#39B54A] text-white rounded-br-sm"
                              : "bg-gray-100 text-gray-900 rounded-bl-sm"
                          }`}
                        >
                          <p className="text-xs md:text-sm break-words">
                            {message.message}
                          </p>
                        </div>
                      )}
                      {/* Timestamp */}
                      <span
                        className={`text-[10px] text-gray-400 ${
                          message.is_sender ? "text-right" : "text-left"
                        }`}
                      >
                        {message.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 md:p-4 border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!selectedReceiverId}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={
                  selectedReceiverId
                    ? "Type a message..."
                    : "Select a conversation first"
                }
                disabled={!selectedReceiverId || sendingMessage}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#39B54A] disabled:opacity-50 disabled:cursor-not-allowed"
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSendMessage()
                }
              />

              <button
                onClick={handleSendMessage}
                disabled={
                  !messageText.trim() || !selectedReceiverId || sendingMessage
                }
                className="p-2.5 text-white bg-[#39B54A] hover:bg-green-600 rounded-full transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingMessage ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingApp;
