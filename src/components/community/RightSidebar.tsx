import React from "react";
import { TrendingTopic, Event } from "../../types/community";

interface RightSidebarProps {
  mainSection: "Community" | "Events" | "Settings";
  trendingTopics: TrendingTopic[];
  events: Event[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({ mainSection, trendingTopics, events }) => {
  if (mainSection === "Community") {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Trending now</h3>
        </div>
        {trendingTopics.map((topic) => (
          <div
            key={topic.id}
            className="flex space-x-3 py-3 cursor-pointer hover:bg-gray-50 rounded -mx-2 px-2"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold text-sm shrink-0">
              {topic.number}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{topic.title}</p>
              {topic.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{topic.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mainSection === "Events") {
    const joinedEvents = events.filter((e) => e.isJoined);
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">My Events</h3>
        {joinedEvents.length === 0 ? (
          <p className="text-sm text-gray-400">No events joined yet.</p>
        ) : (
          joinedEvents.map((event) => (
            <div key={event.id} className="text-sm text-gray-700 line-clamp-2">
              {event.name} - {event.date}
            </div>
          ))
        )}
      </div>
    );
  }

  // Settings
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Community Stats</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">1,234</p>
          <p className="text-xs text-gray-500">Members</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">156</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;