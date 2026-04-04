"use client";

import React, { useState } from "react";
import {
  Heart, MessageCircle, Share2, MapPin, Trash2, MoreHorizontal, Loader2,
} from "lucide-react";
import {
  ApiPost, ApiComment, likePost, createComment,
  replyToComment, deletePost, getPostComments,
} from "@/services/community";
import CommentThread from "./CommentThread";
import { Comment } from "@/types/community";

interface PostCardProps {
  post: ApiPost;
  communityId: number | string;
  token?: string;
  currentUserId?: number;
  onDeleted?: (postId: number) => void;
}

/** Resolve the best available avatar URL from a user object */
function resolveAvatar(user?: { avatar?: string; avatar_url?: string }): string | undefined {
  return user?.avatar_url || user?.avatar || undefined;
}

/** Resolve display name — API uses "user", fallback to "author" for compat */
function resolveUser(post: ApiPost) {
  const u = post.user ?? post.author;
  return {
    id:     u?.id,
    name:   u?.name ?? "Unknown",
    avatar: resolveAvatar(u),
  };
}

function mapComment(c: ApiComment): Comment {
  // Comments also use "user" field
  const u = c.user ?? c.author;
  return {
    id:        String(c.id),
    author:    u?.name ?? "Unknown",
    avatar:    resolveAvatar(u),
    content:   c.content,
    timestamp: formatRelative(c.created_at),
    replies:   (c.replies ?? []).map(mapComment),
    reactions: {},
  };
}

function formatRelative(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch { return ""; }
}

function extractComments(res: unknown): ApiComment[] {
  if (Array.isArray(res)) return res as ApiComment[];
  if (res && typeof res === "object") {
    const obj = res as { data?: unknown };
    if (Array.isArray(obj.data)) return obj.data as ApiComment[];
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as { data?: unknown };
      if (Array.isArray(inner.data)) return inner.data as ApiComment[];
    }
  }
  return [];
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  communityId,
  token,
  currentUserId,
  onDeleted,
}) => {
  const postUser = resolveUser(post);

  const [liked,       setLiked]       = useState(post.is_liked ?? false);
  const [likesCount,  setLikesCount]  = useState(post.likes_count);
  const [likeLoading, setLikeLoading] = useState(false);

  const [comments,        setComments]        = useState<Comment[]>([]);
  const [commentsLoaded,  setCommentsLoaded]  = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showComments,    setShowComments]    = useState(false);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText,  setReplyText]  = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied,   setCopied]   = useState(false);

  // Owner check: compare against post.user_id OR the resolved user id
  const isOwner =
    currentUserId != null &&
    (post.user_id === currentUserId || postUser.id === currentUserId);

  // ── Likes ───────────────────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!token) return;
    setLikeLoading(true);
    try {
      await likePost(communityId, post.id, token);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Like failed:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  // ── Comments ────────────────────────────────────────────────────────────────
  const handleToggleComments = async () => {
    setShowComments((prev) => !prev);
    if (!commentsLoaded) {
      setCommentsLoading(true);
      try {
        const res = await getPostComments(communityId, post.id, 20);
        setComments(extractComments(res).map(mapComment));
        setCommentsLoaded(true);
      } catch (err) {
        console.error("Comments load failed:", err);
      } finally {
        setCommentsLoading(false);
      }
    }
  };

  const handleSubmitComment = async () => {
    if (!token || !newComment.trim()) return;
    setSubmitting(true);
    try {
      const created = await createComment(
        communityId, post.id, { content: newComment.trim() }, token
      );
      setComments((prev) => [mapComment(created), ...prev]);
      setNewComment("");
      if (!showComments) setShowComments(true);
      setCommentsLoaded(true);
    } catch (err) {
      console.error("Comment failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!token || !replyText.trim() || !replyingTo) return;
    setSubmitting(true);
    try {
      const created = await replyToComment(
        communityId, post.id, replyingTo,
        { content: replyText.trim() }, token
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyingTo
            ? { ...c, replies: [...c.replies, mapComment(created)] }
            : c
        )
      );
      setReplyingTo(null);
      setReplyText("");
    } catch (err) {
      console.error("Reply failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!token || !window.confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await deletePost(communityId, post.id, token);
      onDeleted?.(post.id);
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleting(false);
    }
  };

  // ── Share ───────────────────────────────────────────────────────────────────
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const authorInitial = postUser.name.charAt(0).toUpperCase();
  const timeAgo       = formatRelative(post.created_at);

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      {/* ── Header ── */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700 shrink-0 overflow-hidden">
            {postUser.avatar ? (
              <img
                src={postUser.avatar}
                alt={postUser.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              authorInitial
            )}
          </div>

          <div className="min-w-0 flex-1">
            {/* Name — now correctly shows BasamFarm etc. */}
            <p className="font-semibold text-gray-900 truncate">{postUser.name}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Owner menu */}
        {isOwner && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  {deleting
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Title ── */}
      {post.title && (
        <div className="px-4 pb-1">
          <h3 className="font-semibold text-gray-900">{post.title}</h3>
        </div>
      )}

      {/* ── Content ── */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* ── Tags ── */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Images ── */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3 px-4">
          <div className={`grid gap-2 ${
            post.images.length === 1 ? "grid-cols-1"
            : post.images.length === 2 ? "grid-cols-2"
            : "grid-cols-2 sm:grid-cols-3"
          }`}>
            {post.images.slice(0, 4).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                className="w-full aspect-square object-cover rounded-lg"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-100">
        {likesCount} like{likesCount !== 1 ? "s" : ""} · {post.comments_count} comment{post.comments_count !== 1 ? "s" : ""}
      </div>

      {/* ── Actions ── */}
      <div className="px-4 py-2 flex items-center space-x-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={likeLoading || !token}
          className={`flex items-center space-x-2 transition-colors ${
            liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          } disabled:opacity-50`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm font-medium">Like</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Comment</span>
        </button>

        <button
          onClick={handleShare}
          className={`flex items-center space-x-2 transition-colors ${
            copied ? "text-green-600" : "text-gray-600 hover:text-green-600"
          }`}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>

      {/* ── Comment input ── */}
      {token && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmitComment()}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Post
            </button>
          </div>
        </div>
      )}

      {/* ── Comments list ── */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {commentsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-green-500" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">
              No comments yet. Be the first!
            </p>
          ) : (
            <CommentThread
              comments={comments}
              replyingTo={replyingTo}
              replyText={replyText}
              onReply={(id) => setReplyingTo(id)}
              onReplyTextChange={setReplyText}
              onCancelReply={() => { setReplyingTo(null); setReplyText(""); }}
              onSubmitReply={handleSubmitReply}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;