import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Paperclip,
  Send,
  Menu,
  X,
  Image as ImageIcon,
  Video,
  FileText,
} from "lucide-react";
import { getChatList, getMessages, sendMessage, sendMediaMessage, ChatListItem, Message } from "@/services/chat";

const MessagingApp: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: string; name: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMediaMenu, setShowMediaMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaMenuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string = ""): string => {
    const trimmed = name.trim();
    if (!trimmed) return "?";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (name: string = "") => {
    const colors = [
      "bg-indigo-500", "bg-blue-500", "bg-green-500", "bg-teal-500",
      "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-red-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const shouldShowRealAvatar = (avatar?: string) => {
    if (!avatar) return false;
    const trimmed = avatar.trim();
    if (trimmed === "" || trimmed === "null" || trimmed === "undefined") return false;
    if (trimmed.includes("fakeimg.pl")) return false;
    if (trimmed.includes("placehold")) return false;
    if (!trimmed.startsWith("http") && !trimmed.startsWith("/")) return false;
    return true;
  };

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const data = await getChatList();
        if (data) {
          setChatList(data);
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

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const data = await getMessages(selectedConversation);
          if (data) setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mediaMenuRef.current && !mediaMenuRef.current.contains(e.target as Node)) {
        setShowMediaMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async () => {
    const hasText = messageText.trim();
    const hasMedia = !!selectedFile && !!mediaPreview;

    if ((!hasText && !hasMedia) || !selectedConversation) return;

    if (hasMedia && selectedFile && mediaPreview) {
      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticMsg: Message & { _optimisticMediaUrl?: string; _optimisticMediaType?: string } = {
        id: optimisticId as any,
        chat_id: 0,
        message: hasText || "",
        meta: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_sender: true,
        time: "",
        _optimisticMediaUrl: mediaPreview.url,
        _optimisticMediaType: mediaPreview.type,
      };
      setMessages(prev => [...prev, optimisticMsg]);

      const fileToUpload = selectedFile;
      const caption = hasText || undefined;

      setMessageText("");
      setSelectedFile(null);
      setMediaPreview(null);

      try {
        const serverMsg = await sendMediaMessage(selectedConversation, fileToUpload, caption);
        if (serverMsg) {
          setMessages(prev => prev.map(m => (m.id as any) === optimisticId ? serverMsg : m));
        } else {
          setMessages(prev => prev.filter(m => (m.id as any) !== optimisticId));
        }
      } catch {
        setMessages(prev => prev.filter(m => (m.id as any) !== optimisticId));
      }
      return;
    }

    try {
      const newMessage = await sendMessage(selectedConversation, hasText);
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        setMessageText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (accept: string) => {
    setShowMediaMenu(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video") ? "video" : file.type.startsWith("image") ? "image" : "file";
    setMediaPreview({ url, type, name: file.name });
    setSelectedFile(file);
    e.target.value = "";
  };

  const handleRemoveMedia = () => {
    if (mediaPreview?.url) URL.revokeObjectURL(mediaPreview.url);
    setMediaPreview(null);
    setSelectedFile(null);
  };

  const selectedConv = chatList.find((c) => c.user_id.toString() === selectedConversation);

  const filteredConversations = chatList.filter((conv) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      conv.name.toLowerCase().includes(term) ||
      (conv.message && conv.message.toLowerCase().includes(term))
    );
  });

  const handleConversationSelect = (convId: string) => {
    setSelectedConversation(convId);
    setIsSidebarOpen(false);
  };

  const canSend = !!messageText.trim() || !!selectedFile;

  return (
    // h-full fills whatever height the parent dashboard gives us; overflow-hidden prevents page scroll
    <div className="flex h-full overflow-hidden">
      <div className="w-full flex h-full bg-white overflow-hidden">

        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out z-50 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:z-auto`}
        >
          <div className="p-3 md:p-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg md:text-xl font-semibold text-gray-900">Messages</h1>
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

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading conversations...</div>
            ) : chatList.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No conversations found</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No matching conversations</div>
            ) : (
              filteredConversations.map((conv) => {
                const initials = getInitials(conv.name);
                const bgColor = getAvatarColor(conv.name);
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleConversationSelect(conv.user_id.toString())}
                    className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conv.user_id.toString() ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-2 md:space-x-3">
                      {shouldShowRealAvatar(conv.avatar) ? (
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0"
                          onError={(e) => {
                            e.currentTarget.outerHTML = `<div class="${bgColor} w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-medium shrink-0">${initials}</div>`;
                          }}
                        />
                      ) : (
                        <div className={`${bgColor} w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-medium shrink-0`}>
                          {initials}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{conv.name}</h3>
                          <span className="text-xs text-gray-500 shrink-0 ml-2">{conv.time}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 truncate mb-2">{conv.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{conv.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ─── Right Side: Chat Area ─────────────────────────────────────────────
            flex-1        → takes remaining horizontal space
            flex flex-col → stacks header / messages / input vertically
            min-h-0       → CRITICAL: lets flex children shrink below content size
                            without this, the messages div can't scroll properly
        ──────────────────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* Chat Header — shrink-0 so it never shrinks */}
          {selectedConv && (
            <div className="shrink-0 p-3 md:p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <button
                  className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                {shouldShowRealAvatar(selectedConv.avatar) ? (
                  <img
                    src={selectedConv.avatar}
                    alt={selectedConv.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                    onError={(e) => {
                      e.currentTarget.outerHTML = `<div class="${getAvatarColor(selectedConv.name)} w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-medium">${getInitials(selectedConv.name)}</div>`;
                    }}
                  />
                ) : (
                  <div className={`${getAvatarColor(selectedConv.name)} w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-medium`}>
                    {getInitials(selectedConv.name)}
                  </div>
                )}
                <h2 className="font-semibold text-gray-900 text-sm md:text-base">{selectedConv.name}</h2>
              </div>
            </div>
          )}

          {/* Messages Area
              flex-1    → fills all remaining vertical space between header and input
              min-h-0   → allows it to shrink so the input is never pushed off screen
              overflow-y-auto → scrollable
          */}
          <div
            ref={scrollContainerRef}
            className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4"
          >
            {!messages || messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_sender ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[85%] md:max-w-md lg:max-w-lg">
                    <div
                      className={`px-3 md:px-4 py-2 rounded-2xl ${
                        message.is_sender ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-xs md:text-sm break-words">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Bar
              shrink-0 → never shrinks; always visible at the bottom
              No positioning tricks needed — it's just the last flex child
          */}
          <div className="shrink-0 bg-white border-t border-gray-200 p-3 md:p-4">
            {/* Media Preview */}
            {mediaPreview && (
              <div className="mb-2 relative inline-block">
                {mediaPreview.type === "image" ? (
                  <img
                    src={mediaPreview.url}
                    alt="preview"
                    className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                  />
                ) : mediaPreview.type === "video" ? (
                  <video
                    src={mediaPreview.url}
                    className="h-20 w-28 object-cover rounded-lg border border-gray-200"
                    muted
                  />
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-700 max-w-[120px] truncate">{mediaPreview.name}</span>
                  </div>
                )}
                <button
                  onClick={handleRemoveMedia}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Attachment Menu */}
              <div className="relative shrink-0" ref={mediaMenuRef}>
                <button
                  className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setShowMediaMenu(prev => !prev)}
                  title="Attach media"
                >
                  <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {showMediaMenu && (
                  <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px] z-10">
                    <button
                      onClick={() => handleFileSelect("image/*")}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 text-indigo-500" />
                      <span>Photo</span>
                    </button>
                    <button
                      onClick={() => handleFileSelect("video/*")}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Video className="w-4 h-4 text-indigo-500" />
                      <span>Video</span>
                    </button>
                    <button
                      onClick={() => handleFileSelect("*/*")}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>File</span>
                    </button>
                  </div>
                )}
              </div>

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
                disabled={!canSend}
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingApp;