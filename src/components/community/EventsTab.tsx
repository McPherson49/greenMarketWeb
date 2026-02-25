import React from "react";
import { Plus, Calendar } from "lucide-react";
import { Event } from "../../types/community";

interface EventsTabProps {
  events: Event[];
  onCreateEvent: () => void;
}

const EventsTab: React.FC<EventsTabProps> = ({ events, onCreateEvent }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <button
          onClick={onCreateEvent}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 font-semibold shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-48 relative">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg shrink-0">
                    {event.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{event.name}</h3>
                </div>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ml-2 ${
                    event.isJoined
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {event.isJoined ? "Leave" : "Join"}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{event.date}</p>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.location}</p>
              <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{event.attendees} attendees</span>
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsTab;