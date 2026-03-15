"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import LeftSidebar from "../components/community/LeftSidebar";
import RightSidebar from "../components/community/RightSidebar";
import CommunityHeader from "../components/community/CommunityHeader";
import FeedTab from "../components/community/FeedTab";
import PeopleTab from "../components/community/PeopleTab";
import AboutTab from "../components/community/AboutTab";
import EventsTab from "../components/community/EventsTab";
import SettingsTab from "../components/community/SettingsTab";
import CreateCommunityModal from "../components/community/CreateCommunityModal";

import {
  communities,
  events,
  trendingTopics,
  members,
  initialPosts,
} from "../data/mockData";
import { NewCommunity } from "../types/community";

const CommunityFeed: React.FC = () => {
  const [mainSection, setMainSection] = useState<"Community" | "Events" | "Settings">("Community");
  const [activeTab, setActiveTab] = useState("Feed");
  const [posts] = useState(initialPosts);

  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const handleCommunitySubmit = (community: NewCommunity) => {
    alert(`Community "${community.name}" created successfully! 🎉`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
            <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide border-b border-gray-200 lg:border-b-0 pb-2 lg:pb-0">
              {(["Community", "Events", "Settings"] as const).map((section) => (
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
            <button
              onClick={() => setShowCreateCommunity(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium w-full lg:w-auto justify-center lg:justify-start transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create a Community</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <LeftSidebar mainSection={mainSection} communities={communities} events={events} />
          </aside>

          <main className="flex-1 w-full lg:max-w-2xl">
            {mainSection === "Community" && (
              <>
                <CommunityHeader activeTab={activeTab} onTabChange={setActiveTab} />
                {activeTab === "Feed" && <FeedTab posts={posts} />}
                {activeTab === "People" && <PeopleTab members={members} />}
                {activeTab === "About" && <AboutTab />}
              </>
            )}
            {mainSection === "Events" && (
              <EventsTab events={events} />
            )}
            {mainSection === "Settings" && <SettingsTab members={members} />}
          </main>

          {/* <aside className="hidden lg:block w-72 shrink-0">
            <RightSidebar mainSection={mainSection} trendingTopics={trendingTopics} events={events} />
          </aside> */}
        </div>
      </div>

      {/* Modals */}
      {showCreateCommunity && (
        <CreateCommunityModal
          onClose={() => setShowCreateCommunity(false)}
          onSubmit={handleCommunitySubmit}
        />
      )}
    </div>
  );
};

export default CommunityFeed;