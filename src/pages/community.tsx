import React, { useState } from "react";
import Image from "next/image";

import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Smile,
  MapPin,
  Users,
  Calendar,
  ChevronRight,
  ThumbsUp,
  Send,
  Settings,
  User,
  Shield,
  Bell,
  Edit3,
  Trash2,
  Plus,
  Search,
  X,
  Upload,
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  images: string[];
  likes: number;
  comments: Comment[];
}

interface Comment {
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

interface Community {
  id: string;
  name: string;
  icon: string;
  members: number;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  icon: string;
  description?: string;
  attendees?: number;
  isJoined?: boolean;
}

interface TrendingTopic {
  id: string;
  title: string;
  subtitle: string;
  number: number;
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joined: string;
  email?: string;
}

const CommunityFeed: React.FC = () => {
  const [mainSection, setMainSection] = useState<
    "Community" | "Events" | "Settings"
  >("Community");
  const [activeTab, setActiveTab] = useState("Feed");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchMembers, setSearchMembers] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [settingsSubTab, setSettingsSubTab] = useState<
    "General" | "Members" | "Moderation" | "Notifications"
  >("General");
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    isOnline: false,
    description: "",
    image: null as File | null,
    previewImage: null as string | null,
    attendees: null as number | null,
  });

  const communities: Community[] = [
    { id: "1", name: "Livestock & Poultry Network", icon: "🐄", members: 1234 },
    { id: "2", name: "Bulk Supply Marketplace", icon: "📦", members: 567 },
    { id: "3", name: "Export & International Trade", icon: "🌐", members: 890 },
  ];
  const events: Event[] = [
    {
      id: "1",
      name: "agriFood Nigeria 2025 exhibition",
      date: "3-5 March 2025",
      location: "Lagos State Event Center",
      icon: "🌾",
      description:
        "Join us for the premier agricultural exhibition featuring livestock innovations and networking opportunities.",
      attendees: 1500,
      isJoined: false,
    },
    {
      id: "2",
      name: "GreenMarket Agro Connect 2025(Online)",
      date: "17 June 2025",
      location: "307 people have joined this event",
      icon: "🏢",
      description:
        "Virtual connect for sustainable farming practices and market linkages.",
      attendees: 307,
      isJoined: true,
    },
    {
      id: "3",
      name: "The Fintech Ecosystem Symphony",
      date: "15 July 2025",
      location: "Lagos State Event Center",
      icon: "🎵",
      description:
        "Explore fintech solutions tailored for agricultural financing and trade.",
      attendees: 800,
      isJoined: false,
    },
    {
      id: "4",
      name: "FarmMarket Expo",
      date: "Coming Soon",
      location: "437 people have joined this event",
      icon: "🚜",
      description:
        "Annual expo for farm inputs, machinery, and direct market access.",
      attendees: 437,
      isJoined: false,
    },
  ];
  const trendingTopics: TrendingTopic[] = [
    {
      id: "1",
      title: "Top tips every farmer should own",
      subtitle: "As shared by the org",
      number: 1,
    },
    {
      id: "2",
      title: "Best fertilizer mix for dry season farming",
      subtitle: "",
      number: 2,
    },
    {
      id: "3",
      title: "How I reduced feed cost by 40%",
      subtitle: "As shared by the org",
      number: 3,
    },
  ];
  const members: Member[] = [
    {
      id: "1",
      name: "Michael Brown",
      role: "Member",
      avatar: "",
      joined: "2 months ago",
      email: "michael@example.com",
    },
    {
      id: "2",
      name: "Adeline Enterprise",
      role: "Member",
      avatar: "",
      joined: "6 months ago",
      email: "adeline@example.com",
    },
    {
      id: "3",
      name: "Olajuwon Francis",
      role: "Admin",
      avatar: "",
      joined: "1 year ago",
      email: "olajuwon@example.com",
    },
    {
      id: "4",
      name: "Michael Bosch",
      role: "Moderator",
      avatar: "",
      joined: "8 months ago",
      email: "bosch@example.com",
    },
    {
      id: "5",
      name: "Alice Oyekan",
      role: "Member",
      avatar: "",
      joined: "3 months ago",
      email: "alice@example.com",
    },
    {
      id: "6",
      name: "Greg Koski",
      role: "Member",
      avatar: "",
      joined: "1 month ago",
      email: "greg@example.com",
    },
  ];
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchMembers.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchMembers.toLowerCase())
  );
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Livestock & Poultry Network",
      avatar: "🐄",
      timestamp: "3 days ago",
      content:
        "Hi, there! With the recent increase in animal feed prices, what affordable alternatives or local solutions are you using on your farm?",
      images: [
        "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=200&fit=crop",
      ],
      likes: 182,
      comments: [
        {
          id: "1",
          author: "Michael Brown",
          timestamp: "4 days ago",
          content:
            "For my cows, I rely use brewery waste way i dey collect from beer company. E cheap pass normal feed, and the animals dey grow am well.",
          reactions: { fire: 4, clap: 6, bulb: 1 },
          replies: [
            {
              id: "1-1",
              author: "Hassan Cara",
              timestamp: "3 days ago",
              content: "Yah! definitely try that Francis. Thanks!",
              replies: [],
              parentId: "1",
            },
            {
              id: "1-2",
              author: "Michael Bosch",
              timestamp: "4 days ago",
              content:
                "I think cooperating buying can help. If farmers in one area come together, we can buy food in bulk at lower prices.",
              replies: [
                {
                  id: "1-2-1",
                  author: "Michael Bosch",
                  timestamp: "4 days ago",
                  content:
                    "No good plan is, but sometimes farmers no dey trust each other with money. If we fit get one person to coordinate well, e go make sense.",
                  replies: [],
                  parentId: "1-2",
                },
              ],
              parentId: "1",
            },
          ],
        },
        {
          id: "2",
          author: "Adeline Enterprise",
          timestamp: "1 week ago",
          content:
            "In my area, we use brewery waste (spent grain) as an affordable supplement for cattle feed. It is cheap and nutritious.",
          replies: [],
        },
        {
          id: "3",
          author: "Olajuwon Francis",
          timestamp: "2 days ago",
          content:
            "For my cows, I dey use brewery waste way i dey collect from beer company. E cheap pass normal feed, and the animals dey grow am well.\n\nHas anyone tried using maggot protein or black soldier fly larvae as a substitute? I have heard it is effective and sustainable.",
          replies: [],
        },
        {
          id: "4",
          author: "Alice Oyekan",
          timestamp: "5 days ago",
          content:
            "Maybe breweries/beer can even create a cooperative group forum. If farmers join by location, the platform can help organize bulk orders and make payments easier.",
          reactions: { thumbs: 2 },
          replies: [],
        },
        {
          id: "5",
          author: "Greg Koski",
          timestamp: "6 days ago",
          content: "Nice are you thoughts?",
          replies: [],
        },
      ],
    },
  ]);
  const renderComments = (comments: Comment[], isNested = false) => {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className={isNested ? "ml-4 sm:ml-8 md:ml-10 mt-3" : "mt-4"}
      >
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full shrink-0"></div>
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-semibold text-sm text-gray-900">
                  {comment.author}
                </p>
                <span className="text-xs text-gray-500">
                  · {comment.timestamp}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {comment.content}
              </p>
            </div>

            {comment.reactions && (
              <div className="flex items-center space-x-3 mt-2 text-xs">
                {comment.reactions.fire && (
                  <span className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-full">
                    <span>🔥</span>
                    <span className="text-gray-600">
                      {comment.reactions.fire}
                    </span>
                  </span>
                )}
                {comment.reactions.clap && (
                  <span className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <span>👏</span>
                    <span className="text-gray-600">
                      {comment.reactions.clap}
                    </span>
                  </span>
                )}
                {comment.reactions.bulb && (
                  <span className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <span>💡</span>
                    <span className="text-gray-600">
                      {comment.reactions.bulb}
                    </span>
                  </span>
                )}
                {comment.reactions.thumbs && (
                  <span className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                    <span>👍</span>
                    <span className="text-gray-600">
                      {comment.reactions.thumbs}
                    </span>
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium"
              >
                Comment
              </button>
              {comment.replies.length > 0 && (
                <button className="text-xs text-green-600 hover:underline">
                  {comment.replies.length} comment
                  {comment.replies.length > 1 ? "s" : ""}
                </button>
              )}
            </div>
            {replyingTo === comment.id && (
              <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 w-full sm:w-auto">
                  Comment
                </button>
              </div>
            )}
            {comment.replies.length > 0 &&
              renderComments(comment.replies, true)}
          </div>
        </div>
      </div>
    ));
  };
  const renderFeedTab = () => (
    <>
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl shrink-0">
            🐄
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Share your thoughts or a post"
              className="w-full border-none focus:ring-0 text-gray-600 placeholder-gray-400 outline-none"
            />
            <div className="flex items-center space-x-4 mt-3">
              <button className="text-gray-400 hover:text-gray-600">
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm mb-6">
          {/* Post Header */}
          <div className="p-4 flex items-center">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl shrink-0">
                {post.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">
                  {post.author}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">Sabon Lann</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Post Content */}
          <div className="px-4 pb-3">
            <p className="text-gray-700">{post.content}</p>
          </div>
          {/* Post Images */}
          <div className="mb-3 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {post.images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className="w-full aspect-square object-cover rounded"
                />
              ))}
            </div>
            {post.images[4] && (
              <img
                src={post.images[4]}
                alt=""
                className="w-full h-48 object-cover mt-2 rounded"
              />
            )}
          </div>
          {/* Post Stats */}
          <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
            <span>
              {post.likes} Likes ·{" "}
              {post.comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)}{" "}
              comments
            </span>
          </div>
          {/* Post Actions */}
          <div className="px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 gap-2 sm:gap-0">
            <div className="flex space-x-4 w-full sm:w-auto">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 flex-1 sm:flex-none">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 flex-1 sm:flex-none">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Comment</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 flex-1 sm:flex-none">
                <Bookmark className="w-5 h-5" />
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 justify-center sm:justify-start">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
          {/* Comments Section */}
          <div className="px-4 pb-4 border-t border-gray-100 pt-4">
            {renderComments(post.comments)}
          </div>
        </div>
      ))}
    </>
  );
  const renderPeopleTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 sm:gap-0">
        <h2 className="text-xl font-semibold text-gray-900">Members</h2>
        <span className="text-sm text-gray-500">{members.length} members</span>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-b-0 gap-3 sm:gap-0"
          >
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-12 h-12 bg-gray-300 rounded-full shrink-0"></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-gray-900 truncate">
                    {member.name}
                  </p>
                  {member.role !== "Member" && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        member.role === "Admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {member.role}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Joined {member.joined}</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  const renderAboutTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        About this Community
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700">
            Welcome to the Livestock & Poultry Network - a community dedicated
            to sharing knowledge, best practices, and innovative solutions for
            livestock and poultry farming. Connect with farmers, experts, and
            suppliers to grow your agricultural business.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Community Guidelines
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 shrink-0">•</span>
              <span>Be respectful and professional in all interactions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 shrink-0">•</span>
              <span>Share accurate and helpful information</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 shrink-0">•</span>
              <span>No spam or self-promotion without permission</span>
            </li>
            <li className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-700">
                Support fellow farmers and contribute positively
              </span>
              <input type="checkbox" className="rounded" />
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">1,234</p>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-600">48</p>
              <p className="text-sm text-gray-600">Subscribers</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-600">156</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-orange-600">892</p>
              <p className="text-sm text-gray-600">Comments</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
          <p className="text-gray-700">January 15, 2024</p>
        </div>
      </div>
    </div>
  );
  const renderEventsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <button
          onClick={() => setShowCreateEvent(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 font-semibold shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Create Event Modal */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="h-48 bg-linear-to-r from-green-400 to-green-600 relative">
              <img
                src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop`}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg shrink-0">
                    {event.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {event.name}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    // Toggle join logic
                    const updatedEvents = events.map((e) =>
                      e.id === event.id ? { ...e, isJoined: !e.isJoined } : e
                    );
                    // Note: In a real app, update state here
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ml-2 ${
                    event.isJoined
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {event.isJoined ? "Leave" : "Join"}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{event.date}</p>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {event.location}
              </p>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {event.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{event.attendees} attendees</span>
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderSettingsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Community Settings
          </h2>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {["General", "Members", "Moderation", "Notifications"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setSettingsSubTab(tab as any)}
                  className={`px-3 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap shrink-0 ${
                    settingsSubTab === tab
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
          {settingsSubTab === "General" && (
            <div className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Community Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Livestock & Poultry Network"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    defaultValue="Welcome to the Livestock & Poultry Network..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                    <Edit3 className="w-4 h-4" />
                    <span>Upload Cover Photo</span>
                  </button>
                  <button className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                    <Edit3 className="w-4 h-4" />
                    <span>Change Icon</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {settingsSubTab === "Members" && (
            <div className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Manage Members
              </h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchMembers}
                  onChange={(e) => setSearchMembers(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  <span>Invite Member</span>
                </button>
              </div>
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 gap-3 sm:gap-0"
                  >
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
                      {member.role === "Member" && (
                        <select className="border border-gray-300 rounded px-2 py-1 text-sm shrink-0">
                          <option>Member</option>
                          <option>Moderator</option>
                          <option>Admin</option>
                        </select>
                      )}
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="text-blue-600 hover:text-blue-700 text-sm shrink-0"
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm shrink-0">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {selectedMember && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Editing {selectedMember.name}
                  </h4>
                  {/* Modal-like content for editing */}
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-600 underline"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}
          {settingsSubTab === "Moderation" && (
            <div className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Moderation Tools
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="auto-moderate"
                    className="rounded"
                  />
                  <label
                    htmlFor="auto-moderate"
                    className="text-sm text-gray-700"
                  >
                    Enable auto-moderation for spam
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="report-notifs"
                    className="rounded"
                  />
                  <label
                    htmlFor="report-notifs"
                    className="text-sm text-gray-700"
                  >
                    Notify admins on new reports
                  </label>
                </div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Reports</span>
                </button>
              </div>
            </div>
          )}
          {settingsSubTab === "Notifications" && (
            <div className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-700">
                    New post notifications
                  </span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-700">
                    Member join alerts
                  </span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-700">Event reminders</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg">
                  Reset All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  const renderCommunityMain = () => (
    <>
      {/* Community Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="h-32 bg-linear-to-r from-green-400 to-green-600 relative">
          <img
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=200&fit=crop"
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="w-16 h-16 bg-white rounded-full border-4 border-white -mt-8 sm:-mt-12 flex items-center justify-center text-3xl shadow-lg shrink-0">
                🐄
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  Livestock & Poultry Network
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1 flex-wrap gap-2">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    1.1k members
                  </span>
                  <span>48 subscribers</span>
                </div>
              </div>
            </div>
            <button className="bg-white border border-green-500 text-green-600 hover:bg-green-50 px-6 py-2 rounded-full font-medium w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
          {["Feed", "People", "About"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      {activeTab === "Feed" && renderFeedTab()}
      {activeTab === "People" && renderPeopleTab()}
      {activeTab === "About" && renderAboutTab()}
    </>
  );
  const renderEventsMain = () => renderEventsTab();
  const renderSettingsMain = () => renderSettingsTab();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
            <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide border-b border-gray-200 lg:border-b-0 pb-2 lg:pb-0">
              <button
                onClick={() => setMainSection("Community")}
                className={`flex items-center px-3 py-2 rounded-t-lg font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  mainSection === "Community"
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-600 hover:text-gray-900 cursor-pointer"
                }`}
              >
                My Community
              </button>
              <button
                onClick={() => setMainSection("Events")}
                className={`flex items-center px-3 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                  mainSection === "Events"
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-600 hover:text-gray-900 cursor-pointer"
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setMainSection("Settings")}
                className={`flex items-center px-3 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                  mainSection === "Settings"
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-600 hover:text-gray-900 cursor-pointer"
                }`}
              >
                Settings
              </button>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium w-full lg:w-auto justify-center lg:justify-start">
              <Plus className="w-4 h-4" />
              <span>Create a Community</span>
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            {mainSection === "Community" && (
              <>
                {/* My Community Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      My Community
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  {communities.map((community) => (
                    <div
                      key={community.id}
                      className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded -mx-2 px-2"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-2xl shrink-0">
                        {community.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {community.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {community.members} members
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Events Section */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Events</h3>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  {events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-xl shrink-0">
                          {event.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1 truncate">
                            {event.name}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            {event.date}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {mainSection === "Events" && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-lg shrink-0">
                        {event.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.name}
                        </p>
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {mainSection === "Settings" && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-2 text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded">
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded">
                    <Shield className="w-4 h-4" />
                    <span>Privacy & Safety</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded">
                    <Settings className="w-4 h-4" />
                    <span>Account</span>
                  </button>
                </div>
              </div>
            )}
          </aside>
          {/* Main Content */}
          <main className="flex-1 w-full lg:max-w-2xl">
            {mainSection === "Community" && renderCommunityMain()}
            {mainSection === "Events" && renderEventsMain()}
            {mainSection === "Settings" && renderSettingsMain()}
          </main>
          {/* Right Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            {mainSection === "Community" && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Trending now</h3>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex space-x-3 py-3 cursor-pointer hover:bg-gray-50 rounded -mx-2 px-2"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold text-sm shrink-0">
                      {topic.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {topic.title}
                      </p>
                      {topic.subtitle && (
                        <p className="text-xs text-gray-500 mt-1">
                          {topic.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {mainSection === "Events" && (
              <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                <h3 className="font-semibold text-gray-900">My Events</h3>
                {events
                  .filter((e) => e.isJoined)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="text-sm text-gray-700 line-clamp-2"
                    >
                      {event.name} - {event.date}
                    </div>
                  ))}
              </div>
            )}
            {mainSection === "Settings" && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Community Stats
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">1,234</p>
                    <p className="text-xs text-gray-500">Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
      {showCreateEvent && (
        <div className="fixed inset-0 z-50  flex items-center justify-center bg-black/50 px-4 backdrop-blur supports-backdrop-filter:bg-white/60 border-b border-neutral-200 overflow-y-auto">
          <div className="bg-white mt-20 rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Event
              </h2>
              <button
                onClick={() => setShowCreateEvent(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="e.g., agriFood Nigeria 2025 Exhibition"
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* Date & Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time (optional)
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                    placeholder="e.g., Lagos Event Center or Online (Zoom)"
                    className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <label className="flex items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={newEvent.isOnline}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, isOnline: e.target.checked })
                      }
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <span className="text-sm font-medium">Online Event</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  rows={6}
                  placeholder="Tell people what this event is about, agenda, speakers, etc..."
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700 leading-relaxed"
                />
              </div>

              {/* Event Image */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Event Image
                </label>
                <div className="space-y-4">
                  {newEvent.previewImage ? (
                    <div className="relative max-w-full rounded-xl overflow-hidden shadow-md border border-gray-200 aspect-8/4">
                      {/* Use fill for perfect responsiveness */}
                      <Image
                        src={newEvent.previewImage}
                        alt="Event preview"
                        fill
                        className="object-cover"
                        unoptimized // Important for local object URLs!
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewEvent({
                            ...newEvent,
                            previewImage: null,
                            image: null,
                          });
                        }}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors z-10"
                      >
                        <X className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="max-w-full aspect-8/4 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p className="text-gray-400 text-center px-4">
                        No image selected
                      </p>
                    </div>
                  )}

                  <div className="text-center">
                    <label className="cursor-pointer inline-flex items-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
                      <Upload className="w-5 h-5" />
                      Upload Event Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setNewEvent({
                              ...newEvent,
                              image: file,
                              previewImage: url,
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-3">
                      Recommended: 1200×600px · JPG, PNG · Max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Expected Attendees */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4" />
                  Expected Attendees (optional)
                </label>
                <input
                  type="number"
                  value={newEvent.attendees || ""}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      attendees: parseInt(e.target.value) || null,
                    })
                  }
                  placeholder="e.g., 500"
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-4 rounded-b-2xl">
              <button
                onClick={() => setShowCreateEvent(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("New event submitted:", newEvent);
                  alert(
                    "Event submitted for approval! Admin will review it soon."
                  );
                  setShowCreateEvent(false);
                  // Reset form
                  setNewEvent({
                    title: "",
                    date: "",
                    time: "",
                    location: "",
                    isOnline: false,
                    description: "",
                    image: null,
                    previewImage: null,
                    attendees: null,
                  });
                }}
                disabled={
                  !newEvent.title ||
                  !newEvent.date ||
                  !newEvent.location ||
                  !newEvent.description
                }
                className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-md transition-colors"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
