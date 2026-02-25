"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  PauseCircle,
  Calendar,
  Users,
} from "lucide-react";
import CreateCommunityModal from "@/components/community/CreateCommunityModal";
import { NewCommunity } from "../../types/community";

const mockCommunities: any[] = [];

export default function AdminCommunityPage() {
  const [communities, setCommunities] = useState(mockCommunities);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateCommunity = (data: NewCommunity) => {
    const newCommunity = {
      id: Date.now().toString(),
      name: data.name,
      icon: data.icon,
      description: data.description,
      category: data.category,
      tags: data.tags,
      isPrivate: data.isPrivate,
      coverImage: data.coverPreview,
      creator: "Admin",
      createdDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      members: 0,
      status: "Pending", // always starts as Pending, must be explicitly approved
    };
    setCommunities((prev: any[]) => [newCommunity, ...prev]);
    setShowCreateModal(false);
  };

  // ── Action (approve / suspend / delete) modal ──────────────────────────────
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [actionType, setActionType] = useState<
    "approve" | "suspend" | "delete" | null
  >(null);

  const openAction = (
    community: any,
    type: "approve" | "suspend" | "delete",
  ) => {
    setSelectedCommunity(community);
    setActionType(type);
    setActionModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedCommunity || !actionType) return;

    if (actionType === "delete") {
      setCommunities((prev: any[]) =>
        prev.filter((c) => c.id !== selectedCommunity.id),
      );
    } else {
      const nextStatus = actionType === "approve" ? "Approved" : "Suspended";
      setCommunities((prev: any[]) =>
        prev.map((c) =>
          c.id === selectedCommunity.id ? { ...c, status: nextStatus } : c,
        ),
      );
    }
    setActionModalOpen(false);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const statusStyles: Record<string, string> = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Suspended: "bg-red-100 text-red-700",
  };

  const actionMeta = {
    approve: {
      label: "Approve",
      description:
        "This will make the community live and visible to all users.",
      btnClass: "bg-green-600 hover:bg-green-700 text-white",
    },
    suspend: {
      label: "Suspend",
      description: "This will temporarily hide the community from all users.",
      btnClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    delete: {
      label: "Delete",
      description:
        "This will permanently remove the community. This action cannot be undone.",
      btnClass: "bg-red-600 hover:bg-red-700 text-white",
    },
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Community Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage communities, approve new ones, monitor posts, and enforce
            rules
          </p>
        </div>

        {/* Opens the same 2-step CreateCommunityModal */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Community
        </button>
      </div>

      {/* ── Community Table ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {communities.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Communities Yet
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Community groups will appear here once they are created by users
              or admins.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              {["Approved", "Pending", "Suspended"].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${statusStyles[s]}`} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {[
                      "Community",
                      "Creator",
                      "Created",
                      "Members",
                      "Status",
                      "Actions",
                    ].map((h) => (
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
                  {communities.map((community: any) => (
                    <tr
                      key={community.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Community name + icon */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl shrink-0">
                            {/* If icon is an emoji render it; if a URL use Image */}
                            {community.icon?.startsWith("http") ? (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                <Image
                                  src={community.icon}
                                  alt={community.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              community.icon
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {community.name}
                            </p>
                            {community.category && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {community.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 hidden sm:table-cell text-sm text-gray-700">
                        {community.creator}
                      </td>

                      <td className="py-4 px-6 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {community.createdDate}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{community.members}</span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusStyles[community.status] ?? ""}`}
                        >
                          {community.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/community/${community.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/community/${community.id}`}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>

                          {/* Approve — only shown when Pending */}
                          {community.status === "Pending" && (
                            <button
                              onClick={() => openAction(community, "approve")}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Reject/Suspend — only shown when Pending or Approved */}
                          {(community.status === "Pending" ||
                            community.status === "Approved") && (
                            <button
                              onClick={() => openAction(community, "suspend")}
                              className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title={
                                community.status === "Pending"
                                  ? "Reject"
                                  : "Suspend"
                              }
                            >
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Re-approve — only shown when Suspended */}
                          {community.status === "Suspended" && (
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
                Showing {communities.length} communit
                {communities.length !== 1 ? "ies" : "y"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Create Community Modal ────────────────────────────────────────── */}
      {showCreateModal && (
        <CreateCommunityModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCommunity}
        />
      )}

      {/* ── Approve / Suspend / Delete Confirmation Modal ─────────────────── */}
      {actionModalOpen && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                actionType === "approve"
                  ? "bg-green-100"
                  : actionType === "suspend"
                    ? "bg-yellow-100"
                    : "bg-red-100"
              }`}
            >
              {actionType === "approve" && (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
              {actionType === "suspend" && (
                <PauseCircle className="w-6 h-6 text-yellow-600" />
              )}
              {actionType === "delete" && (
                <Trash2 className="w-6 h-6 text-red-600" />
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {actionMeta[actionType].label} Community?
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              You are about to{" "}
              <strong>{actionMeta[actionType].label.toLowerCase()}</strong>{" "}
              <span className="font-medium text-gray-900">
                "{selectedCommunity?.name}"
              </span>
              .
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {actionMeta[actionType].description}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setActionModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${actionMeta[actionType].btnClass}`}
              >
                {actionMeta[actionType].label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
