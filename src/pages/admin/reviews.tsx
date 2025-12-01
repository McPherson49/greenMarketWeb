import React, { useState } from 'react';
import { 
  FaStar, 
  FaRegStar, 
  FaUserCircle, 
  FaThumbsUp,
  FaCamera,
  FaReply
} from 'react-icons/fa';

// Sample reviews data
const reviews = [
  {
    id: 1,
    reviewer: {
      name: 'Emily Carter',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face', // Placeholder
      location: 'New York, NY'
    },
    rating: 5,
    date: '2025-11-20',
    title: 'Outstanding Marketplace Experience',
    text: 'GreenMarket has revolutionized how I buy and sell unique items. The escrow system provides peace of mind, and the buyer-seller matching is spot on. Highly recommend for anyone in the marketplace scene!',
    helpfulCount: 12,
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'],
    reply: null
  },
  {
    id: 2,
    reviewer: {
      name: 'Michael Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      location: 'Los Angeles, CA'
    },
    rating: 4,
    date: '2025-11-18',
    title: 'Great App with Minor Improvements Needed',
    text: 'Love the secure transactions and diverse seller base on GreenMarket. Delivery tracking could be more detailed, but overall, it\'s a solid platform for meeting reliable sellers.',
    helpfulCount: 8,
    photos: [],
    reply: 'Thank you for your feedback, Michael! We\'re working on enhanced tracking features in the next update. - GreenMarket Team'
  },
  {
    id: 3,
    reviewer: {
      name: 'Sophia Lee',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      location: 'Chicago, IL'
    },
    rating: 5,
    date: '2025-11-22',
    title: 'Seamless Buyer-Seller Connections',
    text: 'As a frequent buyer, GreenMarket makes it effortless to find quality sellers. The review system builds trust, and customer support is responsive. Five stars all the way!',
    helpfulCount: 15,
    photos: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop'],
    reply: null
  },
  {
    id: 4,
    reviewer: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      location: 'San Francisco, CA'
    },
    rating: 3,
    date: '2025-11-15',
    title: 'Good Concept, App Needs Polish',
    text: 'The idea of a green-focused marketplace is fantastic, but the interface feels clunky on mobile. Escrow holds funds securely, though—worth sticking around for updates.',
    helpfulCount: 5,
    photos: [],
    reply: 'We appreciate your honesty, David. Mobile optimizations are our top priority. Stay tuned! - GreenMarket Team'
  },
  {
    id: 5,
    reviewer: {
      name: 'Olivia Martinez',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      location: 'Miami, FL'
    },
    rating: 5,
    date: '2025-11-24',
    title: 'Best App for Eco-Friendly Trades',
    text: 'GreenMarket connects me with sellers who prioritize sustainability. Transactions are smooth, and the community is welcoming. Already planning my next purchase!',
    helpfulCount: 20,
    photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'],
    reply: null
  },
];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        <FaStar />
      </span>
    ))}
  </div>
);

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReviews, setFilteredReviews] = useState(reviews);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = reviews.filter(
      (review) =>
        review.reviewer.name.toLowerCase().includes(term.toLowerCase()) ||
        review.title.toLowerCase().includes(term.toLowerCase()) ||
        review.text.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredReviews(filtered);
  };

  const handleHelpfulClick = (id: number) => {
    // Simulate helpful vote
    console.log(`Marked review ${id} as helpful`);
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Customer Reviews</h1>
          <p className="text-sm text-gray-500">Discover what users are saying about GreenMarket</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {/* Reviewer Info */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={review.reviewer.avatar}
                alt={review.reviewer.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=?';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{review.reviewer.name}</h3>
                  <Stars rating={review.rating} />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{review.reviewer.location}</span>
                  <span>•</span>
                  <span>{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Review Title and Text */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-800 mb-2">{review.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
            </div>

            {/* Photos */}
            {review.photos.length > 0 && (
              <div className="flex gap-2 mb-4">
                {review.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt="Review photo"
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
                {review.photos.length > 3 && (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                    +{review.photos.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button
                  onClick={() => handleHelpfulClick(review.id)}
                  className="flex items-center gap-1 hover:text-green-600 transition-colors"
                >
                  <FaThumbsUp />
                  <span>Helpful ({review.helpfulCount})</span>
                </button>
                {review.photos.length > 0 && (
                  <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                    <FaCamera />
                    <span>{review.photos.length} photo{review.photos.length > 1 ? 's' : ''}</span>
                  </button>
                )}
              </div>
              {review.reply && (
                <div className="text-right">
                  <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors">
                    <FaReply />
                    <span>Read reply</span>
                  </button>
                </div>
              )}
            </div>

            {/* Reply Section */}
            {review.reply && (
              <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 italic">"{review.reply}"</p>
                <p className="text-xs text-gray-500 mt-1">— GreenMarket Team</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FaUserCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Found</h3>
          <p className="text-sm">Try adjusting your search to find matching reviews.</p>
        </div>
      )}
    </div>
  );
}