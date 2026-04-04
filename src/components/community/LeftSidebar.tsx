"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Community } from "../../types/community";

interface LeftSidebarProps {
  mainSection: "Community" | "Events" | "Settings";
  communities: Community[];
}

// ── Community section sidebar ─────────────────────────────────────────────
function CommunitySidebar({ communities }: { communities: Community[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">My Communities</h3>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>

      {communities.length === 0 ? (
        <p className="text-xs text-gray-400 py-2">You haven't joined any communities yet.</p>
      ) : (
        communities.map((community) => (
          <div
            key={community.id}
            className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded -mx-2 px-2"
          >
            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-sm font-bold text-green-700 shrink-0 overflow-hidden">
              {community.icon && community.icon.length > 2 ? (
                <img
                  src={community.icon}
                  alt={community.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span>{community.icon ?? community.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{community.name}</p>
              <p className="text-xs text-gray-500">{(community.members ?? 0).toLocaleString()} members</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
const LeftSidebar: React.FC<LeftSidebarProps> = ({ mainSection, communities }) => {
  if (mainSection === "Community" || mainSection === "Settings") {
    return <CommunitySidebar communities={communities} />;
  }

  // Events section — no left sidebar content needed
  return null;
};

export default LeftSidebar;