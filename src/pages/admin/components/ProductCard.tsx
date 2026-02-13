import React from 'react';
import { FiTrendingUp, FiTrash2, FiEye } from 'react-icons/fi';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    status: 'rejected' | 'publish' | 'pending' | 'draft' | 'trash';
    thumbnail: string;
    views: number;
    uiRating: number;
    uiReviewCount: number;
    originalPrice?: number;
    category: string;
    tags: string[];
    purchased_ad: boolean;
  };
  onStatusChange: (productId: number, newStatus: 'rejected' | 'publish' | 'pending' | 'draft' | 'trash') => void;
  onDelete: (productId: number) => void;
  onBoostAd: (productId: number) => void;
}

export default function ProductCard({ 
  product, 
  onStatusChange, 
  onDelete, 
  onBoostAd 
}: ProductCardProps) {
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < rating ? <AiFillStar key={i} className="text-yellow-400" /> : <AiOutlineStar key={i} className="text-gray-300" />
    ));
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publish': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'trash': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        {product.thumbnail ? (
          <img 
            src={product.thumbnail} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(product.status)}`}>
            {product.status}
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-2 left-2 flex gap-1">
          <button
            onClick={() => onStatusChange(product.id, 'publish')}
            className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
            title="Publish"
          >
            <FiTrendingUp size={14} className="text-green-600" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
            title="Delete"
          >
            <FiTrash2 size={14} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title and Category */}
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500">{product.category}</p>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
          {product.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{product.tags.length - 3}
            </span>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {renderStars(product.uiRating)}
          </div>
          <span className="text-xs text-gray-500">
            ({product.uiReviewCount} reviews)
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ₦{formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">
              ₦{formatPrice(product.price)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FiEye size={12} />
              <span>{product.views}</span>
            </div>
            
            {product.purchased_ad && (
              <button
                onClick={() => onBoostAd(product.id)}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Boost
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
