"use client";

import React, { useState } from "react";
import { Users, Loader2, Lock, Globe } from "lucide-react";
import { toast } from "react-toastify";
import { ApiCommunity, joinCommunity, leaveCommunity } from "@/services/community";

interface CommunityHeaderProps {
  community: ApiCommunity | null;
  isLoading: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  token?: string;
  isAdmin?: boolean;
  /** Authoritative membership flag — resolved from the members API in the parent */
  isMember?: boolean;
  onMembershipChange?: (isMember: boolean) => void;
}

const BASE_TABS  = ["Feed", "People", "About"];
const ADMIN_TABS = [...BASE_TABS, "Settings"];

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=200&fit=crop";

const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  community,
  isLoading,
  activeTab,
  onTabChange,
  token,
  isAdmin = false,
  isMember = false,
  onMembershipChange,
}) => {
  const [joining, setJoining] = useState(false);

  const tabs = isAdmin ? ADMIN_TABS : BASE_TABS;

  const handleMembership = async () => {
    if (!token || !community) {
      toast.error("Please sign in to perform this action");
      return;
    }
    setJoining(true);
    try {
      if (isMember) {
        await leaveCommunity(community.id, token);
        onMembershipChange?.(false);
        toast.success("You have left the community");
      } else {
        await joinCommunity(community.id, token);
        onMembershipChange?.(true);
        toast.success(`Successfully joined ${community.name}`);
      }
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      const status  = e?.response?.status;
      const message = e?.response?.data?.message ?? "Action failed";
      if (status === 422 && message.toLowerCase().includes("already")) {
        onMembershipChange?.(true);
        toast.info("You are already a member of this community");
      } else if (status === 401) {
        toast.error("Your session has expired. Please sign in again.");
      } else {
        toast.error(message);
      }
    } finally {
      setJoining(false);
    }
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 animate-pulse">
        <div className="h-32 bg-gray-200" />
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full -mt-8 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="h-9 w-24 bg-gray-200 rounded-full" />
          </div>
        </div>
        <div className="h-12 bg-gray-100" />
      </div>
    );
  }

  if (!community) {
    return <div className="text-center py-10 text-gray-500">Community not found</div>;
  }

  const name         = community.name;
  const membersCount = community.members_count ?? 0;
  const postsCount   = community.posts_count   ?? 0;
  const isPrivate    = community.privacy === "private";
  const coverImage   = community.image ?? FALLBACK_COVER;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      {/* Cover */}
      <div className="h-32 relative">
        <img
          src={coverImage}
          alt={`${name} cover`}
          className="w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_COVER; }}
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
          {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
          <span>{isPrivate ? "Private" : "Public"}</span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            {/* Icon */}
            <div className="w-16 h-16 bg-white rounded-full border-4 border-white -mt-8 sm:-mt-12 flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
              {community.icon ? (
                <img
                  src={community.icon}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span className="text-2xl font-bold text-green-600">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {membersCount.toLocaleString()} members
                </span>
                <span>·</span>
                <span>{postsCount.toLocaleString()} posts</span>
                {community.category && (
                  <>
                    <span>·</span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {community.category.name}
                    </span>
                  </>
                )}
              </div>
              {community.tags && community.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {community.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action button — driven entirely by props, no internal state */}
          {token && isAdmin && (
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5 w-full sm:w-auto justify-center">
              <span>👑</span> Admin
            </span>
          )}
          {token && !isAdmin && (
            <button
              onClick={handleMembership}
              disabled={joining}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all w-full sm:w-auto flex items-center justify-center gap-2 ${
                isMember
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {joining && <Loader2 className="w-4 h-4 animate-spin" />}
              {isMember ? "Leave Community" : "Join Community"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 sm:px-6 py-3.5 font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommunityHeader;