import React from "react";
import { ChevronRight, Search } from "lucide-react";
import { Community, Event } from "../../types/community";

interface LeftSidebarProps {
  mainSection: "Community" | "Events" | "Settings";
  communities: Community[];
  events: Event[];
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ mainSection, communities, events }) => {
  if (mainSection === "Community") {
    return (
      <>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">My Community</h3>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          {communities.map((community) => (
            <div
              key={community.id}
              className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded -mx-2 px-2"
            >
              <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-2xl shrink-0">
                {community.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{community.name}</p>
                <p className="text-xs text-gray-500">{community.members} members</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Events</h3>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-xl shrink-0">
                  {event.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1 truncate">{event.name}</p>
                  <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{event.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (mainSection === "Events") {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded"
            >
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-lg shrink-0">
                {event.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{event.name}</p>
                <p className="text-xs text-gray-500">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

};

export default LeftSidebar;