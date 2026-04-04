"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Trash2, Eye, Plus, CheckCircle, XCircle,
  PauseCircle, Calendar, Users, Loader2, AlertCircle,
  Search, RefreshCw,
} from "lucide-react";
import CreateCommunityModal from "@/components/community/CreateCommunityModal";
import ApiFetcher from "@/utils/apis";


// ── Types ─────────────────────────────────────────────────────────────────────
interface AdminCommunity {
  id: number;
  name: string;
  description: string;
  category?: { id: number; name: string };
  icon?: string;
  image?: string;
  creator?: { id: number; name: string };
  created_at: string;
  members_count: number;
  posts_count: number;
  status: "pending" | "approved" | "rejected" | "suspended";
  privacy: "public" | "private";
  tags?: string[];
}

const STATUS_STYLES: Record<string, string> = {
  approved:  "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
  rejected:  "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  approved:  "Approved",
  pending:   "Pending",
  suspended: "Suspended",
  rejected:  "Rejected",
};

type ActionType = "approve" | "reject" | "suspend" | "delete";

const ACTION_META: Record<ActionType, { label: string; description: string; btnClass: string }> = {
  approve: {
    label: "Approve",
    description: "This will make the community live and visible to all users.",
    btnClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  reject: {
    label: "Reject",
    description: "This will reject the community request.",
    btnClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
  },
  suspend: {
    label: "Suspend",
    description: "This will temporarily hide the community from all users.",
    btnClass: "bg-orange-600 hover:bg-orange-700 text-white",
  },
  delete: {
    label: "Delete",
    description: "This will permanently remove the community. This action cannot be undone.",
    btnClass: "bg-red-600 hover:bg-red-700 text-white",
  },
};

function extractCommunities(data: unknown): AdminCommunity[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as AdminCommunity[];
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) return inner.data as AdminCommunity[];
    }
  }
  return [];
}

export default function AdminCommunityPage() {
  const [communities, setCommunities] = useState<AdminCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<AdminCommunity | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        sort_by: "created_at",
        sort_order: "desc",
        per_page: "50",
      };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const res = await ApiFetcher.get("/admin/communities", { params });
      setCommunities(extractCommunities(res.data));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load communities.");
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const openAction = (community: AdminCommunity, type: ActionType) => {
    setSelectedCommunity(community);
    setActionType(type);
    setActionError(null);
    setActionModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedCommunity || !actionType) return;
    setActionLoading(true);
    setActionError(null);
    try {
      if (actionType === "approve") {
        await ApiFetcher.post(`/admin/communities/${selectedCommunity.id}/approve`);
        setCommunities((prev) =>
          prev.map((c) => c.id === selectedCommunity.id ? { ...c, status: "approved" } : c)
        );
      } else if (actionType === "reject") {
        await ApiFetcher.post(`/admin/communities/${selectedCommunity.id}/reject`, {
          reason: "Does not meet guidelines.",
        });
        setCommunities((prev) =>
          prev.map((c) => c.id === selectedCommunity.id ? { ...c, status: "rejected" } : c)
        );
      } else if (actionType === "suspend") {
        await ApiFetcher.post(`/admin/communities/${selectedCommunity.id}/suspend`, {
          reason: "Community violated guidelines.",
        });
        setCommunities((prev) =>
          prev.map((c) => c.id === selectedCommunity.id ? { ...c, status: "suspended" } : c)
        );
      } else if (actionType === "delete") {
        await ApiFetcher.delete(`/admin/communities/${selectedCommunity.id}`);
        setCommunities((prev) => prev.filter((c) => c.id !== selectedCommunity.id));
      }
      setActionModalOpen(false);
    } catch (err: any) {
      setActionError(err?.response?.data?.message ?? "Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      });
    } catch { return iso; }
  };

  const stats = {
    total:     communities.length,
    approved:  communities.filter((c) => c.status === "approved").length,
    pending:   communities.filter((c) => c.status === "pending").length,
    suspended: communities.filter((c) => c.status === "suspended").length,
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Community Management</h1>
          <p className="text-sm text-gray-500 mt-1">Approve, suspend, and manage all communities</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Community
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total",     value: stats.total,     color: "text-gray-800",  bg: "bg-white"      },
          { label: "Approved",  value: stats.approved,  color: "text-green-700", bg: "bg-green-50"   },
          { label: "Pending",   value: stats.pending,   color: "text-yellow-700",bg: "bg-yellow-50"  },
          { label: "Suspended", value: stats.suspended, color: "text-red-700",   bg: "bg-red-50"     },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl border border-gray-200 p-4`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search communities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={fetchCommunities}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={fetchCommunities} className="px-5 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
              Retry
            </button>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Communities Found</h3>
            <p className="text-sm text-gray-500">
              {statusFilter || search ? "Try adjusting your filters." : "No communities have been created yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {["Community", "Creator", "Created", "Members", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider
                          ${h === "Creator" ? "hidden sm:table-cell" : ""}
                          ${h === "Created" ? "hidden md:table-cell" : ""}
                          ${h === "Members" ? "hidden lg:table-cell" : ""}
                          ${h === "Actions" ? "text-center" : ""}
                        `}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {communities.map((community) => (
                    <tr key={community.id} className="hover:bg-gray-50 transition-colors">

                      {/* Community */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                            {community.icon ? (
                              <img
                                src={community.icon}
                                alt={community.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <span className="text-sm font-bold text-green-700">
                                {community.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">
                              {community.name}
                            </p>
                            {community.category && (
                              <p className="text-xs text-gray-400 mt-0.5">{community.category.name}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-4 px-6 hidden sm:table-cell text-sm text-gray-700">
                        {community.creator?.name ?? "—"}
                      </td>

                      {/* Created */}
                      <td className="py-4 px-6 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-sm">{formatDate(community.created_at)}</span>
                        </div>
                      </td>

                      {/* Members */}
                      <td className="py-4 px-6 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-sm">{(community.members_count ?? 0).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[community.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABELS[community.status] ?? community.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/admin/community/${community.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {community.status === "pending" && (
                            <>
                              <button
                                onClick={() => openAction(community, "approve")}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openAction(community, "reject")}
                                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {community.status === "approved" && (
                            <button
                              onClick={() => openAction(community, "suspend")}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Suspend"
                            >
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          )}

                          {(community.status === "suspended" || community.status === "rejected") && (
                            <button
                              onClick={() => openAction(community, "approve")}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Re-approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => openAction(community, "delete")}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {communities.length} communit{communities.length !== 1 ? "ies" : "y"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Create Modal — no token prop needed, ApiFetcher handles auth */}
      {showCreateModal && (
        <CreateCommunityModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchCommunities}
        />
      )}

      {/* Action Confirmation Modal */}
      {actionModalOpen && actionType && selectedCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              actionType === "approve" ? "bg-green-100" :
              actionType === "reject"  ? "bg-yellow-100" :
              actionType === "suspend" ? "bg-orange-100" : "bg-red-100"
            }`}>
              {actionType === "approve" && <CheckCircle className="w-6 h-6 text-green-600" />}
              {actionType === "reject"  && <XCircle     className="w-6 h-6 text-yellow-600" />}
              {actionType === "suspend" && <PauseCircle className="w-6 h-6 text-orange-600" />}
              {actionType === "delete"  && <Trash2      className="w-6 h-6 text-red-600" />}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {ACTION_META[actionType].label} Community?
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              You are about to <strong>{ACTION_META[actionType].label.toLowerCase()}</strong>{" "}
              <span className="font-medium text-gray-800">"{selectedCommunity.name}"</span>.
            </p>
            <p className="text-sm text-gray-400 mb-6">{ACTION_META[actionType].description}</p>

            {actionError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
                {actionError}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setActionModalOpen(false)}
                disabled={actionLoading}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 ${ACTION_META[actionType].btnClass}`}
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {ACTION_META[actionType].label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}