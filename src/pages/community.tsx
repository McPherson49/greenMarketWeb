"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Loader2, AlertCircle, Users, Eye, LogIn, CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAllCommunities, getCommunityById, joinCommunity, ApiCommunity } from "@/services/community";
import { getProfile, UserProfile } from "@/services/profile";
import { Community } from "@/types/community";
import { getAuthToken } from "@/utils/auth";
import ApiFetcher from "@/utils/apis";

import CommunityHeader      from "@/components/community/CommunityHeader";
import FeedTab              from "@/components/community/FeedTab";
import PeopleTab            from "@/components/community/PeopleTab";
import AboutTab             from "@/components/community/AboutTab";
import SettingsTab          from "@/components/community/SettingsTab";
import EventsTab            from "@/components/community/EventsTab";
import CreateCommunityModal from "@/components/community/CreateCommunityModal";
import LeftSidebar          from "@/components/community/LeftSidebar";
import RightSidebar         from "@/components/community/RightSidebar";

// ── Types ──────────────────────────────────────────────────────────────────
type MainSection  = "Community" | "Events" | "Settings";
type CommunityTab = "Feed" | "People" | "About" | "Settings";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=200&fit=crop";

interface ApiMemberRow {
  id: number;
  community_id: number;
  user_id: number;
  role: "admin" | "moderator" | "member";
  status: string;
  user: { id: number; name: string };
}

// ── Helpers ────────────────────────────────────────────────────────────────
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

/**
 * Checks /communities/{id}/members for the given userId.
 * Returns { isMember, isAdmin }.
 */
async function resolveMembership(
  communityId: number,
  userId: number
): Promise<{ isMember: boolean; isAdmin: boolean }> {
  let page = 1;
  while (page <= 5) {
    const res = await ApiFetcher.get(`/communities/${communityId}/members`, {
      params: { per_page: 50, page },
    });
    const outer = res.data?.data ?? res.data;
    const rows: ApiMemberRow[] = Array.isArray(outer)
      ? outer
      : Array.isArray(outer?.data)
      ? (outer.data as ApiMemberRow[])
      : [];

    const match = rows.find((m) => m.user_id === userId);
    if (match) {
      return {
        isMember: true,
        isAdmin: match.role === "admin" || match.role === "moderator",
      };
    }
    const lastPage: number = typeof outer?.last_page === "number" ? outer.last_page : 1;
    if (page >= lastPage) break;
    page++;
  }
  return { isMember: false, isAdmin: false };
}

// ── Community Card ─────────────────────────────────────────────────────────
function CommunityCard({
  community, currentUser, token, onView, onJoined,
}: {
  community: ApiCommunity;
  currentUser: UserProfile | null;
  token: string | null;
  onView: (id: number) => void;
  onJoined: () => void;
}) {
  const [joining, setJoining] = useState(false);
  const [status,  setStatus]  = useState<"loading" | "admin" | "member" | "none">("loading");

  useEffect(() => {
    if (!currentUser) { setStatus(community.is_member ? "member" : "none"); return; }
    if (community.is_member) { setStatus("member"); return; }
    setStatus("loading");
    resolveMembership(community.id, currentUser.id)
      .then(({ isMember, isAdmin }) => {
        if (isAdmin)       setStatus("admin");
        else if (isMember) setStatus("member");
        else               setStatus("none");
      })
      .catch(() => setStatus("none"));
  }, [community.id, community.is_member, currentUser]);

  const effectivelyJoined = status === "member" || status === "admin";

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) { toast.error("Please sign in to join communities"); return; }
    setJoining(true);
    try {
      await joinCommunity(community.id, token);
      setStatus("member");
      onJoined();
      toast.success(`Joined ${community.name}!`);
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number; data?: { message?: string } } };
      const s = apiErr?.response?.status;
      const msg = apiErr?.response?.data?.message ?? "Failed to join community";
      if (s === 422 && msg.toLowerCase().includes("already")) {
        setStatus("member"); toast.info("You are already a member");
      } else { toast.error(msg); }
    } finally { setJoining(false); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col group hover:shadow-md transition-shadow">
      <div className="h-24 relative overflow-hidden">
        <img
          src={community.image ?? FALLBACK_IMAGE} alt={community.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        {status === "loading" && (
          <div className="absolute top-2 right-2">
            <Loader2 className="w-4 h-4 animate-spin text-white drop-shadow" />
          </div>
        )}
        {effectivelyJoined && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" />
            {status === "admin" ? "Admin" : "Joined"}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-green-50 border-2 border-white -mt-7 shadow-md shrink-0 flex items-center justify-center font-bold text-green-700 text-sm overflow-hidden">
            {community.icon
              ? <img src={community.icon} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              : community.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="font-semibold text-gray-900 truncate text-sm">{community.name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3" />
              {(community.members_count ?? 0).toLocaleString()} members
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">{community.description}</p>

        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onView(community.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            {effectivelyJoined ? "Open" : "View"}
          </button>
          {token && status !== "loading" && !effectivelyJoined && (
            <button
              onClick={handleJoin} disabled={joining}
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

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CommunityPage() {
  // ── Hydration-safe token ───────────────────────────────────────────────
  const [token,    setToken]    = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setToken(getAuthToken()); setHydrated(true); }, []);

  // ── Current user ───────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) { setUserLoading(false); return; }
    getProfile().then(setCurrentUser).catch(() => setCurrentUser(null)).finally(() => setUserLoading(false));
  }, [hydrated, token]);

  // ── Top-level section nav ──────────────────────────────────────────────
  const [mainSection, setMainSection] = useState<MainSection>("Community");

  // ── Community list ─────────────────────────────────────────────────────
  const [communities, setCommunities] = useState<ApiCommunity[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError,   setListError]   = useState<string | null>(null);
  const [search,      setSearch]      = useState("");

  const fetchCommunities = useCallback(async () => {
    setListLoading(true); setListError(null);
    try {
      const res = await getAllCommunities({ sort_by: "members_count", sort_order: "desc", per_page: 30 });
      setCommunities(extractCommunities(res));
    } catch { setListError("Failed to load communities."); setCommunities([]); }
    finally { setListLoading(false); }
  }, []);

  useEffect(() => { if (hydrated) fetchCommunities(); }, [hydrated, fetchCommunities]);

  // ── Detail state ───────────────────────────────────────────────────────
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
  const [selectedCommunity,   setSelectedCommunity]   = useState<ApiCommunity | null>(null);
  const [communityLoading,    setCommunityLoading]     = useState(false);
  const [activeTab,           setActiveTab]            = useState<CommunityTab>("Feed");
  const [isMember,            setIsMember]             = useState(false);
  const [isAdmin,             setIsAdmin]              = useState(false);
  const [membershipChecked,   setMembershipChecked]    = useState(false);
  const [showCreateModal,     setShowCreateModal]      = useState(false);

  // ── Open a community ───────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedCommunityId) return;
    setCommunityLoading(true);
    setSelectedCommunity(null);
    setIsMember(false);
    setIsAdmin(false);
    setMembershipChecked(false);

    getCommunityById(selectedCommunityId)
      .then(async (c) => {
        setSelectedCommunity(c);
        if (currentUser) {
          try {
            const { isMember: mem, isAdmin: adm } = await resolveMembership(selectedCommunityId, currentUser.id);
            setIsMember(mem);
            setIsAdmin(adm);
            setActiveTab(mem || adm ? "Feed" : "About");
          } catch {
            setIsMember(false); setIsAdmin(false); setActiveTab("About");
          }
        } else {
          setIsMember(false); setIsAdmin(false); setActiveTab("About");
        }
      })
      .catch(() => { setSelectedCommunity(null); setIsMember(false); setIsAdmin(false); setActiveTab("About"); })
      .finally(() => { setCommunityLoading(false); setMembershipChecked(true); });
  }, [selectedCommunityId, currentUser]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleViewCommunity = (id: number) => { setSelectedCommunityId(id); };

  const handleMembershipChange = (newIsMember: boolean) => {
    setIsMember(newIsMember);
    setSelectedCommunity((prev) => prev ? { ...prev, is_member: newIsMember } : prev);
    setCommunities((prev) => prev.map((c) => c.id === selectedCommunityId ? { ...c, is_member: newIsMember } : c));
    if (newIsMember) setActiveTab("Feed");
  };

  const handleJoinFromBanner = async () => {
    if (!selectedCommunityId || !token) { toast.error("Please sign in to join communities"); return; }
    try {
      await joinCommunity(selectedCommunityId, token);
      toast.success("Joined successfully!");
      handleMembershipChange(true);
      fetchCommunities();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      const message = apiErr?.response?.data?.message ?? "Could not join community";
      if (message.toLowerCase().includes("already")) { handleMembershipChange(true); toast.info("You are already a member"); }
      else { toast.error(message); }
    }
  };

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description?.toLowerCase() ?? "").includes(search.toLowerCase())
  );

  const joinedCommunities = communities.filter((c) => {
    const isCreator = currentUser && c.creator?.id === currentUser.id;
    return c.is_member || isCreator;
  });

  const sidebarCommunities = communities.map(toLocalCommunity);
  const detailReady = !communityLoading && !userLoading && hydrated && membershipChecked;

  // ════════════════════════════════════════════════════════════════════════
  // DETAIL VIEW
  // ════════════════════════════════════════════════════════════════════════
  if (selectedCommunityId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => { setSelectedCommunityId(null); setSelectedCommunity(null); setMembershipChecked(false); }}
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
                isLoading={!detailReady}
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab as CommunityTab)}
                token={token ?? undefined}
                isAdmin={isAdmin}
                isMember={isMember}
                onMembershipChange={handleMembershipChange}
              />

              {/* Join banner */}
              {detailReady && selectedCommunity && !isMember && !isAdmin && token && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-green-800 text-sm">You are not a member of this community</p>
                    <p className="text-xs text-green-600 mt-0.5">Join to post, comment, and interact with members.</p>
                  </div>
                  <button onClick={handleJoinFromBanner} className="shrink-0 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                    Join Community
                  </button>
                </div>
              )}

              {detailReady && (
                <>
                  {activeTab === "Feed"     && <FeedTab communityId={selectedCommunityId} token={token ?? undefined} currentUser={currentUser} isMember={isMember || isAdmin} />}
                  {activeTab === "People"   && <PeopleTab communityId={selectedCommunityId} token={token ?? undefined} />}
                  {activeTab === "About"    && <AboutTab community={selectedCommunity} isLoading={false} />}
                  {activeTab === "Settings" && isAdmin && (
                    <SettingsTab
                      communityId={selectedCommunityId}
                      token={token ?? undefined}
                      currentUserId={currentUser?.id}
                    />
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

  // ════════════════════════════════════════════════════════════════════════
  // LIST VIEW  — with top nav tabs restored
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top section nav ── */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
            <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide border-b border-gray-200 lg:border-b-0 pb-2 lg:pb-0">
              {(["Community", "Events", "Settings"] as MainSection[]).map((section) => (
                <button
                  key={section}
                  onClick={() => setMainSection(section)}
                  className={`flex items-center px-3 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                    mainSection === section
                      ? "text-green-600 border-b-2 border-green-600 bg-green-50 font-semibold"
                      : "text-gray-600 hover:text-gray-900 cursor-pointer"
                  }`}
                >
                  {section === "Community" ? "My Community" : section}
                </button>
              ))}
            </div>
            {token && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium w-full lg:w-auto justify-center lg:justify-start transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create a Community</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── EVENTS section ── */}
        {mainSection === "Events" && (
          <EventsTab />
        )}

        {/* ── SETTINGS section (admin only — shows joined communities to manage) ── */}
        {mainSection === "Settings" && (
          <div>
            {!isAdmin && joinedCommunities.filter((c) => currentUser && c.creator?.id === currentUser.id).length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-500 text-sm">You need to be an admin of a community to access settings.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Community Settings</h2>
                <p className="text-gray-500 text-sm mb-6">Select one of your communities to manage its members.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {joinedCommunities
                    .filter((c) => currentUser && c.creator?.id === currentUser.id)
                    .map((c) => (
                      <div
                        key={c.id}
                        onClick={() => { setSelectedCommunityId(c.id); setActiveTab("Settings"); }}
                        className="bg-white p-5 rounded-2xl flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-sm text-gray-500">{(c.members_count ?? 0).toLocaleString()} members</p>
                        </div>
                        <span className="text-green-600 font-medium text-sm">Manage →</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── COMMUNITY section ── */}
        {mainSection === "Community" && (
          <>
            {/* My Communities strip */}
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

            {/* Search */}
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
                    currentUser={currentUser}
                    token={token}
                    onView={handleViewCommunity}
                    onJoined={fetchCommunities}
                  />
                ))}
              </div>
            )}

            {!listLoading && !listError && filteredCommunities.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                {search ? `No communities found for "${search}"` : "No communities yet. Be the first to create one!"}
              </div>
            )}
          </>
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