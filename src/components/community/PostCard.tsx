import React, { useState } from "react";
import { Heart, MessageCircle, Bookmark, Share2, MapPin } from "lucide-react";
import { Post } from "../../types/community";
import CommentThread from "./CommentThread";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const totalComments = post.comments.reduce(
    (acc, c) => acc + 1 + c.replies.length,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      {/* Header */}
      <div className="p-4 flex items-center">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl shrink-0">
            {post.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 truncate">{post.author}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">Sabon Lann</span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-700">{post.content}</p>
      </div>

      {/* Images */}
      {post.images.length > 0 && (
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
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
        <span>
          {post.likes} Likes · {totalComments} comments
        </span>
      </div>

      {/* Actions */}
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

      {/* Comments */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-4">
        <CommentThread
          comments={post.comments}
          replyingTo={replyingTo}
          replyText={replyText}
          onReply={(id) => setReplyingTo(id)}
          onReplyTextChange={setReplyText}
          onCancelReply={() => { setReplyingTo(null); setReplyText(""); }}
          onSubmitReply={() => { setReplyingTo(null); setReplyText(""); }}
        />
      </div>
    </div>
  );
};

export default PostCard;