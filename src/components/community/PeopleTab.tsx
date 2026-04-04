"use client";

import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, Crown, Shield, User } from "lucide-react";
import ApiFetcher from "@/utils/apis";

interface ApiMemberResponse {
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
    email: string;
    avatar_url: string | null;
  };
}

interface PeopleTabProps {
  communityId: number | string;
  token?: string;
}

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

function extractMembers(data: unknown): { members: ApiMemberResponse[]; total: number } {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    // { status, data: { current_page, data: [...], total } }
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) {
        return {
          members: inner.data as ApiMemberResponse[],
          total: (inner.total as number) ?? inner.data.length,
        };
      }
    }
    // flat array
    if (Array.isArray(obj.data)) {
      return { members: obj.data as ApiMemberResponse[], total: obj.data.length };
    }
  }
  return { members: [], total: 0 };
}

const ROLE_META: Record<
  string,
  { label: string; style: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  admin:     { label: "Admin",     style: "bg-purple-100 text-purple-700", Icon: Crown  },
  moderator: { label: "Moderator", style: "bg-blue-100 text-blue-700",     Icon: Shield },
  member:    { label: "Member",    style: "bg-gray-100 text-gray-600",      Icon: User   },
};

const PeopleTab: React.FC<PeopleTabProps> = ({ communityId, token }) => {
  const [members, setMembers] = useState<ApiMemberResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [total, setTotal]     = useState(0);

  useEffect(() => {
    if (!communityId) return;
    setIsLoading(true);
    setError(null);

    ApiFetcher.get(`/communities/${communityId}/members`, {
      params: { per_page: 50 },
    })
      .then((res) => {
        const { members, total } = extractMembers(res.data);
        setMembers(members);
        setTotal(total);
      })
      .catch(() => setError("Unable to load members."))
      .finally(() => setIsLoading(false));
  }, [communityId, token]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center py-16 mt-6">
        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center py-16 mt-6">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">{error}</p>
        {!token && (
          <p className="text-xs text-gray-400 mt-2">
            You may need to join this community to view its members.
          </p>
        )}
      </div>
    );
  }

  // Sort: admins first, then moderators, then members
  const sorted = [...members].sort((a, b) => {
    const order = { admin: 0, moderator: 1, member: 2 };
    return (order[a.role] ?? 3) - (order[b.role] ?? 3);
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Members</h2>
        <span className="text-sm text-gray-500">{total.toLocaleString()} member{total !== 1 ? "s" : ""}</span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No members found.</p>
      ) : (
        <div className="space-y-1">
          {sorted.map((member) => {
            const meta = ROLE_META[member.role] ?? ROLE_META.member;
            const RoleIcon = meta.Icon;
            const avatarSrc = member.user.avatar_url ?? member.user.avatar;

            return (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-b-0 gap-2"
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full shrink-0 bg-gray-200 overflow-hidden flex items-center justify-center">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={member.user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
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
                      <p className="font-semibold text-gray-900 truncate">{member.user.name}</p>
                      {/* Role badge — always shown so community structure is clear */}
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${meta.style}`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Joined {member.joined_at ? formatJoined(member.joined_at) : "–"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PeopleTab;