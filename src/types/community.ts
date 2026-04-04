// types/community.ts

export interface Post {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  images: string[];
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  timestamp: string;
  content: string;
  reactions?: {
    fire?: number;
    clap?: number;
    bulb?: number;
    thumbs?: number;
  };
  replies: Comment[];
  parentId?: string;
}

export interface Community {
  id: string;
  name: string;
  icon: string;
  members: number | string; // allow both — sidebar passes string like "1.2k"
  posts?: number | string;
  description?: string;
  category?: string;
  isPrivate?: boolean;
  coverImage?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
  location: string;
  icon: string;
  description?: string;
  attendees?: number;
  isJoined?: boolean;
  isOnline?: boolean;
  meetingLink?: string;
  registrationLink?: string;
}

export interface TrendingTopic {
  id: string;
  title: string;
  subtitle: string;
  number: number;
}

export interface Member {
  id: string;
  name: string;
  role: "Admin" | "Moderator" | "Member" | string;
  avatar: string;
  joined: string;
  email?: string;
}

export interface NewEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  description: string;
  image: File | null;
  previewImage: string | null;
  attendees: number | null;
  meetingLink: string;
  registrationLink: string;
}

export interface NewCommunity {
  name: string;
  description: string;
  category: string;
  icon: string;
  coverImage: File | null;
  coverPreview: string | null;
  isPrivate: boolean;
  tags: string[];
}