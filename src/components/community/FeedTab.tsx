"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, ImagePlus, X, Send, Sprout, Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCommunityPosts, createPost, ApiPost, PaginatedResponse } from "@/services/community";
import { UserProfile } from "@/services/profile";
import PostCard from "./PostCard";

interface FeedTabProps {
  communityId: number | string;
  token?: string;
  currentUser?: UserProfile | null;
  isMember?: boolean;
  
}

function extractPosts(res: PaginatedResponse<ApiPost> | ApiPost[] | unknown): ApiPost[] {
  if (Array.isArray(res)) return res as ApiPost[];
  if (res && typeof res === "object") {
    const top = res as { data?: unknown };
    if (Array.isArray(top.data)) return top.data as ApiPost[];
    if (top.data && typeof top.data === "object") {
      const inner = top.data as { data?: unknown };
      if (Array.isArray(inner.data)) return inner.data as ApiPost[];
    }
  }
  return [];
}

// ── Access gate ────────────────────────────────────────────────────────────
function FeedGate({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-16 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <LogIn className="w-7 h-7 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Sign in to view this feed</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Create a free account or sign in to join communities and see what members are sharing.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="mt-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-16 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
        <Lock className="w-7 h-7 text-green-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Members only</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Join this community to read posts, comment, and share with other members.
        </p>
      </div>
    </div>
  );
}

const FeedTab: React.FC<FeedTabProps> = ({ communityId, token, currentUser, isMember }) => {
  const [posts,         setPosts]         = useState<ApiPost[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  const [newContent,    setNewContent]    = useState("");
  const [newTitle,      setNewTitle]      = useState("");
  const [images,        setImages]        = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting,    setSubmitting]    = useState(false);
  const [showExpanded,  setShowExpanded]  = useState(false);

  const isLoggedIn  = !!token;
  const canViewFeed = isLoggedIn && isMember;

  // ── Fetch posts ────────────────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    if (!canViewFeed) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCommunityPosts(communityId, { sort_by: "latest", per_page: 20 });
      setPosts(extractPosts(res));
    } catch {
      setError("Failed to load posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [communityId, canViewFeed]);

  useEffect(() => {
    if (canViewFeed) fetchPosts();
    else setIsLoading(false);
  }, [fetchPosts, canViewFeed]);

  // ── Image helpers ──────────────────────────────────────────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - images.length);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImages((prev)        => [...prev, ...files].slice(0, 5));
    setImagePreviews((prev) => [...prev, ...previews].slice(0, 5));
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const resetComposer = () => {
    setShowExpanded(false);
    setNewContent("");
    setNewTitle("");
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setImagePreviews([]);
  };

  // ── Create post ────────────────────────────────────────────────────────
  const handleCreatePost = async () => {
    if (!token || !newContent.trim()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("content", newContent.trim());
      if (newTitle.trim()) fd.append("title", newTitle.trim());
      images.forEach((img) => fd.append("images[]", img));

      const created = await createPost(communityId, fd, token);
      setPosts((prev) => [created, ...prev]);
      resetComposer();
    } catch {
      setError("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Post updated inline (from PostCard edit) ───────────────────────────
  const handlePostUpdated = (updated: ApiPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // ── Post deleted ───────────────────────────────────────────────────────
  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // ── Composer avatar ────────────────────────────────────────────────────
  const avatarSrc   = currentUser?.avatar ?? currentUser?.avatar_url ?? null;
  const displayName = currentUser?.name ?? "";
  const initial     = displayName.charAt(0).toUpperCase() || "U";

  if (!canViewFeed) return <FeedGate isLoggedIn={isLoggedIn} />;

  return (
    <div className="mt-6">
      {/* ── Post composer ── */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        {!showExpanded ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700 shrink-0 overflow-hidden">
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              ) : <span>{initial}</span>}
            </div>
            <button
              onClick={() => setShowExpanded(true)}
              className="flex-1 text-left border border-gray-200 rounded-full px-4 py-2.5 text-gray-400 hover:border-green-400 hover:bg-green-50/30 transition-colors text-sm"
            >
              Share something with the community…
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
            />
            <textarea
              autoFocus
              placeholder="What's on your mind?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />

            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={src} alt="" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors px-2 py-1 rounded-lg hover:bg-green-50">
                  <ImagePlus className="w-4 h-4" />
                  <span>Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={images.length >= 5}
                  />
                </label>
                <span className="text-xs text-gray-400">{images.length}/5</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={resetComposer} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={submitting || !newContent.trim()}
                  className="px-5 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-green-500" />
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={fetchPosts} className="px-5 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Sprout className="w-12 h-12 text-green-200 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold text-lg mb-1">No posts yet</h3>
          <p className="text-gray-400 text-sm">Be the first to share something with the community!</p>
        </div>
      )}

      {!isLoading && !error && posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          communityId={communityId}
          token={token}
          currentUserId={currentUser?.id}
          onDeleted={handlePostDeleted}
          onUpdated={handlePostUpdated}
        />
      ))}
    </div>
  );
};

export default FeedTab;