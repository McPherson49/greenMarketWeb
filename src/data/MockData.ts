import { Community, Event, TrendingTopic, Member, Post } from "../types/community";

export const communities: Community[] = [
  { id: "1", name: "Livestock & Poultry Network", icon: "🐄", members: 1234 },
  { id: "2", name: "Bulk Supply Marketplace", icon: "📦", members: 567 },
  { id: "3", name: "Export & International Trade", icon: "🌐", members: 890 },
];

export const events: Event[] = [
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

export const trendingTopics: TrendingTopic[] = [
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

export const members: Member[] = [
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

export const initialPosts: Post[] = [
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
];