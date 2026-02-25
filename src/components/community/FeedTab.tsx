import React from "react";
import { Smile } from "lucide-react";
import { Post } from "../../types/community";
import PostCard from "./PostCard";

interface FeedTabProps {
  posts: Post[];
}

const FeedTab: React.FC<FeedTabProps> = ({ posts }) => {
  return (
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
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default FeedTab;