import React from "react";
import { Users } from "lucide-react";

interface CommunityHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = ["Feed", "People", "About"];

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="h-32 relative">
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=200&fit=crop"
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="w-16 h-16 bg-white rounded-full border-4 border-white -mt-8 sm:-mt-12 flex items-center justify-center text-3xl shadow-lg shrink-0">
              🐄
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                Livestock & Poultry Network
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1 flex-wrap gap-2">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  1.1k members
                </span>
                <span>48 subscribers</span>
              </div>
            </div>
          </div>
          <button className="bg-white border border-green-500 text-green-600 hover:bg-green-50 px-6 py-2 rounded-full font-medium w-full sm:w-auto">
            Subscribe
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-3 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap shrink-0 ${
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