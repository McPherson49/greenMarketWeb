"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Loader2, AlertCircle, Users, Eye, LogIn, CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAllCommunities, getCommunityById, joinCommunity, ApiCommunity } from "@/services/community";
import { Community } from "@/types/community";
import { getAuthToken } from "@/utils/auth";

import CommunityHeader      from "@/components/community/CommunityHeader";
import FeedTab              from "@/components/community/FeedTab";
import PeopleTab            from "@/components/community/PeopleTab";
import AboutTab             from "@/components/community/AboutTab";
import SettingsTab          from "@/components/community/SettingsTab";
import CreateCommunityModal from "@/components/community/CreateCommunityModal";
import LeftSidebar          from "@/components/community/LeftSidebar";
import RightSidebar         from "@/components/community/RightSidebar";

// ── Auth hook ──────────────────────────────────────────────────────────────────
// Token is an opaque session token stored in sessionStorage (key: "jwt").
// It is NOT a JWT — we cannot decode a userId from it.
// All membership/creator detection must come from the API response fields.
function useAuth() {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const t = getAuthToken();
    setToken(t ?? undefined);
  }, []);

  return { token };
}

// ── Types ──────────────────────────────────────────────────────────────────────
type CommunityTab = "Feed" | "People" | "About" | "Settings";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=200&fit=crop";

// ── Helpers ────────────────────────────────────────────────────────────────────
function toLocalCommunity(c: ApiCommunity): Community {
  return {
    id: String(c.id),
    name: c.name,
    icon: c.icon ?? c.name.charAt(0).toUpperCase(),
    members: c.members_count ?? 0,
    posts: c.posts_count ?? 0,
    description: c.description,
    category: c.category?.name,
    isPrivate: c.privacy === "private",
    coverImage: c.image,
  };
}

function extractCommunities(res: unknown): ApiCommunity[] {
  if (Array.isArray(res)) return res as ApiCommunity[];
  if (res && typeof res === "object") {
    const obj = res as { data?: unknown };
    if (Array.isArray(obj.data)) return obj.data as ApiCommunity[];
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as { data?: unknown };
      if (Array.isArray(inner.data)) return inner.data as ApiCommunity[];
    }
  }
  return [];
}

// ── Community Card ─────────────────────────────────────────────────────────────
function CommunityCard({
  community,
  token,
  onView,
  onJoined,
}: {
  community: ApiCommunity;
  token?: string;
  onView: (id: number) => void;
  onJoined: () => void;
}) {
  const [joining,  setJoining]  = useState(false);
  const [isMember, setIsMember] = useState(community.is_member ?? false);

  useEffect(() => { setIsMember(community.is_member ?? false); }, [community.is_member]);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const t = getAuthToken();
    if (!t) { toast.error("Please sign in to join communities"); return; }

    setJoining(true);
    try {
      await joinCommunity(community.id, t);
      setIsMember(true);
      onJoined();
      toast.success(`Joined ${community.name}!`);
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number; data?: { message?: string } } };
      const status  = apiErr?.response?.status;
      const message = apiErr?.response?.data?.message ?? "Failed to join community";
      if (status === 422 && message.toLowerCase().includes("already")) {
        setIsMember(true);
        toast.info("You are already a member");
      } else {
        toast.error(message);
      }
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col group hover:shadow-md transition-shadow">
      <div className="h-24 relative overflow-hidden">
        <img
          src={community.image ?? FALLBACK_IMAGE}
          alt={community.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        {isMember && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Joined
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-green-50 border-2 border-white -mt-7 shadow-md shrink-0 flex items-center justify-center font-bold text-green-700 text-sm overflow-hidden">
            {community.icon ? (
              <img
                src={community.icon}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              community.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="font-semibold text-gray-900 truncate text-sm">{community.name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3" />
              {(community.members_count ?? 0).toLocaleString()} members
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {community.description}
        </p>

        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onView(community.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            {isMember ? "Open" : "View"}
          </button>

          {token && !isMember && (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {joining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
              {joining ? "Joining…" : "Join"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { token } = useAuth();

  const [communities,  setCommunities]  = useState<ApiCommunity[]>([]);
  const [listLoading,  setListLoading]  = useState(true);
  const [listError,    setListError]    = useState<string | null>(null);
  const [search,       setSearch]       = useState("");

  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
  const [selectedCommunity,   setSelectedCommunity]   = useState<ApiCommunity | null>(null);
  const [communityLoading,    setCommunityLoading]     = useState(false);
  const [activeTab,           setActiveTab]            = useState<CommunityTab>("Feed");
  const [isMember,            setIsMember]             = useState(false);
  const [isAdmin,             setIsAdmin]              = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  // ── Fetch list ─────────────────────────────────────────────────────────────
  const fetchCommunities = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const res = await getAllCommunities({ sort_by: "members_count", sort_order: "desc", per_page: 30 });
      setCommunities(extractCommunities(res));
    } catch {
      setListError("Failed to load communities.");
      setCommunities([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => { fetchCommunities(); }, [fetchCommunities]);

  // ── Fetch single community ─────────────────────────────────────────────────
  // CRITICAL: we pass the auth token so the API returns is_member=true
  // for the community creator/members. Without the token the public endpoint
  // always returns is_member=false regardless of who you are.
  useEffect(() => {
    if (!selectedCommunityId) return;

    setCommunityLoading(true);
    setSelectedCommunity(null);
    setIsMember(false);
    setIsAdmin(false);

    // Read token directly from storage (not from state) to avoid stale closure
    const currentToken = getAuthToken() ?? undefined;

    getCommunityById(selectedCommunityId, undefined, currentToken)
      .then((c) => {
        setSelectedCommunity(c);

        // API returns is_member=true if the authenticated user is a member
        const memberStatus = c.is_member ?? false;

        // API may return is_creator or is_admin for the community owner
        const adminStatus =
          c.is_creator === true ||
          c.is_admin   === true;

        // Creators are implicitly members — grant both flags
        setIsMember(memberStatus || adminStatus);
        setIsAdmin(adminStatus);
        setActiveTab(memberStatus || adminStatus ? "Feed" : "About");
      })
      .catch(() => {
        setSelectedCommunity(null);
        setIsMember(false);
        setIsAdmin(false);
      })
      .finally(() => setCommunityLoading(false));
  }, [selectedCommunityId]); // intentionally omit token — we read it live via getAuthToken()

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleViewCommunity = (id: number) => { setSelectedCommunityId(id); };

  const handleMembershipChange = (newIsMember: boolean) => {
    setIsMember(newIsMember);
    setSelectedCommunity((prev) => prev ? { ...prev, is_member: newIsMember } : prev);
    setCommunities((prev) =>
      prev.map((c) => c.id === selectedCommunityId ? { ...c, is_member: newIsMember } : c)
    );
    if (newIsMember) setActiveTab("Feed");
  };

  const handleJoinFromBanner = async () => {
    if (!selectedCommunityId) return;
    const t = getAuthToken();
    if (!t) { toast.error("Please sign in to join communities"); return; }
    try {
      await joinCommunity(selectedCommunityId, t);
      toast.success("Joined successfully!");
      handleMembershipChange(true);
      fetchCommunities();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      const message = apiErr?.response?.data?.message ?? "Could not join community";
      if (message.toLowerCase().includes("already")) {
        handleMembershipChange(true);
        toast.info("You are already a member");
      } else {
        toast.error(message);
      }
    }
  };

  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description?.toLowerCase() ?? "").includes(search.toLowerCase())
  );

  const joinedCommunities  = communities.filter((c) => c.is_member);
  const sidebarCommunities = communities.map(toLocalCommunity);

  // ════════════════════════════════════════════════════════════════════════════
  // DETAIL VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (selectedCommunityId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => { setSelectedCommunityId(null); setSelectedCommunity(null); }}
            className="text-sm text-gray-500 hover:text-green-600 mb-4 transition-colors flex items-center gap-1"
          >
            ← Back to Communities
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-6">
            <div className="hidden lg:block">
              <LeftSidebar mainSection="Community" communities={sidebarCommunities} />
            </div>

            <div>
              <CommunityHeader
                community={selectedCommunity}
                isLoading={communityLoading}
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab as CommunityTab)}
                token={token}
                isAdmin={isAdmin}
                onMembershipChange={handleMembershipChange}
              />

              {/* Non-member banner — hidden once isMember or isAdmin is true */}
              {!communityLoading && selectedCommunity && !isMember && !isAdmin && token && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-green-800 text-sm">
                      You are not a member of this community
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">
                      Join to post, comment, and interact with members.
                    </p>
                  </div>
                  <button
                    onClick={handleJoinFromBanner}
                    className="shrink-0 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Join Community
                  </button>
                </div>
              )}

              {!communityLoading && (
                <>
                  {activeTab === "Feed" && (
                    <FeedTab
                      communityId={selectedCommunityId}
                      token={token}
                      isMember={isMember || isAdmin}
                    />
                  )}
                  {activeTab === "People" && (
                    <PeopleTab communityId={selectedCommunityId} token={token} />
                  )}
                  {activeTab === "About" && (
                    <AboutTab community={selectedCommunity} isLoading={communityLoading} />
                  )}
                  {activeTab === "Settings" && isAdmin && (
                    <SettingsTab members={[]} />
                  )}
                </>
              )}
            </div>

            <div className="hidden lg:block">
              <RightSidebar mainSection="Community" trendingTopics={[]} events={[]} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
            <p className="text-gray-500 mt-1">Connect, share and grow with fellow farmers</p>
          </div>
          {token && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Community
            </button>
          )}
        </div>

        {joinedCommunities.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">My Communities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {joinedCommunities.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleViewCommunity(c.id)}
                  className="bg-white p-5 rounded-2xl flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-gray-500">{(c.members_count ?? 0).toLocaleString()} members</p>
                  </div>
                  <span className="text-green-600 font-medium">Open →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search communities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>

        <h2 className="text-base font-semibold text-gray-700 mb-4">
          {search ? `Results for "${search}"` : "All Communities"}
        </h2>

        {listLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          </div>
        )}

        {listError && !listLoading && (
          <div className="text-center py-20">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-gray-500">{listError}</p>
            <button onClick={fetchCommunities} className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Retry
            </button>
          </div>
        )}

        {!listLoading && !listError && filteredCommunities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                token={token}
                onView={handleViewCommunity}
                onJoined={fetchCommunities}
              />
            ))}
          </div>
        )}

        {!listLoading && !listError && filteredCommunities.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            {search
              ? `No communities found for "${search}"`
              : "No communities yet. Be the first to create one!"}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateCommunityModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchCommunities();
            toast.success("Community created! It will be visible once approved by an admin.");
          }}
        />
      )}
    </div>
  );
}