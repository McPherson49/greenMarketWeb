// api/chat.ts
import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";

export interface Message {
  id: number;
  chat_id: number;
  message: string;
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
      // Flatten the grouped messages into a single array
      const allMessages: Message[] = [];
      Object.values(response.data.data).forEach((dayMessages) => {
        allMessages.push(...dayMessages);
      });
      // Sort by created_at to maintain chronological order
      return allMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    toast.error("Failed to load messages");
    return null;
  } catch (error) {
    console.error("Error fetching messages:", error);
    toast.error("Error fetching messages");
    return null;
  }
};


// SEND MESSAGE
export const sendMessage = async (
  receiverId: string, 
  text: string
): Promise<Message | null> => {
  try {
    const response = await ApiFetcher.post<{ messages: { [date: string]: Message[] } }>(
      `/chats/messages/${receiverId}`, 
      { text }
    );
    if (response?.data?.messages) {
      // Get the most recent message from the response
      const allMessages: Message[] = [];
      Object.values(response.data.messages).forEach((dayMessages) => {
        allMessages.push(...dayMessages);
      });
      // Sort by created_at and return the latest message
      const sortedMessages = allMessages.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      return sortedMessages[0] || null;
    }
    toast.error("Failed to send message");
    return null;
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Error sending message");
    return null;
  }
};
