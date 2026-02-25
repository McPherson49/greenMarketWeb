import React from "react";
import { Comment } from "../../types/community";

interface CommentThreadProps {
  comments: Comment[];
  replyingTo: string | null;
  replyText: string;
  isNested?: boolean;
  onReply: (id: string) => void;
  onReplyTextChange: (text: string) => void;
  onCancelReply: () => void;
  onSubmitReply: () => void;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  replyingTo,
  replyText,
  isNested = false,
  onReply,
  onReplyTextChange,
  onCancelReply,
  onSubmitReply,
}) => {
  return (
    <>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={isNested ? "ml-4 sm:ml-8 md:ml-10 mt-3" : "mt-4"}
        >
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full shrink-0" />
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
                      <span className="text-gray-600">{comment.reactions.fire}</span>
                    </span>
                  )}
                  {comment.reactions.clap && (
                    <span className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <span>👏</span>
                      <span className="text-gray-600">{comment.reactions.clap}</span>
                    </span>
                  )}
                  {comment.reactions.bulb && (
                    <span className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <span>💡</span>
                      <span className="text-gray-600">{comment.reactions.bulb}</span>
                    </span>
                  )}
                  {comment.reactions.thumbs && (
                    <span className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                      <span>👍</span>
                      <span className="text-gray-600">{comment.reactions.thumbs}</span>
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => onReply(comment.id)}
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
                    onChange={(e) => onReplyTextChange(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={onCancelReply}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSubmitReply}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 w-full sm:w-auto"
                  >
                    Comment
                  </button>
                </div>
              )}

              {comment.replies.length > 0 && (
                <CommentThread
                  comments={comment.replies}
                  replyingTo={replyingTo}
                  replyText={replyText}
                  isNested
                  onReply={onReply}
                  onReplyTextChange={onReplyTextChange}
                  onCancelReply={onCancelReply}
                  onSubmitReply={onSubmitReply}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CommentThread;