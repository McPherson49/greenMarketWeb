"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle, PauseCircle, Trash2,
  Users, Calendar, Globe, Lock, Tag,
  AlertCircle, Loader2, XCircle, FileText,
} from "lucide-react";
import ApiFetcher from "@/utils/apis";


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
  guidelines?: string;
}

const STATUS_STYLES: Record<string, string> = {
  approved:  "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
  rejected:  "bg-gray-100 text-gray-600",
};

type ActionType = "approve" | "reject" | "suspend" | "delete";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=200&fit=crop";

export default function AdminCommunityViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [community, setCommunity] = useState<AdminCommunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionModal, setActionModal] = useState<ActionType | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Fetch using public endpoint (no admin single-get endpoint exists) ───────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    ApiFetcher.get(`/communities/${id}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setCommunity(data);
      })
      .catch(() => setError("Failed to load community."))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Actions via admin endpoints ─────────────────────────────────────────────
  const confirmAction = async () => {
    if (!actionModal || !community) return;
    setActionLoading(true);
    setActionError(null);
    try {
      if (actionModal === "approve") {
        await ApiFetcher.post(`/admin/communities/${id}/approve`);
        setCommunity((prev) => prev ? { ...prev, status: "approved" } : prev);
      } else if (actionModal === "reject") {
        await ApiFetcher.post(`/admin/communities/${id}/reject`, {
          reason: "Does not meet guidelines.",
        });
        setCommunity((prev) => prev ? { ...prev, status: "rejected" } : prev);
      } else if (actionModal === "suspend") {
        await ApiFetcher.post(`/admin/communities/${id}/suspend`, {
          reason: "Community violated guidelines.",
        });
        setCommunity((prev) => prev ? { ...prev, status: "suspended" } : prev);
      } else if (actionModal === "delete") {
        await ApiFetcher.delete(`/admin/communities/${id}`);
        router.push("/admin/community");
        return;
      }
      setActionModal(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="text-center py-24">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">{error ?? "Community not found."}</p>
        <Link href="/admin/community" className="text-green-600 underline text-sm">
          Back to Communities
        </Link>
      </div>
    );
  }

  const currentStatus = community.status;

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin/community"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Communities
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Edit button — goes to edit page */}
          <Link
            href={`/admin/community/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>

          {currentStatus === "pending" && (
            <>
              <button
                onClick={() => setActionModal("approve")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => setActionModal("reject")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </>
          )}
          {currentStatus === "approved" && (
            <button
              onClick={() => setActionModal("suspend")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <PauseCircle className="w-4 h-4" /> Suspend
            </button>
          )}
          {(currentStatus === "suspended" || currentStatus === "rejected") && (
            <button
              onClick={() => setActionModal("approve")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Re-approve
            </button>
          )}
          <button
            onClick={() => setActionModal("delete")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Cover + Info */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-40 relative">
          <img
            src={community.image ?? FALLBACK_IMAGE}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
          />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-7 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0 overflow-hidden">
              {community.icon ? (
                <img
                  src={community.icon}
                  alt={community.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span className="text-xl font-bold text-green-600">
                  {community.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className={`self-start sm:self-auto inline-flex px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[currentStatus]}`}>
              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{community.name}</h1>
          {community.category && (
            <p className="text-sm text-gray-400 mb-3">{community.category.name}</p>
          )}
          <p className="text-gray-700 leading-relaxed">{community.description}</p>

          {community.tags && community.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {community.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          )}

          {community.guidelines && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Guidelines</p>
              <p className="text-sm text-gray-700">{community.guidelines}</p>
            </div>
          )}
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Members", value: (community.members_count ?? 0).toLocaleString(), Icon: Users },
          { label: "Posts",   value: (community.posts_count ?? 0).toLocaleString(),   Icon: FileText },
          { label: "Privacy", value: community.privacy === "private" ? "Private" : "Public", Icon: community.privacy === "private" ? Lock : Globe },
          { label: "Created", value: formatDate(community.created_at), Icon: Calendar },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Creator */}
      {community.creator && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 text-sm shrink-0">
            {community.creator.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Created by</p>
            <p className="text-sm font-semibold text-gray-900">{community.creator.name}</p>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              actionModal === "approve" ? "bg-green-100" :
              actionModal === "reject"  ? "bg-yellow-100" :
              actionModal === "suspend" ? "bg-orange-100" : "bg-red-100"
            }`}>
              {actionModal === "approve" && <CheckCircle className="w-6 h-6 text-green-600" />}
              {actionModal === "reject"  && <XCircle     className="w-6 h-6 text-yellow-600" />}
              {actionModal === "suspend" && <PauseCircle className="w-6 h-6 text-orange-600" />}
              {actionModal === "delete"  && <Trash2      className="w-6 h-6 text-red-600" />}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1 capitalize">
              {actionModal} Community?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {actionModal === "approve" && "This will make the community live and visible to all users."}
              {actionModal === "reject"  && "This will reject the community request."}
              {actionModal === "suspend" && "This will temporarily hide the community from all users."}
              {actionModal === "delete"  && "This will permanently remove the community. This action cannot be undone."}
            </p>

            {actionError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
                {actionError}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setActionModal(null)}
                disabled={actionLoading}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`px-5 py-2.5 rounded-lg font-medium text-white flex items-center gap-2 ${
                  actionModal === "approve" ? "bg-green-600 hover:bg-green-700" :
                  actionModal === "reject"  ? "bg-yellow-600 hover:bg-yellow-700" :
                  actionModal === "suspend" ? "bg-orange-600 hover:bg-orange-700" :
                  "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {actionModal.charAt(0).toUpperCase() + actionModal.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}