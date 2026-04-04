"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  AlertCircle,
  Crown,
  Shield,
  User,
  UserX,
  Ban,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import ApiFetcher from "@/utils/apis";

interface ApiMemberRow {
  id: number;
  community_id: number;
  user_id: number;
  role: "admin" | "moderator" | "member";
  status: "active" | "banned" | "removed";
  joined_at: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
    avatar_url: string | null;
    email: string;
  };
}

interface SettingsTabProps {
  communityId: number | string;
  token?: string;
  currentUserId?: number;
}

const ROLE_META: Record<
  string,
  {
    label: string;
    style: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  admin: {
    label: "Admin",
    style: "bg-purple-100 text-purple-700",
    Icon: Crown,
  },
  moderator: {
    label: "Moderator",
    style: "bg-blue-100 text-blue-700",
    Icon: Shield,
  },
  member: { label: "Member", style: "bg-gray-100 text-gray-600", Icon: User },
};

function formatJoined(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function extractMembers(data: unknown): {
  members: ApiMemberRow[];
  total: number;
} {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) {
        return {
          members: inner.data as ApiMemberRow[],
          total: (inner.total as number) ?? inner.data.length,
        };
      }
    }
    if (Array.isArray(obj.data)) {
      return { members: obj.data as ApiMemberRow[], total: obj.data.length };
    }
  }
  return { members: [], total: 0 };
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  communityId,
  token,
  currentUserId,
}) => {
  const [members, setMembers] = useState<ApiMemberRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioning, setActioning] = useState<number | null>(null);

  useEffect(() => {
    if (!communityId) return;
    setLoading(true);
    setError(null);

    ApiFetcher.get(`/communities/${communityId}/members`, {
      params: { per_page: 50 },
    })
      .then((res) => {
        const { members, total } = extractMembers(res.data);
        setMembers(members);
        setTotal(total);
      })
      .catch(() => setError("Failed to load members."))
      .finally(() => setLoading(false));
  }, [communityId]);

  // Remove — kicks user out, they CAN rejoin
  const handleRemove = async (member: ApiMemberRow) => {
    if (
      !window.confirm(
        `Remove ${member.user.name} from this community?\n\nThey will be able to rejoin later.`,
      )
    )
      return;

    setActioning(member.user_id);
    try {
      await ApiFetcher.post(
        `/admin/communities/${communityId}/members/${member.user_id}/remove`,
        { reason: "Removed by community admin" },
      );
      setMembers((prev) => prev.filter((m) => m.user_id !== member.user_id));
      setTotal((t) => t - 1);
      toast.success(
        `${member.user.name} has been removed. They can still rejoin.`,
      );
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message ?? "Failed to remove member.");
    } finally {
      setActioning(null);
    }
  };

  // Ban — kicks user out AND blocks rejoining. No unban endpoint exists.
  const handleBan = async (member: ApiMemberRow) => {
    if (
      !window.confirm(
        `Ban ${member.user.name} from this community?\n\n⚠️ This is permanent — there is no way to unban them once confirmed.`,
      )
    )
      return;

    setActioning(member.user_id);
    try {
      await ApiFetcher.post(
        `/admin/communities/${communityId}/members/${member.user_id}/ban`,
        { reason: "Banned by community admin" },
      );
      setMembers((prev) =>
        prev.map((m) =>
          m.user_id === member.user_id ? { ...m, status: "banned" } : m,
        ),
      );
      toast.success(`${member.user.name} has been permanently banned.`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message ?? "Failed to ban member.");
    } finally {
      setActioning(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center mt-6">
        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-6">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  const sorted = [...members].sort((a, b) => {
    const order = { admin: 0, moderator: 1, member: 2 };
    return (order[a.role] ?? 3) - (order[b.role] ?? 3);
  });

  return (
    <div className="mt-6 space-y-4">
      {/* Action legend */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 space-y-1">
          <p>
            <span className="font-semibold">Remove</span> — kicks the member
            out. They are free to rejoin the community later.
          </p>
          <p>
            <span className="font-semibold">Ban</span> — permanently blocks the
            member from this community.{" "}
            <span className="font-semibold">This cannot be undone</span>
          </p>
        </div>
      </div>

      {/* Member list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Member Management
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {total.toLocaleString()} member{total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">
            No members found.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {sorted.map((member) => {
              const meta = ROLE_META[member.role] ?? ROLE_META.member;
              const RoleIcon = meta.Icon;
              const avatarSrc = member.user.avatar_url ?? member.user.avatar;
              const isSelf = currentUserId === member.user_id;
              const isAdmin = member.role === "admin";
              const isBanned = member.status === "banned";
              const busy = actioning === member.user_id;

              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between px-6 py-4 transition-colors ${
                    isBanned ? "bg-red-50/40" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={member.user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-500">
                          {member.user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {member.user.name}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${meta.style}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {meta.label}
                        </span>
                        {isBanned && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600">
                            <Ban className="w-3 h-3" />
                            Banned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {member.user.email} · Joined{" "}
                        {formatJoined(member.joined_at)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {isSelf && (
                      <span className="text-xs text-gray-400 italic">You</span>
                    )}

                    {/* Can't action yourself or other admins */}
                    {!isSelf && !isAdmin && !isBanned && (
                      <>
                        <button
                          onClick={() => handleRemove(member)}
                          disabled={busy}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          title="Remove — they can rejoin"
                        >
                          {busy ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UserX className="w-3.5 h-3.5" />
                          )}
                          Remove
                        </button>

                        <button
                          onClick={() => handleBan(member)}
                          disabled={busy}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                          title="Ban — permanent, cannot be undone"
                        >
                          {busy ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Ban className="w-3.5 h-3.5" />
                          )}
                          Ban
                        </button>
                      </>
                    )}

                    {/* Banned member — show notice, no actions available */}
                    {!isSelf && !isAdmin && isBanned && (
                      <span className="text-xs text-red-400 italic">
                        Permanently banned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;
