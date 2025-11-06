import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Image, Smile, MapPin, Users, Calendar, ChevronRight } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
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
}

interface TrendingTopic {
  id: string;
  title: string;
  subtitle: string;
  number: number;
}

const CommunityFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Feed');
  
  const communities: Community[] = [
    { id: '1', name: 'Livestock & Poultry Network', icon: '🐄', members: 1234 },
    { id: '2', name: 'Bulk Supply Marketplace', icon: '📦', members: 567 },
    { id: '3', name: 'Export & International Trade', icon: '🌐', members: 890 }
  ];

  const events: Event[] = [
    { id: '1', name: 'agriFood Nigeria 2025 exhibition', date: '3-5 March 2025', location: 'Lagos State Event Center', icon: '🌾' },
    { id: '2', name: 'GreenMarket Agro Connect 2025(Online)', date: '17 June 2025', location: '307 people have joined this event', icon: '🏢' },
    { id: '3', name: 'The Fintech Ecosystem Symphony', date: '15 July 2025', location: 'Lagos State Event Center', icon: '🎵' },
    { id: '4', name: 'FarmMarket Expo', date: 'Coming Soon', location: '437 people have joined this event', icon: '🚜' }
  ];

  const trendingTopics: TrendingTopic[] = [
    { id: '1', title: 'Top tips every farmer should own', subtitle: 'As shared by the org', number: 1 },
    { id: '2', title: 'Best fertilizer mix for dry season farming', subtitle: '', number: 2 },
    { id: '3', title: 'How I reduced feed cost by 40%', subtitle: 'As shared by the org', number: 3 }
  ];

  const posts: Post[] = [
    {
      id: '1',
      author: 'Livestock & Poultry Network',
      avatar: '🐄',
      timestamp: '3 days ago',
      content: 'Hi, there! With the recent increase in animal feed prices, what affordable alternatives or local solutions are you using on your farm?',
      images: [
        'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=200&fit=crop'
      ],
      likes: 182,
      comments: 7
    }
  ];

  const comments = [
    {
      id: '1',
      author: 'Michael Brown',
      timestamp: '4 days ago',
      content: 'For my cows, I rely use brewery waste way i dey collect from beer company. E cheap pass normal feed, and the animals dey grow am well.',
      reactions: { fire: 4, clap: 6, bulb: 1 },
      replies: 2
    },
    {
      id: '2',
      author: 'Adeline Enterprise',
      timestamp: '1 week ago',
      content: 'In my area, we use brewery waste (spent grain) as an affordable supplement for cattle feed. It\'s cheap and nutritious.',
      replies: 0
    },
    {
      id: '3',
      author: 'Olajuwon Francis',
      timestamp: '2 days ago',
      content: 'For my cows, I dey use brewery waste way i dey collect from beer company. E cheap pass normal feed, and the animals dey grow am well.\n\nHas anyone tried using maggot protein or black soldier fly larvae as a substitute? I have heard it is effective and sustainable.',
      replies: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <span className="font-semibold text-gray-900">My Community</span>
            <span className="text-gray-600 cursor-pointer hover:text-gray-900">Events</span>
            <span className="text-gray-600 cursor-pointer hover:text-gray-900">Settings</span>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span className="text-xl">+</span>
            <span>Create a Community</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Left Sidebar */}
        <aside className="w-64 flex-shrink-0">
          {/* My Community Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">My Community</h3>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            {communities.map((community) => (
              <div key={community.id} className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded -mx-2 px-2">
                <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-2xl">
                  {community.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{community.name}</p>
                  <p className="text-xs text-gray-500">{community.members} members</p>
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
            {events.map((event) => (
              <div key={event.id} className="py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-xl flex-shrink-0">
                    {event.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">{event.name}</p>
                    <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                    <p className="text-xs text-gray-400">{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-2xl">
          {/* Community Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="h-32 bg-gradient-to-r from-green-400 to-green-600 relative">
              <img 
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=200&fit=crop" 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-full border-4 border-white -mt-12 flex items-center justify-center text-3xl shadow-lg">
                    🐄
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Livestock & Poultry Network</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        1.1k members
                      </span>
                      <span>48 subscribers</span>
                    </div>
                  </div>
                </div>
                <button className="bg-white border border-green-500 text-green-600 hover:bg-green-50 px-6 py-2 rounded-full font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex border-b border-gray-200">
              {['Feed', 'People', 'About'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium ${
                    activeTab === tab
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Create Post */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                🐄
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Share your thoughts or a post"
                  className="w-full border-none focus:ring-0 text-gray-600 placeholder-gray-400"
                />
                <div className="flex items-center space-x-4 mt-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Image className="w-5 h-5" />
                  </button>
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
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                    {post.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>Sabon Lann</span>
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
              <div className="grid grid-cols-4 gap-1 mb-3">
                {post.images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className={idx === 0 ? 'col-span-2 row-span-2' : ''}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="col-span-4">
                  <img src={post.images[4]} alt="" className="w-full h-48 object-cover" />
                </div>
              </div>

              {/* Post Stats */}
              <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                <span>{post.likes} Likes · {post.comments} comments</span>
              </div>

              {/* Post Actions */}
              <div className="px-4 py-2 flex items-center justify-between border-t border-gray-100">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">Like</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Comment</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                  <Bookmark className="w-5 h-5" />
                  <span className="text-sm font-medium">Save</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              {/* Comments */}
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
                        <p className="text-sm text-gray-500 mb-1">{comment.timestamp}</p>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      {comment.reactions && (
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <span>🔥</span>
                            <span>{comment.reactions.fire}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>👏</span>
                            <span>{comment.reactions.clap}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>💡</span>
                            <span>{comment.reactions.bulb}</span>
                          </span>
                        </div>
                      )}
                      {comment.replies > 0 && (
                        <button className="text-xs text-green-600 hover:underline mt-2">
                          {comment.replies} comments
                        </button>
                      )}
                      <button className="text-xs text-gray-500 hover:text-gray-700 mt-2 ml-4">
                        Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Trending now</h3>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            {trendingTopics.map((topic) => (
              <div key={topic.id} className="flex space-x-3 py-3 cursor-pointer hover:bg-gray-50 rounded -mx-2 px-2">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold text-sm flex-shrink-0">
                  {topic.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{topic.title}</p>
                  {topic.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{topic.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunityFeed;