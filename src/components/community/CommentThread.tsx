import React, { useState } from "react";
import { Trash2, Pencil, X, Check } from "lucide-react";
import { Comment } from "../../types/community";

interface CommentThreadProps {
  comments: Comment[];
  replyingTo: string | null;
  replyText: string;
  isNested?: boolean;
  rootCommentId?: string;
  /** Logged-in user's numeric ID — controls edit/delete visibility */
  currentUserId?: number;
  onReply: (commentId: string, rootId: string) => void;
  onReplyTextChange: (text: string) => void;
  onCancelReply: () => void;
  onSubmitReply: () => void;
  onDeleteComment: (commentId: string) => void;
  onEditComment: (commentId: string, newContent: string) => void;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  replyingTo,
  replyText,
  isNested = false,
  rootCommentId,
  currentUserId,
  onReply,
  onReplyTextChange,
  onCancelReply,
  onSubmitReply,
  onDeleteComment,
  onEditComment,
}) => {
  const [editingId,   setEditingId]   = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const submitEdit = (commentId: string) => {
    if (!editContent.trim()) return;
    onEditComment(commentId, editContent.trim());
    setEditingId(null);
    setEditContent("");
  };

  return (
    <>
      {comments.map((comment) => {
        const thisRoot  = rootCommentId ?? comment.id;
        // userId lives on Comment now (optional number)
        const isOwner   = currentUserId != null && comment.userId === currentUserId;
        const isEditing = editingId === comment.id;

        return (
          <div
            key={comment.id}
            className={isNested ? "ml-4 sm:ml-8 md:ml-10 mt-3" : "mt-4"}
          >
            <div className="flex space-x-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center text-xs font-semibold text-gray-500">
                {comment.avatar ? (
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  comment.author.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex-1">
                {/* Bubble */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
                      <span className="text-xs text-gray-500">· {comment.timestamp}</span>
                    </div>
                    {isOwner && !isEditing && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                          title="Edit comment"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline edit */}
                  {isEditing ? (
                    <div className="space-y-2 mt-1">
                      <textarea
                        autoFocus
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                        <button
                          onClick={() => submitEdit(comment.id)}
                          disabled={!editContent.trim()}
                          className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-200 rounded-lg"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-line">{comment.content}</p>
                  )}
                </div>

                {/* Reactions */}
                {comment.reactions && (
                  <div className="flex items-center space-x-3 mt-2 text-xs">
                    {comment.reactions.fire   && <span className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-full"><span>🔥</span><span className="text-gray-600">{comment.reactions.fire}</span></span>}
                    {comment.reactions.clap   && <span className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full"><span>👏</span><span className="text-gray-600">{comment.reactions.clap}</span></span>}
                    {comment.reactions.bulb   && <span className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full"><span>💡</span><span className="text-gray-600">{comment.reactions.bulb}</span></span>}
                    {comment.reactions.thumbs && <span className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full"><span>👍</span><span className="text-gray-600">{comment.reactions.thumbs}</span></span>}
                  </div>
                )}

                {/* Reply button */}
                {!isEditing && (
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => onReply(comment.id, thisRoot)}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Reply
                    </button>
                    {(comment.replies?.length ?? 0) > 0 && (
                      <span className="text-xs text-green-600">
                        {comment.replies.length} repl{comment.replies.length > 1 ? "ies" : "y"}
                      </span>
                    )}
                  </div>
                )}

                {/* Inline reply input */}
                {replyingTo === comment.id && (
                  <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => onReplyTextChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmitReply(); }
                        if (e.key === "Escape") onCancelReply();
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button onClick={onCancelReply} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 w-full sm:w-auto">
                      Cancel
                    </button>
                    <button onClick={onSubmitReply} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 w-full sm:w-auto">
                      Reply
                    </button>
                  </div>
                )}

                {/* Nested replies */}
                {(comment.replies?.length ?? 0) > 0 && (
                  <CommentThread
                    comments={comment.replies}
                    replyingTo={replyingTo}
                    replyText={replyText}
                    isNested
                    rootCommentId={thisRoot}
                    currentUserId={currentUserId}
                    onReply={onReply}
                    onReplyTextChange={onReplyTextChange}
                    onCancelReply={onCancelReply}
                    onSubmitReply={onSubmitReply}
                    onDeleteComment={onDeleteComment}
                    onEditComment={onEditComment}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CommentThread;