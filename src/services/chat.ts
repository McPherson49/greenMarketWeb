// api/chat.ts
import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";

export interface Message {
  id: number;
  chat_id: number;
  message: string;
  media_url?: string;       // URL of uploaded media returned by server
  media_type?: string;      // "image" | "video" | "file"
  meta: any;
  created_at: string;
  updated_at: string;
  is_sender: boolean;
  time: string;
}

export interface ChatInfo {
  id: number;
  avatar: string;
  user_id: number;
  message: string;
  time: string;
  date: string;
  name: string;
}

export interface MessagesResponse {
  data: { [date: string]: Message[] };
  chat: ChatInfo;
}

export interface ChatListItem {
  id: number;
  avatar: string;
  user_id: number;
  message: string;
  time: string;
  date: string;
  name: string;
}

// Helper: flatten + sort grouped messages
const flattenMessages = (grouped: { [date: string]: Message[] }): Message[] => {
  const all: Message[] = [];
  Object.values(grouped).forEach((dayMessages) => all.push(...dayMessages));
  return all.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
};

// GET CHAT LIST
export const getChatList = async (): Promise<ChatListItem[] | null> => {
  try {
    const response = await ApiFetcher.get<{ data: ChatListItem[] }>(`/chats`);
    if (response?.data?.data) {
      return response.data.data;
    }
    toast.error("Failed to load chat list");
    return null;
  } catch (error) {
    console.error("Error fetching chat list:", error);
    toast.error("Error fetching chat list");
    return null;
  }
};

// GET MESSAGES FOR A RECEIVER
export const getMessages = async (receiverId: string): Promise<Message[] | null> => {
  try {
    const response = await ApiFetcher.get<MessagesResponse>(`/chats/messages/${receiverId}`);
    if (response?.data?.data) {
      return flattenMessages(response.data.data);
    }
    toast.error("Failed to load messages");
    return null;
  } catch (error) {
    console.error("Error fetching messages:", error);
    toast.error("Error fetching messages");
    return null;
  }
};

// SEND TEXT MESSAGE
export const sendMessage = async (
  receiverId: string,
  message: string
): Promise<Message | null> => {
  try {
    const response = await ApiFetcher.post<{ messages: { [date: string]: Message[] } }>(
      `/chats/messages/${receiverId}`,
      { message }
    );
    if (response?.data?.messages) {
      const sorted = flattenMessages(response.data.messages);
      return sorted[sorted.length - 1] || null;
    }
    toast.error("Failed to send message");
    return null;
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Error sending message");
    return null;
  }
};

// SEND MEDIA MESSAGE (image / video / file)
// Posts as multipart/form-data so the server receives the actual file.
// Optionally include a caption text alongside the media.
export const sendMediaMessage = async (
  receiverId: string,
  file: File,
  caption?: string
): Promise<Message | null> => {
  try {
    const formData = new FormData();
    formData.append("media", file);
    if (caption?.trim()) {
      formData.append("message", caption.trim());
    }

    const response = await ApiFetcher.post<{ messages: { [date: string]: Message[] } }>(
      `/chats/messages/${receiverId}`,
      formData,
      // Tell axios (or your fetcher) not to set Content-Type manually —
      // the browser sets it automatically with the correct boundary for FormData.
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response?.data?.messages) {
      const sorted = flattenMessages(response.data.messages);
      return sorted[sorted.length - 1] || null;
    }
    toast.error("Failed to send media");
    return null;
  } catch (error) {
    console.error("Error sending media:", error);
    toast.error("Error sending media");
    return null;
  }
};