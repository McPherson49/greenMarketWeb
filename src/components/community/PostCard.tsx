"use client";

import React, { useState } from "react";
import {
  Heart, MessageCircle, Share2, MapPin, Trash2, MoreHorizontal,
  Loader2, Pencil, X, Check,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  ApiPost, ApiComment,
  likePost, createComment, replyToComment,
  deletePost, updatePost, getPostComments,
  deleteComment, updateComment,
} from "@/services/community";
import CommentThread from "./CommentThread";
import { Comment } from "@/types/community";

interface PostCardProps {
  post: ApiPost;
  communityId: number | string;
  token?: string;
  currentUserId?: number;
  onDeleted?: (postId: number) => void;
  onUpdated?: (post: ApiPost) => void;
}

const STORAGE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ?? "";

/**
 * Turns a relative storage path like "community/posts/images/xxx.png"
 * into a full URL like "https://escrow.greenmarket.com.ng/storage/community/posts/images/xxx.png".
 * Leaves already-absolute URLs untouched.
 */
function resolveImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Strip any leading slash then prepend storage base
  return `${STORAGE_BASE}/storage/${path.replace(/^\/+/, "")}`;
}

function resolveAvatar(user?: { avatar?: string; avatar_url?: string }): string | undefined {
  return user?.avatar_url || user?.avatar || undefined;
}

function resolveUser(post: ApiPost) {
  const u = post.user ?? post.author;
  return { id: u?.id, name: u?.name ?? "Unknown", avatar: resolveAvatar(u) };
}

function mapComment(c: ApiComment): Comment {
  const u = c.user ?? c.author;
  return {
    id:        String(c.id),
    author:    u?.name ?? "Unknown",
    avatar:    resolveAvatar(u),
    content:   c.content,
    timestamp: formatRelative(c.created_at),
    replies:   (c.replies ?? []).map(mapComment),
    reactions: {},
    userId:    u?.id,
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

function extractErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { status?: number; data?: { message?: string } } };
  const status  = e?.response?.status;
  const message = e?.response?.data?.message;
  if (status === 410) return "This comment no longer exists. Please refresh.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 422 && message) return message;
  return message ?? fallback;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  communityId,
  token,
  currentUserId,
  onDeleted,
  onUpdated,
}) => {
  const postUser = resolveUser(post);

  const [liked,       setLiked]       = useState(post.is_liked ?? false);
  const [likesCount,  setLikesCount]  = useState(post.likes_count);
  const [likeLoading, setLikeLoading] = useState(false);

  const [editingPost, setEditingPost] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editTitle,   setEditTitle]   = useState(post.title ?? "");
  const [savingPost,  setSavingPost]  = useState(false);

  const [comments,        setComments]        = useState<Comment[]>([]);
  const [commentsLoaded,  setCommentsLoaded]  = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showComments,    setShowComments]    = useState(false);

  const [replyingTo,  setReplyingTo]  = useState<string | null>(null);
  const [replyRootId, setReplyRootId] = useState<string | null>(null);
  const [replyText,   setReplyText]   = useState("");

  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied,   setCopied]   = useState(false);

  const isOwner = currentUserId != null &&
    (post.user_id === currentUserId || postUser.id === currentUserId);

  // Resolve post images — convert relative paths to full URLs
  const postImages: string[] = Array.isArray(post.images)
    ? post.images.filter(Boolean).map(resolveImageUrl)
    : [];

  // ── Load comments ──────────────────────────────────────────────────────
  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await getPostComments(communityId, post.id, 20);
      setComments(extractComments(res).map(mapComment));
      setCommentsLoaded(true);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to load comments"));
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleToggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) await loadComments();
  };

  // ── Like ───────────────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!token) return;
    setLikeLoading(true);
    try {
      await likePost(communityId, post.id, token);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to like post"));
    } finally {
      setLikeLoading(false);
    }
  };

  // ── Edit post ──────────────────────────────────────────────────────────
  const handleSavePost = async () => {
    if (!token || !editContent.trim()) return;
    setSavingPost(true);
    try {
      const updated = await updatePost(
        communityId, post.id,
        { content: editContent.trim(), title: editTitle.trim() || undefined },
        token
      );
      onUpdated?.(updated);
      setEditingPost(false);
      toast.success("Post updated.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to update post"));
    } finally {
      setSavingPost(false);
    }
  };

  // ── Delete post ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!token || !window.confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await deletePost(communityId, post.id, token);
      onDeleted?.(post.id);
      toast.success("Post deleted.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to delete post"));
      setDeleting(false);
    }
  };

  // ── Create comment ─────────────────────────────────────────────────────
  const handleSubmitComment = async () => {
    if (!token || !newComment.trim()) return;
    setSubmitting(true);
    try {
      const created = await createComment(
        communityId, post.id, { content: newComment.trim(), parent_id: null }, token
      );
      setComments((prev) => [mapComment(created), ...prev]);
      setNewComment("");
      if (!showComments) setShowComments(true);
      setCommentsLoaded(true);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to post comment"));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reply ──────────────────────────────────────────────────────────────
  const handleSetReply = (commentId: string, rootId: string) => {
    setReplyingTo(commentId);
    setReplyRootId(rootId);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyRootId(null);
    setReplyText("");
  };

  const handleSubmitReply = async () => {
    if (!token || !replyText.trim() || !replyingTo || !replyRootId) return;
    setSubmitting(true);
    try {
      const created = await replyToComment(
        communityId, post.id, replyRootId,
        { content: replyText.trim() }, token
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyRootId
            ? { ...c, replies: [...(c.replies ?? []), mapComment(created)] }
            : c
        )
      );
      setReplyingTo(null);
      setReplyRootId(null);
      setReplyText("");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to post reply"));
      const e = err as { response?: { status?: number } };
      if (e?.response?.status === 410) {
        setReplyingTo(null); setReplyRootId(null); setReplyText("");
        setCommentsLoaded(false);
        await loadComments();
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete comment ─────────────────────────────────────────────────────
  const handleDeleteComment = async (commentId: string) => {
    if (!token || !window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(communityId, post.id, commentId, token);
      const removeFromList = (list: Comment[]): Comment[] =>
        list
          .filter((c) => c.id !== commentId)
          .map((c) => ({ ...c, replies: removeFromList(c.replies ?? []) }));
      setComments((prev) => removeFromList(prev));
      toast.success("Comment deleted.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to delete comment"));
    }
  };

  // ── Edit comment ───────────────────────────────────────────────────────
  const handleEditComment = async (commentId: string, newContent: string) => {
    if (!token || !newContent.trim()) return;
    try {
      await updateComment(communityId, post.id, commentId, { content: newContent.trim() }, token);
      const updateInList = (list: Comment[]): Comment[] =>
        list.map((c) =>
          c.id === commentId
            ? { ...c, content: newContent.trim() }
            : { ...c, replies: updateInList(c.replies ?? []) }
        );
      setComments((prev) => updateInList(prev));
      toast.success("Comment updated.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to update comment"));
    }
  };

  // ── Share ──────────────────────────────────────────────────────────────
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
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700 shrink-0 overflow-hidden">
            {postUser.avatar ? (
              <img src={postUser.avatar} alt={postUser.name} className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            ) : authorInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 truncate">{postUser.name}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {isOwner && !editingPost && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[130px]">
                <button
                  onClick={() => { setEditingPost(true); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Edit mode ── */}
      {editingPost ? (
        <div className="px-4 pb-4 space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setEditingPost(false); setEditContent(post.content); setEditTitle(post.title ?? ""); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSavePost}
              disabled={savingPost || !editContent.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-200 rounded-lg transition-colors"
            >
              {savingPost ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          {post.title && (
            <div className="px-4 pb-1">
              <h3 className="font-semibold text-gray-900">{post.title}</h3>
            </div>
          )}

          <div className="px-4 pb-3">
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Post images — resolved to full URLs ── */}
          {postImages.length > 0 && (
            <div className="mb-3 px-4">
              <div className={`grid gap-2 ${
                postImages.length === 1 ? "grid-cols-1"
                : postImages.length === 2 ? "grid-cols-2"
                : "grid-cols-2 sm:grid-cols-3"
              }`}>
                {postImages.slice(0, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Post image ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg bg-gray-100"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ))}
                {postImages.length > 4 && (
                  <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 font-medium text-sm">+{postImages.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Post
            </button>
          </div>
        </div>
      )}

      {/* ── Comments ── */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {commentsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-green-500" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">No comments yet. Be the first!</p>
          ) : (
            <CommentThread
              comments={comments}
              replyingTo={replyingTo}
              replyText={replyText}
              currentUserId={currentUserId}
              onReply={handleSetReply}
              onReplyTextChange={setReplyText}
              onCancelReply={handleCancelReply}
              onSubmitReply={handleSubmitReply}
              onDeleteComment={handleDeleteComment}
              onEditComment={handleEditComment}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;