import React from "react";
import { ApiCommunity } from "@/services/community";
import { Calendar, Globe, Lock, Tag } from "lucide-react";

interface AboutTabProps {
  community: ApiCommunity | null;
  isLoading: boolean;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

const AboutTab: React.FC<AboutTabProps> = ({ community, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { value: community?.members_count?.toLocaleString() ?? "0", label: "Total Members", color: "green" },
    { value: community?.posts_count?.toLocaleString() ?? "0", label: "Posts", color: "purple" },
  ];

  const guidelines = community?.guidelines
    ? community.guidelines.split(/[.\n]/).map((s) => s.trim()).filter(Boolean)
    : [
        "Be respectful and professional in all interactions",
        "Share accurate and helpful information",
        "No spam or self-promotion without permission",
        "Support fellow members and contribute positively",
      ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">About this Community</h2>

      <div className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed">
            {community?.description ?? "No description provided."}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {community?.privacy && (
            <div className="flex items-center gap-1.5">
              {community.privacy === "private" ? (
                <Lock className="w-4 h-4 text-gray-400" />
              ) : (
                <Globe className="w-4 h-4 text-gray-400" />
              )}
              <span className="capitalize">{community.privacy}</span>
            </div>
          )}
          {community?.category && (
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-gray-400" />
              <span>{community.category.name}</span>
            </div>
          )}
          {community?.created_at && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Created {formatDate(community.created_at)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {community?.tags && community.tags.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full border border-green-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Community Guidelines</h3>
          <ul className="space-y-2 text-gray-700">
            {guidelines.map((guideline, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2 mt-0.5 text-green-500 shrink-0">•</span>
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Statistics */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label, color }) => (
              <div key={label} className={`bg-${color}-50 rounded-lg p-4`}>
                <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                <p className="text-sm text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Creator */}
        {community?.creator && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Created by</h3>
            <p className="text-gray-700">{community.creator.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutTab;